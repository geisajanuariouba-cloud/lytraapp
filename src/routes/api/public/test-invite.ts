import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * ⚠️ ROTA DE DIAGNÓSTICO — REMOVER APÓS VALIDAÇÃO DO FLUXO DE E-MAIL.
 *
 * Testa toda a cadeia de envio de e-mail de acesso sem precisar da Kiwify.
 * Protegida por KIWIFY_WEBHOOK_TOKEN.
 *
 * URLs:
 *
 * 1. Diagnóstico de env vars e Resend (NÃO envia e-mail):
 *    GET /api/public/test-invite?token=SEU_TOKEN&check=envs
 *
 * 2. Enviar e-mail real via Resend para um endereço de teste:
 *    GET /api/public/test-invite?token=SEU_TOKEN&email=seu@email.com&mode=resend
 *    → Gera link de acesso, envia via Resend, retorna resend_id ou error completo.
 *
 * 3. Gerar link de acesso sem enviar e-mail (debug do Supabase):
 *    GET /api/public/test-invite?token=SEU_TOKEN&email=seu@email.com&mode=link
 *
 * 4. Reenviar e-mail para usuário da compra real (recompra):
 *    GET /api/public/test-invite?token=SEU_TOKEN&email=comprador@email.com&mode=resend
 *    → Localiza usuário existente, gera link recovery, envia via Resend.
 */
