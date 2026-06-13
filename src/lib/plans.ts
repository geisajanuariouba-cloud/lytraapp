// Catálogo de planos da Lytra — única fonte de verdade entre landing, conta e webhook.

export type PlanKey = "monthly" | "quarterly" | "lifetime";

export const PLANS: Record<
  PlanKey,
  {
    key: PlanKey;
    label: string;
    badge?: string;
    price: number; // R$ atual
    oldPrice: number; // R$ riscado
    period: string;
    perMonthHint?: string;
    checkoutUrl: string;
    highlights: string[];
    extra?: string[];
  }
> = {
  monthly: {
    key: "monthly",
    label: "Mensal",
    price: 19.9,
    oldPrice: 39.9,
    period: "/mês",
    checkoutUrl: "https://pay.kiwify.com.br/5iXm09X",
    highlights: [
      "Diário emocional",
      "Missões personalizadas",
      "Acompanhamento de progresso",
      "Sistema de conquistas",
      "Área de suporte",
      "Atualizações futuras",
    ],
  },
  quarterly: {
    key: "quarterly",
    label: "Trimestral",
    badge: "Mais popular",
    price: 39.9,
    oldPrice: 79.9,
    period: "/trimestre",
    perMonthHint: "≈ R$ 13,30/mês",
    checkoutUrl: "https://pay.kiwify.com.br/I4aeKFt",
    highlights: [
      "Diário emocional",
      "Missões personalizadas",
      "Acompanhamento de progresso",
      "Sistema de conquistas",
      "Área de suporte",
      "Atualizações futuras",
    ],
  },
  lifetime: {
    key: "lifetime",
    label: "Vitalício",
    price: 79.9,
    oldPrice: 159.9,
    period: "único",
    checkoutUrl: "https://pay.kiwify.com.br/PhPf42z",
    highlights: [
      "Diário emocional",
      "Missões personalizadas",
      "Acompanhamento de progresso",
      "Sistema de conquistas",
      "Área de suporte",
      "Atualizações futuras",
    ],
    extra: ["Pagamento único", "Sem renovação", "Acesso permanente"],
  },
};

export function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Considera a assinatura ativa apenas se o status for "active" E ela não estiver
 * vencida (expires_at no passado). lifetime tem expires_at nulo → sempre ativa.
 */
export function isSubscriptionActive(
  sub?: { status?: string | null; expires_at?: string | null } | null,
): boolean {
  if (!sub || sub.status !== "active") return false;
  if (sub.expires_at && new Date(sub.expires_at).getTime() < Date.now()) return false;
  return true;
}

export function planLabel(key?: string | null): string {  if (!key) return "—";
  if (key === "monthly") return "Mensal";
  if (key === "quarterly") return "Trimestral";
  if (key === "lifetime") return "Vitalício";
  return key;
}

// Detecta a chave do plano a partir do payload da Kiwify (product name / id / url).
export function detectPlanKey(payload: any): PlanKey | null {
  const haystack = [
    payload?.Product?.product_name,
    payload?.product?.name,
    payload?.product_name,
    payload?.plan,
    payload?.subscription_plan,
    payload?.Product?.product_id,
    payload?.product?.id,
    payload?.product_id,
    payload?.checkout_link,
    payload?.payment_url,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/vital[ií]ci|lifetime|phpf42z/.test(haystack)) return "lifetime";
  if (/trimestr|quarter|i4aekft/.test(haystack)) return "quarterly";
  if (/mensal|month|dyg3zsk|5ixm09x/.test(haystack)) return "monthly";
  return null;
}
