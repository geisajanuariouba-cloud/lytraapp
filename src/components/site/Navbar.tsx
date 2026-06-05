import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="Lytra — início">
          <Logo height={40} />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition hover:text-foreground">Como funciona</a>
          <a href="#beneficios" className="transition hover:text-foreground">Benefícios</a>
          <a href="#depoimentos" className="transition hover:text-foreground">Depoimentos</a>
          <a href="#precos" className="transition hover:text-foreground">Planos</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/login"
            className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:h-10 sm:px-4 sm:text-sm"
          >
            Entrar
          </Link>
          <a
            href="#precos"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary-gradient px-3.5 text-xs font-medium text-primary-foreground shadow-glow transition hover:opacity-95 sm:h-10 sm:px-5 sm:text-sm"
          >
            Adquirir agora
          </a>
        </div>
      </div>
    </header>
  );
}
