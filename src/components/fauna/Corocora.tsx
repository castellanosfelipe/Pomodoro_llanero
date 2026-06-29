/** Corocora / Ibis escarlata (Eudocimus ruber) — el rojo del ocaso llanero. */

interface CороcoraProps {
  size?: number;
  /** Cruzar en bandada de izquierda a derecha */
  crossing?: boolean;
  className?: string;
}

export function Corocora({
  size = 90,
  crossing = false,
  className = "",
}: CороcoraProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 90 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${crossing ? "animate-corocora-cross" : ""} ${className}`}
      role="img"
      aria-label="Corocora"
    >
      {/* Ala izquierda (trasera) */}
      <path
        d="M 45 32 Q 10 20 4 8 Q 8 6 16 12 Q 24 18 32 22 Q 40 26 45 32 Z"
        fill="#A03010"
      />

      {/* Cuerpo principal */}
      <ellipse cx="52" cy="32" rx="18" ry="12" fill="#C1440E" />
      <ellipse cx="52" cy="30" rx="16" ry="10" fill="#D45018" />

      {/* Ala derecha (delantera, extendida) */}
      <path
        d="M 45 28 Q 62 14 78 6 Q 80 8 76 12 Q 68 18 58 24 Q 52 28 48 30 Z"
        fill="#C1440E"
      />
      <path
        d="M 48 28 Q 64 16 80 8 Q 80 10 76 14 Q 66 20 56 26 Q 52 28 49 30 Z"
        fill="#D45018"
      />
      {/* Puntas negras en alas */}
      <path d="M 72 7 Q 76 6 80 6 Q 80 8 76 12 Z" fill="#1A1A1A" />
      <path d="M 4 8 Q 6 6 10 6 Q 8 10 6 12 Z" fill="#1A1A1A" />

      {/* Cabeza */}
      <ellipse cx="66" cy="26" rx="9" ry="8" fill="#C1440E" />

      {/* Pico largo y curvado hacia abajo */}
      <path d="M 73 25 Q 86 28 88 36 Q 86 37 84 34 Q 80 30 72 28 Z"
        fill="#E8822A" />
      <path d="M 73 26 Q 84 30 86 37" stroke="#C86820" strokeWidth="1" fill="none" />

      {/* Ojo */}
      <circle cx="69" cy="22" r="3" fill="#E8C030" />
      <circle cx="69" cy="22" r="1.5" fill="#1A1A1A" />
      <circle cx="68" cy="21" r="0.8" fill="white" opacity="0.6" />

      {/* Cola */}
      <path d="M 36 38 Q 28 44 24 50 Q 26 52 30 48 Q 36 42 40 38 Z" fill="#A03010" />
      <path d="M 40 38 Q 34 46 32 52 Q 34 53 38 48 Q 42 42 44 38 Z" fill="#B03818" />
    </svg>
  );
}

/** Bandada de corocoras para la transición del ocaso */
export function BandadaCorocoras({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute left-0 top-[45%] flex gap-8 ${className}`}
      style={{ animation: "corocora-cross 3.2s ease-in-out forwards" }}
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={28 - i * 2}
          height={20 - i}
          viewBox="0 0 28 20"
          fill="none"
          style={{ marginTop: `${i % 2 === 0 ? 0 : -8}px`, opacity: 0.9 - i * 0.1 }}
        >
          {/* Silueta de vuelo simplificada */}
          <path d="M 14 10 Q 4 6 0 2 Q 2 1 6 4 Q 10 7 14 10 Z" fill="#C1440E" />
          <path d="M 14 10 Q 24 6 28 2 Q 26 1 22 4 Q 18 7 14 10 Z" fill="#C1440E" />
          <ellipse cx="14" cy="10" rx="5" ry="3.5" fill="#D45018" />
        </svg>
      ))}
    </div>
  );
}
