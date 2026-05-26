import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Webhook do Kiwify
 * Configure a URL: /api/public/kiwify
 * Adicione um token ?token=XYZ se quiser verificação (KIWIFY_WEBHOOK_TOKEN).
 *
 * Quando o pagamento é aprovado, cria a conta automaticamente e envia
 * link de definição de senha por email.
 */
export const Route = createFileRoute("/api/public/kiwify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;
        if (expectedToken) {
          const provided = url.searchParams.get("token");
          if (provided !== expectedToken) {
            return new Response("Invalid token", { status: 401 });
          }
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const orderId =
          body?.order_id || body?.Order?.order_id || body?.id || crypto.randomUUID();
        const status =
          body?.order_status || body?.status || body?.Order?.order_status || "unknown";
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

        await supabaseAdmin.from("kiwify_orders").upsert(
          {
            order_id: String(orderId),
            email,
            status,
            product_id: productId ? String(productId) : null,
            raw: body,
          },
          { onConflict: "order_id" },
        );

        const approved = ["paid", "approved", "completed"].includes(
          String(status).toLowerCase(),
        );
        if (!approved || !email) {
          return Response.json({ ok: true, created: false });
        }

        // Verifica/cria usuário
        const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
        const found = existing?.users.find(
          (u) => (u.email || "").toLowerCase() === email,
        );

        let userId: string | undefined = found?.id;
        if (!userId) {
          const tempPassword = crypto.randomUUID() + "Aa1!";
          const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
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

        // Envia link de definição de senha
        const siteUrl =
          process.env.SITE_URL ||
          `https://${url.host}`;
        await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email,
          options: { redirectTo: `${siteUrl}/redefinir-senha` },
        });

        if (userId) {
          await supabaseAdmin
            .from("kiwify_orders")
            .update({ created_user_id: userId })
            .eq("order_id", String(orderId));
        }

        return Response.json({ ok: true, created: true, userId });
      },
    },
  },
});
