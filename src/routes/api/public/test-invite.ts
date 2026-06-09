import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * ⚠️ ROTA TEMPORÁRIA DE TESTE — REMOVER APÓS A VALIDAÇÃO.
 *
 * Reproduz EXATAMENTE o que o webhook da Kiwify faz no primeiro acesso
 * (mesmo redirectTo + data), para validar o e-mail de "Invite user".
 *
 * Protegida pelo mesmo token do webhook (KIWIFY_WEBHOOK_TOKEN). Sem o token
 * correto responde 401. Sem o token configurado, 503.
 *
 * URL:
 *   GET /api/public/test-invite?token=SEU_TOKEN&email=voce%2Bteste@gmail.com&mode=link
 *
 * Modos:
 *   mode=send  (default) → inviteUserByEmail: ENVIA o e-mail real (paridade total
 *                          com o webhook). Não retorna o link (só aparece no inbox).
 *   mode=link            → generateLink(type=invite): NÃO envia e-mail, mas RETORNA
 *                          o action_link e o redirect_to presente nele.
 *
 * Observação: ambos os modos CRIAM o usuário. Use um e-mail de teste novo por
 * chamada (ou apague o usuário no painel Auth entre os testes).
 */
export const Route = createFileRoute("/api/public/test-invite")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;
        if (!expectedToken) {
          return new Response("Rota de teste desabilitada (sem token)", { status: 503 });
        }
        if (url.searchParams.get("token") !== expectedToken) {
          return new Response("Invalid token", { status: 401 });
        }

        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        if (!email) {
          return Response.json({ ok: false, reason: "missing email" }, { status: 400 });
        }
        const mode = (url.searchParams.get("mode") || "send").toLowerCase();

        // Mesma construção do webhook (src/routes/api/public/kiwify.ts).
        const siteUrl = (process.env.SITE_URL || `https://${url.host}`).replace(/\/+$/, "");
        const redirectTo = `${siteUrl}/criar-senha`;
        const data = { full_name: "Teste Lytra", source: "kiwify" };

        if (mode === "link") {
          const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
            type: "invite",
            email,
            options: { redirectTo, data },
          });
          if (error) {
            return Response.json(
              { ok: false, mode, redirectTo, error: error.message },
              { status: 400 },
            );
          }
          const actionLink = gen?.properties?.action_link ?? null;
          let redirectInLink: string | null = null;
          try {
            if (actionLink) redirectInLink = new URL(actionLink).searchParams.get("redirect_to");
          } catch {
            /* ignore parse error */
          }
          return Response.json({
            ok: true,
            mode,
            redirectTo_sent: redirectTo,
            action_link: actionLink,
            redirect_to_in_link: redirectInLink,
            user_id: gen?.user?.id ?? null,
          });
        }

        // mode=send → paridade total com o webhook (envia o e-mail real).
        const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
          email,
          { redirectTo, data },
        );
        if (error) {
          return Response.json(
            { ok: false, mode: "send", redirectTo, error: error.message },
            { status: 400 },
          );
        }
        return Response.json({
          ok: true,
          mode: "send",
          redirectTo_sent: redirectTo,
          user_id: invited?.user?.id ?? null,
          note: "E-mail de convite enviado. O redirect_to está no link dentro do e-mail.",
        });
      },
    },
  },
});
