import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="border-b border-primary/20 bg-primary-gradient text-primary-foreground shadow-soft">
        <div className="mx-auto flex min-h-10 max-w-6xl items-center justify-center px-4 py-2 text-center text-[11px] font-semibold tracking-[0.08em] sm:text-xs">
          🔥 DESCONTO LIBERADO HOJE • GARANTIA DE 7 DIAS • ACESSO IMEDIATO
        </div>
      </div>

      <header className="border-b border-border/60 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Link to="/" aria-label="Lytra — início" className="shrink-0">
            <Logo height={56} className="max-w-[150px] sm:max-w-none" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-full px-2.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground sm:h-10 sm:px-4 sm:text-sm"
            >
              Entrar
            </Link>
            <a
              href="#precos"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary-gradient px-3 text-[11px] font-medium text-primary-foreground shadow-glow transition hover:opacity-95 sm:h-10 sm:px-5 sm:text-sm"
            >
              Adquirir agora
            </a>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:bg-accent md:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border/60 bg-background/96 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden">
            <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-3 shadow-card">
              <nav className="grid gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  Entrar
                </Link>
                <a
                  href="#precos"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-primary-gradient px-5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
                >
                  Adquirir agora
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
