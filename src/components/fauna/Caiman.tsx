/** Caimán del Orinoco — guardián de la noche llanera. */

interface CaimanProps {
  size?: number;
  className?: string;
}

export function Caiman({ size = 130, className = "" }: CaimanProps) {
  return (
    <svg
      width={size}
      height={size * 0.38}
      viewBox="0 0 130 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Caimán"
    >
      {/* Superficie del agua */}
      <line x1="0" y1="30" x2="130" y2="30" stroke="#3D7AB5" strokeWidth="0.5" opacity="0.4" />

      {/* Cola larga y aplanada */}
      <path d="M 0 28 Q 8 24 16 28 Q 8 32 0 30 Z" fill="#2A3A1A" />
      <path d="M 14 26 Q 20 22 28 26 L 28 30 Q 20 34 14 30 Z" fill="#2A3A1A" />

      {/* Cuerpo principal — aplanado y alargado */}
      <path
        d="M 26 22 Q 50 16 80 18 Q 100 18 110 22 L 110 32 Q 100 36 80 36 Q 50 38 26 34 Z"
        fill="#2D4A1E"
      />
      <path
        d="M 28 24 Q 52 19 80 21 Q 98 21 108 24 L 108 30 Q 96 34 78 34 Q 52 36 28 32 Z"
        fill="#3A5C28"
      />

      {/* Escudos dorsales (osteodermos) */}
      {[32, 42, 52, 62, 72, 82, 92].map((x, i) => (
        <ellipse key={i} cx={x} cy={22} rx={4.5} ry={3} fill="#243D18" />
      ))}

      {/* Patas delanteras */}
      <path d="M 50 34 L 44 44 L 48 44 L 54 34" fill="#2A3A1A" />
      <path d="M 66 36 L 60 46 L 64 46 L 70 36" fill="#2A3A1A" />

      {/* Patas traseras */}
      <path d="M 82 34 L 78 43 L 82 43 L 86 34" fill="#2A3A1A" />
      <path d="M 96 32 L 93 41 L 96 41 L 99 32" fill="#2A3A1A" />

      {/* Cabeza — aplanada y triangular */}
      <path
        d="M 106 20 Q 116 18 126 22 Q 128 26 126 30 Q 116 34 106 32 Z"
        fill="#2D4A1E"
      />
      <path
        d="M 108 22 Q 118 20 124 24 Q 126 27 124 29 Q 116 32 108 30 Z"
        fill="#3A5C28"
      />

      {/* Hocico alargado */}
      <path d="M 122 24 L 136 22 L 136 30 Q 130 32 122 30 Z" fill="#2D4A1E" />

      {/* Dientes visibles */}
      <path d="M 124 24 L 126 20 L 128 24" fill="#E8E0D0" />
      <path d="M 128 24 L 130 20 L 132 24" fill="#E8E0D0" />
      <path d="M 124 30 L 126 34 L 128 30" fill="#E8E0D0" />

      {/* Ojo — el caimán tiene ojos en lo alto de la cabeza */}
      <ellipse cx="114" cy="19" rx="5" ry="4" fill="#1A2A10" />
      <ellipse cx="114" cy="19" rx="3" ry="3" fill="#2A8030" />
      <ellipse cx="114" cy="19" rx="1.5" ry="2" fill="#0A0A0A" />
      <circle cx="113" cy="18" r="1" fill="white" opacity="0.6" />

      {/* Línea lateral — escamas */}
      <path d="M 30 28 Q 60 26 90 28 Q 100 28 106 27" stroke="#243D18" strokeWidth="1" fill="none" />
    </svg>
  );
}
