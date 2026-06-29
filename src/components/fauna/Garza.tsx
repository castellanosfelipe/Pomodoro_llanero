/** Garza blanca (Ardea alba) — compañera de la faena. Paciencia total. */

interface GarzaProps {
  size?: number;
  /** Animación ocasional de giro de cabeza */
  animateHead?: boolean;
  /** Animación de vuelo (al completar ciclo) */
  flying?: boolean;
  className?: string;
}

export function Garza({
  size = 80,
  animateHead = false,
  flying = false,
  className = "",
}: GarzaProps) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${flying ? "animate-garza-fly" : ""} ${className}`}
      role="img"
      aria-label="Garza blanca"
    >
      {/* Pata derecha */}
      <line x1="54" y1="118" x2="54" y2="138" stroke="#8B8070" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="54" y1="138" x2="46" y2="138" stroke="#8B8070" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="138" x2="58" y2="135" stroke="#8B8070" strokeWidth="2" strokeLinecap="round" />
      {/* Pata izquierda (levantada — garza siempre en una pata) */}
      <line x1="50" y1="118" x2="52" y2="124" stroke="#8B8070" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cuerpo — oval blanco con sombra sutil */}
      <ellipse cx="52" cy="100" rx="20" ry="26" fill="#F5F5F0" />
      <ellipse cx="52" cy="104" rx="18" ry="22" fill="#FFFFFE" />

      {/* Plumas de cría (ornamentales largas) */}
      <path d="M 40 118 Q 30 132 28 140" stroke="#E8E8E2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 44 120 Q 36 133 34 140" stroke="#E8E8E2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 48 121 Q 42 134 40 140" stroke="#E8E8E2" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Cuello — curva elegante en S */}
      <path
        d="M 52 78 Q 58 70 55 58 Q 52 48 50 40"
        stroke="#FFFFFE"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 52 78 Q 58 70 55 58 Q 52 48 50 40"
        stroke="#F0F0EA"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cabeza — con animación opcional */}
      <g
        className={animateHead ? "animate-garza-head origin-bottom" : ""}
        style={{ transformOrigin: "50px 40px" }}
      >
        <ellipse cx="50" cy="34" rx="10" ry="8" fill="#FFFFFE" />
        {/* Máscara facial negra */}
        <path d="M 43 33 Q 40 31 42 28 Q 44 26 48 28" fill="#2A2A2A" />
        {/* Pico amarillo largo */}
        <path d="M 48 30 L 36 24 L 38 26 Z" fill="#E8C830" />
        <path d="M 48 30 L 36 24 L 36 22 Z" fill="#C8A820" />
        {/* Ojo */}
        <circle cx="47" cy="32" r="2" fill="#E8C830" />
        <circle cx="47" cy="32" r="1" fill="#1A1A1A" />
        {/* Penachos negros (adulto reproductivo) */}
        <path d="M 54 28 Q 62 22 64 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 53 26 Q 60 19 62 14" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Ala visible — posición de reposo */}
      <path
        d="M 33 90 Q 28 100 30 110 Q 36 115 52 115 Q 68 115 72 106 Q 74 96 70 88"
        fill="#E8E8E2"
        stroke="#D0D0C8"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Silueta simplificada para el contador de ciclos */
export function GarzaSilueta({
  size = 24,
  completed = false,
  flying = false,
  className = "",
}: {
  size?: number;
  completed?: boolean;
  flying?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 24 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${flying ? "animate-garza-fly" : ""} ${className}`}
      aria-hidden
    >
      {/* Silueta compacta */}
      <path
        d="M 12 32 L 13 22 Q 14 16 13 10 Q 12 6 10 4 Q 8 2 10 1 L 16 1 Q 18 4 16 6 L 14 10 Q 16 14 14 22 Z"
        fill={completed ? "var(--day-accent)" : "var(--day-text-soft)"}
        opacity={completed ? 1 : 0.4}
      />
      <line x1="12" y1="32" x2="8" y2="34" stroke={completed ? "var(--day-accent)" : "var(--day-text-soft)"} strokeWidth="1.5" opacity={completed ? 1 : 0.4} />
      <line x1="12" y1="32" x2="14" y2="33" stroke={completed ? "var(--day-accent)" : "var(--day-text-soft)"} strokeWidth="1.5" opacity={completed ? 1 : 0.4} />
    </svg>
  );
}
