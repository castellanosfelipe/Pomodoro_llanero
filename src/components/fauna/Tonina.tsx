/** Tonina / Delfín rosado de río (Inia geoffrensis) — aparición especial. */

interface ToninaProps {
  size?: number;
  leaping?: boolean;
  className?: string;
}

export function Tonina({
  size = 100,
  leaping = false,
  className = "",
}: ToninaProps) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${leaping ? "animate-tonina-leap" : ""} ${className}`}
      role="img"
      aria-label="Tonina"
    >
      {/* Ondas de agua debajo */}
      {!leaping && (
        <>
          <path d="M 10 68 Q 30 62 50 68 Q 70 74 90 68" stroke="#3D7AB5" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M 5 72 Q 25 66 50 72 Q 75 78 95 72" stroke="#3D7AB5" strokeWidth="1.5" fill="none" opacity="0.3" />
        </>
      )}

      {/* Aleta caudal */}
      <path
        d="M 14 44 Q 6 36 4 28 Q 8 26 12 32 Q 14 38 16 42 Z"
        fill="#C8889A"
      />
      <path
        d="M 14 44 Q 8 50 6 58 Q 10 60 14 54 Q 16 48 16 44 Z"
        fill="#C8889A"
      />

      {/* Cuerpo principal — el delfín rosado es más "gordo" que el marino */}
      <path
        d="M 18 44 Q 22 30 40 26 Q 60 22 76 28 Q 90 34 94 42 Q 90 50 76 54 Q 60 58 40 56 Q 22 54 18 44 Z"
        fill="#D898AA"
      />
      <path
        d="M 22 44 Q 26 34 44 30 Q 62 26 76 32 Q 88 38 88 44 Q 86 50 74 52 Q 58 56 42 54 Q 26 52 22 44 Z"
        fill="#E8A8BA"
      />

      {/* Aleta dorsal — el boto tiene una cresta dorsal baja, no aleta puntiaguda */}
      <path d="M 58 28 Q 60 18 64 16 Q 68 18 68 26" fill="#C8889A" />

      {/* Aleta pectoral izquierda */}
      <path
        d="M 40 54 Q 30 60 28 68 Q 32 70 38 62 Q 42 56 44 54 Z"
        fill="#C8889A"
      />

      {/* Cabeza — el boto tiene un melon frontal más pronunciado */}
      <ellipse cx="88" cy="42" rx="14" ry="12" fill="#E8A8BA" />
      <ellipse cx="92" cy="42" rx="10" ry="9" fill="#EEB8C8" />

      {/* Rostro largo (beak) */}
      <path d="M 96 40 L 116 36 L 116 44 Q 106 46 96 44 Z" fill="#D898AA" />
      <path d="M 96 40 L 116 36 L 116 38 Z" fill="#C8889A" />

      {/* Ojo pequeño y brillante */}
      <circle cx="91" cy="36" r="3" fill="#2A1808" />
      <circle cx="90" cy="35" r="1" fill="white" opacity="0.8" />

      {/* Color rosado característico del boto — manchas más saturadas */}
      <ellipse cx="70" cy="38" rx="12" ry="6" fill="#F0B8CA" opacity="0.5" />
    </svg>
  );
}
