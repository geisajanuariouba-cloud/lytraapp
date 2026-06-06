import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Logo height={44} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Reconstrua sua mente, sua rotina e seu foco, um dia de cada vez.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Plataforma</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#como-funciona" className="hover:text-foreground">Como funciona</a></li>
            <li><a href="#recursos" className="hover:text-foreground">Recursos</a></li>
            <li><a href="#depoimentos" className="hover:text-foreground">Depoimentos</a></li>
            <li><a href="#precos" className="hover:text-foreground">Preços</a></li>
            <li><a href="#faq" className="hover:text-foreground">Perguntas frequentes</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/termos" className="hover:text-foreground">Termos de Uso</Link></li>
            <li><Link to="/privacidade" className="hover:text-foreground">Política de Privacidade</Link></li>
            <li><Link to="/reembolso" className="hover:text-foreground">Política de Reembolso</Link></li>
            <li><Link to="/seguranca" className="hover:text-foreground">Segurança</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contato</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="mailto:suporte.lytra@gmail.com" className="hover:text-foreground">
                suporte.lytra@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Lytra. Todos os direitos reservados.</p>
          <p className="max-w-xl text-balance">
            A Lytra é uma ferramenta de apoio comportamental. Não substitui acompanhamento médico,
            psicológico ou psiquiátrico.
          </p>
        </div>
      </div>
    </footer>
  );
}
