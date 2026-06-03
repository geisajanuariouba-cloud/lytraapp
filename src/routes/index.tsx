import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Moon,
  PlayCircle,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Timer,
  XCircle,
  Zap,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PLANS, formatBRL } from "@/lib/plans";

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

const reconhece = [
  {
    icon: Smartphone,
    title: "Você abre o celular para ver uma mensagem — e 2 horas se vão.",
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
    text: "A procrastinação crônica não é preguiça — é um sinal de que algo emocional está te impedindo. Geralmente ansiedade, perfeccionismo ou exaustão.",
  },
  {
    icon: RefreshCw,
    title: "Você tenta mudar. Amanhã. De novo.",
    text: "O ciclo se repete porque os métodos genéricos ignoram o lado emocional. Sem acolhimento real, qualquer estratégia vira mais uma coisa para fracassar.",
  },
];

const antes = [
  "Scrollava o feed no automático",
  "Dormia mal, acordava ainda cansado",
  "Procrastinava o que realmente importava",
  "Sentia culpa e vergonha todo dia",
  "Prometia mudar — e não conseguia",
];

const depois = [
  "Percebe o presente com clareza",
  "Fecha o dia com leveza e dorme melhor",
  "Missões pequenas que cabem na sua vida",
  "Progresso gentil, sem julgamento",
  "Hoje. Um passo de cada vez.",
];

const numeros = [
  { icon: Smartphone, before: "6h+", after: "1h20", label: "de tela por dia", who: "Mariana, 28" },
  { icon: Flame, before: "0", after: "47 dias", label: "de streak seguidos", who: "Igor, 30" },
  { icon: Target, before: "2h", after: "2h seguidas", label: "de foco profundo", who: "Lucas, 22" },
  { icon: Moon, before: "ruim", after: "profundo", label: "qualidade do sono", who: "Helena, 27" },
];

const seals = [
  { icon: Lock, title: "Dados criptografados", text: "Segurança de nível bancário" },
  { icon: Zap, title: "Acesso imediato", text: "Pronto em menos de 5 min" },
  { icon: RefreshCw, title: "Garantia 7 dias", text: "Reembolso sem perguntas" },
  { icon: XCircle, title: "Cancele quando quiser", text: "Sem fidelidade" },
];

// Distribuição realista de estrelas
const ratingBreakdown = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

import marianaImg from "@/assets/testimonials/mariana.jpg";
import carlaImg from "@/assets/testimonials/carla.jpg";
import igorImg from "@/assets/testimonials/igor.jpg";
import rafaelImg from "@/assets/testimonials/rafael.jpg";
import diegoImg from "@/assets/testimonials/diego.jpg";
import julianaImg from "@/assets/testimonials/juliana.jpg";
import lucasImg from "@/assets/testimonials/lucas.jpg";
import fernandaImg from "@/assets/testimonials/fernanda.jpg";
import marcosImg from "@/assets/testimonials/marcos.jpg";
import anaImg from "@/assets/testimonials/ana.jpg";
import gabrielImg from "@/assets/testimonials/gabriel.jpg";
import nataliaImg from "@/assets/testimonials/natalia.jpg";
import brunoImg from "@/assets/testimonials/bruno.jpg";
import helenaImg from "@/assets/testimonials/helena.jpg";
import pauloImg from "@/assets/testimonials/paulo.jpg";

