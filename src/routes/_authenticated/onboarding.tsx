import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { submitOnboarding } from "@/lib/lytra.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  beforeLoad: async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw redirect({ to: "/login" });

    // Idempotency: if onboarding is already complete, send to dashboard immediately.
    // Prevents re-doing the quiz and overwriting an existing plan.
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profile?.onboarded) {
      throw redirect({ to: "/app" });
    }
  },
  component: OnboardingPage,
});

const HABITS = [
  "Excesso de celular",
  "Redes sociais",
  "Procrastinação",
  "Pornografia",
  "Vídeos curtos",
  "Impulsividade",
  "Desorganização",
  "Rotina ruim",
  "Sono ruim",
  "Falta de foco",
];

const TRIGGERS_OPTIONS = [
  "Ansiedade",
  "Tédio",
  "Solidão",
  "Estresse",
  "Noite",
  "Acordar",
  "Trabalho",
  "Notificações",
  "Pessoas específicas",
];

const HOURS_OPTIONS = ["Manhã", "Tarde", "Final do dia", "Noite", "Madrugada"];

function OnboardingPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const submit = useServerFn(submitOnboarding);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    habit: "",
    intensity: 3,
    triggers: [] as string[],
    critical_hours: [] as string[],
    goal: "",
    current_feeling: "",
    biggest_obstacle: "",
    time_lost: "",
    vision_30_days: "",
  });

  const steps = [
    { title: "O que você quer reduzir?", subtitle: "Escolha aquilo que mais tira sua paz." },
    { title: "Qual a intensidade?", subtitle: "Sem julgamento. Apenas honestidade." },
    { title: "Quais são seus gatilhos?", subtitle: "O que costuma te empurrar pra lá?" },
    { title: "Quando é pior?", subtitle: "Em que horários você mais perde o controle?" },
    { title: "Onde você quer chegar?", subtitle: "Em poucas palavras." },
    { title: "Como você se sente hoje?", subtitle: "Antes de mudar, precisamos te conhecer." },
    { title: "O que mais te atrapalha?", subtitle: "Seja sincero. Isso fica entre nós." },
    { title: "Quanto tempo você perde?", subtitle: "Estimativa diária." },
    { title: "Como você quer estar em 30 dias?", subtitle: "Desenhe esse cenário." },
  ];

  async function handleFinish() {
    if (!form.habit || !form.goal || !form.current_feeling) {
      toast.error("Preencha os campos principais.");
      return;
    }
    setLoading(true);
    try {
      await submit({ data: form });
      // Clear the dashboard cache so app.tsx's beforeLoad reads fresh onboarded=true
      // and doesn't send the user back to /onboarding on the redirect.
      qc.removeQueries({ queryKey: ["dashboard"] });
      nav({ to: "/app" });
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao gerar seu plano.");
    } finally {
      setLoading(false);
    }
  }

  const current = steps[step];
  const last = step === steps.length - 1;

  function isStepValid(s: number): boolean {
    switch (s) {
      case 0: return !!form.habit;
      case 1: return form.intensity >= 1 && form.intensity <= 5;
      case 2: return form.triggers.length > 0;
      case 3: return form.critical_hours.length > 0;
      case 4: return form.goal.trim().length >= 3;
      case 5: return form.current_feeling.trim().length >= 3;
      case 6: return form.biggest_obstacle.trim().length >= 3;
      case 7: return form.time_lost.trim().length >= 1;
      case 8: return form.vision_30_days.trim().length >= 3;
      default: return false;
    }
  }
  const canContinue = isStepValid(step);

  function handleNext() {
    if (!canContinue) {
      toast.error("Responda para continuar.");
      return;
    }
    setStep((s) => s + 1);
  }


  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-6 py-10">
        <div>
          <Logo height={26} />
        </div>

        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary-gradient transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Passo {step + 1} de {steps.length}
        </p>

        <div className="mt-10 flex-1 animate-fade-up">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{current.title}</h1>
          <p className="mt-2 text-muted-foreground">{current.subtitle}</p>

          <div className="mt-8">
            {step === 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {HABITS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setForm((f) => ({ ...f, habit: h }))}
                    className={`rounded-2xl border p-4 text-left text-sm transition ${
                      form.habit === h
                        ? "border-primary bg-primary-soft text-foreground shadow-glow"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={form.intensity}
                  onChange={(e) => setForm((f) => ({ ...f, intensity: Number(e.target.value) }))}
                  className="w-full accent-[color:var(--primary)]"
                />
                <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                  <span>Leve</span>
                  <span>Moderado</span>
                  <span>Intenso</span>
                </div>
                <p className="mt-6 text-center text-4xl font-semibold text-primary">
                  {form.intensity}/5
                </p>
              </div>
            )}

            {(step === 2 || step === 3) && (
              <MultiChips
                options={step === 2 ? TRIGGERS_OPTIONS : HOURS_OPTIONS}
                values={step === 2 ? form.triggers : form.critical_hours}
                onToggle={(v) =>
                  setForm((f) => {
                    const key = step === 2 ? "triggers" : "critical_hours";
                    const arr = (f as any)[key] as string[];
                    return {
                      ...f,
                      [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v],
                    };
                  })
                }
              />
            )}

            {step === 4 && (
              <TextArea
                value={form.goal}
                onChange={(v) => setForm((f) => ({ ...f, goal: v }))}
                placeholder="Quero dormir melhor, voltar a estudar..."
              />
            )}
            {step === 5 && (
              <TextArea
                value={form.current_feeling}
                onChange={(v) => setForm((f) => ({ ...f, current_feeling: v }))}
                placeholder="Cansado, sem foco, ansioso..."
              />
            )}
            {step === 6 && (
              <TextArea
                value={form.biggest_obstacle}
                onChange={(v) => setForm((f) => ({ ...f, biggest_obstacle: v }))}
                placeholder="Pego o celular sem perceber..."
              />
            )}
            {step === 7 && (
              <input
                value={form.time_lost}
                onChange={(e) => setForm((f) => ({ ...f, time_lost: e.target.value }))}
                placeholder="Ex: 4 horas por dia"
                className="h-12 w-full rounded-2xl border border-border bg-card px-4 outline-none focus:border-primary"
              />
            )}
            {step === 8 && (
              <TextArea
                value={form.vision_30_days}
                onChange={(v) => setForm((f) => ({ ...f, vision_30_days: v }))}
                placeholder="Acordando cedo, lendo, presente comigo mesmo..."
              />
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="inline-flex h-11 items-center gap-1 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          {!last ? (
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-gradient px-6 text-sm font-medium text-primary-foreground shadow-glow transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading || !canContinue}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-gradient px-6 text-sm font-medium text-primary-foreground shadow-glow transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Gerar meu plano
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed outline-none focus:border-primary"
    />
  );
}

function MultiChips({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className={`rounded-full border px-4 py-2.5 text-sm transition ${
              active
                ? "border-primary bg-primary-soft text-foreground shadow-glow"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
