import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/lib/lytra.functions";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { LogOut, Loader2, ExternalLink, User, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/configuracoes")({
  component: ConfigPage,
});

function ConfigPage() {
  const nav = useNavigate();
  const fetchDash = useServerFn(getDashboard);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDash() });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.profile?.full_name) setName(data.profile.full_name);
    supabase.auth.getUser().then(({ data: u }) => setEmail(u.user?.email ?? ""));
  }, [data]);

  async function handleSaveName() {
    if (!name.trim()) return toast.error("Nome obrigatório.");
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", (await supabase.auth.getUser()).data.user!.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Nome atualizado.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    nav({ to: "/login" });
  }

  async function handleResetPassword() {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) toast.error(error.message);
    else toast.success("Email de redefinição enviado.");
  }

  return (
    <div className="md:pt-16">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sua conta e seu plano.</p>
      </header>

      {/* Perfil */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <User className="h-4 w-4" /> Perfil
        </h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
            <input
              value={email}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-2xl border border-border bg-muted px-4 text-sm text-muted-foreground"
            />
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </button>
            <button
              onClick={handleResetPassword}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Mail className="h-4 w-4" /> Redefinir senha
            </button>
          </div>
        </div>
      </section>

      {/* Plano */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="h-4 w-4" /> Assinatura
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-soft/40 p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Plano atual</p>
            <p className="mt-1 text-lg font-semibold">Acesso ativo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Para gerenciar, cancelar ou trocar de plano, acesse seu painel Kiwify.
            </p>
          </div>
          <a
            href="/#precos"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Melhorar plano <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Segurança / sessão */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <ShieldCheck className="h-4 w-4" /> Sessão
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Saia da sua conta em qualquer momento. Seus dados ficam guardados com segurança.
        </p>
        <button
          onClick={handleLogout}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-destructive/30 bg-background px-5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sair da conta
        </button>
      </section>
    </div>
  );
}
