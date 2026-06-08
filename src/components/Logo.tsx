import { useId } from "react";

interface LogoProps {
  className?: string;
  /** Altura total em px; a folha e o texto escalam proporcionalmente. */
  height?: number;
}

/**
 * Logo oficial da Lytra — wordmark vetorial (folha em gradiente verde + "lytra").
 *
 * Recriado em SVG inline: alta qualidade em qualquer tamanho, fundo 100%
 * transparente (sem caixa branca) e sem depender de nenhum arquivo de imagem
 * externo, então nunca quebra (local, produção, etc.).
 */
export function Logo({ className = "", height = 40 }: LogoProps) {
  const gradId = useId();
  const leaf = Math.round(height * 0.82);
  const fontSize = Math.round(height * 0.62);
  const gap = Math.max(4, Math.round(height * 0.12));

  return (
    <span
      className={`inline-flex select-none items-center ${className}`}
      style={{ height, gap }}
      role="img"
      aria-label="Lytra"
    >
      <svg
        width={leaf}
        height={leaf}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="19" y1="4.5" x2="5" y2="19.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6EE7A8" />
            <stop offset="1" stopColor="#12A36A" />
          </linearGradient>
        </defs>
        {/* corpo da folha (diagonal: base inferior-esquerda, ponta superior-direita) */}
        <path
          d="M4.6 19.4 C 4.6 10.4 10.4 4.6 19.4 4.6 C 19.4 13.6 13.6 19.4 4.6 19.4 Z"
          fill={`url(#${gradId})`}
        />
        {/* nervura central */}
        <path
          d="M7 17 C 10.5 13.2 13.2 10.5 17 7"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        className="font-display font-semibold lowercase tracking-tight text-foreground"
        style={{ fontSize, lineHeight: 1 }}
      >
        lytra
      </span>
    </span>
  );
}
