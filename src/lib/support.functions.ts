import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listMyTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: ticket }, { data: messages }] = await Promise.all([
      supabase.from("support_tickets").select("*").eq("id", data.id).maybeSingle(),
      supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", data.id)
        .order("created_at", { ascending: true }),
    ]);
    if (!ticket) throw new Error("Ticket não encontrado");
    return { ticket, messages: messages ?? [] };
  });

export const createTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      subject: z.string().min(3).max(200),
      message: z.string().min(3).max(4000),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({ user_id: userId, subject: data.subject })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("support_messages").insert({
      ticket_id: ticket.id,
      author_id: userId,
      is_admin: false,
      content: data.message,
    });
    return ticket;
  });

export const replyTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string().uuid(),
      content: z.string().min(1).max(4000),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    await supabase.from("support_messages").insert({
      ticket_id: data.ticket_id,
      author_id: userId,
      is_admin: !!isAdmin,
      content: data.content,
    });
    await supabase
      .from("support_tickets")
      .update({
        updated_at: new Date().toISOString(),
        status: isAdmin ? "answered" : "open",
      })
      .eq("id", data.ticket_id);
    return { ok: true };
  });
