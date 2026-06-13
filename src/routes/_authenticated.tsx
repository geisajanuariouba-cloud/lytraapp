import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// ssr: false — the Supabase session lives in localStorage.
// Without this, any hard navigation (refresh, deep link) renders on the server
// without a token → getUser() returns null → redirect /login, causing a loop.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login" });
    }

    // Fetch onboarding status once here — passed as context to all child routes.
    // This avoids duplicate Supabase calls in app.tsx and onboarding.tsx beforeLoads,
    // which were causing hangs (extra round-trips) during the post-submit navigation.
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", data.user.id)
      .maybeSingle();

    console.log("[beforeLoad] user_id=", data.user.id);
    console.log("[beforeLoad] profiles.onboarded=", profile?.onboarded, "raw_profile=", JSON.stringify(profile));
    console.log("[beforeLoad] decision=", profile?.onboarded ? "onboarded=true" : "onboarded=false");

    return { userId: data.user.id, onboarded: profile?.onboarded ?? false };
  },
  component: () => <Outlet />,
});
