import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// ssr: false — a sessão do Supabase mora no localStorage do navegador.
// Sem isso, qualquer navegação dura (window.location.assign, refresh, deep link)
// renderiza no servidor sem token → getUser() retorna null → redirect /login,
// causando o "loop" em que o formulário some e volta limpo.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }
    return { userId: data.user.id };
  },
  component: () => <Outlet />,
});
