import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getDashboard,
  toggleTask,
  submitMood,
  regenerateTodayTasks,
  ensureTodayTasks,
} from "@/lib/lytra.functions";
import {
  CheckCircle2,
  Circle,
  Flag,
  Flame,
  Heart,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Volume2,
  Square,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/app/")({
  component: HomePage,
});

const MOODS = [
  { v: 1, label: "Péssimo", emoji: "😞" },
  { v: 2, label: "Ruim", emoji: "😕" },
  { v: 3, label: "Normal", emoji: "😐" },
  { v: 4, label: "Bem", emoji: "🙂" },
  { v: 5, label: "Ótimo", emoji: "😊" },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  fisica:    { label: "Físico",       color: "bg-blue-50 text-blue-600" },
  gatilho:   { label: "Gatilho",      color: "bg-amber-50 text-amber-600" },
  mental:    { label: "Mental",       color: "bg-purple-50 text-purple-600" },
  reflexao:  { label: "Reflexão",     color: "bg-teal-50 text-teal-600" },
};

function HomePage() {
  const qc = useQueryClient();
  const fetchDash = useServerFn(getDashboard);
  const toggleFn = useServerFn(toggleTask);
  const moodFn = useServerFn(submitMood);
  const regenFn = useServerFn(regenerateTodayTasks);
  const ensureFn = useServerFn(ensureTodayTasks);

  const [regenerating, setRegenerating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  // Auto-generate tasks on first load of the day — silently, no button needed.
  useEffect(() => {
    if (!data) return;
    if (data.tasks.length > 0) return; // already have tasks
    ensureFn().then((res) => {
      if ((res as any)?.generated) {
        qc.invalidateQueries({ queryKey: ["dashboard"] });
      }
    }).catch(() => {/* silent — user can retry manually */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.tasks?.length === 0]);

  const toggleM = useMutation({
    mutationFn: (vars: { id: string; completed: boolean }) => toggleFn({ data: vars }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["dashboard"] });
      const prev = qc.getQueryData<any>(["dashboard"]);
      if (prev) {
        const tasks = prev.tasks.map((t: any) =>
          t.id === vars.id
            ? { ...t, completed: vars.completed, completed_at: vars.completed ? new Date().toISOString() : null }
            : t,
        );
        let progress = prev.progress;
        if (vars.completed && progress) {
          const xp = (progress.xp ?? 0) + 10;
          progress = { ...progress, xp, level: Math.max(1, Math.floor(xp / 100) + 1) };
        }
        qc.setQueryData(["dashboard"], { ...prev, tasks, progress });
      }
      return { prev };
    },
    onError: (e: any, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
      toast.error(e?.message ?? "Não foi possível atualizar a tarefa.");
    },
  });

  const moodM = useMutation({
    mutationFn: (mood: number) => moodFn({ data: { mood } }),
    onMutate: async (mood) => {
      await qc.cancelQueries({ queryKey: ["dashboard"] });
      const prev = qc.getQueryData<any>(["dashboard"]);
      if (prev) {
        qc.setQueryData(["dashboard"], { ...prev, todayMood: { ...(prev.todayMood ?? {}), mood } });
      }
      return { prev };
    },
    onError: (e: any, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
      toast.error(e?.message ?? "Não foi possível salvar o humor.");
    },
  });

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      await regenFn();
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Missão do dia atualizada.");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao atualizar tarefas.");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleRetryGenerate() {
    setRegenerating(true);
    try {
      await ensureFn();
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      toast.error("Não conseguimos carregar sua missão de hoje. Tente novamente.");
    } finally {
      setRegenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="md:pt-16">
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-3xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return "Boa madrugada";
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  const name = (data.profile?.full_name ?? "").split(" ")[0] || "";
  const progress = data.progress;
  const xpPct = (progress?.xp ?? 0) % 100;
  const tasks: any[] = data.tasks ?? [];
  const completedToday = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const allDone = totalTasks > 0 && completedToday === totalTasks;
  const progressPct = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;

  // First task not yet completed = "missão principal"
  const mainMission = tasks.find((t) => !t.completed) ?? tasks[0] ?? null;

  return (
    <div className="md:pt-16 space-y-6">

      {/* ── Greeting ──────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <p className="text-sm text-muted-foreground">{greeting}{name ? "," : ""}</p>
        <h1 className="mt-0.5 text-3xl font-semibold tracking-tight">
          {name || "respira."}{" "}
          <span className="text-primary">Você está aqui.</span>
        </h1>
      </section>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Flame}    label="Sequência" value={`${progress?.current_streak ?? 0} dias`} />
        <Stat icon={Trophy}   label="Nível"     value={`${progress?.level ?? 1}`} />
        <Stat icon={Sparkles} label="XP"        value={`${progress?.xp ?? 0}`} />
      </section>

      {/* XP progress bar */}
      <div className="-mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary-gradient transition-all duration-700"
          style={{ width: `${xpPct}%` }}
        />
      </div>

      {/* ── Mood ──────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Como você está agora?
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => {
            const active = data.todayMood?.mood === m.v;
            return (
              <button
                key={m.v}
                onClick={() => moodM.mutate(m.v)}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl border px-1 py-3 text-xs transition ${
                  active
                    ? "border-primary bg-primary-soft shadow-glow"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-center text-[11px] leading-tight text-muted-foreground">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Personal plan ─────────────────────────────────────── */}
      {data.onboarding?.ai_plan && (
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
              Seu plano
            </h2>
            <PlanAudioButton text={data.onboarding.ai_plan} />
          </div>
          <PlanBlocks text={data.onboarding.ai_plan} />
        </section>
      )}

      {/* ── Daily Mission ─────────────────────────────────────── */}
      <section>
        {/* Header with progress */}
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
              Missão de hoje
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {allDone
                ? "Tudo concluído — ótimo trabalho."
                : totalTasks === 0
                ? "Preparando seu dia..."
                : `${completedToday} de ${totalTasks} concluídas`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            title="Reorganizar dia"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary-gradient transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        {/* ── All done state ─────────────────────────────────── */}
        {allDone && (
          <div className="rounded-3xl border border-primary/30 bg-primary-soft/60 p-8 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft mb-4">
              <Star className="h-7 w-7 text-primary fill-primary/30" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
              Dia concluído
            </p>
            <h3 className="text-xl font-semibold text-foreground">
              Você completou sua missão de hoje.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cada pequena vitória constrói o próximo passo.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              +{totalTasks * 10} XP ganhos
            </div>
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────── */}
        {!allDone && totalTasks === 0 && !regenerating && (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Não conseguimos carregar sua missão de hoje.
            </p>
            <button
              type="button"
              onClick={handleRetryGenerate}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Tentar novamente
            </button>
          </div>
        )}

        {/* ── Generating skeleton ────────────────────────────── */}
        {!allDone && totalTasks === 0 && regenerating && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Mission highlight (first pending task) ─────────── */}
        {!allDone && mainMission && (
          <div className="mb-3 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/80 to-primary-soft/30 p-5 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-3.5 w-3.5 text-primary" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                Próxima missão
              </p>
            </div>
            <p className="text-base font-semibold text-foreground leading-snug">
              {mainMission.title}
            </p>
            {mainMission.description && (
              <p className="mt-1 text-sm text-muted-foreground">{mainMission.description}</p>
            )}
            <button
              type="button"
              onClick={() => toggleM.mutate({ id: mainMission.id, completed: true })}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-primary-gradient px-4 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Marcar como feita
            </button>
          </div>
        )}

        {/* ── Full task list ─────────────────────────────────── */}
        {totalTasks > 0 && (
          <ul className="space-y-2">
            {tasks.map((t: any) => {
              const cat = CATEGORY_LABELS[t.category] ?? null;
              return (
                <li
                  key={t.id}
                  className={`group flex items-start gap-3 rounded-2xl border p-4 transition ${
                    t.completed
                      ? "border-primary/20 bg-primary-soft/20"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleM.mutate({ id: t.id, completed: !t.completed })}
                    className={`mt-0.5 shrink-0 transition ${
                      t.completed ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                    aria-label={t.completed ? "Desmarcar tarefa" : "Concluir tarefa"}
                  >
                    {t.completed
                      ? <CheckCircle2 className="h-5 w-5" />
                      : <Circle className="h-5 w-5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-medium leading-snug ${
                        t.completed ? "text-muted-foreground line-through" : "text-foreground"
                      }`}>
                        {t.title}
                      </p>
                      {cat && !t.completed && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                      )}
                    </div>
                    {t.description && !t.completed && (
                      <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                        {t.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

const PLAN_STEPS = [
  { tag: "Onde você está", icon: Heart },
  { tag: "A estratégia",   icon: Target },
  { tag: "Primeiro passo", icon: Flag },
];

function PlanBlocks({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const parts = blocks.length > 0 ? blocks : [text.trim()];

  return (
    <div className="mt-3 space-y-3">
      {parts.map((p, i) => {
        const meta = PLAN_STEPS[i];
        const Icon = meta?.icon ?? Sparkles;
        return (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                {meta?.tag ?? `Parte ${i + 1}`}
              </p>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{p}</p>
          </div>
        );
      })}
    </div>
  );
}

function PlanAudioButton({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [voiceGender, setVoiceGender] = useState<"f" | "m">("f");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) setSupported(false);
    return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);

  function pickVoice(gender: "f" | "m"): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    const ptBR = voices.filter((v) => /pt[-_]br/i.test(v.lang) || /pt[-_]pt/i.test(v.lang));
    if (ptBR.length === 0) return null;
    const femaleHint = /(feminin|female|luciana|raquel|maria|joana|monica|helena|camila|fernanda)/i;
    const maleHint   = /(masculin|male|felipe|daniel|joão|joao|ricardo|paulo|lucas|carlos)/i;
    return ptBR.find((v) => gender === "f" ? femaleHint.test(v.name) : maleHint.test(v.name)) ?? ptBR[0];
  }

  function handlePlay() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (playing) { setPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR"; u.rate = 0.95; u.pitch = voiceGender === "f" ? 1.05 : 0.95;
    const v = pickVoice(voiceGender); if (v) u.voice = v;
    u.onend = () => setPlaying(false); u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u); setPlaying(true);
  }

  if (!supported) return null;
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setVoiceGender((g) => (g === "f" ? "m" : "f"))}
        className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:text-foreground"
      >
        Voz: {voiceGender === "f" ? "feminina" : "masculina"}
      </button>
      <button
        type="button"
        onClick={handlePlay}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary-gradient px-3 text-[11px] font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
      >
        {playing ? <Square className="h-3 w-3 fill-current" /> : <Volume2 className="h-3.5 w-3.5" />}
        {playing ? "Parar" : "Ouvir plano"}
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
