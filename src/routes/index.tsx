import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Target,
  XCircle,
  Zap,
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
          "Acompanhamento guiado para reduzir vícios, recuperar foco e reconstruir sua rotina, com um plano diário feito sob medida pra você.",
      },
      { property: "og:title", content: "Lytra · Recupere o controle da sua mente" },
      {
        property: "og:description",
        content: "Plano diário e personalizado, com passos simples e suporte humano para reconstruir sua rotina.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const reconhece = [
  {
    icon: Smartphone,
    title: "Você abre o celular para ver uma mensagem e 2 horas se vão.",
    text: "Não é falta de força de vontade. É como o cérebro foi condicionado a buscar recompensas rápidas, uma notificação de cada vez.",
  },
  {
    icon: Zap,
    title: "Você deita para dormir, mas sua mente não para de rodar.",
    text: "A fadiga existe. O descanso, não. O excesso de estímulos digitais mantém o sistema nervoso em estado de alerta constante.",
  },
  {
    icon: Clock,
    title: "Você começa uma tarefa importante e para no meio. Todo dia.",
    text: "A procrastinação crônica não é preguiça. É um sinal de que algo emocional está te impedindo. Geralmente ansiedade, perfeccionismo ou exaustão.",
  },
  {
    icon: RefreshCw,
    title: "Você tenta mudar. Amanhã. De novo.",
    text: "O ciclo se repete porque os métodos genéricos ignoram o lado emocional. Sem acolhimento real, qualquer estratégia vira mais uma coisa para fracassar.",
  },
];

const antes = [
  "Passava horas no feed sem perceber",
  "Dormia mal, acordava ainda cansado",
  "Procrastinava o que realmente importava",
  "Sentia culpa e vergonha todo dia",
  "Prometia mudar, e não conseguia",
];

const depois = [
  "Percebe o presente com clareza",
  "Fecha o dia com leveza e dorme melhor",
  "Missões pequenas que cabem na sua vida",
  "Progresso gentil, sem julgamento",
  "Hoje. Um passo de cada vez.",
];

const seals = [
  { icon: Lock, title: "Dados criptografados", text: "Segurança de nível bancário" },
  { icon: Zap, title: "Acesso imediato", text: "Pronto em menos de 5 min" },
  { icon: RefreshCw, title: "Garantia 7 dias", text: "Reembolso sem perguntas" },
  { icon: XCircle, title: "Cancele quando quiser", text: "Sem fidelidade" },
];

const faqs = [
  {
    q: "Como funciona a Lytra?",
    a: "Você responde um quiz rápido, recebe seu plano personalizado, e todo dia tem tarefas e reflexões que se adaptam ao seu progresso.",
  },
  {
    q: "Substitui terapia?",
    a: "Não. É apoio comportamental e de rotina. Para quadros clínicos, procure um profissional.",
  },
  {
    q: "Como recebo acesso depois de comprar?",
    a: "Acesso imediato. Após o pagamento, você recebe um email para criar sua senha e entrar.",
  },
  {
    q: "E se eu não gostar?",
    a: "Garantia de 7 dias. Devolvemos 100% do valor, sem perguntas.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. Mobile-first, funciona como app no navegador.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Muita gente percebe melhora em foco, presença e organização da rotina nas primeiras semanas. A evolução consistente vem com continuidade.",
  },
];

const trustItems = [
  "Garantia incondicional de 7 dias",
  "Pagamento 100% seguro",
  "Acesso imediato após a compra",
  "Suporte por e-mail",
  "Ambiente protegido",
  "Dados protegidos",
];

function useTodayLabel() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" });
    setLabel(fmt.format(new Date()));
  }, []);
  return label;
}

