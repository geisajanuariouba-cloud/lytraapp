import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard, getTaskHistory, getDailyCompletions } from "@/lib/lytra.functions";
import { CheckCircle2, Circle, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/historico")({
  head: () => ({ meta: [{ title: "Histórico — Lytra" }] }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const fetchDash = useServerFn(getDashboard);
  const fetchHistory = useServerFn(getTaskHistory);
  const fetchCompletions = useServerFn(getDailyCompletions);

  const { data: dash } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  const { data: historyData, isLoading: loadingTasks } = useQuery({
    queryKey: ["task-history"],
    queryFn: () => fetchHistory(),
  });

  const { data: completionsData, isLoading: loadingCompletions } = useQuery({
    queryKey: ["daily-completions"],
    queryFn: () => fetchCompletions(),
  });

  const tasks: any[] = historyData?.tasks ?? [];
  const completions: any[] = completionsData?.completions ?? [];

  // Build a map of date → completion record
  const completionByDate = completions.reduce<Record<string, any>>((acc, c) => {
    acc[c.completed_date] = c;
    return acc;
  }, {});

  // Group tasks by date
  const tasksByDate = tasks.reduce<Record<string, any[]>>((acc, t) => {
    const d = t.task_date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(t);
    return acc;
  }, {});

  // Union of all dates that appear in either completions or tasks
  const allDates = Array.from(
    new Set([...Object.keys(completionByDate), ...Object.keys(tasksByDate)])
  ).sort((a, b) => b.localeCompare(a)).slice(0, 30);

  const today = new Date().toISOString().slice(0, 10);

  function formatDate(iso: string): string {
    if (iso === today) return "Hoje";
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (iso === yesterday) return "Ontem";
    return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }

  const categoryLabels: Record<string, string> = {
    fisica: "Físico", gatilho: "Gatilho", mental: "Mental", reflexao: "Reflexão",
  };
  const categoryColors: Record<string, string> = {
    fisica: "bg-blue-50 text-blue-600",
    gatilho: "bg-amber-50 text-amber-600",
    mental: "bg-purple-50 text-purple-600",
    reflexao: "bg-teal-50 text-teal-600",
  };

  const isLoading = loadingTasks || loadingCompletions;

  return (
    <div className="md:pt-16 space-y-6">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada dia concluído é uma vitória real.
        </p>
      </header>

      {/* Summary strip */}
      {dash?.progress && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft text-center">
            <p className="text-2xl font-semibold">{completions.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">dias concluídos</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft text-center">
            <p className="text-2xl font-semibold">{(dash.progress as any)?.total_tasks_completed ?? 0}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">tarefas feitas</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft text-center">
            <p className="text-2xl font-semibold">{dash.progress?.xp ?? 0}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">XP total</p>
          </div>
        </div>
      )}

      {/* Day-by-day history */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : allDates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma missão concluída ainda. Complete sua primeira missão hoje!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allDates.map((date) => {
            const completion = completionByDate[date];
            const dayTasks = tasksByDate[date] ?? [];
            const completedTasks = dayTasks.filter((t) => t.completed_at || t.completed);
            const isDayDone = !!completion;

            return (
              <div key={date} className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
                {/* Day header */}
                <div className={`flex items-center justify-between px-5 py-3 ${
                  isDayDone
                    ? "bg-primary-soft/50 border-b border-primary/20"
                    : "bg-muted/30 border-b border-border"
                }`}>
                  <div className="flex items-center gap-2">
                    {isDayDone && <Star className="h-4 w-4 text-primary fill-primary/20 shrink-0" />}
                    <span className="text-sm font-semibold capitalize">{formatDate(date)}</span>
                    {isDayDone && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Missão concluída
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {dayTasks.length > 0 && (
                      <span>{completedTasks.length}/{dayTasks.length} tarefas</span>
                    )}
                    {isDayDone && (
                      <span className="flex items-center gap-0.5 text-primary font-medium">
                        <Zap className="h-3 w-3" />+{completion.xp_awarded ?? 50} XP
                      </span>
                    )}
                  </div>
                </div>

                {/* Tasks or "no task data" notice */}
                {dayTasks.length > 0 ? (
                  <ul className="divide-y divide-border/50">
                    {dayTasks.map((t) => {
                      const done = !!(t.completed_at || t.completed);
                      const cat = categoryColors[t.category] ?? null;
                      return (
                        <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                          {done
                            ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                            : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                          <span className={`flex-1 text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {t.title}
                          </span>
                          {cat && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cat}`}>
                              {categoryLabels[t.category] ?? t.category}
                            </span>
                          )}
                          {done && t.completed_at && (
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              {new Date(t.completed_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : isDayDone ? (
                  <div className="px-5 py-4 text-sm text-muted-foreground">
                    Missão concluída em {new Date(completion.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
