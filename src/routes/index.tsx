import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  ChartLine,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  HeartHandshake,
  Leaf,
  ListChecks,
  MessageCircleHeart,
  Moon,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Timer,
  Wind,
  Zap,
} from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lytra — Recupere o controle da sua mente" },
      {
        name: "description",
        content:
          "A Lytra cria um plano inteligente e personalizado para reduzir vícios, recuperar foco e reconstruir sua rotina dia após dia.",
      },
      { property: "og:title", content: "Lytra — Recupere o controle da sua mente" },
      {
        property: "og:description",
        content:
          "Plataforma de reset mental com IA. Reduza vícios, recupere foco e reconstrua sua rotina.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Target, title: "Escolha seu hábito", desc: "Selecione o vício ou hábito que deseja reduzir." },
  { icon: MessageCircleHeart, title: "Responda 1 minuto", desc: "Algumas perguntas rápidas para entender você de verdade." },
  { icon: Sparkles, title: "IA cria seu plano", desc: "Um plano diário, personalizado e adaptativo é gerado para você." },
  { icon: ChartLine, title: "Acompanhe a evolução", desc: "Veja seu progresso, recaídas e clareza mental crescerem." },
];

const emotionalCards = [
  { icon: Smartphone, title: "Excesso de celular", text: "Horas perdidas em scroll infinito que drenam sua energia." },
  { icon: Zap, title: "Dopamina rápida", text: "Vídeos curtos, notificações, recompensas instantâneas que viciam o cérebro." },
  { icon: Brain, title: "Mente cansada", text: "Sensação de neblina mental, dificuldade de pensar com clareza." },
  { icon: Clock, title: "Procrastinação", text: "Tarefas importantes sempre adiadas. Culpa que se acumula." },
  { icon: Wind, title: "Ansiedade digital", text: "Inquietação constante mesmo sem motivo aparente." },
  { icon: Compass, title: "Falta de controle", text: "Vontade de mudar, mas sem saber por onde começar." },
];

const benefits = [
  { icon: Sparkles, title: "Rotina personalizada", text: "Um plano feito sob medida para sua realidade e seus gatilhos." },
  { icon: Brain, title: "Acompanhamento inteligente", text: "Uma IA que entende seu contexto e adapta o caminho com você." },
  { icon: ListChecks, title: "Tarefas diárias simples", text: "Pequenas ações que cabem no seu dia e geram grandes resultados." },
  { icon: ChartLine, title: "Progresso visual", text: "Gráficos suaves, streak, níveis. Dopamina positiva todos os dias." },
  { icon: HeartHandshake, title: "Redução de recaídas", text: "Modo emergência inteligente para os momentos difíceis." },
  { icon: Leaf, title: "Clareza mental", text: "Menos ruído, mais foco, mais paz dentro da sua cabeça." },
  { icon: CalendarCheck, title: "Reconstrução de hábitos", text: "Um sistema vivo que adapta intensidade conforme você evolui." },
  { icon: Flame, title: "Recuperação de foco", text: "Volte a estudar, trabalhar e viver com presença real." },
  { icon: Target, title: "Sistema adaptativo", text: "Quanto mais você usa, mais a Lytra entende como te ajudar." },
];

const testimonials = [
  { name: "Carolina M.", role: "Estudante de Medicina", text: "Eu passava 8h por dia no celular. Em 3 semanas com a Lytra desci pra 2h e voltei a estudar com foco real. Não acredito que era esse o problema todo esse tempo." },
  { name: "Rafael S.", role: "Designer", text: "Tentei mil apps de hábito. Nenhum entendia que eu não conseguia manter constância. A Lytra ajusta a dificuldade comigo, sem julgamento. Mudou meu ano." },
  { name: "Beatriz L.", role: "Empreendedora", text: "A parte do diário emocional me pegou. A IA respondeu de um jeito que parecia que alguém realmente estava ali. Chorei na primeira semana." },
  { name: "Lucas P.", role: "Engenheiro", text: "Lutei contra pornografia por 6 anos. Em 47 dias na Lytra é o maior tempo limpo da minha vida adulta. O botão de emergência salvou minha sequência umas 20 vezes." },
  { name: "Mariana R.", role: "Professora", text: "Procrastinação crônica. A Lytra me ensinou que não é preguiça, é dopamina desregulada. As micro tarefas mudaram tudo." },
  { name: "André T.", role: "Médico residente", text: "Dormia às 3h vendo reels. Hoje durmo 23h sem celular no quarto. Acordo outra pessoa." },
  { name: "Júlia V.", role: "Advogada", text: "Eu achava que era TDAH. Na verdade era TikTok destruindo minha capacidade de atenção. 2 meses depois leio livros de novo." },
  { name: "Pedro H.", role: "Universitário", text: "O streak vicia mais do que o que eu estava tentando largar. Mas no bom sentido. Hoje tô em 89 dias." },
  { name: "Camila O.", role: "Mãe e arquiteta", text: "Voltei a estar presente com meus filhos. Eles notaram antes de mim. Isso vale qualquer preço." },
  { name: "Thiago A.", role: "Vendedor", text: "Achei que seria mais um app motivacional cringe. É exatamente o oposto. A IA é direta e estratégica, não fica enchendo de frasezinha." },
  { name: "Fernanda C.", role: "Nutricionista", text: "Recaí no dia 31. A Lytra não me julgou, refez meu plano e me mostrou o padrão. Voltei mais forte." },
  { name: "Gustavo B.", role: "Programador", text: "O modo foco com a respiração guiada é absurdo. Uso todo dia antes de codar. Minha produtividade dobrou." },
  { name: "Larissa F.", role: "Psicóloga", text: "Como profissional da área, posso dizer: a Lytra não substitui terapia, mas é o melhor complemento que já vi. Indico pros meus pacientes." },
  { name: "Bruno N.", role: "Personal trainer", text: "Foco recuperado, sono regulado, treinos melhores. Tudo conectado. A clareza mental veio junto." },
  { name: "Isabela Q.", role: "Jornalista", text: "Em 60 dias minha ansiedade caiu pela metade. Sem remédio. Só rotina e a IA me cobrando de um jeito acolhedor." },
];

