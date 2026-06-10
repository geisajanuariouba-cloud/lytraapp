import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full">
      <header
        className="border-b backdrop-blur-xl"
        style={{
          borderColor: "oklch(0.52 0.13 158 / 0.08)",
          background: "oklch(1 0 0 / 0.92)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          {/* logo */}
          <Link to="/" aria-label="Lytra — início" className="shrink-0">
            <Logo height={52} className="max-w-[130px] sm:max-w-none" />
          </Link>

          {/* nav desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "oklch(0.48 0.02 160)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--primary)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "oklch(0.48 0.02 160)")}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-medium transition-colors sm:h-10 sm:px-5 sm:text-sm"
              style={{ color: "oklch(0.48 0.02 160)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "oklch(0.48 0.02 160)")
              }
            >
              Entrar
            </Link>

            {/* botão principal: verde, elegante, sem aparência SaaS */}
            <a
              href="#precos"
              className="inline-flex h-9 items-center justify-center rounded-full px-5 text-xs font-semibold transition-all sm:h-10 sm:px-6 sm:text-sm"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Começar jornada
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
