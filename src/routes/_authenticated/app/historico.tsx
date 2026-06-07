import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTaskHistory, getDashboard } from "@/lib/lytra.functions";
import { CheckCircle2, Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/historico")({
  head: () => ({ meta: [{ title: "Histórico — Lytra" }] }),
  component: HistoricoPage,
});

const CATEGORY_LABEL: Record<string, string> = {
  fisica: "Física",
  gatilho: "Gatilho",
  mental: "Mental",
  reflexao: "Reflexão",
};

function HistoricoPage() {
  const fetchHistory = useServerFn(getTaskHistory);
  const fetchDash = useServerFn(getDashboard);

  const { data, isLoading } = useQuery({
    queryKey: ["task-history"],
    queryFn: () => fetchHistory(),
  });
  const { data: dash } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  // Agrupa pelo dia LOCAL em que a tarefa foi concluída (fuso do usuário),
  // evitando bug onde tarefas concluídas tarde da noite apareciam no dia seguinte
  // por causa do task_date armazenado em UTC.
  const grouped: Record<string, any[]> = {};
  (data?.tasks ?? []).forEach((t: any) => {
    const ref = t.completed_at ?? t.task_date;
    const d = new Date(ref);
    // chave YYYY-MM-DD no fuso local
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    (grouped[key] = grouped[key] ?? []).push(t);
  });
  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="md:pt-16">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo que você concluiu nos últimos 30 dias.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat
          icon={Flame}
          label="Sequência atual"
          value={`${dash?.progress?.current_streak ?? 0} dias`}
        />
        <Stat icon={Trophy} label="Melhor sequência" value={`${dash?.progress?.best_streak ?? 0} dias`} />
        <Stat
          icon={CheckCircle2}
          label="Tarefas concluídas"
          value={`${data?.tasks?.length ?? 0}`}
        />
      </section>

      <section className="mt-8 space-y-6">
        {isLoading && (
          <p className="py-10 text-center text-sm text-muted-foreground">Carregando...</p>
        )}

        {!isLoading && dates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Você ainda não concluiu nenhuma tarefa. Comece pelo Hoje.
          </div>
        )}

        {dates.map((d) => {
          const [y, m, day] = d.split("-").map(Number);
          const date = new Date(y, m - 1, day);
          const label = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            weekday: "long",
          }).format(date);
          return (
            <div key={d}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {label}
              </h2>
              <ul className="space-y-2">
                {grouped[d].map((t: any) => (
                  <li
                    key={t.id}
                    className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/30 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{t.title}</p>
                      {t.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        {t.completed_at && (
                          <span>
                            {new Date(t.completed_at).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                        {t.category && (
                          <span className="rounded-full bg-card px-2 py-0.5">
                            {CATEGORY_LABEL[t.category] ?? t.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
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
