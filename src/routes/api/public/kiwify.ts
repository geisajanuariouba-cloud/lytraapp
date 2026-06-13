import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { detectPlanKey } from "@/lib/plans";
import { sendAccessEmail } from "@/lib/email.server";

/**
 * Resolve o user_id de um e-mail usando SOMENTE tabelas da aplicação.
 * Premissa: signup público off — todo usuário nasce deste webhook.
 */
async function resolveUserIdByEmail(email: string): Promise<string | undefined> {
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("email", email)
    .limit(1);
  if (subs?.[0]?.user_id) return subs[0].user_id;

  const { data: orders } = await supabaseAdmin
    .from("kiwify_orders")
    .select("created_user_id")
    .eq("email", email)
    .not("created_user_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);
  return orders?.[0]?.created_user_id ?? undefined;
}

/**
 * Gera um link de acesso (invite ou recovery) sem enviar e-mail pelo Supabase.
 * Retornamos o link e disparamos pelo Resend.
 */
async function generateAccessLink(email: string, redirectTo: string): Promise<string | null> {
  // Try invite first (new user flow)
  const { data: inv, error: invErr } = await supabaseAdmin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo, data: {} },
  });
  if (!invErr && inv?.properties?.action_link) {
    return inv.properties.action_link;
  }
  console.warn("[kiwify] generateLink(invite) failed:", invErr?.message, "— trying recovery");

  // User already exists — generate a recovery (magic link) for /criar-senha flow
  const { data: rec, error: recErr } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });
  if (!recErr && rec?.properties?.action_link) {
    return rec.properties.action_link;
  }
  console.error("[kiwify] generateLink(recovery) also failed:", recErr?.message);
  return null;
}

/**
 * Webhook Kiwify
 * URL: /api/public/kiwify?token=KIWIFY_WEBHOOK_TOKEN
 */
