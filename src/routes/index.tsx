import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PLANS, formatBRL } from "@/lib/plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lytra" },
      {
        name: "description",
        content:
          "Um acompanhamento diário e personalizado para recuperar foco, disciplina e controle dos impulsos. Passos simples, no seu ritmo.",
      },
      { property: "og:title", content: "Lytra" },
      {
        property: "og:description",
        content: "Recupere foco, disciplina e controle dos impulsos com um plano diário e personalizado.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

// ── dados ────────────────────────────────────────────────────────────

const dores = [
  {
    title: "Você abre o celular por um segundo e perde duas horas.",
    text: "Não é fraqueza. É como o cérebro foi condicionado a buscar dopamina, uma notificação de cada vez.",
  },
  {
    title: "Você adia o que importa e cumpre o que não importa.",
    text: "Procrastinação crônica costuma ser exaustão e ansiedade disfarçadas, não preguiça.",
  },
  {
    title: "Você decide mudar. Amanhã. De novo.",
    text: "O ciclo se repete porque métodos genéricos ignoram o lado emocional. Sem acolhimento, nenhuma estratégia dura.",
  },
];

const passos = [
  {
    num: "01",
    title: "Diagnóstico rápido",
    text: "Em minutos a Lytra entende seus gatilhos e o que precisa ser reconstruído.",
  },
  {
    num: "02",
    title: "Missões feitas para você",
    text: "Tarefas curtas e diárias que se encaixam na sua rotina real, sem pressão.",
  },
  {
    num: "03",
    title: "Evolução que você vê",
    text: "Cada passo registrado. A jornada se ajusta conforme você avança.",
  },
];

// Planos: apresentação visual separada do preço (que vem de plans.ts)
const planDisplay = {
  monthly: {
    destaque: "Preço de lançamento — 50% off",
    features: [
      "Acesso completo",
      "Diário emocional",
      "Missões personalizadas",
      "Sistema de conquistas",
      "Suporte incluso",
    ],
  },
  quarterly: {
    destaque: "Equivale a R$ 8,30/mês · 37% de economia",
    features: [
      "Tudo do mensal",
      "Mesmo acesso completo",
      "Mesmo conteúdo e suporte",
      "Preço por mês bem menor",
    ],
    recommended: true,
  },
} as const;

const testimonials: { name: string; detail: string; rating: number; text: string; photo: string; result: string }[] = [
  {
    name: "Ana Clara M.",
    detail: "Estudante, 22 anos · São Paulo",
    rating: 5.0,
    text: "Eu achava que meu problema era falta de disciplina, mas na verdade eu vivia distraída o tempo todo. Em 3 semanas cortei o Instagram de 4h para menos de 1h por dia.",
    result: "De 4h → menos de 1h no Instagram em 3 semanas",
    photo: "/avatar-1.webp",
  },
  {
    name: "Marcelo P.",
    detail: "Analista de TI, 31 anos · Recife",
    rating: 4.9,
    text: "Eu vivia começando projetos e abandonando no meio. Depois que comecei a usar a Lytra, consegui criar uma consistência que não tinha há anos.",
    result: "Primeiro projeto finalizado em 21 dias",
    photo: "/avatar-4.webp",
  },
  {
    name: "Sônia C.",
    detail: "Empreendedora, 38 anos · Florianópolis",
    rating: 4.8,
    text: "Achei que fosse algo voltado apenas para pessoas mais jovens, mas me surpreendi. Me ajudou a criar hábitos mais saudáveis e recuperar 2 horas de foco por dia.",
    result: "2h extras de foco por dia recuperadas",
    photo: "/avatar-6.webp",
  },
];

const whatsappShots: { src: string; alt: string }[] = [
  { src: "/wp-1.webp", alt: "Minha cabeça ficou mais silenciosa" },
  { src: "/wp-8.webp", alt: "é normal eu estar perdendo a vontade de abrir instagram?" },
  { src: "/wp-3.webp", alt: "Eu jurava que meu problema era falta de disciplina" },
  { src: "/wp-4.webp", alt: "Já faz uma semana, tô começando a acreditar que consigo" },
  { src: "/wp-5.webp", alt: "Minha ansiedade diminuiu muito" },
  { src: "/wp-6.webp", alt: "Pela primeira vez em meses minha lista de tarefas acabou" },
];

const faqs = [
  {
    q: "Como a Lytra funciona?",
    a: "Você responde um diagnóstico rápido, recebe um plano diário personalizado e acompanha sua evolução com missões e reflexões que se adaptam ao seu progresso.",
  },
  {
    q: "Substitui terapia?",
    a: "Não. É um apoio comportamental e de rotina. Para quadros clínicos, procure um profissional de saúde.",
  },
  {
    q: "Como recebo o acesso após comprar?",
    a: "Logo após o pagamento você recebe um e-mail com link para criar sua senha e entrar. Acesso em menos de 5 minutos.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A Lytra roda direto no navegador, sem precisar baixar nada.",
  },
  {
    q: "E se eu não gostar?",
    a: "7 dias de garantia total. Se não gostar por qualquer motivo, devolvemos 100% — sem burocracia, sem perguntas.",
  },
];

function trackCheckout(price: number, label: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", { value: price, currency: "BRL", content_name: label });
  }
}

