import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PLANS, formatBRL } from "@/lib/plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lytra — Recupere seu foco em 21 dias" },
      {
        name: "description",
        content:
          "Missões diárias personalizadas para recuperar foco, vencer a procrastinação e criar hábitos que duram. Sem baixar app. Garantia de 7 dias.",
      },
      { property: "og:title", content: "Lytra — Recupere seu foco em 21 dias" },
      {
        property: "og:description",
        content: "Missões diárias personalizadas para recuperar foco e reconstruir sua rotina. Garantia de 7 dias.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

// ── dados ────────────────────────────────────────────────────────────

const planDisplay = {
  monthly: {
    destaque: "50% OFF — Preço de lançamento",
    features: ["Acesso completo", "Diário emocional", "Missões personalizadas", "Sistema de conquistas", "Suporte incluso"],
  },
  quarterly: {
    destaque: "Equivale a R$ 8,30/mês · Mais popular",
    features: ["Tudo do mensal", "Acesso completo", "Suporte incluso", "Preço por mês menor"],
    recommended: true,
  },
} as const;

const testimonials = [
  {
    name: "Ana Clara M.",
    detail: "Estudante, 22 anos · São Paulo",
    rating: 5,
    text: "Eu achava que meu problema era falta de disciplina, mas na verdade eu vivia distraída o tempo todo. Em 3 semanas cortei o Instagram de 4h para menos de 1h por dia.",
    result: "De 4h → menos de 1h no Instagram em 3 semanas",
    photo: "/avatar-1.webp",
  },
  {
    name: "Marcelo P.",
    detail: "Analista de TI, 31 anos · Recife",
    rating: 5,
    text: "Eu vivia começando projetos e abandonando no meio. Depois que comecei a usar a Lytra, consegui criar uma consistência que não tinha há anos.",
    result: "Primeiro projeto finalizado em 21 dias",
    photo: "/avatar-4.webp",
  },
  {
    name: "Sônia C.",
    detail: "Empreendedora, 38 anos · Florianópolis",
    rating: 5,
    text: "Achei que fosse algo voltado apenas para pessoas mais jovens, mas me surpreendi. Me ajudou a criar hábitos e recuperar 2 horas de foco por dia.",
    result: "2h extras de foco por dia recuperadas",
    photo: "/avatar-6.webp",
  },
  {
    name: "Fernanda S.",
    detail: "Professora, 29 anos · Belo Horizonte",
    rating: 5,
    text: "Em poucos dias eu já percebi diferença. Passei a gastar menos tempo no celular e consegui organizar melhor minha rotina sem me sentir pressionada.",
    result: "Rotina organizada em menos de 1 semana",
    photo: "/avatar-2.webp",
  },
  {
    name: "Lucas R.",
    detail: "Designer freelancer, 26 anos · Curitiba",
    rating: 5,
    text: "O que mais gostei foi a simplicidade. É direto ao ponto e realmente ajuda a manter o foco quando mais preciso.",
    result: "Produtividade dobrou no trabalho remoto",
    photo: "/avatar-3.webp",
  },
  {
    name: "Juliana A.",
    detail: "Universitária, 20 anos · Rio de Janeiro",
    rating: 5,
    text: "Antes eu pegava o celular automaticamente toda hora. Hoje consigo controlar muito melhor meus impulsos. Minha nota na faculdade subiu.",
    result: "Nota na faculdade melhorou no semestre seguinte",
    photo: "/avatar-5.webp",
  },
];

const whatsappShots = [
  { src: "/wp-1.webp", alt: "Minha cabeça ficou mais silenciosa" },
  { src: "/wp-8.webp", alt: "é normal eu estar perdendo a vontade de abrir instagram?" },
  { src: "/wp-3.webp", alt: "Eu jurava que meu problema era falta de disciplina" },
  { src: "/wp-4.webp", alt: "Já faz uma semana, tô começando a acreditar que consigo" },
  { src: "/wp-5.webp", alt: "Minha ansiedade diminuiu muito" },
  { src: "/wp-6.webp", alt: "Pela primeira vez em meses minha lista de tarefas acabou" },
];

const faqs = [
  { q: "Como a Lytra funciona?", a: "Você responde um diagnóstico rápido, recebe um plano diário personalizado e acompanha sua evolução com missões e reflexões que se adaptam ao seu progresso." },
  { q: "Precisa baixar algum app?", a: "Não. A Lytra funciona direto no navegador do celular ou computador. Sem instalação, sem permissões, sem ocupar espaço." },
  { q: "Substitui terapia?", a: "Não. É um apoio comportamental e de rotina. Para quadros clínicos, procure um profissional de saúde." },
  { q: "Como recebo o acesso após comprar?", a: "Logo após o pagamento você recebe um e-mail com link para criar sua senha e entrar. Acesso em menos de 5 minutos." },
  { q: "E se eu não gostar?", a: "7 dias de garantia total. Se não gostar por qualquer motivo, devolvemos 100% — sem burocracia, sem perguntas." },
  { q: "Em quanto tempo sinto resultado?", a: "Muitas pessoas percebem mais foco e presença já nas primeiras semanas. A consistência é o que sustenta a mudança." },
];

// ── helpers ──────────────────────────────────────────────────────────

function trackCheckout(price: number, label: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", { value: price, currency: "BRL", content_name: label });
  }
}

