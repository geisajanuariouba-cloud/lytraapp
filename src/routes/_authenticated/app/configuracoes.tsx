import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/lib/lytra.functions";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  LogOut,
  Loader2,
  User,
  Mail,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PLANS, planLabel } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/app/configuracoes")({
  component: ConfigPage,
});

function statusBadge(status?: string | null) {
  switch (status) {
    case "active":
      return { label: "Ativa", className: "bg-primary-soft text-primary" };
    case "past_due":
      return { label: "Atrasada", className: "bg-amber-100 text-amber-700" };
    case "canceled":
      return { label: "Cancelada", className: "bg-muted text-muted-foreground" };
    case "refunded":
      return { label: "Reembolsada", className: "bg-muted text-muted-foreground" };
    case "chargeback":
      return { label: "Chargeback", className: "bg-destructive/10 text-destructive" };
    default:
      return { label: "Sem assinatura", className: "bg-muted text-muted-foreground" };
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

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

  const sub = data?.subscription;
  const badge = statusBadge(sub?.status);
  const currentPlanKey = sub?.plan as keyof typeof PLANS | undefined;

  // Caminhos de upgrade disponíveis
  const upgradeOptions: ("quarterly" | "lifetime")[] =
    currentPlanKey === "monthly"
      ? ["quarterly", "lifetime"]
      : currentPlanKey === "quarterly"
      ? ["lifetime"]
      : currentPlanKey === "lifetime"
      ? []
      : ["monthly", "quarterly", "lifetime"] as any;

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
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </button>
            <button
              onClick={handleResetPassword}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
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

        <div className="mt-5 rounded-2xl bg-primary-soft/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Plano atual
              </p>
              <p className="mt-1 text-lg font-semibold">{planLabel(sub?.plan)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Iniciada em {formatDate(sub?.started_at)}
                {sub?.plan !== "lifetime" && sub?.expires_at && (
                  <> · próxima cobrança em {formatDate(sub?.expires_at)}</>
                )}
                {sub?.plan === "lifetime" && <> · acesso permanente</>}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {upgradeOptions.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Melhorar plano
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {upgradeOptions.map((k) => {
                const p = PLANS[k];
                return (
                  <a
                    key={k}
                    href={p.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:border-primary hover:bg-primary-soft/30"
                  >
                    <div>
                      <p className="text-sm font-semibold">{p.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        {p.period}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Reembolso */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <MessageCircle className="h-4 w-4" /> Reembolso
        </h2>
        <div className="mt-5">
          <p className="text-base font-semibold">Solicitar reembolso</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Se você deseja solicitar um reembolso dentro do prazo permitido, entre em contato pelo WhatsApp abaixo.
          </p>
          <a
            href="https://wa.me/553298425801"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* Sessão */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <ShieldCheck className="h-4 w-4" /> Sessão
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Saia da sua conta em qualquer momento. Seus dados ficam guardados com segurança.
        </p>
        <button
          onClick={handleLogout}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-destructive/30 bg-background px-5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sair da conta
        </button>
      </section>
    </div>
  );
}
