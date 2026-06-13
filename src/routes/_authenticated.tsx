import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// ssr: false — the Supabase session lives in localStorage.
// Without this, any hard navigation (refresh, deep link) renders on the server
// without a token → getUser() returns null → redirect /login, causing a loop.
//
// ALL onboarding guards live HERE — not in child routes — because child route
// beforeLoads run on the server even when ssr:false is set, and at that point
// the parent context hasn't been populated yet (no session, no profile).
// The parent is the only safe place to gate: it has ssr:false, runs client-only,
// reads fresh data, and can redirect before any child is touched.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      console.log("[_authenticated beforeLoad] no session → redirect /login");
      throw redirect({ to: "/login" });
    }

    const userId = data.user.id;

    // Always fetch fresh — never rely on cached/stale context.
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userId)
      .maybeSingle();

    const onboarded = profile?.onboarded === true;
    const path = location.pathname;

    console.log("[_authenticated beforeLoad] user_id=", userId);
    console.log("[_authenticated beforeLoad] path=", path);
    console.log("[_authenticated beforeLoad] fresh_profile_onboarded=", profile?.onboarded, "raw=", JSON.stringify(profile), "err=", profileErr?.message ?? null);
    console.log("[_authenticated beforeLoad] onboarded=", onboarded);

    // Guard: /app and all sub-paths require onboarded=true
    if (!onboarded && path.startsWith("/app")) {
      console.log("[_authenticated beforeLoad] decision=redirect_onboarding (onboarded=false, path=/app*)");
      throw redirect({ to: "/onboarding" });
    }

    // Guard: /onboarding requires onboarded=false — if already done, send to dashboard
    if (onboarded && path.startsWith("/onboarding")) {
      console.log("[_authenticated beforeLoad] decision=redirect_app (onboarded=true, path=/onboarding)");
      throw redirect({ to: "/app" });
    }

    console.log("[_authenticated beforeLoad] decision=allow path=", path);
    return { userId, onboarded };
  },
  component: () => <Outlet />,
});