const faqs = [
  { q: "Como funciona a Lytra?", a: "Você responde um onboarding rápido, a IA cria um plano personalizado, e todos os dias você recebe pequenas tarefas, reflexões e acompanhamento que se adaptam ao seu progresso." },
  { q: "Isso substitui terapia ou tratamento médico?", a: "Não. A Lytra é uma ferramenta de apoio comportamental e organização de rotina. Para quadros clínicos, sempre busque um profissional de saúde." },
  { q: "A IA realmente personaliza tudo?", a: "Sim. Cada plano é construído a partir das suas respostas, gatilhos, horários e evolução. Quanto mais você usa, mais inteligente fica." },
  { q: "Como recebo acesso depois de comprar?", a: "Acesso imediato. Logo após o pagamento você recebe um email para criar sua senha e entrar na plataforma." },
  { q: "Posso cancelar quando quiser?", a: "Sim, sem burocracia. Cancelamento simples direto pelo seu painel. E ainda temos garantia de 7 dias." },
  { q: "Funciona no celular?", a: "Sim. A Lytra é mobile-first e funciona perfeitamente no navegador do seu celular como um app." },
  { q: "Quanto tempo até ver resultado?", a: "A maioria dos usuários relata mudanças nítidas em 7 a 14 dias. Reconstrução profunda acontece entre 30 e 90 dias." },
  { q: "O plano muda conforme meu progresso?", a: "Sim. A IA ajusta intensidade, tarefas e estratégias com base nas suas recaídas, sequências e check-ins emocionais." },
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
            <p className="mt-6 max-w-lg text-lg text-muted-foreground text-balance">
              A Lytra cria um plano inteligente e personalizado para ajudar você a reduzir vícios,
              recuperar foco e reconstruir sua rotina dia após dia.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                search={{ mode: "signup" }}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-7 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
              >
                Criar conta grátis
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Ver como funciona
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
            <img
              src={heroMockup}
              alt="Plataforma Lytra"
              width={1280}
              height={960}
              className="relative animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Como funciona</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Quatro passos para uma mente mais clara.
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

      {/* SEÇÃO EMOCIONAL */}
      <section className="relative overflow-hidden bg-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Você não está sozinho</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Sua mente foi sequestrada.
              <br />
              E quase ninguém percebeu.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-balance">
              Vivemos numa economia da atenção. Cada notificação, cada scroll, cada vídeo curto rouba um
              pedaço da sua clareza. A Lytra existe para te devolver o que é seu.
            </p>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {emotionalCards.map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card"
              >
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
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Benefícios</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Tudo que você precisa para reconstruir do zero.
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="bg-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Histórias reais</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Pessoas reconstruindo a própria mente.
            </h2>
            <div className="mt-4 flex items-center justify-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                4.9/5 — milhares de jornadas em andamento
              </span>
            </div>
          </div>

          <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Comece hoje</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Um investimento na sua própria mente.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Menos do que um delivery por mês. Mais valioso do que quase tudo.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <p className="text-sm font-medium text-muted-foreground">Mensal</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">R$19</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Flexibilidade total, cancele quando quiser.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Acesso completo à plataforma", "Plano diário com IA", "Diário emocional", "Modo emergência", "Suporte por email"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://lytra.shop"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card font-medium transition hover:bg-accent"
            >
              Assinar mensal
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
              Equivalente a <span className="font-medium text-foreground">R$13/mês</span> — economia de 32%.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Tudo do plano mensal",
                "Planos adaptativos avançados",
                "Análises semanais com IA",
                "Prioridade no modo emergência",
                "Suporte humano dedicado",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://lytra.shop"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary-gradient font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Começar meu reset
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Garantia incondicional de 7 dias</span>
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
            7 dias de garantia. Acesso imediato. Cancele quando quiser. Você não tem nada a perder
            além do que já está perdendo.
          </p>
          <Link
            to="/login"
            search={{ mode: "signup" }}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-gradient px-8 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Criar conta grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      </section>

      <Footer />
    </div>
  );
}
