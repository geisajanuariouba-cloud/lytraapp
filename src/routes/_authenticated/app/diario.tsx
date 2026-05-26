import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard, submitJournalEntry } from "@/lib/lytra.functions";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/diario")({
  component: DiarioPage,
});

function DiarioPage() {
  const qc = useQueryClient();
  const fetchDash = useServerFn(getDashboard);
  const submit = useServerFn(submitJournalEntry);
  const [text, setText] = useState("");

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  const mut = useMutation({
    mutationFn: (content: string) => submit({ data: { content } }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Erro"),
  });

  return (
    <div className="md:pt-16">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Diário</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escreva o que está sentindo. A Lytra escuta e responde.
        </p>
      </header>

      <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Como você está? O que aconteceu hoje? O que está pesando?"
          rows={6}
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{text.length}/4000</span>
          <button
            disabled={!text.trim() || mut.isPending}
            onClick={() => mut.mutate(text.trim())}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar
          </button>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {data?.journal.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Sua primeira entrada aparece aqui.
          </p>
        )}
        {data?.journal.map((entry: any) => (
          <article key={entry.id} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleString("pt-BR")}
            </p>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed">{entry.content}</p>
            {entry.ai_response && (
              <div className="mt-4 rounded-2xl bg-primary-soft/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Lytra</p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {entry.ai_response}
                </p>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
