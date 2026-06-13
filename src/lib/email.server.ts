/**
 * Email delivery via Resend.
 * Falls back gracefully with detailed logs so webhook never silently swallows errors.
 *
 * Required env vars:
 *   RESEND_API_KEY  — Resend API key (re_...)
 *   FROM_EMAIL      — verified sender address, e.g. "Lytra <acesso@lytra.shop>"
 */

export interface SendAccessEmailParams {
  to: string;
  fullName: string | null;
  accessUrl: string; // the /criar-senha link
}

export async function sendAccessEmail(params: SendAccessEmailParams): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "Lytra <acesso@lytra.shop>";

  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not set — cannot send access email");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const firstName = params.fullName?.split(" ")[0] || "por aí";

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#1a7a4d;">lytra</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">
            Sua jornada começa agora, ${firstName}.
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
            Sua compra foi confirmada. Crie sua senha para acessar a Lytra e começar.
          </p>
          <a href="${params.accessUrl}"
             style="display:inline-block;background:#1a7a4d;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:100px;">
            Criar minha senha
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
            Este link expira em 24 horas. Se você não realizou esta compra, ignore este e-mail.<br>
            Em caso de dúvida: <a href="mailto:acesso@lytra.shop" style="color:#1a7a4d;">acesso@lytra.shop</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: "Sua senha de acesso à Lytra",
      html,
    });

    if (error) {
      console.error("[email] Resend error:", JSON.stringify(error));
      return { ok: false, error: JSON.stringify(error) };
    }

    console.log("[email] Resend success id=", data?.id, "to=", params.to);
    return { ok: true, id: data?.id };
  } catch (e: any) {
    console.error("[email] Resend threw:", e?.message);
    return { ok: false, error: e?.message };
  }
}
