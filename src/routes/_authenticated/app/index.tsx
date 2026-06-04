import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getDashboard,
  toggleTask,
  submitMood,
  regenerateTodayTasks,
  appendMoreTasks,
} from "@/lib/lytra.functions";
import { CheckCircle2, Circle, Flame, RefreshCw, Sparkles, Trophy, Volume2, Square } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

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

function HomePage() {
  const qc = useQueryClient();
  const fetchDash = useServerFn(getDashboard);
  const toggleFn = useServerFn(toggleTask);
  const moodFn = useServerFn(submitMood);
  const regenFn = useServerFn(regenerateTodayTasks);
  const appendFn = useServerFn(appendMoreTasks);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  const [regenerating, setRegenerating] = useState(false);

  // OPTIMISTIC: atualiza a UI imediatamente, sincroniza com o servidor em background.
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
        // Atualiza XP / streak otimisticamente também (visual apenas)
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
    // Sem invalidate forçado — o staleTime cuida do refresh; evita refetch pesado.
  });

  const moodM = useMutation({
    mutationFn: (mood: number) => moodFn({ data: { mood } }),
    onMutate: async (mood) => {
      await qc.cancelQueries({ queryKey: ["dashboard"] });
      const prev = qc.getQueryData<any>(["dashboard"]);
      if (prev) {
        qc.setQueryData(["dashboard"], {
          ...prev,
          todayMood: { ...(prev.todayMood ?? {}), mood },
        });
      }
      return { prev };
    },
    onError: (e: any, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["dashboard"], ctx.prev);
      toast.error(e?.message ?? "Não foi possível salvar o humor.");
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Carregando...</div>;
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
  const xpPct = ((progress?.xp ?? 0) % 100);
  const completedToday = data.tasks.filter((t: any) => t.completed).length;

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      await regenFn();
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Novas tarefas geradas pela IA.");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="md:pt-16">
      {/* Saudação */}
      <section className="animate-fade-up">
        <p className="text-sm text-muted-foreground">{greeting}{name ? "," : ""}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {name || "respira."} <span className="text-primary">Você está aqui.</span>
        </h1>
      </section>

      {/* Streak / Progresso */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={Flame} label="Sequência" value={`${progress?.current_streak ?? 0} dias`} />
        <Stat icon={Trophy} label="Nível" value={`${progress?.level ?? 1}`} />
        <Stat icon={Sparkles} label="XP" value={`${progress?.xp ?? 0}`} />
      </section>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary-gradient transition-all duration-700"
          style={{ width: `${xpPct}%` }}
        />
      </div>

      {/* Humor do dia */}
      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Como você está agora?</h2>
        <div className="mt-4 flex justify-between gap-2">
          {MOODS.map((m) => {
            const active = data.todayMood?.mood === m.v;
            return (
              <button
                key={m.v}
                onClick={() => moodM.mutate(m.v)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border p-3 text-xs transition ${
                  active
                    ? "border-primary bg-primary-soft shadow-glow"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] text-muted-foreground">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Plano pessoal */}
      {data.onboarding?.ai_plan && (
        <section className="mt-6 rounded-3xl border border-border bg-soft p-6 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Seu plano</h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
            {data.onboarding.ai_plan}
          </p>
        </section>
      )}

      {/* Tarefas do dia */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Hoje</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {completedToday}/{data.tasks.length} tarefas concluídas
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
            Novas tarefas
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {data.tasks.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem tarefas. Toque em "Novas tarefas".
            </li>
          )}
          {data.tasks.map((t: any) => (
            <li
              key={t.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                t.completed ? "border-primary/30 bg-primary-soft/40" : "border-border bg-background"
              }`}
            >
              <button
                onClick={() => toggleM.mutate({ id: t.id, completed: !t.completed })}
                className="mt-0.5 shrink-0 text-primary"
              >
                {t.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${t.completed ? "text-muted-foreground line-through" : ""}`}>
                  {t.title}
                </p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
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
