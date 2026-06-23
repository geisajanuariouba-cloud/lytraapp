import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  X,
  Zap,
  Timer,
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
    text: "Em minutos a Lytra entende seu momento, seus gatilhos e o que precisa ser reconstruído.",
  },
  {
    num: "02",
    title: "Plano feito para você",
    text: "Missões curtas e diárias que se encaixam na sua rotina real, sem pressão e sem padrões prontos.",
  },
  {
    num: "03",
    title: "Acompanhamento que evolui",
    text: "A jornada se ajusta conforme você avança. Cada passo registrado é prova do quanto você já foi.",
  },
];

const transformacoes = [
  { de: "Horas no feed sem perceber", para: "Mais presença e clareza no dia" },
  { de: "Sono ruim, cansaço constante", para: "Noites tranquilas, manhãs com propósito" },
  { de: "Adiar o que realmente importa", para: "Missões pequenas que cabem na rotina" },
  { de: "Culpa e desânimo no fim do dia", para: "Progresso gentil, sem julgamento" },
  { de: "Decisões que não se sustentam", para: "Disciplina construída um passo de cada vez" },
];

const oQueVoceRecebe = [
  {
    titulo: "Clareza mental",
    desc: "Entenda seus padrões, gatilhos e emoções com um diário que organiza o que você sente.",
  },
  {
    titulo: "Progresso real",
    desc: "Missões diárias personalizadas que cabem na sua rotina e mostram avanço concreto a cada dia.",
  },
  {
    titulo: "Presença no dia",
    desc: "Ferramentas práticas para pausar, respirar e responder em vez de reagir no automático.",
  },
  {
    titulo: "Rotina reconstruída",
    desc: "Um sistema de progresso que celebra cada passo, mantendo você no caminho sem pressão.",
  },
  {
    titulo: "Horas de volta",
    desc: "Estratégias concretas para recuperar o tempo perdido em estímulos que não te servem.",
  },
  {
    titulo: "Evolução visível",
    desc: "Registro de conquistas que transforma pequenas vitórias em prova de que você está mudando.",
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
  lifetime: {
    destaque: "Você paga uma vez. Para sempre.",
    features: [
      "Tudo do trimestral",
      "Sem mensalidades",
      "Sem renovações",
      "Acesso permanente",
    ],
  },
} as const;

const testimonials: { name: string; detail: string; rating: number; text: string; photo: string; result: string }[] = [
  {
    name: "Ana Clara M.",
    detail: "Estudante, 22 anos · São Paulo",
    rating: 5.0,
    text: "Eu achava que meu problema era falta de disciplina, mas na verdade eu vivia distraída o tempo todo. Em 3 semanas cortei o Instagram de 4h para menos de 1h por dia.",
    result: "De 4h → menos de 1h no Instagram em 3 semanas",
    photo: "/avatar-1.jpg",
  },
  {
    name: "Fernanda S.",
    detail: "Professora, 29 anos · Belo Horizonte",
    rating: 5.0,
    text: "Em poucos dias eu já percebi diferença. Passei a gastar menos tempo no celular e consegui organizar melhor minha rotina sem me sentir pressionada.",
    result: "Rotina organizada em menos de 1 semana",
    photo: "/avatar-2.jpg",
  },
  {
    name: "Lucas R.",
    detail: "Designer freelancer, 26 anos · Curitiba",
    rating: 5.0,
    text: "O que mais gostei foi a simplicidade. Não parece mais um app cheio de funções inúteis. É direto ao ponto e realmente ajuda a manter o foco quando mais preciso.",
    result: "Produtividade dobrou no trabalho remoto",
    photo: "/avatar-3.jpg",
  },
  {
    name: "Marcelo P.",
    detail: "Analista de TI, 31 anos · Recife",
    rating: 4.9,
    text: "Eu vivia começando projetos e abandonando no meio. Depois que comecei a usar a Lytra, consegui criar uma consistência que não tinha há anos.",
    result: "Primeiro projeto finalizado em 21 dias",
    photo: "/avatar-4.jpg",
  },
  {
    name: "Juliana A.",
    detail: "Universitária, 20 anos · Rio de Janeiro",
    rating: 5.0,
    text: "Antes eu pegava o celular automaticamente toda hora. Hoje consigo controlar muito melhor meus impulsos. Minha nota na faculdade subiu no semestre seguinte.",
    result: "Nota na faculdade melhorou no semestre seguinte",
    photo: "/avatar-5.jpg",
  },
  {
    name: "Sônia C.",
    detail: "Empreendedora, 38 anos · Florianópolis",
    rating: 4.8,
    text: "Achei que fosse algo voltado apenas para pessoas mais jovens, mas me surpreendi. Me ajudou a criar hábitos mais saudáveis e reduzir distrações no trabalho.",
    result: "2h extras de foco por dia recuperadas",
    photo: "/avatar-6.jpg",
  },
];

const whatsappShots: { src: string; alt: string }[] = [
  { src: "/wp-1.jpg", alt: "Minha cabeça ficou mais silenciosa" },
  { src: "/wp-8.jpg", alt: "é normal eu estar perdendo a vontade de abrir instagram?" },
  { src: "/wp-3.jpg", alt: "Eu jurava que meu problema era falta de disciplina" },
  { src: "/wp-4.jpg", alt: "Já faz uma semana, tô começando a acreditar que consigo" },
  { src: "/wp-5.jpg", alt: "Minha ansiedade diminuiu muito" },
  { src: "/wp-6.jpg", alt: "Pela primeira vez em meses minha lista de tarefas acabou" },
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
    a: "Logo após o pagamento você recebe um e-mail com um link para criar sua senha e entrar na plataforma.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A Lytra é pensada para o celular e roda direto no navegador, sem precisar baixar nada.",
  },
  {
    q: "Em quanto tempo sinto resultado?",
    a: "Muitas pessoas percebem mais foco e presença já nas primeiras semanas. A consistência é o que sustenta a mudança.",
  },
];

