import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Acesso restrito a administradores");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const [subs, tickets, orders] = await Promise.all([
      supabaseAdmin
        .from("subscriptions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("kiwify_orders")
        .select("order_id, email, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    return {
      subscriptions: subs.data ?? [],
      tickets: tickets.data ?? [],
      orders: orders.data ?? [],
    };
  });

export const adminUpdateSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      status: z.enum(["active", "canceled", "refunded", "chargeback", "inactive"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("user_id", data.user_id);
    await supabaseAdmin
      .from("profiles")
      .update({ active: data.status === "active" })
      .eq("id", data.user_id);
    return { ok: true };
  });
