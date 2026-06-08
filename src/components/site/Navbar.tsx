import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="border-b border-border/60 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Link to="/" aria-label="Lytra — início" className="shrink-0">
            <Logo height={60} className="max-w-[150px] sm:max-w-none" />
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
              className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:h-10 sm:px-4 sm:text-sm"
            >
              Entrar
            </Link>
            <a
              href="#precos"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary-gradient px-4 text-xs font-medium text-primary-foreground shadow-glow transition hover:opacity-95 sm:h-10 sm:px-5 sm:text-sm"
            >
              Adquirir agora
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
