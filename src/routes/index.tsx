import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  MessageCircle,
  NotebookPen,
  Quote,
  RefreshCw,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PLANS, formatBRL } from "@/lib/plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lytra · Recupere o controle da sua mente" },
      {
        name: "description",
        content:
          "Um acompanhamento diário e personalizado para recuperar foco, disciplina e controle dos impulsos. Passos simples, no seu ritmo.",
      },
      { property: "og:title", content: "Lytra · Recupere o controle da sua mente" },
      {
        property: "og:description",
        content:
          "Recupere foco, disciplina e controle dos impulsos com um plano diário e personalizado.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

// ── Problema (você se reconhece aqui?) ──────────────────────────────
const reconhece = [
  {
    icon: Smartphone,
    title: "Você abre o celular por um instante e perde duas horas.",
    text: "Não é falta de força de vontade. É como o cérebro foi condicionado a buscar recompensas rápidas, uma notificação de cada vez.",
  },
  {
    icon: Clock,
    title: "Você adia o que importa e cumpre o que não importa.",
    text: "A procrastinação crônica costuma ser um sinal de exaustão, ansiedade ou perfeccionismo, não de preguiça.",
  },
  {
    icon: RefreshCw,
    title: "Você decide mudar. Amanhã. De novo.",
    text: "O ciclo se repete porque métodos genéricos ignoram o lado emocional. Sem acolhimento real, toda estratégia vira mais uma coisa para abandonar.",
  },
];

// ── Como funciona (3 passos) ────────────────────────────────────────
const passos = [
  {
    icon: Sparkles,
    title: "Você responde um diagnóstico rápido",
    text: "Em poucos minutos, a Lytra entende seu momento, seus gatilhos e o que você quer reconstruir.",
  },
  {
    icon: Target,
    title: "Recebe um plano diário sob medida",
    text: "Missões curtas e possíveis, pensadas para a sua rotina, um passo de cada vez.",
  },
  {
    icon: TrendingUp,
    title: "Acompanha sua evolução com clareza",
    text: "A rotina se adapta conforme você avança, com registro de progresso e reconhecimento a cada passo.",
  },
];

// ── Benefícios (antes / depois) ─────────────────────────────────────
const antes = [
  "Horas no feed sem perceber o tempo passar",
  "Sono ruim e cansaço que não passa",
  "Adiar o que realmente importa",
  "Culpa e desânimo no fim do dia",
  "Decidir mudar e não conseguir manter",
];

const depois = [
  "Mais presença e clareza no dia a dia",
  "Noites mais tranquilas e foco recuperado",
  "Missões pequenas que cabem na sua vida",
  "Progresso gentil, sem julgamento",
  "Disciplina construída um passo de cada vez",
];

// ── O que você recebe / Valor percebido (mesma base) ────────────────
const entregaveis = [
  {
    icon: NotebookPen,
    title: "Diário emocional inteligente",
    desc: "Registre como se sente e ganhe clareza sobre seus gatilhos.",
    value: 29,
  },
  {
    icon: Target,
    title: "Missões personalizadas",
    desc: "Pequenas ações diárias que se adaptam ao seu momento.",
    value: 39,
  },
  {
    icon: Sparkles,
    title: "Plano diário de evolução",
    desc: "Um caminho claro para seguir, um passo de cada vez.",
    value: 29,
  },
  {
    icon: RefreshCw,
    title: "Sistema de acompanhamento",
    desc: "Sua rotina se ajusta conforme você avança.",
    value: 39,
  },
  {
    icon: TrendingUp,
    title: "Registro de progresso",
    desc: "Veja sua evolução de forma concreta e motivadora.",
    value: 19,
  },
  {
    icon: Trophy,
    title: "Sistema de conquistas",
    desc: "Reconhecimento a cada passo que você dá.",
    value: 19,
  },
  {
    icon: Headphones,
    title: "Central de suporte",
    desc: "Gente de verdade para te ajudar quando precisar.",
    value: 19,
  },
  {
    icon: Sparkles,
    title: "Atualizações futuras",
    desc: "A plataforma evolui junto com você, sem custo extra.",
    value: 49,
  },
];

const valorTotal = entregaveis.reduce((sum, item) => sum + item.value, 0);

// ── Conteúdo dos planos (apenas apresentação; preço/checkout vêm de PLANS) ──
const planContent: Record<
  "monthly" | "quarterly" | "lifetime",
  { features: string[]; note: string; recommended?: boolean }
> = {
  monthly: {
    features: [
      "Acesso completo à plataforma",
      "Diário emocional",
      "Missões personalizadas",
      "Sistema de progresso",
      "Sistema de conquistas",
      "Área de suporte",
      "Atualizações futuras",
    ],
    note: "Custo mais alto por mês",
  },
  quarterly: {
    features: [
      "Tudo do plano mensal",
      "Mesmo acesso completo",
      "Mesmo conteúdo e suporte",
      "Mesmo sistema, por menos",
    ],
    note: "Economize 33% · equivale a R$ 13,30/mês",
    recommended: true,
  },
  lifetime: {
    features: [
      "Tudo do plano trimestral",
      "Sem mensalidades",
      "Sem renovações",
      "Acesso permanente",
    ],
    note: "Menor custo no longo prazo · você paga uma vez",
  },
};

// ── Depoimentos (estrutura pronta; preencher quando as imagens chegarem) ──
// Para ativar, adicione objetos: { name, photo, text }
//   photo: caminho público (ex.: "/depoimentos/ana.jpg") ou URL.
const testimonials: { name: string; photo?: string; text: string }[] = [];

// ── Depoimentos em WhatsApp (carrossel; preencher com os prints reais) ──
//   { src: "/whatsapp/print-1.png", alt: "Conversa com cliente" }
const whatsappShots: { src: string; alt: string }[] = [];

const faqs = [
  {
    q: "Como funciona a Lytra?",
    a: "Você responde um diagnóstico rápido, recebe um plano personalizado e, todos os dias, tem missões e reflexões curtas que se adaptam ao seu progresso.",
  },
  {
    q: "A Lytra substitui terapia?",
    a: "Não. É um apoio comportamental e de rotina. Para quadros clínicos, procure um profissional de saúde.",
  },
  {
    q: "Como recebo o acesso depois de comprar?",
    a: "Logo após a confirmação do pagamento, você recebe um e-mail para criar sua senha e entrar na plataforma.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A Lytra é pensada para o celular e funciona como um app direto no navegador.",
  },
  {
    q: "Posso usar no meu próprio ritmo?",
    a: "Sim. As missões são curtas e se ajustam ao seu momento. A evolução é gentil e sem cobrança.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Muitas pessoas percebem mais foco e presença já nas primeiras semanas. A consistência é o que sustenta a mudança.",
  },
];

function WhatsappCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 360), behavior: "smooth" });
  };

  const slides = whatsappShots.length
    ? whatsappShots
    : // Placeholders enquanto os prints reais não chegam.
      Array.from({ length: 4 }, (_, i) => ({ src: "", alt: `Conversa ${i + 1}` }));

  return (
    <div className="relative mt-12">
      <div className="pointer-events-none absolute -left-4 top-0 z-10 hidden h-full w-12 bg-gradient-to-r from-soft to-transparent md:block" />
      <div className="pointer-events-none absolute -right-4 top-0 z-10 hidden h-full w-12 bg-gradient-to-l from-soft to-transparent md:block" />

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((shot, i) => (
          <div
            key={i}
            className="w-[260px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft sm:w-[280px]"
          >
            {shot.src ? (
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="aspect-[9/16] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[9/16] w-full place-items-center bg-[linear-gradient(160deg,oklch(0.96_0.01_160),oklch(0.93_0.02_160))] text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
                  <MessageCircle className="h-6 w-6" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Anterior"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Próximo"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Recupere o controle{" "}
            <span className="bg-primary-gradient bg-clip-text text-transparent">da sua mente.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
            Um acompanhamento diário e personalizado para recuperar foco, disciplina e controle dos
            impulsos. No seu ritmo, um passo de cada vez.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#precos"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-7 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Começar agora
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground shadow-soft transition hover:bg-accent"
            >
              Ver como funciona
            </a>
          </div>
        </div>
      </section>

      {/* ── Problema ───────────────────────────────────────────── */}
      <section id="problema" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Você se reconhece aqui?
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Não é falta de força
            <br /> de vontade.
          </h2>
          <p className="mt-3 font-display text-lg italic text-primary">
            É como o cérebro foi condicionado.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {reconhece.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ──────────────────────────────────────── */}
      <section id="como-funciona" className="bg-soft py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Como funciona
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Simples de começar. Feito para continuar.
            </h2>
            <p className="mt-4 text-base text-muted-foreground text-balance">
              Sem fórmulas mágicas e sem promessas. Apenas passos claros, todos os dias, com
              orientação cuidadosa.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {passos.map((p, i) => (
              <div
                key={p.title}
                className="relative rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="text-xs font-semibold text-primary">0{i + 1}</span>
                <span className="mt-3 grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-semibold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefícios (antes / depois) ────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">A virada</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            O que muda na sua vida
          </h2>
          <p className="mt-3 font-display text-lg italic text-primary">
            quando sua mente descansa
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <span className="inline-flex rounded-full bg-destructive/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-destructive">
              Antes
            </span>
            <ul className="mt-5 space-y-3 text-sm">
              {antes.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-muted-foreground">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-primary p-7 text-primary-foreground shadow-glow">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              Com a Lytra
            </span>
            <ul className="mt-5 space-y-3 text-sm">
              {depois.map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── O que você recebe ──────────────────────────────────── */}
      <section id="recursos" className="bg-soft py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Tudo incluído
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              O que você recebe
            </h2>
            <p className="mt-4 text-base text-muted-foreground text-balance">
              Um conjunto completo de ferramentas para reconstruir sua rotina com leveza.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {entregaveis.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valor percebido ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            O valor real
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Muito mais do que você paga
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-balance">
            Tudo o que está incluído na sua jornada, e o valor que cada parte representa.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <ul className="divide-y divide-border">
            {entregaveis.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.title}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {formatBRL(item.value)}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 bg-surface px-6 py-4">
              <span className="text-sm font-semibold text-foreground">Valor total percebido</span>
              <span className="text-base font-semibold text-muted-foreground line-through">
                {formatBRL(valorTotal)}+
              </span>
            </li>
          </ul>

          <div className="border-t border-border bg-primary-soft/40 px-6 py-7 text-center">
            <p className="text-sm text-muted-foreground">Hoje você começa por apenas</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-primary">
              {formatBRL(PLANS.monthly.price)}
            </p>
            <a
              href="#precos"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary-gradient px-7 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Ver planos
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ────────────────────────────────────────── */}
      <section id="depoimentos" className="bg-soft py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Quem usa, sente a diferença
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Histórias de quem voltou ao controle
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(testimonials.length
              ? testimonials
              : Array.from({ length: 3 }, () => null)
            ).map((t, i) => (
              <figure
                key={i}
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <Quote className="h-6 w-6 text-primary/40" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  {t ? t.text : "Depoimento em breve."}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t?.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-full bg-muted" aria-hidden />
                  )}
                  <span className="text-sm font-semibold text-foreground">
                    {t ? t.name : "—"}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depoimentos em WhatsApp ────────────────────────────── */}
      <section className="bg-soft pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Conversas reais
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              O que chega pra gente no dia a dia
            </h2>
          </div>
          <WhatsappCarousel />
        </div>
      </section>

      {/* ── Preços ─────────────────────────────────────────────── */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Escolha seu plano
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Comece hoje.
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-balance">
            O mesmo acesso completo em todos os planos. Quanto maior o período, menor o custo.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-6 md:grid-cols-3">
          {(["monthly", "quarterly", "lifetime"] as const).map((key) => {
            const plan = PLANS[key];
            const content = planContent[key];
            const featured = content.recommended;
            const periodLabel = plan.period === "único" ? "pagamento único" : plan.period;
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-3xl border bg-card p-6 sm:p-8 ${
                  featured
                    ? "border-2 border-primary shadow-glow md:-translate-y-2"
                    : "border-border shadow-soft"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-gradient px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
                    Mais recomendado
                  </span>
                )}

                <p className="text-sm font-medium text-muted-foreground">{plan.label}</p>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {formatBRL(plan.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">{periodLabel}</span>
                </div>

                <p
                  className={`mt-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    featured
                      ? "bg-primary-soft text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {content.note}
                </p>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {content.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full font-medium transition ${
                    featured
                      ? "bg-primary-gradient text-primary-foreground shadow-glow hover:opacity-95"
                      : "border border-border bg-card hover:bg-accent"
                  }`}
                >
                  Adquirir agora
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="bg-soft py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Dúvidas</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Perguntas frequentes.
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {f.q}
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-primary transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-center shadow-card md:p-20">
          <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden />
          <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Sua próxima versão começa hoje.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-balance">
            Recupere foco, disciplina e controle dos impulsos, um passo de cada vez.
          </p>
          <a
            href="#precos"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-8 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
