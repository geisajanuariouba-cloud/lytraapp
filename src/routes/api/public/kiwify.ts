import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { detectPlanKey } from "@/lib/plans";

/**
 * Webhook Kiwify
 * URL: /api/public/kiwify?token=KIWIFY_WEBHOOK_TOKEN
 *
 * Eventos tratados:
 *  - Aprovação / renovação    → ativa assinatura + cria usuário se necessário
 *  - Reembolso / chargeback / cancelamento → suspende acesso
 *  - Atraso (late / past_due) → marca status `past_due`
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

        const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
        const found = existing?.users.find(
          (u) => (u.email || "").toLowerCase() === email,
        );
        let userId: string | undefined = found?.id;

        if (isApproval) {
          if (!userId) {
            const tempPassword = crypto.randomUUID() + "Aa1!";
            const { data: created, error: createErr } =
              await supabaseAdmin.auth.admin.createUser({
                email,
                password: tempPassword,
                email_confirm: true,
                user_metadata: { full_name: fullName, source: "kiwify" },
              });
            if (createErr) {
              console.error("Erro criando usuário Kiwify:", createErr);
              return new Response("User create failed", { status: 500 });
            }
            userId = created.user?.id;
          }

          if (userId) {
            // expires_at: para lifetime, deixa null. Para mensal/trimestral, soma o período.
            let expiresAt: string | null = null;
            if (planKey === "monthly") {
              expiresAt = new Date(Date.now() + 31 * 86400000).toISOString();
            } else if (planKey === "quarterly") {
              expiresAt = new Date(Date.now() + 93 * 86400000).toISOString();
            }

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
          }

          const siteUrl = process.env.SITE_URL || `https://${url.host}`;
          await supabaseAdmin.auth.admin.generateLink({
            type: "recovery",
            email,
            options: { redirectTo: `${siteUrl}/redefinir-senha` },
          });

          return Response.json({ ok: true, action: "activated", userId, plan: planKey });
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