// ── componente do carrossel WhatsApp ─────────────────────────────────
function WhatsappCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 320), behavior: "smooth" });
  };

  const slides = whatsappShots.length
    ? whatsappShots
    : Array.from({ length: 4 }, (_, i) => ({ src: "", alt: `Print ${i + 1}` }));

  return (
    <div className="relative mt-14">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((shot, i) => (
          <div
            key={i}
            className="w-[260px] shrink-0 snap-center overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft sm:w-[300px]"
          >
            {shot.src ? (
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
            ) : null}
            {/* placeholder: visível quando src está vazio ou imagem falha em carregar */}
            <div
              data-placeholder
              className="aspect-[9/16] w-full flex-col items-center justify-center gap-4 bg-primary-soft/20 text-center px-6"
              style={{ display: shot.src ? "none" : "flex" }}
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
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* fundo: gradiente verde cobrindo toda a área superior */}
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        {/* camada extra de verde sutil na parte superior */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% -10%, oklch(0.94 0.06 158 / 0.7), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-10 text-center md:pt-36 md:pb-10">
          {/* banner de lançamento */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Preço de lançamento — por tempo limitado
          </div>

          <h1 className="font-display text-5xl leading-[1.08] text-balance text-foreground md:text-6xl lg:text-[4.5rem]">
            A plataforma que reconstrói{" "}
            <span style={{ color: "var(--primary)" }}>seu foco e sua rotina.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
            Para quem vive distraído, adia o que importa e não consegue mudar sozinho. Missões diárias personalizadas, diário emocional e acompanhamento real — sem app para baixar.
          </p>

          {/* pills de definição do produto */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            {["✓ Diagnóstico personalizado", "✓ Missões diárias", "✓ Sem app para baixar", "✓ Acesso imediato"].map((pill) => (
              <span key={pill} className="rounded-full border border-primary/15 bg-white/70 px-3 py-1">
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={PLANS.quarterly.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).fbq) {
                  (window as any).fbq("track", "InitiateCheckout", { value: PLANS.quarterly.price, currency: "BRL", content_name: "Trimestral" });
                }
              }}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 hover:shadow-[0_0_40px_-8px_oklch(0.52_0.13_158/0.5)]"
              style={{ height: "3.25rem" }}
            >
              Quero recuperar meu foco — R$8,30/mês
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-13 items-center justify-center rounded-full border border-primary/20 bg-white/60 px-8 text-sm font-medium text-foreground backdrop-blur transition hover:bg-primary-soft/60"
              style={{ height: "3.25rem" }}
            >
              Como funciona
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">7 dias de garantia · Cancele quando quiser · Preço de lançamento</p>
        </div>

        {/* ── Device mockup ── */}
        <div className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-32">
          <div className="relative flex items-end justify-center">

            {/* Laptop */}
            <div className="relative shrink-0" style={{ width: "min(74vw, 780px)" }}>
              {/* tela */}
              <div
                className="overflow-hidden rounded-t-2xl border border-border bg-white"
                style={{
                  aspectRatio: "16/10",
                  boxShadow: "0 32px 80px -12px oklch(0.52 0.13 158 / 0.15), 0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                {/* barra de endereço */}
                <div className="flex h-8 items-center gap-2 border-b border-border bg-[#f0f0f0] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <div className="mx-auto flex h-5 w-48 items-center justify-center rounded bg-white/90 border border-border/50">
                    <span className="text-[10px] text-muted-foreground">lytra.shop</span>
                  </div>
                </div>
                {/* screenshot real */}
                <img
                  src="/progress-desktop.png.png"
                  alt="Lytra — tela de Progresso no computador"
                  className="w-full h-full object-cover object-top"
                  style={{ height: "calc(100% - 2rem)" }}
                  fetchPriority="high"
                />
              </div>
              {/* base */}
              <div className="h-3 bg-gradient-to-b from-[#cecece] to-[#b0b0b0]" />
              <div className="h-1.5 rounded-b-xl bg-[#a0a0a0] shadow-[0_4px_16px_rgba(0,0,0,0.18)]" />
            </div>

            {/* Phone — sobreposto à direita */}
            <div
              className="absolute bottom-6 right-[3%] shrink-0 md:right-[6%]"
              style={{ width: "min(19vw, 195px)" }}
            >
              <div
                className="overflow-hidden rounded-[32px] border-[8px] border-[#1C1C1E]"
                style={{
                  boxShadow:
                    "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06), -10px 0 40px oklch(0.52 0.13 158 / 0.12)",
                  aspectRatio: "9/19.5",
                }}
              >
                {/* dynamic island */}
                <div className="flex h-5 items-center justify-center bg-[#1C1C1E]">
                  <div className="h-3 w-14 rounded-full bg-black" />
                </div>
                {/* screenshot real */}
                <div className="overflow-y-hidden" style={{ height: "calc(100% - 2.75rem)" }}>
                  <img
                    src="/progress-mobile.png.png"
                    alt="Lytra — tela de Progresso no celular"
                    className="w-full"
                    style={{ display: "block" }}
                    fetchPriority="high"
                  />
                </div>
                {/* home indicator */}
                <div className="flex h-4 items-center justify-center bg-white">
                  <div className="h-1 w-10 rounded-full bg-black/15" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Problema ── */}
      <section id="problema" className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl text-balance md:text-5xl">
            Você se reconhece aqui?
          </h2>
        </div>

        <div className="mt-14 space-y-4">
          {dores.map((d, i) => (
            <div
              key={d.title}
              className="flex items-start gap-5 rounded-2xl border border-border bg-card px-6 py-5 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{d.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="font-display text-2xl text-foreground md:text-3xl">
            Não é falta de força de vontade.
          </p>
          <p className="mt-3 font-display text-xl italic text-primary">
            É como o cérebro aprendeu a funcionar.
          </p>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section
        id="como-funciona"
        className="py-24 md:py-32"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Como funciona
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
              Simples de começar. Feito para continuar.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {passos.map((p) => (
              <div key={p.num} className="relative rounded-3xl border border-primary/10 bg-white p-8 shadow-soft">
                <span className="text-5xl font-bold text-primary/10 select-none">{p.num}</span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
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

      {/* ── Transformação (antes / depois) ── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            A virada
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
            O que muda na prática
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          {/* cabeçalho das colunas */}
          <div className="grid grid-cols-2 border-b border-border">
            <div className="border-r border-border bg-muted/40 px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hoje
            </div>
            <div className="bg-primary px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground">
              Com a Lytra
            </div>
          </div>

          {/* linhas */}
          {transformacoes.map((t, i) => (
            <div
              key={t.de}
              className={`grid grid-cols-2 ${i < transformacoes.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="border-r border-border px-5 py-4 text-sm text-muted-foreground">
                {t.de}
              </div>
              <div className="bg-primary/5 px-5 py-4 text-sm font-medium text-primary">
                {t.para}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── O que você recebe ── */}
      <section
        id="recursos"
        className="py-24 md:py-32"
        style={{ background: "linear-gradient(180deg, oklch(0.96 0.03 158 / 0.4), transparent 60%)" }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              O que você recebe
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
              Não ferramentas. Transformações.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Cada parte da Lytra foi pensada para um resultado real na sua vida, não para parecer
              completa numa lista.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {oQueVoceRecebe.map((item) => (
              <div
                key={item.titulo}
                className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card"
              >
                <h3 className="text-base font-semibold text-foreground">{item.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section id="depoimentos" className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Histórias reais
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
            Quem voltou ao controle
          </h2>
        </div>

        {/* rating summary */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-2 text-center">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl font-normal text-foreground">4,9</span>
            <span className="text-3xl text-yellow-400">★★★★★</span>
          </div>
          <p className="text-sm text-muted-foreground">Baseado em mais de 1.800 avaliações verificadas</p>
          {/* distribuição */}
          <div className="mt-4 w-full max-w-xs space-y-1.5 text-left text-xs text-muted-foreground">
            {[
              { star: 5, pct: 78 },
              { star: 4, pct: 16 },
              { star: 3, pct: 4 },
              { star: 2, pct: 1 },
              { star: 1, pct: 1 },
            ].map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-right">{star}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* cards */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl border border-primary/10 bg-white p-7 shadow-soft"
            >
              {/* estrelas */}
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-yellow-400">{"★".repeat(Math.floor(t.rating))}</span>
                <span className="text-xs font-semibold text-muted-foreground">{t.rating.toFixed(1)}</span>
              </div>
              {/* resultado em destaque */}
              <div className="mt-3 rounded-lg bg-primary/6 px-3 py-1.5 text-xs font-semibold text-primary">
                {t.result}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
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

        {/* CTA mid-page após depoimentos */}
        <div className="mt-14 text-center">
          <a
            href={PLANS.quarterly.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== "undefined" && (window as any).fbq) {
                (window as any).fbq("track", "InitiateCheckout", { value: PLANS.quarterly.price, currency: "BRL", content_name: "Trimestral" });
              }
            }}
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
        className="py-24 md:py-32"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Conversas reais
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
              O que chega pra gente todo dia
            </h2>
          </div>
          <WhatsappCarousel />
        </div>
      </section>

      {/* ── Selos de confiança ── */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Icon: Lock,       title: "Dados criptografados", sub: "Segurança de nível bancário" },
            { Icon: Zap,        title: "Acesso imediato",      sub: "Pronto em menos de 5 min" },
            { Icon: RefreshCw,  title: "Garantia 7 dias",      sub: "Reembolso sem perguntas" },
            { Icon: X,          title: "Cancele quando quiser", sub: "Sem fidelidade" },
          ].map((s) => (
            <div key={s.title} className="flex flex-col items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-5 text-center shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                <s.Icon className="h-4.5 w-4.5" style={{ height: "1.125rem", width: "1.125rem" }} />
              </span>
              <p className="text-xs font-semibold text-foreground">{s.title}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preços ── */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Escolha seu plano
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl">
            Comece hoje.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Acesso completo em todos os planos. O que muda é o custo por período.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Uma sessão de terapia custa em média R$200. O plano vitalício da Lytra custa R$49,90 — pagamento único, para sempre.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-6 md:grid-cols-3">
          {(["monthly", "quarterly", "lifetime"] as const).map((key) => {
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

                <p
                  className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold w-fit ${
                    featured
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {display.destaque}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {display.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                          featured ? "bg-primary" : "bg-primary/20"
                        }`}
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
                      <span className={featured ? "text-foreground" : "text-muted-foreground"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).fbq) {
                      (window as any).fbq("track", "InitiateCheckout", {
                        value: plan.price,
                        currency: "BRL",
                        content_name: plan.label,
                      });
                    }
                  }}
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
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="py-24 md:py-32"
        style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dúvidas</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
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
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="mx-auto max-w-4xl px-6 pb-24 md:pb-32">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-glow md:p-20"
          style={{
            background:
              "linear-gradient(145deg, var(--primary) 0%, oklch(0.62 0.15 160) 100%)",
          }}
        >
          {/* brilho interno */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% -10%, oklch(1 0 0 / 0.18), transparent 70%)",
            }}
            aria-hidden
          />

          <h2 className="relative font-display text-4xl text-white text-balance md:text-5xl">
            Sua próxima versão começa hoje.
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-lg text-white/75 text-balance">
            Foco. Clareza. Controle. Um passo de cada vez.
          </p>
          <a
            href="#precos"
            className="relative mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-white px-9 text-sm font-bold text-primary shadow-lg transition hover:bg-primary-soft"
            style={{ height: "3.25rem" }}
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