// ── carrossel WhatsApp ────────────────────────────────────────────────
function WhatsappCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 320), behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {whatsappShots.map((shot, i) => (
          <div
            key={i}
            className="w-[260px] shrink-0 snap-center overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft sm:w-[300px]"
          >
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="aspect-[9/16] w-full object-cover"
              onError={(e) => {
                const container = (e.currentTarget as HTMLElement).parentElement;
                if (!container) return;
                e.currentTarget.style.display = "none";
                const placeholder = container.querySelector("[data-placeholder]") as HTMLElement | null;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
            <div
              data-placeholder
              className="aspect-[9/16] w-full flex-col items-center justify-center gap-4 bg-primary-soft/20 text-center px-6"
              style={{ display: "none" }}
            >
              <MessageCircle className="h-8 w-8 text-primary/30" />
              <p className="text-sm font-medium text-primary/50 leading-relaxed">{shot.alt}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scroll(dir)}
            aria-label={dir === -1 ? "Anterior" : "Próximo"}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 bg-white text-primary shadow-soft transition hover:bg-primary-soft"
          >
            {dir === -1 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── página ───────────────────────────────────────────────────────────
function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">

      {/* ── Barra de urgência ── */}
      <div className="bg-primary text-primary-foreground text-center text-[13px] font-semibold py-2.5 px-4">
        <span
          className="mr-2 inline-block h-2 w-2 rounded-full bg-white/80 align-middle"
          style={{ animation: "pulse 1.6s ease-in-out infinite" }}
          aria-hidden
        />
        Preço de lançamento — por tempo limitado. Aproveite antes de encerrar.
      </div>

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
          style={{ background: "radial-gradient(ellipse 100% 80% at 50% -10%, oklch(0.94 0.06 158 / 0.7), transparent 70%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-10 text-center md:pt-32">
          <h1 className="font-display text-5xl leading-[1.08] text-balance text-foreground md:text-6xl lg:text-[4.5rem]">
            Chega de perder horas por dia.{" "}
            <span style={{ color: "var(--primary)" }}>Reconquiste seu foco.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
            A Lytra te acompanha com missões diárias personalizadas para vencer a distração, a procrastinação e criar hábitos que realmente duram — sem baixar app.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={PLANS.quarterly.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCheckout(PLANS.quarterly.price, "Trimestral")}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90"
              style={{ height: "3.25rem" }}
            >
              Quero recuperar meu foco — R$8,30/mês
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">7 dias de garantia · Cancele quando quiser · Acesso imediato</p>
        </div>

        {/* Device mockup */}
        <div className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-32">
          <div className="relative flex items-end justify-center">

            <div className="relative shrink-0" style={{ width: "min(74vw, 780px)" }}>
              <div
                className="overflow-hidden rounded-t-2xl border border-border bg-white"
                style={{ aspectRatio: "16/10", boxShadow: "0 32px 80px -12px oklch(0.52 0.13 158 / 0.15), 0 8px 32px rgba(0,0,0,0.12)" }}
              >
                <div className="flex h-8 items-center gap-2 border-b border-border bg-[#f0f0f0] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <div className="mx-auto flex h-5 w-48 items-center justify-center rounded bg-white/90 border border-border/50">
                    <span className="text-[10px] text-muted-foreground">lytra.shop</span>
                  </div>
                </div>
                <img
                  src="/progress-desktop.png.webp"
                  alt="Lytra — tela de Progresso no computador"
                  className="w-full h-full object-cover object-top"
                  style={{ height: "calc(100% - 2rem)" }}
                  fetchPriority="high"
                />
              </div>
              <div className="h-3 bg-gradient-to-b from-[#cecece] to-[#b0b0b0]" />
              <div className="h-1.5 rounded-b-xl bg-[#a0a0a0] shadow-[0_4px_16px_rgba(0,0,0,0.18)]" />
            </div>

            <div className="absolute bottom-6 right-[3%] shrink-0 md:right-[6%]" style={{ width: "min(19vw, 195px)" }}>
              <div
                className="overflow-hidden rounded-[32px] border-[8px] border-[#1C1C1E]"
                style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06), -10px 0 40px oklch(0.52 0.13 158 / 0.12)", aspectRatio: "9/19.5" }}
              >
                <div className="flex h-5 items-center justify-center bg-[#1C1C1E]">
                  <div className="h-3 w-14 rounded-full bg-black" />
                </div>
                <div className="overflow-y-hidden" style={{ height: "calc(100% - 2.75rem)" }}>
                  <img
                    src="/progress-mobile.png.webp"
                    alt="Lytra — tela de Progresso no celular"
                    className="w-full"
                    style={{ display: "block" }}
                    fetchPriority="high"
                  />
                </div>
                <div className="flex h-4 items-center justify-center bg-white">
                  <div className="h-1 w-10 rounded-full bg-black/15" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Problema ── */}
      <section id="problema" className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <h2 className="font-display text-4xl text-balance text-center md:text-5xl">
          Você se reconhece aqui?
        </h2>

        <div className="mt-10 space-y-4">
          {dores.map((d, i) => (
            <div
              key={d.title}
              className="flex items-start gap-5 rounded-2xl border border-border bg-card px-6 py-5 shadow-soft"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{d.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-display text-2xl text-foreground md:text-3xl">
          Não é falta de força de vontade.{" "}
          <span className="italic text-primary">É como o cérebro aprendeu a funcionar.</span>
        </p>
      </section>

      {/* ── Como funciona ── */}
      <section
        id="como-funciona"
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-4xl text-balance text-center md:text-5xl">
            Simples de começar.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {passos.map((p) => (
              <div key={p.num} className="relative rounded-3xl border border-primary/10 bg-white p-7 shadow-soft">
                <span className="text-5xl font-bold text-primary/10 select-none">{p.num}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 rounded-b-3xl"
                  style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-glow))" }}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prova social + Depoimentos ── */}
      <section id="depoimentos" className="mx-auto max-w-5xl px-6 py-20 md:py-28">

        <div className="text-center">
          <p className="font-display text-6xl text-primary">+500</p>
          <p className="mt-2 text-base text-muted-foreground">pessoas já mudaram a rotina com a Lytra</p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="text-xl text-yellow-400">★★★★★</span>
            <span className="text-sm font-semibold text-foreground">4,9</span>
            <span className="text-xs text-muted-foreground">· mais de 1.800 avaliações</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl border border-primary/10 bg-white p-7 shadow-soft"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-yellow-400">{"★".repeat(Math.floor(t.rating))}</span>
                <span className="text-xs font-semibold text-muted-foreground">{t.rating.toFixed(1)}</span>
              </div>
              <div className="mt-3 rounded-lg bg-primary/6 px-3 py-1.5 text-xs font-semibold text-primary">
                {t.result}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const sibling = el.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = "flex";
                  }}
                />
                <span
                  className="h-10 w-10 shrink-0 rounded-full bg-primary/10"
                  style={{ display: "none" }}
                  aria-hidden
                />
                <div>
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.detail}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={PLANS.quarterly.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCheckout(PLANS.quarterly.price, "Trimestral")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Quero esse resultado também — começar agora
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">7 dias de garantia · R$8,30/mês no trimestral</p>
        </div>
      </section>

      {/* ── WhatsApp ── */}
      <section
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-4xl text-balance text-center md:text-5xl">
            O que chega pra gente todo dia
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">Conversas reais de quem está usando.</p>
          <WhatsappCarousel />
        </div>
      </section>

      {/* ── Preços ── */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl text-balance md:text-5xl">
            Comece hoje.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Acesso completo em ambos os planos. O que muda é o custo por período.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 md:grid-cols-2 max-w-3xl">
          {(["monthly", "quarterly"] as const).map((key) => {
            const plan = PLANS[key];
            const display = planDisplay[key];
            const featured = "recommended" in display && display.recommended;

            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-3xl p-7 ${
                  featured
                    ? "border-2 border-primary bg-white shadow-glow md:-translate-y-2"
                    : "border border-border bg-card shadow-soft"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
                    Mais recomendado
                  </span>
                )}

                <p className="text-sm font-semibold text-muted-foreground">{plan.label}</p>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {formatBRL(plan.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period === "único" ? "pagamento único" : plan.period}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatBRL(plan.oldPrice)}
                  </span>
                </div>

                <p className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold w-fit ${featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {display.destaque}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {display.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-full ${featured ? "bg-primary" : "bg-primary/20"}`}
                        style={{ height: "1.125rem", width: "1.125rem" }}
                      >
                        <svg viewBox="0 0 12 9" className="h-2.5 w-2.5" aria-hidden>
                          <path
                            d="M1 4l3.5 3.5L11 1"
                            stroke={featured ? "white" : "oklch(0.52 0.13 158)"}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                      <span className={featured ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCheckout(plan.price, plan.label)}
                  className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    featured
                      ? "bg-primary text-primary-foreground shadow-glow hover:opacity-90"
                      : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  Começar com 7 dias de garantia
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>🔒 Dados criptografados</span>
          <span>⚡ Acesso em menos de 5 min</span>
          <span>↩ 7 dias de garantia sem perguntas</span>
          <span>✕ Cancele quando quiser</span>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl text-center md:text-5xl">
            Dúvidas frequentes
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground">
                  {f.q}
                  <span className="ml-6 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-5 text-base font-semibold text-foreground">Pronto para começar?</p>
            <a
              href={PLANS.quarterly.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCheckout(PLANS.quarterly.price, "Trimestral")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Começar agora — R$8,30/mês
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-muted-foreground">7 dias de garantia · Cancele quando quiser</p>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="mx-auto max-w-4xl px-6 pb-24 md:pb-32">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-glow md:p-20"
          style={{ background: "linear-gradient(145deg, var(--primary) 0%, oklch(0.62 0.15 160) 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% -10%, oklch(1 0 0 / 0.18), transparent 70%)" }}
            aria-hidden
          />
          <h2 className="relative font-display text-4xl text-white text-balance md:text-5xl">
            Sua próxima versão começa hoje.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-white/75 text-balance">
            Foco. Clareza. Controle. Um passo de cada vez.
          </p>
          <a
            href="#precos"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-9 text-sm font-bold text-primary shadow-lg transition hover:bg-primary-soft"
            style={{ height: "3.25rem" }}
          >
            Escolher meu plano
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
