import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { emergencyResponse, registerRelapse } from "@/lib/lytra.functions";
import { Loader2, ShieldAlert, Wind } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/sos")({
  component: SosPage,
});

function SosPage() {
  const qc = useQueryClient();
  const sosFn = useServerFn(emergencyResponse);
  const relapseFn = useServerFn(registerRelapse);
  const [context, setContext] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  const sos = useMutation({
    mutationFn: () => sosFn({ data: { context } }),
    onSuccess: (r) => setReply(r.message),
    onError: (e: any) => toast.error(e?.message ?? "Erro"),
  });

  const relapse = useMutation({
    mutationFn: () => relapseFn({ data: { context } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Registrado. Amanhã começa de novo.");
      setContext("");
      setReply(null);
    },
  });

  return (
    <div className="md:pt-16">
      <header className="animate-fade-up text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary shadow-glow">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Modo emergência</h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance">
          Está prestes a recair? Respira. Estamos aqui.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <label className="text-xs font-medium text-muted-foreground">
          O que está acontecendo agora? (opcional)
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          placeholder="Estou ansioso, com vontade de..."
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => sos.mutate()}
          disabled={sos.isPending}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-gradient text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {sos.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wind className="h-4 w-4" />}
          Me ajude agora
        </button>
      </section>

      {reply && (
        <section className="mt-6 animate-fade-up rounded-3xl border border-primary/30 bg-primary-soft/40 p-6 shadow-glow">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">{reply}</p>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-dashed border-border bg-card p-6">
        <h3 className="text-sm font-semibold">Já recaiu?</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Sem julgamento. Registrar te ajuda a entender padrões.
        </p>
        <button
          onClick={() => relapse.mutate()}
          disabled={relapse.isPending}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          {relapse.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Registrar recaída
        </button>
      </section>
    </div>
  );
}
