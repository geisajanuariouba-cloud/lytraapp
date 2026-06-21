import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,h
} from "@tanstack/react-router";h
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";



function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  // Auto-recover from navigation-related errors (e.g. the onboarding → /app
  // transition where a route beforeLoad throws during a concurrent navigation).
  // These are transient and self-heal on a fresh load — no need to show the user.
  useEffect(() => {
    const msg = error?.message ?? "";
    const isNavigationError =
      msg.includes("redirect") ||
      msg.includes("navigation") ||
      msg.includes("beforeLoad") ||
      msg.includes("router") ||
      msg.includes("Cannot read properties of undefined");

    if (isNavigationError) {
      router.invalidate();
      reset();
    }
  }, [error, reset, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Você pode tentar novamente ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lytra" },
      {
        name: "description",
        content:
          "A Lytra te acompanha com um plano diário e personalizado para reduzir vícios, recuperar foco e reconstruir sua rotina, com passos simples e suporte humano.",
      },
      { name: "author", content: "Lytra" },
      { property: "og:title", content: "Lytra" },
      {
        property: "og:description",
        content: "Acompanhamento guiado para reduzir vícios, recuperar foco e reconstruir sua rotina, com passos simples e suporte humano.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231A7A4D'/%3E%3Ctext x='32' y='34' text-anchor='middle' dominant-baseline='central' font-family='Georgia,serif' font-style='italic' font-size='40' fill='white'%3Ey%3C/text%3E%3C/svg%3E",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent /><meta name="facebook-domain-verification" content="4tmm0bo28ttprwl3lvqdo1eigg8895" /><script src="https://cdn.utmify.com.br/scripts/utms/latest.js" data-utmify-prevent-xcod-sck data-utmify-prevent-subids async defer />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','995199796558041');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=995199796558041&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

function AuthSync() {
  const qc = useQueryClient();
  useEffect(() => {
    let initialized = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // Ignora a primeira emissão (hidratação da sessão no carregamento).
      // Invalidar router/limpar cache nesse instante competia com o
      // carregamento inicial das rotas e causava o erro na primeira entrada
      // do app (que só "abria" depois de clicar em Try again).
      if (!initialized) {
        initialized = true;
        return;
      }
      // Em troca real de usuário, limpa o cache do React Query para não exibir
      // dados do usuário anterior. Não invalidamos o router aqui: nenhuma rota
      // carrega dados de usuário em loader, e invalidar durante uma navegação
      // em andamento era justamente o que quebrava a primeira entrada.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        qc.clear();
      }
    });
    return () => subscription.unsubscribe();
  }, [qc]);
  return null;
}
