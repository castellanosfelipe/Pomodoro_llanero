/** Palma llanera (Copernicia tectorum) — el ícono del horizonte plano. */

interface PalmaProps {
  height?: number;
  color?: string;
  className?: string;
}

export function PalmaLlanera({
  height = 80,
  color = "currentColor",
  className = "",
}: PalmaProps) {
  const w = height * 0.6;

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 48 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Tronco recto — la palma llanera es notable por su tronco esbelto */}
      <rect x="22" y="30" width="4" height="50" rx="2" fill={color} opacity="0.85" />
      {/* Anillos del tronco */}
      {[38, 46, 54, 62].map((y) => (
        <line key={y} x1="22" y1={y} x2="26" y2={y} stroke={color} strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Corona de hojas — frondas pinnadas */}
      {/* Hoja central */}
      <path d="M 24 32 Q 24 16 24 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Hojas laterales */}
      <path d="M 24 20 Q 10 14 2 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M 24 20 Q 38 14 46 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M 24 16 Q 8 8 0 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M 24 16 Q 40 8 48 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M 24 24 Q 12 20 4 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 24 24 Q 36 20 44 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Hojas caídas */}
      <path d="M 24 18 Q 14 24 8 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 24 18 Q 34 24 40 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Frutos pequeños en la base de la corona */}
      <circle cx="20" cy="28" r="2" fill={color} opacity="0.5" />
      <circle cx="28" cy="27" r="2" fill={color} opacity="0.5" />
      <circle cx="24" cy="26" r="2" fill={color} opacity="0.5" />
    </svg>
  );
}
