import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./termos";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Lytra" },
      { name: "description", content: "Como a Lytra coleta, usa e protege seus dados." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de Privacidade" updated="Atualizado em maio de 2026">
      <p>
        Sua privacidade é prioridade. Esta política explica quais dados coletamos, como usamos e
        como você pode exercer seus direitos.
      </p>
      <h3>1. Dados coletados</h3>
      <p>
        Coletamos dados de cadastro (nome, email), informações fornecidas no onboarding, registros
        do diário emocional, progresso e uso da plataforma. Estes dados são usados apenas para
        personalizar sua experiência.
      </p>
      <h3>2. Como protegemos</h3>
      <p>
        Utilizamos criptografia em trânsito (HTTPS), armazenamento seguro, hashing de senhas e
        controles de acesso restritos.
      </p>
      <h3>3. Compartilhamento</h3>
      <p>Não vendemos seus dados. Compartilhamos apenas com prestadores essenciais (pagamentos, email, IA) sob acordos de confidencialidade.</p>
      <h3>4. Seus direitos (LGPD)</h3>
      <p>
        Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados a qualquer
        momento via suporte.lytra@gmail.com.
      </p>
      <h3>5. Cookies</h3>
      <p>Usamos cookies essenciais para o funcionamento da plataforma e métricas anônimas de uso.</p>
    </LegalLayout>
  ),
});
