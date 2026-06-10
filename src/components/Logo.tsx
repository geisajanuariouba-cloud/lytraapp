interface LogoProps {
  className?: string;
  /** Altura total em px; o wordmark escala proporcionalmente. */
  height?: number;
}

/**
 * Logo oficial da Lytra — wordmark "lytra" na fonte display da marca (DM Serif Display).
 *
 * Usa a mesma fonte serif carregada para os headings, que replica o caráter
 * da logo original (serifa de alto contraste, curvas orgânicas).
 * Fundo 100% transparente, sem arquivo externo — nunca quebra.
 *
 * Para substituir pela arte PNG exata (com fundo transparente):
 *   <img src="/lytra-logo.png" alt="Lytra" style={{ height }} />
 */
export function Logo({ className = "", height = 40 }: LogoProps) {
  const fontSize = Math.round(height * 0.78);

  return (
    <span
      className={`inline-flex select-none items-center ${className}`}
      style={{ height }}
      role="img"
      aria-label="Lytra"
    >
      <span
        style={{
          fontFamily: '"DM Serif Display", "Georgia", serif',
          fontSize,
          lineHeight: 1,
          color: "var(--primary)",
          fontWeight: 400,           // DM Serif Display tem só regular — não use bold
          letterSpacing: "-0.01em",  // igual ao tracking das logos serif premium
        }}
      >
        lytra
      </span>
    </span>
  );
}
