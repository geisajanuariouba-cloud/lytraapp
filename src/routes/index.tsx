import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Smartphone,
  Target,
  X,
  ShieldCheck,
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
        content:
          "Recupere foco, disciplina e controle dos impulsos com um plano diário e personalizado.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

// ── Problema ────────────────────────────────────────────────────────
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
    icon: Target,
    title: "Você decide mudar. Amanhã. De novo.",
    text: "O ciclo se repete porque métodos genéricos ignoram o lado emocional. Sem acolhimento real, toda estratégia vira mais uma coisa para abandonar.",
  },
];

// ── Como funciona (3 passos) ────────────────────────────────────────
const passos = [
  {
    title: "Diagnóstico Rápido",
    text: "A plataforma entende seu momento atual, seus gatilhos e o que precisa ser reconstruído.",
  },
  {
    title: "Plano Sob Medida",
    text: "Você recebe missões curtas e diárias que se adaptam à sua rotina real, sem pressão.",
  },
  {
    title: "Acompanhamento Diário",
    text: "A rotina se ajusta conforme você avança. Você registra progresso e mantém a consistência.",
  },
];

// ── Benefícios (antes / depois) ─────────────────────────────────────
const antes = [
  "Horas no feed sem perceber o tempo passar",
  "Sono ruim e cansaço constante",
  "Adiar o que realmente importa",
  "Culpa e desânimo no fim do dia",
  "Decidir mudar e não conseguir manter",
];

const depois = [
  "Mais presença e clareza no dia a dia",
  "Noites tranquilas e foco recuperado",
  "Missões pequenas que cabem na rotina",
  "Progresso gentil, sem julgamento",
  "Disciplina construída um passo de cada vez",
];

// ── Valor Percebido ─────────────────────────────────────────────────
const recursos = [
  {
    title: "Diário Emocional Inteligente",
    desc: "Registre como se sente e ganhe clareza imediata sobre seus gatilhos.",
  },
  {
    title: "Missões Personalizadas",
    desc: "Ações diárias desenhadas para o seu contexto e sua disponibilidade.",
  },
  {
    title: "Plano de Evolução Adaptável",
    desc: "Seu caminho se ajusta ao seu progresso, garantindo que você nunca se sinta sobrecarregado.",
  },
  {
    title: "Registro de Conquistas",
    desc: "Métricas simples e visuais para você ver, na prática, a retomada do seu foco.",
  },
];

// ── Depoimentos Estruturais (Aguardando Materiais) ──────────────────
// Insira as URLs reais das imagens e textos quando os materiais estiverem disponíveis.
const testimonials: { name: string; text: string; photo: string }[] = [
  {
    name: "[Nome do Usuário 1]",
    text: "[Texto do depoimento real do usuário relatando a transformação e melhora no foco. Substituir assim que o material estiver disponível.]",
    photo: "", // ex: "/depoimentos/foto1.jpg"
  },
  {
    name: "[Nome do Usuário 2]",
    text: "[Texto do depoimento real do usuário relatando como parou de procrastinar. Substituir assim que o material estiver disponível.]",
    photo: "",
  },
  {
    name: "[Nome do Usuário 3]",
    text: "[Texto do depoimento real do usuário relatando o impacto positivo na rotina. Substituir assim que o material estiver disponível.]",
    photo: "",
  },
];

