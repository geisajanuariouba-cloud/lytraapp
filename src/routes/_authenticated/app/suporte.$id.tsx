import { createFileRoute, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTicket, replyTicket } from "@/lib/support.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/suporte/$id")({
  component: TicketPage,
});

function TicketPage() {
  const { id } = useParams({ from: "/_authenticated/app/suporte/$id" });
  const qc = useQueryClient();
  const fetchOne = useServerFn(getTicket);
  const replyFn = useServerFn(replyTicket);
  const { data } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchOne({ data: { id } }),
  });
  const [content, setContent] = useState("");

  const mut = useMutation({
    mutationFn: () => replyFn({ data: { ticket_id: id, content } }),
    onSuccess: () => {
      setContent("");
      toast.success("Resposta enviada");
      qc.invalidateQueries({ queryKey: ["ticket", id] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (!data) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">{data.ticket.subject}</h1>
        <p className="text-xs text-muted-foreground capitalize">{data.ticket.status}</p>
      </header>

      <ul className="space-y-3">
        {data.messages.map((m: any) => (
          <li
            key={m.id}
            className={`rounded-xl border px-4 py-3 ${
              m.is_admin
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              {m.is_admin ? "Equipe Lytra" : "Você"} ·{" "}
              {new Date(m.created_at).toLocaleString("pt-BR")}
            </p>
            <p className="whitespace-pre-wrap text-sm">{m.content}</p>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <Textarea
          placeholder="Escreva uma resposta..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          disabled={content.trim().length < 1 || mut.isPending}
          onClick={() => mut.mutate()}
        >
          {mut.isPending ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
