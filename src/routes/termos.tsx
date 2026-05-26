import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import type { ReactNode } from "react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Lytra" },
      { name: "description", content: "Termos de Uso da plataforma Lytra." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updated="Atualizado em maio de 2026">
      <p>
        Ao utilizar a Lytra você concorda com estes Termos. Leia com atenção. A Lytra é uma
        plataforma de apoio comportamental e organização de rotina, não substitui acompanhamento
        médico, psicológico ou psiquiátrico.
      </p>
      <h3>1. Sobre o serviço</h3>
      <p>
        A Lytra oferece planos personalizados, conteúdo, tarefas e acompanhamento por IA com
        objetivo de apoiar a redução de hábitos indesejados e o desenvolvimento de novos hábitos
        saudáveis.
      </p>
      <h3>2. Conta e segurança</h3>
      <p>
        Você é responsável pelas credenciais de acesso e pelas atividades realizadas na sua conta.
        Mantenha sua senha em sigilo.
      </p>
      <h3>3. Pagamentos e cancelamento</h3>
      <p>
        Assinaturas são cobradas conforme o plano escolhido. Você pode cancelar a qualquer momento.
        Garantia incondicional de 7 dias a partir da compra.
      </p>
      <h3>4. Uso aceitável</h3>
      <p>É proibido usar a plataforma para fins ilegais, abusivos ou que violem direitos de terceiros.</p>
      <h3>5. Limitação de responsabilidade</h3>
      <p>
        A Lytra não se responsabiliza por decisões tomadas com base no conteúdo da plataforma. Em
        situações de crise emocional ou risco à saúde, busque imediatamente um profissional ou
        serviços de emergência.
      </p>
    </LegalLayout>
  );
}

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Lytra</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{updated}</p>
        <div className="prose prose-neutral mt-10 max-w-none text-foreground/90 prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
