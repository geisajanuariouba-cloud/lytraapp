import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/lib/lytra.functions";
import { xpForNextLevel, LEVEL_THRESHOLDS } from "@/lib/lytra.functions";
import { Flame, Trophy, Sparkles, Award, Heart, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/progresso")({
  component: ProgressoPage,
});

const ACHIEVEMENT_META: Record<string, { label: string; desc: string }> = {
  first_mission:  { label: "Primeiro passo",      desc: "Completou sua primeira missão diária" },
  streak_3:       { label: "Constância inicial",   desc: "3 dias seguidos" },
  streak_7:       { label: "Semana completa",      desc: "7 dias seguidos" },
  tasks_10:       { label: "Foco em construção",   desc: "10 tarefas concluídas" },
  tasks_25:       { label: "Controle crescente",   desc: "25 tarefas concluídas" },
  level_2:        { label: "Nível 2 alcançado",    desc: "Chegou ao nível 2" },
  level_5:        { label: "Nível 5 alcançado",    desc: "Chegou ao nível 5" },
};

// Static streak-based badges for the calendar section
const STREAK_BADGES = [
  { id: "3d",  name: "3 dias",  min: 3 },
  { id: "7d",  name: "1 semana", min: 7 },
  { id: "14d", name: "2 semanas", min: 14 },
  { id: "30d", name: "30 dias",  min: 30 },
  { id: "60d", name: "60 dias",  min: 60 },
  { id: "90d", name: "90 dias",  min: 90 },
];

function ProgressoPage() {
  const fetchDash = useServerFn(getDashboard);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDash() });

  if (!data) return null;

  const p = data.progress;
  const streak = p?.current_streak ?? 0;
  const best = p?.best_streak ?? 0;
  const totalXp = p?.xp ?? 0;
  const level = p?.level ?? 1;
  const relapses = data.relapses.length;
  const totalDays = (p as any)?.total_days_completed ?? 0;
  const totalTasks = (p as any)?.total_tasks_completed ?? 0;

  const xpInfo = xpForNextLevel(totalXp);

  // Achievements from DB (if available)
  const dbAchievements: string[] = (data as any)?.achievements?.map((a: any) => a.achievement_key) ?? [];
  const allAchievementKeys = Object.keys(ACHIEVEMENT_META);

  // Calendar — last 35 days
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d;
  });
  const relapseDates = new Set(
    data.relapses.map((r: any) => new Date(r.created_at).toISOString().slice(0, 10)),
  );

  return (
    <div className="md:pt-16 space-y-6">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Progresso</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dia após dia, você está reconstruindo.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-2">
        <BigStat icon={Flame}    label="Sequência atual"  value={`${streak} ${streak === 1 ? "dia" : "dias"}`} accent />
        <BigStat icon={Trophy}   label="Melhor sequência" value={`${best} ${best === 1 ? "dia" : "dias"}`} accent />
        <BigStat icon={Zap}      label="Tarefas concluídas" value={`${totalTasks}`} accent />
        <BigStat icon={Heart}    label="Recaídas"          value={`${relapses}`} />
      </section>

      {/* XP / Level card */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Nível {level}</p>
            <p className="mt-0.5 text-3xl font-semibold tracking-tight">{totalXp} XP</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary-gradient transition-all duration-700"
            style={{ width: `${xpInfo.pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Nível {level}</span>
          <span>
            {xpInfo.needed > 0
              ? `${totalXp - (LEVEL_THRESHOLDS[level - 1] ?? 0)} / ${(LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[level - 1]) - (LEVEL_THRESHOLDS[level - 1] ?? 0)} XP`
              : "Nível máximo"}
          </span>
          <span>Nível {Math.min(level + 1, LEVEL_THRESHOLDS.length)}</span>
        </div>
      </section>

      {/* Calendar */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Últimos 35 dias</h2>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const relapsed = relapseDates.has(iso);
            const isToday = iso === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={iso}
                title={d.toLocaleDateString("pt-BR")}
                className={`aspect-square rounded-lg ${
                  relapsed ? "bg-destructive/20" : "bg-primary-soft"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
              />
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="mr-3 inline-block h-2.5 w-2.5 rounded-sm bg-primary-soft align-middle" /> Dia limpo
          <span className="ml-4 mr-3 inline-block h-2.5 w-2.5 rounded-sm bg-destructive/20 align-middle" /> Recaída
        </p>
      </section>

      {/* Streak badges */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Sequência</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {STREAK_BADGES.map((b) => {
            const unlocked = best >= b.min;
            return (
              <div
                key={b.id}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-xs transition ${
                  unlocked
                    ? "border-primary bg-primary-soft text-foreground shadow-glow"
                    : "border-border bg-background text-muted-foreground opacity-50"
                }`}
              >
                <Award className={`h-6 w-6 ${unlocked ? "text-primary" : ""}`} />
                {b.name}
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Conquistas</h2>
        <div className="space-y-3">
          {allAchievementKeys.map((key) => {
            const meta = ACHIEVEMENT_META[key];
            const unlocked = dbAchievements.includes(key);
            return (
              <div
                key={key}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                  unlocked
                    ? "border-primary/30 bg-primary-soft/40"
                    : "border-border bg-background opacity-50"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  unlocked ? "bg-primary-soft" : "bg-muted"
                }`}>
                  {unlocked
                    ? <Star className="h-5 w-5 text-primary fill-primary/20" />
                    : <Award className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {meta.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{meta.desc}</p>
                </div>
                {unlocked && (
                  <span className="ml-auto text-xs font-medium text-primary">Desbloqueada</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function BigStat({
  icon: Icon, label, value, accent,
}: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : ""}`} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