function Landing() {
  const todayLabel = useTodayLabel();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 pt-18 pb-10 text-center md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Acompanhamento guiado, dia após dia
          </span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Recupere o controle{" "}
            <span className="bg-primary-gradient bg-clip-text text-transparent">da sua mente.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
            Plano diário, adaptativo, feito pra você reduzir vícios e reconstruir foco.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#vsl"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-7 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Assistir e começar
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-foreground shadow-soft sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vsl" className="mx-auto max-w-4xl px-6 pb-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Apresentação
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Veja como a Lytra funciona na prática
          </h2>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-border bg-card shadow-card sm:max-w-[400px]">
          {/*
            Container de vídeo (proporção 9:16) pronto para receber o VSL.
            Para publicar, troque o bloco <div role="img"> abaixo por um <video> ou <iframe>
            mantendo a classe "aspect-[9/16] w-full", por exemplo:

            <video className="h-full w-full object-cover" controls playsInline poster="/vsl-poster.jpg">
              <source src="/vsl.mp4" type="video/mp4" />
            </video>

            ou um embed (YouTube / Vimeo / Mux) com a mesma proporção.
          */}
          <div
            className="relative grid aspect-[9/16] w-full place-items-center bg-[linear-gradient(135deg,oklch(0.18_0.05_158),oklch(0.12_0.04_160))]"
            role="img"
            aria-label="Prévia do vídeo de apresentação da Lytra"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_45%,rgba(255,255,255,0.14),transparent)]"
              aria-hidden
            />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
              <PlayCircle className="h-9 w-9" strokeWidth={1.5} />
            </span>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-sm text-center text-xs text-muted-foreground">
          Conheça a Lytra e escolha o plano ideal para a sua jornada.
        </p>
      </section>

      <div>
        <section id="como-funciona" className="mx-auto max-w-3xl px-6 py-24">
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

        <section id="recursos" className="bg-soft py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                A virada real
              </p>
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

            <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <p className="font-display text-xl italic text-foreground">
                "Você volta a viver com presença."
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                A proposta da Lytra para os seus próximos 30 dias.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-soft pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {seals.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft"
                >
                  <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Feita para o dia a dia
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Um acompanhamento que cabe na sua rotina
            </h2>
            <p className="mt-4 text-base text-muted-foreground text-balance">
              Sem fórmulas mágicas e sem promessas. Apenas passos simples, todos os dias, com
              orientação cuidadosa e suporte humano.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
                <Target className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold">Plano diário</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Passos curtos e possíveis, pensados para o seu momento.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
                <RefreshCw className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold">Jornada personalizada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A rotina se adapta a você conforme avança, sem julgamento.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold">Suporte humano</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Gente de verdade para te ajudar quando você precisar.
              </p>
            </div>
          </div>
        </section>

        <section id="precos" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Comece hoje
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Escolha seu plano.
            </h2>
            {todayLabel && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/40 px-4 py-1.5 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Condição promocional disponível hoje, {todayLabel}.
              </p>
            )}
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {(["monthly", "quarterly", "lifetime"] as const).map((key) => {
              const plan = PLANS[key];
              const featured = key === "quarterly";
              const economy = Math.round(((plan.oldPrice - plan.price) / plan.oldPrice) * 100);
              return (
                <div
                  key={key}
                  className={`relative flex flex-col rounded-3xl border bg-card p-6 sm:p-8 ${featured ? "border-2 border-primary shadow-glow md:-translate-y-2" : "border-border shadow-soft"}`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-gradient px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
                      {plan.badge}
                    </span>
                  )}
                  <p className="text-sm font-medium text-muted-foreground">{plan.label}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatBRL(plan.oldPrice)}
                    </span>
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                      -{economy}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                      {formatBRL(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.perMonthHint && (
                    <p className="mt-1 text-xs text-muted-foreground">{plan.perMonthHint}</p>
                  )}

                  <ul className="mt-6 space-y-2.5 text-sm">
                    {plan.highlights.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                    {plan.extra?.map((f) => (
                      <li key={f} className="flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full font-medium transition ${featured ? "bg-primary-gradient text-primary-foreground shadow-glow hover:opacity-95" : "border border-border bg-card hover:bg-accent"}`}
                  >
                    Adquirir agora
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-10 text-center shadow-card md:p-14">
            <div className="absolute inset-0 -z-10 bg-hero-glow opacity-60" aria-hidden />
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-gradient text-primary-foreground shadow-glow">
              <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
            </span>
            <p className="mt-5 text-xs font-medium uppercase tracking-widest text-primary">
              Garantia incondicional
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              7 dias para sentir a Lytra por dentro.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
              Experimente a Lytra por 7 dias. Se não fizer sentido para você, devolvemos 100% do
              valor. Sem burocracia.
            </p>
          </div>
        </section>

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

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-center shadow-card md:p-20">
            <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden />
            <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Sua próxima versão começa hoje.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-balance">
              Garantia de 7 dias. Acesso imediato. Suporte humano.
            </p>
            <a
              href="#precos"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-8 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Adquirir agora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