export const Route = createFileRoute("/api/public/kiwify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;

        if (!expectedToken) {
          console.error("[kiwify] KIWIFY_WEBHOOK_TOKEN not set");
          return new Response("Webhook desabilitado", { status: 503 });
        }
        const provided =
          url.searchParams.get("token") || request.headers.get("x-kiwify-token");
        if (provided !== expectedToken) {
          console.error("[kiwify] Invalid token provided");
          return new Response("Invalid token", { status: 401 });
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // ── Parse payload ────────────────────────────────────────────────
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
        ).toLowerCase().trim();
        const fullName =
          body?.Customer?.full_name ||
          body?.customer?.full_name ||
          body?.customer?.name ||
          null;
        const productId =
          body?.Product?.product_id || body?.product?.id || body?.product_id || null;

        const planKey = detectPlanKey(body);

        console.log("[kiwify] received", {
          order_id: String(orderId),
          raw_status: rawStatus,
          email: email || "(empty)",
          product_id: productId,
          plan_key: planKey,
          full_name: fullName,
          body_keys: Object.keys(body || {}),
        });

        // ── Always log raw order ─────────────────────────────────────────
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
        console.log("[kiwify] order upserted order_id=", String(orderId));

        // ── Classify event ───────────────────────────────────────────────
        const isApproval = [
          "paid", "approved", "completed", "order_approved",
          "subscription_renewed", "subscription_paid", "renewed",
        ].some((s) => rawStatus.includes(s));

        const isLate = [
          "late", "past_due", "subscription_late",
          "subscription_overdue", "subscription_renewal_failed",
        ].some((s) => rawStatus.includes(s));

        const isCancel = [
          "refund", "chargeback", "canceled", "cancelled", "subscription_canceled",
        ].some((s) => rawStatus.includes(s));

        console.log("[kiwify] classified", { isApproval, isLate, isCancel });

        if (!email) {
          console.error("[kiwify] no email in payload — cannot proceed");
          return Response.json({ ok: true, handled: false, reason: "no_email" });
        }

        // ── Identify existing user ───────────────────────────────────────
        let userId = await resolveUserIdByEmail(email);
        console.log("[kiwify] resolved userId=", userId ?? "(new user)");

        // ── APPROVAL ────────────────────────────────────────────────────
        if (isApproval) {
          const siteUrl = (process.env.SITE_URL || `https://${url.host}`).replace(/\/+$/, "");
          const redirectTo = `${siteUrl}/criar-senha`;

          let isNewUser = false;
          let accessLink: string | null = null;

          if (!userId) {
            // New user: create via invite
            console.log("[kiwify] new user — calling inviteUserByEmail email=", email);
            const { data: invited, error: inviteErr } =
              await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo,
                data: { full_name: fullName, source: "kiwify" },
              });

            if (inviteErr) {
              // User might already exist in auth.users but unmapped in our tables.
              // This happens if the same email bought before with a failed subscription write.
              console.warn("[kiwify] inviteUserByEmail failed:", inviteErr.message, "— trying to find existing auth user");

              // Try to find existing auth user via listUsers filter
              // (service_role can do this)
              const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
              const existingUser = userList?.users?.find(
                (u) => u.email?.toLowerCase() === email
              );

              if (existingUser) {
                userId = existingUser.id;
                console.log("[kiwify] found existing auth user id=", userId);
                // Generate recovery link to /criar-senha (lets them set/reset password)
                accessLink = await generateAccessLink(email, redirectTo);
              } else {
                console.error("[kiwify] cannot create or find user for email=", email);
                return Response.json({
                  ok: true,
                  handled: false,
                  reason: "user_create_failed",
                  invite_error: inviteErr.message,
                  email,
                  order_id: String(orderId),
                });
              }
            } else if (invited?.user?.id) {
              userId = invited.user.id;
              isNewUser = true;
              console.log("[kiwify] new user created id=", userId);
              // For new users, generate the link ourselves (don't rely on Supabase email)
              accessLink = await generateAccessLink(email, redirectTo);
            } else {
              console.error("[kiwify] inviteUserByEmail returned no user");
              return Response.json({
                ok: true,
                handled: false,
                reason: "invite_returned_no_user",
                email,
              });
            }
          } else {
            // Returning user (recompra/renewal) — generate fresh access link
            console.log("[kiwify] existing user recompra/renewal userId=", userId);
            accessLink = await generateAccessLink(email, redirectTo);
          }

          // ── Activate subscription ──────────────────────────────────────
          let expiresAt: string | null = null;
          if (planKey === "monthly") expiresAt = new Date(Date.now() + 31 * 86400000).toISOString();
          else if (planKey === "quarterly") expiresAt = new Date(Date.now() + 93 * 86400000).toISOString();

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
          console.log("[kiwify] subscription activated userId=", userId, "plan=", planKey);

          await supabaseAdmin.from("profiles").update({ active: true }).eq("id", userId);
          await supabaseAdmin
            .from("kiwify_orders")
            .update({ created_user_id: userId })
            .eq("order_id", String(orderId));

          // ── Send access email via Resend ──────────────────────────────
          let emailSent = false;
          let emailError: string | undefined;

          if (accessLink) {
            console.log("[kiwify] sending access email to=", email, "link=", accessLink.slice(0, 60) + "...");
            const emailResult = await sendAccessEmail({
              to: email,
              fullName,
              accessUrl: accessLink,
            });
            emailSent = emailResult.ok;
            emailError = emailResult.error;
            if (emailResult.ok) {
              console.log("[kiwify] access email sent ok id=", emailResult.id);
            } else {
              console.error("[kiwify] access email FAILED:", emailResult.error);
            }
          } else {
            console.error("[kiwify] no accessLink generated — email NOT sent for userId=", userId);
            emailError = "no_access_link_generated";
          }

          return Response.json({
            ok: true,
            action: "activated",
            userId,
            plan: planKey,
            new_user: isNewUser,
            email_sent: emailSent,
            email_error: emailError ?? null,
          });
        }

        // ── LATE ────────────────────────────────────────────────────────
        if (isLate && userId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("user_id", userId);
          console.log("[kiwify] marked past_due userId=", userId);
          return Response.json({ ok: true, action: "past_due", userId });
        }

        // ── CANCEL ───────────────────────────────────────────────────────
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
          console.log("[kiwify] subscription", newStatus, "userId=", userId);
          return Response.json({ ok: true, action: newStatus, userId });
        }

        console.log("[kiwify] unhandled event status=", rawStatus, "userId=", userId);
        return Response.json({ ok: true, handled: false, status: rawStatus, userId });
      },
    },
  },
});