export const Route = createFileRoute("/api/public/test-invite")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;
        if (!expectedToken) {
          return Response.json({ ok: false, error: "KIWIFY_WEBHOOK_TOKEN not configured" }, { status: 503 });
        }
        if (url.searchParams.get("token") !== expectedToken) {
          return Response.json({ ok: false, error: "Invalid token" }, { status: 401 });
        }

        const check = url.searchParams.get("check");
        const mode = (url.searchParams.get("mode") || "link").toLowerCase();
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        const siteUrl = (process.env.SITE_URL || `https://${url.host}`).replace(/\/+$/, "");

        // ── MODE: check=envs — diagnose all env vars ─────────────────────
        if (check === "envs") {
          const resendKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.FROM_EMAIL;
          const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY;
          const webhookToken = process.env.KIWIFY_WEBHOOK_TOKEN;

          // Quick Resend connectivity test (list domains — read-only, safe)
          let resendStatus: string = "not_tested";
          let resendError: string | null = null;
          if (resendKey) {
            try {
              const { Resend } = await import("resend");
              const resend = new Resend(resendKey);
              const { data, error } = await resend.domains.list();
              if (error) {
                resendStatus = "api_error";
                resendError = JSON.stringify(error);
              } else {
                resendStatus = "connected";
                const domains = (data as any)?.data ?? data ?? [];
                resendError = `domains: ${JSON.stringify(Array.isArray(domains) ? domains.map((d: any) => ({ name: d.name, status: d.status })) : domains)}`;
              }
            } catch (e: any) {
              resendStatus = "threw";
              resendError = e?.message;
            }
          }

          return Response.json({
            ok: true,
            env_check: {
              SITE_URL: siteUrl,
              RESEND_API_KEY: resendKey
                ? `set (${resendKey.slice(0, 6)}...${resendKey.slice(-4)}, length=${resendKey.length})`
                : "MISSING ❌",
              FROM_EMAIL: fromEmail || "MISSING ❌ (will use default acesso@lytra.shop)",
              KIWIFY_WEBHOOK_TOKEN: webhookToken ? `set (length=${webhookToken.length})` : "MISSING ❌",
              SUPABASE_SERVICE_ROLE_KEY: svcKey
                ? `set (${svcKey.slice(0, 10)}..., length=${svcKey.length})`
                : "MISSING ❌",
              SUPABASE_PUBLISHABLE_KEY: anonKey
                ? `set (length=${anonKey.length})`
                : "MISSING ❌",
            },
            resend_connectivity: {
              status: resendStatus,
              detail: resendError,
            },
          });
        }

        // ── All other modes require an email ─────────────────────────────
        if (!email) {
          return Response.json({
            ok: false,
            error: "Missing ?email= param. Use ?check=envs to test env vars only.",
          }, { status: 400 });
        }

        const redirectTo = `${siteUrl}/criar-senha`;

        // ── MODE: link — generate access link, return it (no email sent) ─
        if (mode === "link") {
          // Check if user exists first
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          const existing = userList?.users?.find((u) => u.email?.toLowerCase() === email);

          let linkResult: any;
          if (existing) {
            const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
              type: "recovery",
              email,
              options: { redirectTo },
            });
            linkResult = { type: "recovery", existing_user_id: existing.id, link: gen?.properties?.action_link ?? null, error: error?.message ?? null };
          } else {
            const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
              type: "invite",
              email,
              options: { redirectTo, data: { source: "kiwify_test" } },
            });
            linkResult = { type: "invite", new_user_id: gen?.user?.id ?? null, link: gen?.properties?.action_link ?? null, error: error?.message ?? null };
          }

          return Response.json({
            ok: !linkResult.error,
            mode: "link",
            email,
            redirectTo,
            user_existed: !!existing,
            ...linkResult,
          });
        }

        // ── MODE: resend — full end-to-end: generate link + send via Resend ─
        if (mode === "resend") {
          const steps: Record<string, any> = {};

          // Step 1: find or create user
          const { data: userList, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
          steps.list_users_error = listErr?.message ?? null;
          const existing = userList?.users?.find((u) => u.email?.toLowerCase() === email);
          steps.user_exists = !!existing;
          steps.user_id = existing?.id ?? null;

          // Step 2: generate link
          let accessLink: string | null = null;
          let linkError: string | null = null;

          if (existing) {
            const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
              type: "recovery",
              email,
              options: { redirectTo },
            });
            accessLink = gen?.properties?.action_link ?? null;
            linkError = error?.message ?? null;
            steps.link_type = "recovery";
          } else {
            const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
              type: "invite",
              email,
              options: { redirectTo, data: { source: "kiwify_test" } },
            });
            accessLink = gen?.properties?.action_link ?? null;
            linkError = error?.message ?? null;
            steps.link_type = "invite";
            steps.new_user_id = (gen as any)?.user?.id ?? null;
          }

          steps.link_generated = !!accessLink;
          steps.link_error = linkError;
          steps.link_preview = accessLink ? accessLink.slice(0, 80) + "..." : null;

          if (!accessLink) {
            return Response.json({ ok: false, mode: "resend", email, steps }, { status: 500 });
          }

          // Step 3: send via Resend
          const apiKey = process.env.RESEND_API_KEY;
          const from = process.env.FROM_EMAIL || "Lytra <acesso@lytra.shop>";
          steps.resend_api_key_set = !!apiKey;
          steps.resend_from = from;

          if (!apiKey) {
            steps.resend_result = "SKIPPED — RESEND_API_KEY not set";
            return Response.json({ ok: false, mode: "resend", email, steps });
          }

          try {
            const { Resend } = await import("resend");
            const resend = new Resend(apiKey);
            const { data: sent, error: sendErr } = await resend.emails.send({
              from,
              to: email,
              subject: "[TESTE] Sua senha de acesso à Lytra",
              html: `<p>Teste de envio via Resend.</p><p><a href="${accessLink}">Clique aqui para criar sua senha</a></p><p>Link: ${accessLink}</p>`,
            });

            if (sendErr) {
              steps.resend_result = "ERROR";
              steps.resend_error_full = JSON.stringify(sendErr, null, 2);
              console.error("[test-invite] Resend error:", JSON.stringify(sendErr, null, 2));
              return Response.json({ ok: false, mode: "resend", email, steps });
            }

            steps.resend_result = "SUCCESS";
            steps.resend_id = sent?.id;
            console.log("[test-invite] Resend success id=", sent?.id, "to=", email);
          } catch (e: any) {
            steps.resend_result = "THREW";
            steps.resend_error_full = e?.message;
            console.error("[test-invite] Resend threw:", e?.message);
            return Response.json({ ok: false, mode: "resend", email, steps });
          }

          return Response.json({ ok: true, mode: "resend", email, steps });
        }

        return Response.json({
          ok: false,
          error: "Unknown mode. Use mode=resend, mode=link, or check=envs",
          available_modes: ["mode=resend", "mode=link", "check=envs"],
        }, { status: 400 });
      },
    },
  },
});
