import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  mode: z.enum(["login", "reset"]).optional(),
});

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Lytra" }] }),
  validateSearch: (s) => searchSchema.parse(s),
  component: LoginPage,
});

// Traduz mensagens comuns do Supabase Auth para PT-BR
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials"))
    return "Email ou senha incorretos. Verifique e tente novamente.";
  if (m.includes("email not confirmed"))
    return "Confirme seu email antes de entrar. Verifique sua caixa de entrada.";
  if (m.includes("user not found"))
    return "Não encontramos uma conta com esse email.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  if (m.includes("network")) return "Sem conexão. Verifique sua internet.";
  if (m.includes("password")) return "Senha inválida. Tente novamente.";
  return "Não foi possível entrar agora. Tente novamente em instantes.";
}

function LoginPage() {
  const nav = useNavigate();
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "reset">(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("session_missing");

        // Decide destino com base em profile + subscription
        const userId = data.user.id;
        const [{ data: profile }, { data: sub }] = await Promise.all([
          supabase.from("profiles").select("onboarded, active").eq("id", userId).maybeSingle(),
          supabase.from("subscriptions").select("status").eq("user_id", userId).maybeSingle(),
        ]);

        const subStatus = sub?.status ?? "inactive";
        const hasActive = subStatus === "active";

        toast.success("Bem-vindo de volta!");

        if (!profile?.onboarded && hasActive) {
          await nav({ to: "/onboarding" });
        } else if (!hasActive) {
          // Acesso permitido só para conta/suporte — o gate em /app cuida da UI
          await nav({ to: "/app/configuracoes" });
        } else {
          await nav({ to: "/app" });
        }
        return;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        });
        if (error) throw error;
        toast.success("Email de recuperação enviado.");
        setMode("login");
      }
    } catch (err: any) {
      console.error("[login] erro:", err);
      toast.error(translateAuthError(err?.message ?? ""));
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  return (
    <div className="relative grid min-h-screen place-items-center bg-background px-4">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
            <Leaf className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-semibold tracking-tight">Lytra</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" && "Bem-vindo de volta."}
            {mode === "reset" && "Recuperar acesso."}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" && "Continue de onde parou."}
            {mode === "reset" && "Enviaremos um link para você redefinir sua senha."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="voce@email.com"
              />
            </Field>
            {mode === "login" && (
              <Field label="Senha">
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-11"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            )}

            <button
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-gradient font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" && (loading ? "Entrando..." : "Entrar")}
              {mode === "reset" && (loading ? "Enviando..." : "Enviar link")}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("reset")} className="hover:text-foreground">
                  Esqueci minha senha
                </button>
                <div className="my-2 h-px w-full bg-border" />
                <p className="text-xs">Ainda não tem acesso à Lytra?</p>
                <Link
                  to="/"
                  hash="precos"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-5 text-sm font-medium text-primary transition hover:bg-primary-soft"
                >
                  Adquirir agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
            {mode === "reset" && (
              <button onClick={() => setMode("login")} className="hover:text-foreground">
                Voltar para login
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0 14px;
          font-size: 14px;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
