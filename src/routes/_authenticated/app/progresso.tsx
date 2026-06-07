import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/lib/lytra.functions";
import { Flame, Trophy, Sparkles, Award, Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/progresso")({
  component: ProgressoPage,
});

const BADGES = [
  { id: "3d", name: "3 dias", min: 3 },
  { id: "7d", name: "1 semana", min: 7 },
  { id: "14d", name: "2 semanas", min: 14 },
  { id: "30d", name: "30 dias", min: 30 },
  { id: "60d", name: "60 dias", min: 60 },
  { id: "90d", name: "90 dias", min: 90 },
];

function ProgressoPage() {
  const fetchDash = useServerFn(getDashboard);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDash() });

  if (!data) return null;

  const p = data.progress;
  const streak = p?.current_streak ?? 0;
  const best = p?.best_streak ?? 0;
  const xp = p?.xp ?? 0;
  const level = p?.level ?? 1;
  const relapses = data.relapses.length;

  // Calendário dos últimos 35 dias
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d;
  });
  const relapseDates = new Set(
    data.relapses.map((r: any) => new Date(r.created_at).toISOString().slice(0, 10)),
  );

  return (
    <div className="md:pt-16">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Progresso</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dia após dia, você está reconstruindo.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <BigStat icon={Flame} label="Sequência atual" value={`${streak} dias`} />
        <BigStat icon={Trophy} label="Melhor sequência" value={`${best} dias`} />
        <BigStat icon={Sparkles} label="Nível" value={`${level}`} />
        <BigStat icon={Heart} label="Recaídas" value={`${relapses}`} subtle />
      </section>

      {/* XP bar */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Nível {level}</span>
          <span className="text-muted-foreground">{xp % 100}/100 XP</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary-gradient transition-all duration-700"
            style={{ width: `${xp % 100}%` }}
          />
        </div>
      </section>

      {/* Calendário */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
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
                  relapsed
                    ? "bg-destructive/20"
                    : "bg-primary-soft"
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

      {/* Badges */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Conquistas</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {BADGES.map((b) => {
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
    </div>
  );
}

function BigStat({
  icon: Icon,
  label,
  value,
  subtle,
}: {
  icon: any;
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${subtle ? "" : "text-primary"}`} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
