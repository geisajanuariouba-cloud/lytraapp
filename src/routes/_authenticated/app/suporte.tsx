import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listMyTickets, createTicket } from "@/lib/support.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/suporte")({
  component: SupportPage,
});

function SupportPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listMyTickets);
  const createFn = useServerFn(createTicket);
  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => fetchList(),
  });

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mut = useMutation({
    mutationFn: () => createFn({ data: { subject, message } }),
    onSuccess: () => {
      toast.success("Ticket enviado");
      setSubject("");
      setMessage("");
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-8 md:pt-16">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Suporte</h1>
        <p className="text-sm text-muted-foreground">
          Estamos aqui para ajudar. Respondemos em até 24h.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-medium text-sm">Contato direto</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:acesso@lytra.shop"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
          >
            acesso@lytra.shop
          </a>
          <a
            href="https://wa.me/5532984258011"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
          >
            WhatsApp +55 32 9842-5801
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-medium">Novo ticket</h2>
        <Input
          placeholder="Assunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Descreva o que está acontecendo..."
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          size="lg"
          disabled={subject.trim().length < 3 || message.trim().length < 3 || mut.isPending}
          onClick={() => mut.mutate()}
        >
          {mut.isPending ? "Enviando..." : "Enviar ticket"}
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Seus tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum ticket ainda.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t: any) => (
              <li key={t.id}>
                <Link
                  to="/app/suporte/$id"
                  params={{ id: t.id }}
                  className="block rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 transition"
                >
                  <div className="flex justify-between gap-3">
                    <span className="font-medium truncate">{t.subject}</span>
                    <span className="text-xs text-muted-foreground capitalize">{t.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.updated_at).toLocaleString("pt-BR")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
