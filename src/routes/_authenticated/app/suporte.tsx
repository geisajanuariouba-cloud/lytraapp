import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/suporte")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="md:pt-16">
      {/* Header */}
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">Suporte</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Precisa de ajuda? Fale diretamente com a nossa equipe.
        </p>
      </header>

      <div className="mt-8 space-y-4">

        {/* WhatsApp — primary card */}
        <a
          href="https://wa.me/553298425801"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-7 shadow-soft transition hover:border-primary/40 hover:shadow-glow/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Mais rápido
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              Atendimento pelo WhatsApp
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Para respostas mais rápidas, fale com a equipe da Lytra diretamente pelo WhatsApp.
            </p>
          </div>

          <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-gradient text-sm font-semibold text-primary-foreground shadow-glow transition group-hover:opacity-95">
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </span>
        </a>

        {/* Email — secondary card */}
        <a
          href="mailto:acesso@lytra.shop"
          className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-7 shadow-soft transition hover:border-border/80"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              E-mail
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              E-mail de suporte
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Se preferir, envie sua dúvida por e-mail. Respondemos o mais rápido possível.
            </p>
          </div>

          <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background text-sm font-medium text-foreground transition group-hover:border-border/60 group-hover:bg-accent/50">
            acesso@lytra.shop
          </span>
        </a>

      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        O atendimento pelo WhatsApp costuma ser mais ágil.
      </p>
    </div>
  );
}
