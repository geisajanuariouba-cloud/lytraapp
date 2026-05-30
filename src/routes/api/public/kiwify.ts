import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Webhook do Kiwify
 * URL: /api/public/kiwify?token=KIWIFY_WEBHOOK_TOKEN
 *
 * Trata aprovação, reembolso, chargeback e cancelamento.
 * - Aprovação: cria conta + assinatura ativa + envia link de senha
 * - Refund/chargeback/cancel: desativa assinatura (bloqueia acesso)
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
          body?.order_status || body?.status || body?.Order?.order_status || "unknown",
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
        const plan =
          body?.Product?.product_name || body?.plan || body?.subscription_plan || null;

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

        const isApproval = ["paid", "approved", "completed", "order_approved"].includes(rawStatus);
        const isCancel = [
          "refunded",
          "refund",
          "chargeback",
          "canceled",
          "cancelled",
          "subscription_canceled",
          "subscription_renewal_failed",
        ].includes(rawStatus);

        if (!email) {
          return Response.json({ ok: true, handled: false, reason: "no email" });
        }

        // Localiza/cria usuário
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
            await supabaseAdmin.from("subscriptions").upsert(
              {
                user_id: userId,
                email,
                status: "active",
                plan,
                order_id: String(orderId),
                product_id: productId ? String(productId) : null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            );
            await supabaseAdmin
              .from("profiles")
              .update({ active: true })
              .eq("id", userId);
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

          return Response.json({ ok: true, action: "activated", userId });
        }

        if (isCancel && userId) {
          const newStatus =
            rawStatus.includes("refund")
              ? "refunded"
              : rawStatus.includes("chargeback")
              ? "chargeback"
              : "canceled";
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
          await supabaseAdmin
            .from("profiles")
            .update({ active: false })
            .eq("id", userId);
          return Response.json({ ok: true, action: newStatus, userId });
        }

        return Response.json({ ok: true, handled: false, status: rawStatus });
      },
    },
  },
});
