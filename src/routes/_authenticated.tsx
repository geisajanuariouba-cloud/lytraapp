import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// ssr: false — the Supabase session lives in localStorage.
// Child route beforeLoads run on the server even when ssr:false, so ALL guards
// live here in the parent where ssr:false is actually respected.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }

    const userId = data.user.id;
    const path = location.pathname;

    // Fresh read — never trust stale context
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userId)
      .maybeSingle();

    const onboarded = profile?.onboarded === true;

    console.log("[_authenticated] userId=", userId, "path=", path, "onboarded=", onboarded, "profile_raw=", JSON.stringify(profile), "err=", profileErr?.message ?? null);

    // Expose to browser DevTools: window.__lytra_debug
    if (typeof window !== "undefined") {
      (window as any).__lytra_debug = { userId, path, profile, profileErr: profileErr?.message, onboarded };
    }

    // /app and sub-paths require onboarded=true
    if (!onboarded && path.startsWith("/app")) {
      console.log("[_authenticated] → redirect /onboarding");
      throw redirect({ to: "/onboarding" });
    }

    // /onboarding redirects to /app when already onboarded
    if (onboarded && path.startsWith("/onboarding")) {
      console.log("[_authenticated] → redirect /app");
      throw redirect({ to: "/app" });
    }

    console.log("[_authenticated] → allow", path);
    return { userId, onboarded };
  },
  component: () => <Outlet />,
});
