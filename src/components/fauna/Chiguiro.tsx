/** Chigüiro / Capibara (Hydrochoerus hydrochaeris) — el más llanero de todos. */

interface ChiguiroProps {
  size?: number;
  floating?: boolean;
  animateEar?: boolean;
  className?: string;
}

export function Chiguiro({
  size = 130,
  floating = false,
  animateEar = false,
  className = "",
}: ChiguiroProps) {
  // id de gradientes (estable; basta uno por uso típico en pantalla).
  const uid = "chg";

  return (
    <svg
      width={size}
      height={size * 0.74}
      viewBox="0 0 130 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${floating ? "animate-float-side" : ""} ${className}`}
      role="img"
      aria-label="Chigüiro"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9794F" />
          <stop offset="0.55" stopColor="#946239" />
          <stop offset="1" stopColor="#7A4F2C" />
        </linearGradient>
        <linearGradient id={`${uid}-head`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#AC7C52" />
          <stop offset="1" stopColor="#86592F" />
        </linearGradient>
        <radialGradient id={`${uid}-cheek`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#B98B5E" />
          <stop offset="1" stopColor="#B98B5E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Reflejo en el agua (solo en descanso) */}
      {floating && (
        <ellipse cx="64" cy="90" rx="54" ry="6" fill="#3D7AB5" opacity="0.16" />
      )}

      {/* Sombra de contacto */}
      <ellipse cx="62" cy="84" rx="48" ry="5" fill="#000" opacity="0.10" />

      {/* Patas traseras y delanteras (robustas y cortas) */}
      <g fill="#6E4626">
        <path d="M34 66 q-4 8 -2 16 q0 3 5 3 q4 0 4 -3 l1 -15 z" />
        <path d="M50 68 q-3 8 -1 15 q0 3 5 3 q4 0 4 -3 l0 -14 z" />
        <path d="M86 66 q-3 9 -1 16 q0 3 5 3 q4 0 4 -3 l0 -15 z" />
        <path d="M100 64 q-2 9 0 17 q0 3 5 3 q4 0 4 -3 l-1 -16 z" />
      </g>
      {/* Pezuñas */}
      <g fill="#3E2817">
        <rect x="33" y="82" width="11" height="4" rx="2" />
        <rect x="49" y="82" width="11" height="4" rx="2" />
        <rect x="85" y="82" width="11" height="4" rx="2" />
        <rect x="101" y="83" width="11" height="4" rx="2" />
      </g>

      {/* Cuerpo en barril, con lomo curvo y grupa alta — silueta de capibara */}
      <path
        d="M28 56
           Q22 40 40 33
           Q58 26 78 30
           Q98 33 110 42
           Q120 49 116 60
           Q112 70 96 71
           Q70 74 46 71
           Q31 69 28 56 Z"
        fill={`url(#${uid}-body)`}
      />
      {/* Línea de lomo más clara */}
      <path d="M40 33 Q66 27 110 42" stroke="#C0986B" strokeWidth="2.5"
        strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Vientre en sombra */}
      <path d="M34 64 Q60 72 100 69" stroke="#5F3D22" strokeWidth="3"
        strokeLinecap="round" fill="none" opacity="0.35" />

      {/* Cabeza grande y rectangular (rasgo clave del chigüiro) */}
      <path
        d="M96 36
           Q116 33 124 44
           Q129 52 126 60
           Q123 67 112 68
           Q100 69 95 60
           Q92 48 96 36 Z"
        fill={`url(#${uid}-head)`}
      />
      {/* Mejilla con brillo suave */}
      <ellipse cx="108" cy="52" rx="12" ry="11" fill={`url(#${uid}-cheek)`} />

      {/* Hocico plano y ancho */}
      <ellipse cx="123" cy="58" rx="7" ry="6" fill="#5F3D22" />
      <ellipse cx="120.5" cy="56.5" rx="1.6" ry="2.2" fill="#2A1A0E" />
      <ellipse cx="125.5" cy="56.5" rx="1.6" ry="2.2" fill="#2A1A0E" />

      {/* Oreja pequeña y redondeada, hacia atrás (anima opcionalmente) */}
      <g
        className={animateEar ? "animate-chiguiro-ear" : ""}
        style={{ transformOrigin: "100px 38px" }}
      >
        <ellipse cx="101" cy="37" rx="6" ry="5.5" fill="#7A4F2C" />
        <ellipse cx="101" cy="38" rx="3" ry="3" fill="#4A2F19" />
      </g>

      {/* Ojo alto y vivo */}
      <ellipse cx="110" cy="45" rx="3.6" ry="3.6" fill="#2C1B0E" />
      <circle cx="111.1" cy="43.9" r="1.1" fill="#fff" opacity="0.85" />

      {/* Textura de pelaje (trazos suaves) */}
      <g stroke="#5F3D22" strokeWidth="1" strokeLinecap="round" opacity="0.28" fill="none">
        <path d="M44 44 q4 -3 8 0" />
        <path d="M60 40 q4 -3 8 0" />
        <path d="M76 42 q4 -3 8 0" />
        <path d="M52 56 q4 -3 8 0" />
        <path d="M70 56 q4 -3 8 0" />
      </g>
    </svg>
  );
}
