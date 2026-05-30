import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { Leaf, Home, BookHeart, ShieldAlert, TrendingUp, Settings, LifeBuoy, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getDashboard } from "@/lib/lytra.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

function AppLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const fetchDash = useServerFn(getDashboard);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash(),
  });

  // Onboarding gate
  useEffect(() => {
    if (!isLoading && data && data.onboarding == null && !loc.pathname.includes("/onboarding")) {
      nav({ to: "/onboarding" });
    }
  }, [isLoading, data, loc.pathname, nav]);

  // Subscription gate — bloqueia exceto conta e suporte
  const subStatus = data?.subscription?.status;
  const hasActive = subStatus === "active";
  const allowedWithoutSub = ["/app/configuracoes", "/app/suporte"];
  const isAllowedPath = allowedWithoutSub.some((p) => loc.pathname.startsWith(p));

  const navItems = [
    { to: "/app", label: "Hoje", icon: Home, exact: true },
    { to: "/app/diario", label: "Diário", icon: BookHeart },
    { to: "/app/sos", label: "Emergência", icon: ShieldAlert },
    { to: "/app/progresso", label: "Progresso", icon: TrendingUp },
    { to: "/app/suporte", label: "Suporte", icon: LifeBuoy },
    { to: "/app/configuracoes", label: "Conta", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link to="/app" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
              <Leaf className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Lytra</span>
          </Link>
          <div className="flex items-center gap-1">
            {data?.isAdmin && (
              <Link
                to="/admin"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label="Admin"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/app/configuracoes"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6">
        {!isLoading && data && !hasActive && !isAllowedPath ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">Sua jornada está pausada</h2>
            <p className="text-sm text-muted-foreground">
              {subStatus === "refunded"
                ? "Identificamos um reembolso. O acesso foi pausado."
                : subStatus === "chargeback"
                ? "Identificamos um chargeback. O acesso foi pausado."
                : subStatus === "canceled"
                ? "Sua assinatura foi cancelada."
                : "Não encontramos uma assinatura ativa vinculada à sua conta."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link to="/">Reativar acesso</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/app/suporte">Falar com suporte</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Bottom nav (mobile) + top tabs (desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const active = item.exact
              ? loc.pathname === item.to
              : loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="fixed left-1/2 top-20 z-20 hidden -translate-x-1/2 md:block">
        <div className="flex gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
          {navItems.map((item) => {
            const active = item.exact
              ? loc.pathname === item.to
              : loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-primary-gradient text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
