import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Leaf,
  ListChecks,
  Moon,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lytra — Recupere o controle da sua mente" },
      {
        name: "description",
        content:
          "Sistema inteligente de reset mental. Reduza vícios, recupere foco e reconstrua sua rotina com um plano feito sob medida pra você.",
      },
      { property: "og:title", content: "Lytra — Recupere o controle da sua mente" },
      {
        property: "og:description",
        content: "Plataforma premium de reset mental com IA. Plano personalizado, acompanhamento diário.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

// URLs do checkout Kiwify — configure VITE_KIWIFY_CHECKOUT_MONTHLY_URL e VITE_KIWIFY_CHECKOUT_QUARTERLY_URL
const KIWIFY_MONTHLY =
  (import.meta.env.VITE_KIWIFY_CHECKOUT_MONTHLY_URL as string | undefined) ?? "#precos";
const KIWIFY_QUARTERLY =
  (import.meta.env.VITE_KIWIFY_CHECKOUT_QUARTERLY_URL as string | undefined) ?? "#precos";

const steps = [
  { icon: Target, title: "Escolha seu hábito", desc: "O que você quer reduzir." },
  { icon: Sparkles, title: "Responda 1 minuto", desc: "A IA aprende seu contexto." },
  { icon: ListChecks, title: "Receba seu plano", desc: "Diário, personalizado, adaptativo." },
  { icon: Flame, title: "Acompanhe a evolução", desc: "Streak, níveis e clareza crescendo." },
];

const emotionalCards = [
  { icon: Smartphone, title: "Horas perdidas no celular", text: "Scroll que drena sua energia." },
  { icon: Zap, title: "Dopamina rápida", text: "Vídeos curtos que viciam o cérebro." },
  { icon: Brain, title: "Mente em neblina", text: "Difícil pensar com clareza." },
  { icon: Clock, title: "Procrastinação", text: "Tudo adiado. Culpa acumulada." },
];

const benefits = [
  { icon: Sparkles, title: "Plano sob medida", text: "Feito pros seus gatilhos." },
  { icon: Brain, title: "IA que entende você", text: "Adapta o caminho com você." },
  { icon: ListChecks, title: "Micro tarefas diárias", text: "Cabem no seu dia." },
  { icon: Flame, title: "Streak e níveis", text: "Dopamina positiva todo dia." },
  { icon: Shield, title: "Modo emergência", text: "Apoio em tempo real." },
  { icon: Leaf, title: "Clareza mental", text: "Menos ruído. Mais foco." },
];

const transformations = [
  {
    name: "Carolina M.",
    role: "Estudante",
    before: "8h por dia no celular",
    after: "2h, foco real nos estudos",
    days: 21,
  },
  {
    name: "Rafael S.",
    role: "Designer",
    before: "Sem constância em nada",
    after: "Rotina firme há 60 dias",
    days: 60,
  },
  {
    name: "Lucas P.",
    role: "Engenheiro",
    before: "Recaía toda semana",
    after: "47 dias limpo — recorde",
    days: 47,
  },
  {
    name: "Mariana R.",
    role: "Professora",
    before: "Procrastinava tudo",
    after: "Plano executado todo dia",
    days: 30,
  },
  {
    name: "André T.",
    role: "Médico residente",
    before: "Dormia às 3h em reels",
    after: "Sono regulado às 23h",
    days: 45,
  },
  {
    name: "Júlia V.",
    role: "Advogada",
    before: "Sem atenção pra ler",
    after: "Lê livros de novo",
    days: 60,
  },
];

const shortQuotes = [
  { name: "Beatriz L.", text: "A IA respondeu como se alguém realmente estivesse ali." },
  { name: "Pedro H.", text: "O streak vicia mais que o que eu tentava largar — no bom sentido." },
  { name: "Camila O.", text: "Voltei a estar presente com meus filhos. Eles notaram antes de mim." },
  { name: "Thiago A.", text: "Direta e estratégica. Nada de frasezinha cringe." },
];

const faqs = [
  { q: "Como funciono a Lytra?", a: "Você responde um quiz rápido, a IA cria seu plano, e todo dia recebe tarefas e reflexões que se adaptam ao seu progresso." },
  { q: "Substitui terapia?", a: "Não. É apoio comportamental e de rotina. Para quadros clínicos, procure um profissional." },
  { q: "Como recebo acesso depois de comprar?", a: "Acesso imediato. Após o pagamento, você recebe um email para criar sua senha e entrar." },
  { q: "Posso cancelar?", a: "Sim, sem burocracia, direto no seu painel." },
  { q: "Funciona no celular?", a: "Sim. Mobile-first, funciona como app no navegador." },
  { q: "Em quanto tempo vejo resultado?", a: "Maioria nota mudança em 7 a 14 dias. Reconstrução profunda entre 30 e 90 dias." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-24 md:grid-cols-2 md:items-center md:pt-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Sistema inteligente de reset mental
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
              Recupere o controle
              <br />
              <span className="bg-primary-gradient bg-clip-text text-transparent">da sua mente.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground text-balance">
              Plano diário, adaptativo, feito pra você reduzir vícios e reconstruir foco.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#precos"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-7 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
              >
                Adquirir agora
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Como funciona
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Garantia de 7 dias
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Cancele quando quiser
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 -z-10 bg-primary-soft/40 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster=""
                className="aspect-[4/3] w-full bg-primary-soft object-cover"
              >
                {/* TODO: substituir pelo vídeo final do hero (mp4) */}
                <source src="" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 grid place-items-center bg-primary-soft/40">
                <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-glow">
                    <Leaf className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    Vídeo da plataforma
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Como funciona</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Quatro passos. Mente mais clara.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOR */}
      <section className="relative overflow-hidden bg-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Você não está sozinho</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Sua atenção foi sequestrada.
            </h2>
            <p className="mt-5 text-base text-muted-foreground text-balance">
              A Lytra existe pra te devolver o que é seu.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {emotionalCards.map((c) => (
              <div key={c.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">O que você ganha</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Reconstrução. Do seu jeito.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-3xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-glow">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSFORMAÇÕES — antes/depois */}
      <section id="depoimentos" className="bg-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Transformações</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Antes e depois da Lytra.
            </h2>
            <div className="mt-4 flex items-center justify-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                4.9/5 — jornadas reais
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {transformations.map((t) => (
              <div
                key={t.name}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="grid grid-cols-2">
                  <div className="bg-muted p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Antes</p>
                    <p className="mt-2 text-sm font-medium text-foreground/80 line-through decoration-muted-foreground/40">
                      {t.before}
                    </p>
                  </div>
                  <div className="bg-primary-soft p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Depois</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{t.after}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">
                    <Flame className="h-3 w-3" />
                    {t.days} dias
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Citações curtas */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shortQuotes.map((q) => (
              <div key={q.name} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{q.text}"</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">— {q.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Comece hoje</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Escolha seu plano.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Menos que um delivery por mês. Acesso imediato após o pagamento.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <p className="text-sm font-medium text-muted-foreground">Mensal</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">R$19</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Cancele quando quiser.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Plataforma completa", "Plano diário com IA", "Diário emocional", "Modo emergência", "Suporte"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={KIWIFY_MONTHLY}
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card font-medium transition hover:bg-accent"
            >
              Adquirir mensal
            </a>
          </div>

          <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-glow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-gradient px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
              Mais escolhido
            </span>
            <p className="text-sm font-medium text-primary">Trimestral</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">R$39</span>
              <span className="text-sm text-muted-foreground">/trimestre</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Equivale a <span className="font-medium text-foreground">R$13/mês</span> — economia de 32%.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Tudo do mensal",
                "Plano adaptativo avançado",
                "Análise semanal com IA",
                "Prioridade no modo emergência",
                "Suporte humano",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={KIWIFY_QUARTERLY}
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary-gradient font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Começar jornada
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Garantia de 7 dias</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Cancele em 1 clique</span>
          <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-primary" /> Acesso imediato</span>
          <span className="flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-primary" /> Pagamento seguro</span>
        </div>
      </section>

      {/* FAQ */}
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

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-center shadow-card md:p-20">
          <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden />
          <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Sua próxima versão começa hoje.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-balance">
            Garantia de 7 dias. Acesso imediato. Cancele quando quiser.
          </p>
          <a
            href="#precos"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-8 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Começar jornada
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
