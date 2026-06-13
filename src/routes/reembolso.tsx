import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./termos";

export const Route = createFileRoute("/reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso — Lytra" },
      { name: "description", content: "Garantia de 7 dias e regras de reembolso da Lytra." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de Reembolso" updated="Atualizado em maio de 2026">
      <p>
        Acreditamos no que entregamos. Por isso oferecemos garantia incondicional de 7 dias em
        qualquer plano.
      </p>
      <h3>1. Como solicitar</h3>
      <p>
        Envie um email para acesso@lytra.shop dentro de 7 dias após a compra. Não precisa
        justificar. O estorno é processado em até 7 dias úteis pelo mesmo meio de pagamento.
      </p>
      <h3>2. Após o prazo de garantia</h3>
      <p>
        Você pode cancelar sua assinatura a qualquer momento e não será cobrado nos próximos
        ciclos. Valores já pagos não são reembolsados após 7 dias da compra.
      </p>
      <h3>3. Acesso após cancelamento</h3>
      <p>
        Você mantém acesso até o fim do ciclo já pago. Após isso, sua conta é arquivada com seus
        dados preservados caso queira retornar.
      </p>
    </LegalLayout>
  ),
});
