/** Chigüiro / Capibara (Hydrochoerus hydrochaeris) — el más llanero de todos. */

interface ChiguiroProps {
  size?: number;
  floating?: boolean;
  animateEar?: boolean;
  className?: string;
}

export function Chiguiro({
  size = 110,
  floating = false,
  animateEar = false,
  className = "",
}: ChiguiroProps) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 110 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${floating ? "animate-float-side" : ""} ${className}`}
      role="img"
      aria-label="Chigüiro"
    >
      {/* Agua / reflejo sutil (en descanso) */}
      {floating && (
        <ellipse cx="55" cy="74" rx="48" ry="6" fill="#3D7AB5" opacity="0.18" />
      )}

      {/* Cuerpo — rectangular con bordes redondeados, muy característico */}
      <rect x="18" y="30" width="72" height="40" rx="20" fill="#8B6340" />
      <rect x="20" y="32" width="68" height="36" rx="18" fill="#9B7050" />

      {/* Línea dorsal más oscura */}
      <path d="M 22 34 Q 55 30 88 34" stroke="#6B4A28" strokeWidth="2" fill="none" />

      {/* Cabeza — grande y cuadrada, característica del chigüiro */}
      <rect x="68" y="18" width="36" height="34" rx="14" fill="#8B6340" />
      <rect x="70" y="20" width="33" height="30" rx="12" fill="#9B7050" />

      {/* Hocico plano y amplio */}
      <ellipse cx="100" cy="42" rx="10" ry="7" fill="#7A5530" />
      {/* Narinas */}
      <ellipse cx="97" cy="41" rx="2" ry="1.5" fill="#5A3A18" />
      <ellipse cx="103" cy="41" rx="2" ry="1.5" fill="#5A3A18" />

      {/* Ojo */}
      <ellipse cx="84" cy="28" rx="4" ry="4" fill="#3A2A14" />
      <ellipse cx="84" cy="28" rx="2.5" ry="2.5" fill="#1A1208" />
      <circle cx="83" cy="27" r="1" fill="white" opacity="0.7" />

      {/* Oreja derecha */}
      <g
        className={animateEar ? "animate-chiguiro-ear" : ""}
        style={{ transformOrigin: "84px 18px" }}
      >
        <ellipse cx="84" cy="15" rx="7" ry="6" fill="#8B6340" />
        <ellipse cx="84" cy="15" rx="4" ry="3.5" fill="#C8906A" />
      </g>

      {/* Patas — cortas y robustas */}
      <rect x="25" y="64" width="12" height="16" rx="6" fill="#7A5530" />
      <rect x="42" y="64" width="12" height="16" rx="6" fill="#7A5530" />
      <rect x="62" y="64" width="12" height="16" rx="6" fill="#7A5530" />
      <rect x="76" y="64" width="12" height="14" rx="6" fill="#7A5530" />

      {/* Pezuñas */}
      <rect x="25" y="76" width="12" height="4" rx="2" fill="#5A3A18" />
      <rect x="42" y="76" width="12" height="4" rx="2" fill="#5A3A18" />
      <rect x="62" y="76" width="12" height="4" rx="2" fill="#5A3A18" />

      {/* Pelaje textura sutil */}
      <path d="M 30 38 Q 34 35 38 38" stroke="#6B4A28" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 50 36 Q 54 33 58 36" stroke="#6B4A28" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 40 50 Q 44 47 48 50" stroke="#6B4A28" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}