// ── Depoimentos WhatsApp (Aguardando Materiais) ─────────────────────
// Adicione as URLs dos prints reais na lista abaixo.
const whatsappShots: { src: string; alt: string }[] = [
  // { src: "/whatsapp/print-1.png", alt: "Conversa real" },
];

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
    a: "Logo após a confirmação do pagamento, você recebe um e-mail com acesso imediato para definir sua senha e entrar na plataforma.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A Lytra foi projetada primariamente para uso em smartphones, funcionando de forma fluida direto no navegador.",
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
    : Array.from({ length: 4 }, (_, i) => ({ src: "", alt: `Aguardando print ${i + 1}` }));

  return (
    <div className="relative mt-12 w-full max-w-5xl mx-auto px-6">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((shot, i) => (
          <div
            key={i}
            className="w-[280px] shrink-0 snap-center overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm sm:w-[320px] transition-transform hover:-translate-y-1"
          >
            {shot.src ? (
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="aspect-[9/16] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[9/16] w-full place-items-center bg-gray-50 text-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <MessageCircle className="h-8 w-8" />
                  <span className="text-sm font-medium">Print de Conversa</span>
                  <span className="text-xs">[Inserir Imagem]</span>
                </div>
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
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Próximo"
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-6 pt-32 pb-24 text-center md:pt-40 md:pb-32">
        <h1 className="text-5xl font-bold tracking-tight text-balance md:text-7xl text-gray-900">
          Recupere o controle <br className="hidden md:block" /> da sua mente.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-500 text-balance leading-relaxed">
          Um acompanhamento diário e prático para retomar seu foco, disciplina e controle dos impulsos. Tudo no seu ritmo, um passo de cada vez.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#precos"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Começar agora
          </a>
          <a
            href="#como-funciona"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-8 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Entenda como funciona
          </a>
        </div>
      </section>

      {/* ── Problema ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Não é preguiça. É exaustão e hábito.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reconhece.map((c) => (
            <div key={c.title} className="flex flex-col gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-900">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefícios (O Contraste) ───────────────────────────── */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <X className="h-3.5 w-3.5" />
                </span>
                Rotina Atual
              </h3>
              <ul className="mt-8 space-y-4">
                {antes.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                Com a Lytra
              </h3>
              <ul className="mt-8 space-y-4">
                {depois.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-gray-900 font-medium">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como funciona ──────────────────────────────────────── */}
      <section id="como-funciona" className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Simples. Direto. Efetivo.
          </h2>
          <p className="mt-4 text-gray-500">
            A consistência é o que traz resultado, não atalhos milagrosos.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {passos.map((p, i) => (
            <div key={p.title} className="relative">
              <span className="text-5xl font-bold text-gray-100 absolute -top-8 -left-4 -z-10">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Depoimentos WhatsApp ───────────────────────────────── */}
      <section className="bg-gray-50 py-24 md:py-32 border-y border-gray-100">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Quem já retomou o controle
          </h2>
          <p className="mt-4 text-gray-500">
            Pessoas reais recuperando horas do seu dia com a Lytra.
          </p>
        </div>
        <WhatsappCarousel />
      </section>

      {/* ── O que você recebe (Valor Percebido) ────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            O que está incluído
          </h2>
          <p className="mt-4 text-gray-500">
            Ferramentas pensadas exclusivamente para manter você no caminho.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recursos.map((r) => (
            <div key={r.title} className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
              <h3 className="text-base font-semibold text-gray-900">{r.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Depoimentos Escritos ───────────────────────────────── */}
      <section className="bg-gray-50 py-24 md:py-32 border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="flex flex-col rounded-2xl bg-white p-8 border border-gray-200">
                <p className="flex-1 text-sm leading-relaxed text-gray-700 italic">
                  "{t.text}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      Foto
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preços & Garantia ──────────────────────────────────── */}
      <section id="precos" className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Sua jornada começa aqui
          </h2>
          <p className="mt-4 text-gray-500">
            Acesso completo em todos os planos. A única diferença é o preço por período.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-start max-w-4xl mx-auto">
          {(["monthly", "quarterly", "lifetime"] as const).map((key) => {
            const plan = PLANS[key];
            const isFeatured = key === "quarterly";
            
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl p-8 bg-white ${
                  isFeatured
                    ? "border-2 border-black shadow-lg md:-translate-y-2"
                    : "border border-gray-200"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                    Plano Recomendado
                  </span>
                )}
                
                <h3 className="text-base font-semibold text-gray-900">{plan.label}</h3>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {formatBRL(plan.price)}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {plan.period === "único" ? "único" : plan.period}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-gray-900" />
                    <span>Acesso Completo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-gray-900" />
                    <span>Todas as ferramentas</span>
                  </div>
                </div>

                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg font-medium transition-colors ${
                    isFeatured
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Adquirir {plan.label}
                </a>
              </div>
            );
          })}
        </div>

        {/* Informação Order Bump */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * Após a compra, você poderá adicionar acesso pelo WhatsApp e suporte prioritário por apenas R$ 9,90.
          </p>
        </div>

        {/* Garantia */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gray-50 p-8 border border-gray-100 max-w-2xl mx-auto text-center">
          <ShieldCheck className="h-10 w-10 text-gray-900" />
          <h3 className="text-lg font-semibold text-gray-900">Garantia Incondicional de 7 Dias</h3>
          <p className="text-sm text-gray-500">
            Você tem 7 dias para acessar a Lytra, ver como funciona na prática e decidir se é para você. Se achar que não ajudou, devolvemos 100% do seu dinheiro, sem complicações. Risco zero.
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-24 border-t border-gray-100">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl mb-12 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-gray-200 bg-white p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                {f.q}
                <span className="ml-6 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 pr-8">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl text-gray-900">
          Sua próxima versão começa hoje.
        </h2>
        <a
          href="#precos"
          className="mt-10 inline-flex h-14 items-center justify-center rounded-lg bg-black px-10 text-base font-medium text-white transition-colors hover:bg-gray-800"
        >
          Retomar o controle
        </a>
      </section>

      <Footer />
    </div>
  );
}