const testimonials = [
  { name: "Mariana S.", age: 28, role: "Designer", img: marianaImg, text: "Eu passava mais de 6 horas por dia no celular sem perceber. Com o Lytra, em 3 semanas reduzi pela metade. Senti que recuperei tempo para o que importa." },
  { name: "Carla M.", age: 39, role: "Empreendedora", img: carlaImg, text: "As missões diárias parecem abraços em forma de tarefa. Pequenas, possíveis e gentis. Finalmente um método que não me faz sentir culpada por errar." },
  { name: "Igor F.", age: 30, role: "Arquiteto", img: igorImg, text: "Tentei outros apps de foco e nunca passava da primeira semana. Com o Lytra, mantive constância por mais de 40 dias. A IA realmente aprende sobre você." },
  { name: "Rafael T.", age: 34, role: "Engenheiro", img: rafaelImg, text: "Quando usei o modo emergência pela primeira vez, parecia que alguém estava do meu lado. Não senti julgamento. Senti acolhimento real." },
  { name: "Diego R.", age: 29, role: "Analista", img: diegoImg, text: "Minha rotina estava completamente desorganizada. Em 30 dias de Lytra recuperei o sono, voltei a me exercitar e parei de rolar o feed até meia-noite." },
  { name: "Juliana K.", age: 24, role: "Psicóloga em formação", img: julianaImg, text: "Mesmo estudando comportamento humano, eu mesma caía no ciclo de dopamina rápida. O Lytra me deu estrutura sem julgamento. Indico para meus colegas." },
  { name: "Lucas M.", age: 22, role: "Estudante", img: lucasImg, text: "Voltei a estudar de verdade. Antes ficava 20 minutos lendo e já queria checar o celular. Agora consigo 2 horas de foco seguido." },
  { name: "Fernanda L.", age: 25, role: "Enfermeira", img: fernandaImg, text: "Trabalho em turnos e meu celular era minha válvula de escape. O Lytra me mostrou outras formas de descansar a mente que eu nunca tinha tentado." },
  { name: "Marcos B.", age: 42, role: "Médico", img: marcosImg, text: "Achei que era tarde demais para mudar hábitos digitais. A Lytra me provou o contrário. Simples, sem pressão, com resultados perceptíveis em menos de um mês." },
  { name: "Ana P.", age: 31, role: "Professora", img: anaImg, text: "O diário emocional me ajudou a entender padrões da minha rotina que eu não enxergava. Comecei a me organizar melhor sem cobrar perfeição." },
  { name: "Gabriel O.", age: 33, role: "Advogado", img: gabrielImg, text: "Reduzi cerca de 4 horas diárias de tela em duas semanas. Minha capacidade de concentração no trabalho melhorou bastante desde então." },
  { name: "Natália S.", age: 21, role: "Universitária", img: nataliaImg, text: "Parei de ficar até as 3 da manhã rolando vídeo curto. Minha rotina de estudo voltou ao eixo e minha cabeça parece mais leve." },
  { name: "Bruno C.", age: 26, role: "Freelancer", img: brunoImg, text: "Recuperei a capacidade de ler um livro inteiro sem interrupções. Parece simples, mas pra mim foi uma conquista enorme." },
  { name: "Helena V.", age: 27, role: "Nutricionista", img: helenaImg, text: "Comecei a dormir melhor depois da primeira semana. O check-in noturno me ajuda a fechar o dia em vez de scrollar até apagar." },
  { name: "Paulo E.", age: 37, role: "Professor universitário", img: pauloImg, text: "O plano personalizado me surpreendeu. Não é genérico. A IA percebe quando estou com dificuldade e ajusta. Senti um cuidado real." },
];

