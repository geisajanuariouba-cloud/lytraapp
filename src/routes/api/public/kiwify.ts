import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { detectPlanKey } from "@/lib/plans";

/**
 * Resolve o user_id de um e-mail usando SOMENTE tabelas da aplicação
 * (sem listUsers / auth.users / RPC).
 *
 * Premissa: o cadastro público está desabilitado no Supabase Auth, então todo
 * usuário nasce deste webhook e ganha uma linha em `subscriptions` na primeira
 * aprovação. Logo, `subscriptions.email` (indexada) é a fonte de verdade.
 * `kiwify_orders.created_user_id` serve de fallback de auditoria.
 */
async function resolveUserIdByEmail(email: string): Promise<string | undefined> {
  // 1) Assinatura existente (indexada por email) — cobre renovações/recompras.
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("email", email)
    .limit(1);
  if (subs && subs[0]?.user_id) return subs[0].user_id;

  // 2) Fallback: pedido anterior que já criou um usuário para este e-mail.
  const { data: orders } = await supabaseAdmin
    .from("kiwify_orders")
    .select("created_user_id")
    .eq("email", email)
    .not("created_user_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);
  return orders && orders[0]?.created_user_id ? orders[0].created_user_id : undefined;
}

/**
 * Webhook Kiwify
 * URL: /api/public/kiwify?token=KIWIFY_WEBHOOK_TOKEN
 *
 * Eventos tratados:
 *  - Aprovação / renovação    → ativa assinatura + cria usuário (1ª compra) + e-mail de acesso
 *  - Reembolso / chargeback / cancelamento → suspende acesso
 *  - Atraso (late / past_due) → marca status `past_due`
 *
 * Identificação de usuário: apenas `subscriptions` + `kiwify_orders` (sem auth.users).
 */
export const Route = createFileRoute("/api/public/kiwify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;
        if (!expectedToken) {
          return new Response("Webhook desabilitado", { status: 503 });
        }
        const provided =
          url.searchParams.get("token") || request.headers.get("x-kiwify-token");
        if (provided !== expectedToken) {
          return new Response("Invalid token", { status: 401 });
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const orderId =
          body?.order_id || body?.Order?.order_id || body?.id || crypto.randomUUID();
        const rawStatus = String(
          body?.order_status ||
            body?.status ||
            body?.Order?.order_status ||
            body?.webhook_event_type ||
            body?.event ||
            "unknown",
        ).toLowerCase();
        const email = (
          body?.Customer?.email ||
          body?.customer?.email ||
          body?.email ||
          ""
        ).toLowerCase();
        const fullName =
          body?.Customer?.full_name ||
          body?.customer?.full_name ||
          body?.customer?.name ||
          null;
        const productId =
          body?.Product?.product_id || body?.product?.id || body?.product_id || null;

        const planKey = detectPlanKey(body);

        await supabaseAdmin.from("kiwify_orders").upsert(
          {
            order_id: String(orderId),
            email,
            status: rawStatus,
            product_id: productId ? String(productId) : null,
            raw: body,
          },
          { onConflict: "order_id" },
        );

        const isApproval = [
          "paid",
          "approved",
          "completed",
          "order_approved",
          "subscription_renewed",
          "subscription_paid",
          "renewed",
        ].some((s) => rawStatus.includes(s));

        const isLate = [
          "late",
          "past_due",
          "subscription_late",
          "subscription_overdue",
          "subscription_renewal_failed",
        ].some((s) => rawStatus.includes(s));

        const isCancel = [
          "refund",
          "chargeback",
          "canceled",
          "cancelled",
          "subscription_canceled",
        ].some((s) => rawStatus.includes(s));

        if (!email) {
          return Response.json({ ok: true, handled: false, reason: "no email" });
        }

        // Identificação SOMENTE por tabelas da app (sem auth.users/listUsers).
        let userId = await resolveUserIdByEmail(email);

        if (isApproval) {
          let isNewUser = false;

          if (!userId) {
            // Primeira compra → cria o usuário VIA CONVITE (única origem de contas,
            // signup público off). inviteUserByEmail cria o usuário E dispara o e-mail
            // "Invite user" (template separado do de recuperação), com link de primeiro
            // acesso apontando para /criar-senha.
            const siteUrl = (process.env.SITE_URL || `https://${url.host}`).replace(/\/+$/, "");
            const { data: invited, error: inviteErr } =
              await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${siteUrl}/criar-senha`,
                data: { full_name: fullName, source: "kiwify" },
              });

            if (inviteErr || !invited?.user?.id) {
              // Defensivo: com signup off isso não deve ocorrer. Se o e-mail já existir
              // em auth mas sem mapeamento na app, não derrubamos o webhook — sinalizamos
              // para reconciliação manual e devolvemos 200 (evita retries infinitos).
              console.error("[kiwify] inviteUserByEmail falhou:", inviteErr?.message);
              return Response.json({
                ok: true,
                handled: false,
                reason: "user_invite_failed_or_exists_unmapped",
                email,
                order_id: String(orderId),
              });
            }

            userId = invited.user.id;
            isNewUser = true;
          }

          // expires_at: lifetime fica null; mensal/trimestral somam o período.
          let expiresAt: string | null = null;
          if (planKey === "monthly") {
            expiresAt = new Date(Date.now() + 31 * 86400000).toISOString();
          } else if (planKey === "quarterly") {
            expiresAt = new Date(Date.now() + 93 * 86400000).toISOString();
          }

          // Upsert idempotente da assinatura (chave: user_id).
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              email,
              status: "active",
              plan: planKey,
              order_id: String(orderId),
              product_id: productId ? String(productId) : null,
              started_at: new Date().toISOString(),
              expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
          await supabaseAdmin.from("profiles").update({ active: true }).eq("id", userId);
          await supabaseAdmin
            .from("kiwify_orders")
            .update({ created_user_id: userId })
            .eq("order_id", String(orderId));

          // O e-mail de primeiro acesso é o próprio convite (inviteUserByEmail),
          // enviado apenas na criação do usuário (1ª compra). Em renovações/recompras/
          // reenvios da Kiwify, o usuário já existe e nenhum e-mail é disparado aqui.
          // Se o convite expirar, o usuário usa "Esqueci minha senha" no login (recovery).

          return Response.json({
            ok: true,
            action: "activated",
            userId,
            plan: planKey,
            new_user: isNewUser,
            email_sent: isNewUser,
          });
        }

        if (isLate && userId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("user_id", userId);
          return Response.json({ ok: true, action: "past_due", userId });
        }

        if (isCancel && userId) {
          const newStatus = rawStatus.includes("refund")
            ? "refunded"
            : rawStatus.includes("chargeback")
            ? "chargeback"
            : "canceled";
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
          await supabaseAdmin.from("profiles").update({ active: false }).eq("id", userId);
          return Response.json({ ok: true, action: newStatus, userId });
        }

        return Response.json({ ok: true, handled: false, status: rawStatus });
      },
    },
  },
});
