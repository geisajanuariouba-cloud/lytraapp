import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Logo height={44} />
          <p className="mt-4 max-w-xs text-sm text-gray-500">
            Reconstrua sua mente, sua rotina e seu foco, um dia de cada vez.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Plataforma</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>
              <a href="#como-funciona" className="hover:text-gray-900 transition-colors">
                Como funciona
              </a>
            </li>
            <li>
              <a href="#recursos" className="hover:text-gray-900 transition-colors">
                Recursos
              </a>
            </li>
            <li>
              <a href="#precos" className="hover:text-gray-900 transition-colors">
                Preços
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-gray-900 transition-colors">
                Perguntas frequentes
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>
              <Link to="/termos" className="hover:text-gray-900 transition-colors">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="hover:text-gray-900 transition-colors">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to="/reembolso" className="hover:text-gray-900 transition-colors">
                Política de Reembolso
              </Link>
            </li>
            <li>
              <Link to="/seguranca" className="hover:text-gray-900 transition-colors">
                Segurança
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Contato</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>
              <a href="mailto:suporte.lytra@gmail.com" className="hover:text-gray-900 transition-colors">
                suporte.lytra@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-gray-500 md:flex-row md:items-center">
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
