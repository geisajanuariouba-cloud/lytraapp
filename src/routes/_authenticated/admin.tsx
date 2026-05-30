import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminOverview, adminUpdateSubscription } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);
  const updateSub = useServerFn(adminUpdateSubscription);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
    retry: false,
  });

  const mut = useMutation({
    mutationFn: (v: { user_id: string; status: any }) =>
      updateSub({ data: v }),
    onSuccess: () => {
      toast.success("Atualizado");
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-2">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground">
          Esta área é exclusiva para administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-10">
      <header>
        <h1 className="text-2xl font-semibold">Painel admin</h1>
        <p className="text-sm text-muted-foreground">Visão geral da Lytra</p>
      </header>

      <section>
        <h2 className="font-medium mb-3">Assinaturas ({data!.subscriptions.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Plano</th>
                <th className="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data!.subscriptions.map((s: any) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2 capitalize">{s.status}</td>
                  <td className="px-3 py-2">{s.plan || "—"}</td>
                  <td className="px-3 py-2 space-x-2">
                    {s.status !== "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          mut.mutate({ user_id: s.user_id, status: "active" })
                        }
                      >
                        Ativar
                      </Button>
                    )}
                    {s.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          mut.mutate({ user_id: s.user_id, status: "canceled" })
                        }
                      >
                        Cancelar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Tickets ({data!.tickets.length})</h2>
        <ul className="space-y-2">
          {data!.tickets.map((t: any) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(t.updated_at).toLocaleString("pt-BR")} · {t.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-medium mb-3">Pedidos recentes Kiwify</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {data!.orders.map((o: any) => (
                <tr key={o.order_id} className="border-t border-border">
                  <td className="px-3 py-2">{o.email}</td>
                  <td className="px-3 py-2 capitalize">{o.status}</td>
                  <td className="px-3 py-2">
                    {new Date(o.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
