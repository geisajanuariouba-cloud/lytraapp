import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/criar-senha")({
  head: () => ({ meta: [{ title: "Criar minha senha — Lytra" }] }),
  component: CreatePasswordPage,
});

type Status = "validating" | "ready" | "invalid" | "saving" | "done";

function CreatePasswordPage() {
  const nav = useNavigate();
  const [status, setStatus] = useState<Status>("validating");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // 1) Fluxo PKCE: ?code=xxx na query → exchangeCodeForSession
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            setErrorMsg("Link inválido ou expirado.");
            setStatus("invalid");
            return;
          }
          window.history.replaceState({}, "", url.pathname);
          setStatus("ready");
          return;
        }

        // 2) Fluxo implícito: tokens no hash (#access_token=...&refresh_token=...&type=invite)
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const hashError = hashParams.get("error_description") ?? hashParams.get("error");

        if (hashError) {
          setErrorMsg(decodeURIComponent(hashError));
          setStatus("invalid");
          return;
        }

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (cancelled) return;
          if (error) {
            setErrorMsg("Não foi possível validar o link.");
            setStatus("invalid");
            return;
          }
          window.history.replaceState({}, "", window.location.pathname);
          setStatus("ready");
          return;
        }

        // 3) Já existe sessão (ex.: usuário recarregou a página após validar o convite)
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          setStatus("ready");
          return;
        }

        // Nada serviu: convite inválido/expirado → orientar o fallback de recuperação
        setErrorMsg("Seu link de primeiro acesso é inválido ou expirou.");
        setStatus("invalid");
      } catch (e: any) {
        if (cancelled) return;
        setErrorMsg(e?.message ?? "Erro ao validar link.");
        setStatus("invalid");
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não conferem.");
      return;
    }
    setStatus("saving");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus("done");
      toast.success("Senha criada! Vamos começar.");
      // Primeiro acesso: mantém a sessão e segue direto para o onboarding.
      setTimeout(() => nav({ to: "/onboarding" }), 1000);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar senha.");
      setStatus("ready");
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center bg-background px-4">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6">
          <Logo height={28} />
        </div>

        {status === "validating" && (
          <div className="py-6 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Validando seu acesso…</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">Link de acesso inválido ou expirado</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {errorMsg ?? "Use a opção abaixo para definir sua senha e entrar."}
                </p>
              </div>
            </div>
            <Link
              to="/login"
              search={{ mode: "reset" }}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary-gradient text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Definir senha por e-mail
            </Link>
            <Link
              to="/login"
              className="block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Voltar para login
            </Link>
          </div>
        )}

        {(status === "ready" || status === "saving") && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo à Lytra.</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua senha para ativar seu acesso. Use pelo menos 8 caracteres.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <PasswordField
                label="Senha"
                value={password}
                onChange={setPassword}
                show={show}
                onToggle={() => setShow((s) => !s)}
              />
              <PasswordField
                label="Confirmar senha"
                value={confirm}
                onChange={setConfirm}
                show={show}
                onToggle={() => setShow((s) => !s)}
              />
              <button
                disabled={status === "saving"}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-gradient text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
              >
                {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar minha senha
              </button>
            </form>
          </>
        )}

        {status === "done" && (
          <div className="space-y-4 py-2 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
            </span>
            <p className="text-sm text-foreground">Senha criada. Preparando sua jornada…</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          required
          type={show ? "text" : "password"}
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm outline-none transition focus:border-primary"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}