function CTA({ label = "QUERO RECUPERAR MEU FOCO →", plan = "quarterly" as "monthly" | "quarterly" }: { label?: string; plan?: "monthly" | "quarterly" }) {
  const p = PLANS[plan];
  return (
    <div className="flex flex-col items-center gap-2">
      <a
        href={p.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCheckout(p.price, p.label)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-glow transition hover:opacity-90 hover:scale-[1.02]"
      >
        {label}
      </a>
      <p className="text-xs text-muted-foreground">🔒 Pagamento seguro · 7 dias de garantia · Acesso imediato</p>
    </div>
  );
}

// ── countdown ────────────────────────────────────────────────────────

function useCountdown() {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// ── carrossel WhatsApp ────────────────────────────────────────────────

function WhatsappCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 320), behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {whatsappShots.map((shot, i) => (
          <div key={i} className="w-[240px] shrink-0 snap-center overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft sm:w-[280px]">
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="aspect-[9/16] w-full object-cover"
              onError={(e) => {
                const c = (e.currentTarget as HTMLElement).parentElement;
                if (!c) return;
                e.currentTarget.style.display = "none";
                const ph = c.querySelector("[data-placeholder]") as HTMLElement | null;
                if (ph) ph.style.display = "flex";
              }}
            />
            <div data-placeholder className="aspect-[9/16] w-full flex-col items-center justify-center gap-3 bg-primary-soft/20 text-center px-5" style={{ display: "none" }}>
              <MessageCircle className="h-7 w-7 text-primary/30" />
              <p className="text-xs font-medium text-primary/50 leading-relaxed">{shot.alt}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-3">
        {([-1, 1] as const).map((dir) => (
          <button key={dir} type="button" onClick={() => scroll(dir)} aria-label={dir === -1 ? "Anterior" : "Próximo"} className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 bg-white text-primary shadow-soft transition hover:bg-primary-soft">
            {dir === -1 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── página ───────────────────────────────────────────────────────────

function Landing() {
  const { h, m, s } = useCountdown();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">

      {/* ── Timer de urgência ── */}
      <div className="bg-primary text-primary-foreground text-center py-3 px-4">
        <p className="text-sm font-bold">
          ⚠️ PROMOÇÃO DE LANÇAMENTO — Oferta encerra em{" "}
          <span className="inline-flex items-center gap-1 font-mono font-black text-base">
            <span className="rounded bg-white/20 px-1.5 py-0.5">{h}</span>:
            <span className="rounded bg-white/20 px-1.5 py-0.5">{m}</span>:
            <span className="rounded bg-white/20 px-1.5 py-0.5">{s}</span>
          </span>
        </p>
      </div>

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[80%]" style={{ background: "radial-gradient(ellipse 100% 80% at 50% -10%, oklch(0.94 0.06 158 / 0.7), transparent 70%)" }} aria-hidden />

        <div className="relative mx-auto max-w-3xl px-6 pt-16 pb-12 text-center md:pt-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            +500 pessoas já recuperaram o foco com a Lytra
          </div>

          <h1 className="font-display text-4xl leading-[1.1] text-balance md:text-5xl lg:text-6xl">
            Você não tem preguiça.{" "}
            <span style={{ color: "var(--primary)" }}>Seu cérebro foi sequestrado pelo celular.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            A Lytra reconstrói seu foco e sua rotina com missões diárias personalizadas — <strong className="text-foreground">resultados nas primeiras semanas ou seu dinheiro de volta.</strong>
          </p>

          <div className="mt-8">
            <CTA label="QUERO RECUPERAR MEU FOCO →" />
          </div>

          {/* rating */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="font-bold text-foreground">4,9</span>
            <span className="text-muted-foreground">· mais de 1.800 avaliações verificadas</span>
          </div>
        </div>

        {/* mockup */}
        <div className="relative mx-auto max-w-6xl px-6 pb-20 md:pb-28">
          <div className="relative flex items-end justify-center">
            <div className="relative shrink-0" style={{ width: "min(74vw, 780px)" }}>
              <div className="overflow-hidden rounded-t-2xl border border-border bg-white" style={{ aspectRatio: "16/10", boxShadow: "0 32px 80px -12px oklch(0.52 0.13 158 / 0.15), 0 8px 32px rgba(0,0,0,0.12)" }}>
                <div className="flex h-8 items-center gap-2 border-b border-border bg-[#f0f0f0] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <div className="mx-auto flex h-5 w-48 items-center justify-center rounded bg-white/90 border border-border/50">
                    <span className="text-[10px] text-muted-foreground">lytra.shop</span>
                  </div>
                </div>
                <img src="/progress-desktop.png.webp" alt="Lytra — dashboard de progresso" className="w-full h-full object-cover object-top" style={{ height: "calc(100% - 2rem)" }} fetchPriority="high" />
              </div>
              <div className="h-3 bg-gradient-to-b from-[#cecece] to-[#b0b0b0]" />
              <div className="h-1.5 rounded-b-xl bg-[#a0a0a0] shadow-[0_4px_16px_rgba(0,0,0,0.18)]" />
            </div>
            <div className="absolute bottom-6 right-[3%] shrink-0 md:right-[6%]" style={{ width: "min(19vw, 195px)" }}>
              <div className="overflow-hidden rounded-[32px] border-[8px] border-[#1C1C1E]" style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06), -10px 0 40px oklch(0.52 0.13 158 / 0.12)", aspectRatio: "9/19.5" }}>
                <div className="flex h-5 items-center justify-center bg-[#1C1C1E]"><div className="h-3 w-14 rounded-full bg-black" /></div>
                <div className="overflow-y-hidden" style={{ height: "calc(100% - 2.75rem)" }}>
                  <img src="/progress-mobile.png.webp" alt="Lytra no celular" className="w-full" style={{ display: "block" }} fetchPriority="high" />
                </div>
                <div className="flex h-4 items-center justify-center bg-white"><div className="h-1 w-10 rounded-full bg-black/15" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="border-y border-border bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { emoji: "⚡", title: "Acesso imediato", sub: "Em menos de 5 minutos" },
              { emoji: "🔒", title: "Pagamento seguro", sub: "Ambiente criptografado" },
              { emoji: "↩", title: "Garantia 7 dias", sub: "100% sem perguntas" },
              { emoji: "📱", title: "Sem baixar app", sub: "Funciona no navegador" },
            ].map((b) => (
              <div key={b.title} className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-2xl">{b.emoji}</span>
                <p className="text-sm font-bold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dor ── */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Isso é você?</p>
          <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">
            Se você se identifica com <span className="italic text-primary">qualquer um</span> desses pontos, a Lytra foi feita para você:
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {[
            "Você abre o celular 'por um segundo' e perde 2 horas sem perceber",
            "Você começa projetos cheio de energia e abandona no meio",
            "Você adia as coisas importantes e só faz o urgente",
            "Você sente culpa e desânimo no fim do dia por não ter feito nada",
            "Você já tentou vários métodos e nenhum durou mais de 2 semanas",
            "Você sabe o que precisa fazer, mas não consegue se forçar a fazer",
          ].map((d) => (
            <div key={d} className="flex items-start gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
              <span className="mt-0.5 shrink-0 text-lg">😔</span>
              <p className="text-sm font-medium text-foreground md:text-base">{d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-display text-xl text-foreground md:text-2xl">
          Isso <strong>não é preguiça</strong>. É como o cérebro foi condicionado a funcionar.{" "}
          <span className="text-primary">E tem solução.</span>
        </p>
      </section>

      {/* ── Antes / Depois ── */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl text-balance md:text-4xl">O que muda na prática</h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-white shadow-card">
            <div className="grid grid-cols-2 border-b border-border">
              <div className="border-r border-border bg-red-50 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-red-500">❌ Sem a Lytra</div>
              <div className="bg-primary px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground">✅ Com a Lytra</div>
            </div>
            {[
              ["Perde 2-4h por dia no celular", "Missões que reconquistam seu tempo"],
              ["Começa e abandona tudo", "Consistência de 21 dias que vira hábito"],
              ["Métodos genéricos que não funcionam", "Diagnóstico personalizado dos seus gatilhos"],
              ["Culpa e desânimo no fim do dia", "Progresso visível e sensação de dever cumprido"],
              ["Ciclo infinito de 'começo amanhã'", "Plano diário feito pro seu ritmo real"],
              ["Ansiedade e foco fragmentado", "Clareza mental e presença no que importa"],
            ].map(([de, para], i, arr) => (
              <div key={de} className={`grid grid-cols-2 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <div className="border-r border-border bg-red-50/50 px-5 py-3.5 text-sm text-red-600">{de}</div>
                <div className="bg-primary/5 px-5 py-3.5 text-sm font-medium text-primary">{para}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <CTA label="QUERO ESSA MUDANÇA →" />
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section id="como-funciona" className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Simples assim</p>
          <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">3 passos para recuperar seu foco</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { num: "01", emoji: "🧠", title: "Diagnóstico rápido", text: "Em minutos a Lytra entende seus gatilhos, seu momento e o que precisa ser reconstruído na sua rotina." },
            { num: "02", emoji: "📋", title: "Plano feito para você", text: "Missões curtas e diárias que se encaixam na sua rotina real — sem pressão, sem padrões prontos." },
            { num: "03", emoji: "📈", title: "Evolução que você vê", text: "Cada passo registrado. A jornada se adapta conforme você avança. Você vê a diferença em semanas." },
          ].map((p) => (
            <div key={p.num} className="relative rounded-3xl border border-primary/10 bg-white p-7 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary/10 select-none">{p.num}</span>
                <span className="text-2xl">{p.emoji}</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 rounded-b-3xl" style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-glow))" }} aria-hidden />
            </div>
          ))}
        </div>
      </section>

      {/* ── O que você recebe ── */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Tudo incluso</p>
            <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">
              O que você acessa por <span className="text-primary">R$8,30/mês</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Valor total se fosse contratar cada recurso separadamente: <strong className="text-foreground">mais de R$300</strong></p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { emoji: "🧠", title: "Diagnóstico Comportamental Personalizado", sub: "Entenda seus padrões, gatilhos e o que realmente te trava", valor: "R$97" },
              { emoji: "📋", title: "Plano Diário Adaptado ao Seu Ritmo", sub: "Missões curtas que cabem na sua rotina real, sem pressão", valor: "R$67" },
              { emoji: "📔", title: "Diário Emocional Inteligente", sub: "Registre seu estado, identifique ciclos e entenda suas emoções", valor: "R$57" },
              { emoji: "🎯", title: "Missões Progressivas e Adaptativas", sub: "Desafios que evoluem conforme você avança — sem estagnação", valor: "R$47" },
              { emoji: "🏆", title: "Sistema de Conquistas e Streaks", sub: "Gamificação que mantém você consistente no longo prazo", valor: "R$37" },
              { emoji: "💬", title: "Suporte Humanizado Incluso", sub: "Tire dúvidas e receba orientação quando precisar", valor: "R$37" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-soft">
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.valor}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">
            <p className="text-sm text-muted-foreground">Valor total dos recursos: <span className="line-through">R$342</span></p>
            <p className="mt-1 text-lg font-bold text-primary">Você acessa tudo por R$8,30/mês no plano trimestral 🎉</p>
          </div>

          <div className="mt-8 text-center">
            <CTA label="QUERO ACESSO AGORA →" />
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section id="depoimentos" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Resultados reais</p>
          <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">Veja o que dizem quem já está usando</h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xl text-yellow-400">★★★★★</span>
            <span className="font-bold">4,9</span>
            <span className="text-sm text-muted-foreground">· mais de 1.800 avaliações</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-1">
                {"★★★★★".split("").map((s, j) => (
                  <span key={j} className="text-sm text-yellow-400">{s}</span>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-primary/6 px-3 py-1.5 text-xs font-bold text-primary">
                ✅ {t.result}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">"{t.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const s = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (s) s.style.display = "flex";
                  }}
                />
                <span className="h-10 w-10 shrink-0 rounded-full bg-primary/10" style={{ display: "none" }} aria-hidden />
                <div>
                  <span className="block text-sm font-bold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.detail}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <CTA label="QUERO ESSE RESULTADO TAMBÉM →" />
        </div>
      </section>

      {/* ── WhatsApp ── */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Conversas reais</p>
            <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">O que chega pra gente todo dia</h2>
            <p className="mt-2 text-sm text-muted-foreground">Prints reais de pessoas que estão usando a Lytra agora.</p>
          </div>
          <WhatsappCarousel />
        </div>
      </section>

      {/* ── Preços ── */}
      <section id="precos" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Escolha seu plano</p>
          <h2 className="mt-3 font-display text-3xl text-balance md:text-4xl">Comece hoje. Mude sua rotina.</h2>
          <p className="mt-2 text-sm text-muted-foreground">⚠️ Preços de lançamento — podem subir sem aviso.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl items-start gap-6 md:grid-cols-2">
          {(["monthly", "quarterly"] as const).map((key) => {
            const plan = PLANS[key];
            const display = planDisplay[key];
            const featured = "recommended" in display && display.recommended;

            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-3xl p-7 ${featured ? "border-2 border-primary bg-white shadow-glow md:-translate-y-2" : "border border-border bg-card shadow-soft"}`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-glow">
                    🔥 MAIS RECOMENDADO
                  </span>
                )}

                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{plan.label}</p>

                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight text-foreground">{formatBRL(plan.price)}</span>
                    <span className="text-sm text-muted-foreground">{plan.period === "único" ? "único" : plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    De <span className="line-through">{formatBRL(plan.oldPrice)}</span> por apenas <strong className="text-primary">{formatBRL(plan.price)}</strong>
                  </p>
                </div>

                <p className={`mt-3 rounded-full px-3 py-1 text-xs font-bold w-fit ${featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {display.destaque}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {display.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span className={`flex shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold ${featured ? "bg-primary" : "bg-primary/40"}`} style={{ height: "1.125rem", width: "1.125rem" }}>✓</span>
                      <span className={featured ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCheckout(plan.price, plan.label)}
                  className={`mt-7 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold transition-all ${featured ? "bg-primary text-primary-foreground shadow-glow hover:opacity-90" : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"}`}
                >
                  COMEÇAR AGORA →
                </a>
                <p className="mt-2 text-center text-xs text-muted-foreground">🔒 Pagamento seguro · 7 dias de garantia</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>🔒 Ambiente criptografado</span>
          <span>⚡ Acesso em menos de 5 min</span>
          <span>↩ 7 dias de garantia total</span>
          <span>✕ Cancele quando quiser</span>
        </div>
      </section>

      {/* ── Garantia ── */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(160deg, oklch(0.97 0.02 158), oklch(1 0 0) 70%)" }}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-5 font-display text-3xl text-balance md:text-4xl">Garantia incondicional de 7 dias</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Se por qualquer motivo a Lytra não for para você, é só mandar uma mensagem em até 7 dias após a compra e devolvemos <strong className="text-foreground">100% do seu dinheiro</strong> — sem perguntas, sem burocracia, sem enrolação.
          </p>
          <p className="mt-4 font-semibold text-foreground">O risco é todo nosso. O resultado é todo seu.</p>
          <div className="mt-8">
            <CTA label="QUERO COMEÇAR SEM RISCO →" />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl md:text-4xl">Perguntas frequentes</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-foreground">
                {f.q}
                <span className="ml-6 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 font-display text-xl text-foreground">Ainda com dúvidas? Comece com a garantia de 7 dias.</p>
          <CTA label="QUERO COMEÇAR AGORA →" />
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="mx-auto max-w-4xl px-6 pb-24 md:pb-32">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center shadow-glow md:p-20"
          style={{ background: "linear-gradient(145deg, var(--primary) 0%, oklch(0.62 0.15 160) 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% -10%, oklch(1 0 0 / 0.18), transparent 70%)" }} aria-hidden />
          <p className="relative text-sm font-bold uppercase tracking-widest text-white/70">Sua decisão. Agora.</p>
          <h2 className="relative mt-3 font-display text-4xl text-white text-balance md:text-5xl">
            Sua próxima versão começa hoje.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-white/75">
            Mais de 500 pessoas já deram o primeiro passo. O que falta é você.
          </p>
          <div className="relative mt-8">
            <a
              href={PLANS.quarterly.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCheckout(PLANS.quarterly.price, "Trimestral")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-black text-primary shadow-lg transition hover:bg-primary-soft hover:scale-[1.02]"
            >
              QUERO COMEÇAR AGORA →
            </a>
            <p className="mt-3 text-xs text-white/60">🔒 Garantia de 7 dias · Acesso imediato · Cancele quando quiser</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
