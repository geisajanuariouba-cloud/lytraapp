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
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Link to="/" aria-label="Lytra — início" className="shrink-0">
            <Logo height={60} className="max-w-[150px] sm:max-w-none" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-500 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-gray-900">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:h-10 sm:px-4 sm:text-sm"
            >
              Entrar
            </Link>
            <a
              href="#precos"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-black px-4 text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:h-10 sm:px-5 sm:text-sm"
            >
              Adquirir agora
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