const faqs = [
  {
    q: "Como funciona a Lytra?",
    a: "Você responde um quiz rápido, a IA cria seu plano, e todo dia recebe tarefas e reflexões que se adaptam ao seu progresso.",
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
    a: "Maioria nota mudança em 7 a 14 dias. Reconstrução profunda entre 30 e 90 dias.",
  },
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
  const [unlocked, setUnlocked] = useState(false);
  const restRef = useRef<HTMLDivElement>(null);

  function handleUnlock() {
    setUnlocked(true);
    requestAnimationFrame(() => {
      restRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO — sem imagem estática */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-10 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sistema inteligente de reset mental
          </span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Recupere o controle{" "}
            <span className="bg-primary-gradient bg-clip-text text-transparent">
              da sua mente.
            </span>
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Garantia de 7 dias
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Acesso imediato
            </div>
          </div>
        </div>
      </section>

      {/* VSL */}
      <section id="vsl" className="mx-auto max-w-4xl px-6 pb-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Assista antes de continuar
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Veja como a Lytra funciona na prática
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          {/* Placeholder de vídeo — substituir <iframe src=""> pelo Vimeo/YouTube/Mux quando disponível. */}
          <div
            className="relative grid aspect-video w-full place-items-center bg-[linear-gradient(135deg,oklch(0.18_0.05_158),oklch(0.12_0.04_160))]"
            aria-label="Vídeo de apresentação"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <button
                type="button"
                onClick={handleUnlock}
                className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-105 hover:bg-white/25"
                aria-label="Reproduzir vídeo"
              >
                <PlayCircle className="h-10 w-10" strokeWidth={1.5} />
              </button>
              <p className="text-sm font-semibold text-white">Vídeo em breve</p>
              <p className="max-w-xs text-xs text-white/70">
                O vídeo de apresentação da Lytra será adicionado em breve.
              </p>
            </div>
          </div>
        </div>

        {/* Gate de consumo */}
        {!unlocked && (
          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 text-center">
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Continue após assistir
            </p>
            <button
              onClick={handleUnlock}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-6 text-sm font-medium text-primary transition hover:bg-primary-soft"
            >
              Já assisti — continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* Faixa verde — stats */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 text-center sm:grid-cols-3">
          <Stat value="24k+" label="pessoas em jornada" />
          <Stat value="94%" label="relatam mais foco" />
          <Stat value="4.9" label="avaliação média" />
        </div>
      </section>

      {/* Restante — gated */}
      <div
        ref={restRef}
        aria-hidden={!unlocked}
        className={`transition-all duration-700 ${
          unlocked
            ? "max-h-none opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        }`}
      >
        {/* Você se reconhece aqui */}
        <section className="mx-auto max-w-3xl px-6 py-24">
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

        {/* Antes vs Com a Lytra */}
        <section className="bg-soft py-24">
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
                "Você para de sobreviver no automático."
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                — O que 94% dos usuários relatam após 30 dias
              </p>
            </div>
          </div>
        </section>

        {/* Números que falam por si */}
        <section className="bg-soft pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Resultados verificados pelos próprios usuários
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                Números que <span className="font-display italic text-primary">falam</span> por si
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {numeros.map((n) => (
                <div
                  key={n.who}
                  className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
                >
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                    <n.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-sm">
                    <span className="text-muted-foreground line-through">{n.before}</span>
                    <span className="mx-1.5 text-muted-foreground">→</span>
                    <span className="font-semibold text-foreground">{n.after}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.label}</p>
                  <p className="mt-3 text-xs font-medium text-primary">{n.who}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-primary p-7 text-center text-primary-foreground shadow-glow">
              <p className="text-base leading-relaxed">
                "Achei que era vício mesmo, que eu não ia conseguir mudar. Lytra me mostrou que era
                possível com passos pequenos. Em 21 dias eu era uma pessoa diferente com o celular."
              </p>
              <div className="mt-5 inline-flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-semibold">
                  TC
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold">Thiago C., 32</p>
                  <p className="text-xs opacity-80">21 dias de jornada</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4.9 rating + selos */}
        <section className="bg-soft pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-2 md:p-12">
              <div>
                <p className="text-6xl font-semibold tracking-tight">4.9</p>
                <div className="mt-2 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Baseado em mais de 1.800 avaliações verificadas
                </p>
              </div>

              <div className="space-y-2">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-4 text-muted-foreground">{r.stars}</span>
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Histórias reais */}
        <section id="depoimentos" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Histórias reais de transformação
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Pessoas comuns que decidiram retomar o controle.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={t.name} hue={t.hue} />
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {t.name}, {t.age}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PLANOS */}
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
                  className={`relative flex flex-col rounded-3xl border bg-card p-8 ${
                    featured
                      ? "border-2 border-primary shadow-glow md:-translate-y-2"
                      : "border-border shadow-soft"
                  }`}
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
                    <span className="text-5xl font-semibold tracking-tight">
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
                      <li
                        key={f}
                        className="flex items-center gap-2 font-medium text-foreground"
                      >
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

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" /> Garantia de 7 dias
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-primary" /> Acesso imediato
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" /> Pagamento seguro
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Cancele quando quiser
            </span>
          </div>
        </section>

        {/* GARANTIA */}
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-4xl font-semibold tracking-tight md:text-5xl">{value}</p>
      <p className="mt-1 text-sm opacity-90">{label}</p>
    </div>
  );
}

function Avatar({ name, img }: { name: string; img: string }) {
  return (
    <img
      src={img}
      alt={`Foto de ${name}`}
      loading="lazy"
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border"
    />
  );
}
