import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
            <Leaf className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight">Lytra</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition hover:text-foreground">Como funciona</a>
          <a href="#beneficios" className="transition hover:text-foreground">Benefícios</a>
          <a href="#depoimentos" className="transition hover:text-foreground">Depoimentos</a>
          <a href="#precos" className="transition hover:text-foreground">Preços</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            to="/login"
            search={{ mode: "signup" }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Criar conta grátis
          </Link>
        </div>

      </div>
    </header>
  );
}
