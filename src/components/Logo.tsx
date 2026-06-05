import logoAsset from "@/assets/lytra-logo.png.asset.json";

interface LogoProps {
  className?: string;
  /** Altura em px; largura é proporcional. */
  height?: number;
}

/**
 * Logo oficial da Lytra. Usa o asset CDN.
 * O wordmark já contém o ícone da folha — não combinar com Leaf.
 */
export function Logo({ className = "", height = 40 }: LogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt="Lytra"
      height={height}
      style={{ height, width: "auto" }}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
