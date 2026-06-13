import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./termos";

export const Route = createFileRoute("/seguranca")({
  head: () => ({
    meta: [
      { title: "Segurança — Lytra" },
      { name: "description", content: "Como a Lytra protege seus dados e sua privacidade." },
    ],
  }),
  component: () => (
    <LegalLayout title="Segurança" updated="Atualizado em maio de 2026">
      <p>
        Tratamos dados sensíveis sobre saúde mental e hábitos. Por isso adotamos camadas múltiplas
        de proteção desde o primeiro dia.
      </p>
      <h3>Infraestrutura</h3>
      <p>HTTPS obrigatório, criptografia em trânsito e em repouso, backups regulares e isolamento de ambientes.</p>
      <h3>Autenticação</h3>
      <p>Senhas com hash seguro, sessões protegidas, rate limit em endpoints sensíveis e proteção contra ataques comuns.</p>
      <h3>Acesso interno</h3>
      <p>Política de menor privilégio. Logs de acesso e auditoria contínua de operações administrativas.</p>
      <h3>Resposta a incidentes</h3>
      <p>Plano formal de resposta a incidentes e notificação aos usuários conforme exigências legais.</p>
      <h3>Reporte de vulnerabilidades</h3>
      <p>Encontrou algo? Escreva para acesso@lytra.shop. Levamos a sério qualquer relatório de segurança.</p>
    </LegalLayout>
  ),
});
