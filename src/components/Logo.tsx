interface LogoProps {
  className?: string;
  /** Altura total em px; o wordmark escala proporcionalmente. */
  height?: number;
}

/**
 * Logo oficial da Lytra — wordmark "lytra" em verde (sem ícone).
 *
 * Renderizado como texto vetorial na fonte display do projeto: alta qualidade
 * em qualquer tamanho, fundo 100% transparente (sem caixa) e sem depender de
 * arquivo de imagem externo, então nunca quebra.
 *
 * Para usar a arte PNG exata no lugar, troque o <span> abaixo por:
 *   <img src="/lytra-logo.png" alt="Lytra" style={{ height }} />
 * (use uma versão com fundo transparente).
 */
export function Logo({ className = "", height = 40 }: LogoProps) {
  const fontSize = Math.round(height * 0.72);

  return (
    <span
      className={`inline-flex select-none items-center ${className}`}
      style={{ height }}
      role="img"
      aria-label="Lytra"
    >
      <span
        className="font-display font-semibold lowercase tracking-tight text-primary"
        style={{ fontSize, lineHeight: 1 }}
      >
        lytra
      </span>
    </span>
  );
}
