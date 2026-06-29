/**
 * Celebración al completar un ciclo de 4 faenas.
 * Aparece 3.5 s y desaparece. Las 4 garzas levantan vuelo.
 * NO confetti genérico — el llano celebra con su fauna.
 */
import { useAppStore } from "../state/store";
import { getDict } from "../i18n";

export function CelebrationOverlay() {
  const show = useAppStore((s) => s.showCelebration);
  const lang = useAppStore((s) => s.settings.appearance.language);

  if (!show) return null;

  const t = getDict(lang);
  const msgs = t.celebration.messages;
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center"
      aria-live="assertive"
      aria-label={msg}
    >
      {/* Fondo semitransparente */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Bandada de garzas levantando vuelo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex items-end gap-3">
          {[0, 1, 2, 3].map((i) => (
            <svg
              key={i}
              width="28"
              height="40"
              viewBox="0 0 28 40"
              fill="none"
              style={{
                animation: `garza-fly 1.4s ease-in-out ${i * 220}ms forwards`,
              }}
              aria-hidden
            >
              {/* Silueta de garza en vuelo */}
              <path d="M 14 38 L 15 22 Q 16 14 14 8 Q 12 4 10 2 Q 8 0 10 0 L 18 0 Q 20 4 18 8 L 16 14 Q 18 20 16 30 Z"
                fill="#F5F5F0" />
              <path d="M 14 30 Q 4 28 0 24 Q 4 20 10 24 Z" fill="#E8E8E2" />
              <path d="M 14 30 Q 24 28 28 24 Q 24 20 18 24 Z" fill="#E8E8E2" />
              <line x1="14" y1="38" x2="10" y2="40" stroke="#8B8070" strokeWidth="1.5" />
            </svg>
          ))}
        </div>

        {/* Mensaje */}
        <p
          className="max-w-xs text-center text-xl font-bold text-white"
          style={{ animation: "celebration-rise 3.5s ease-in-out forwards" }}
        >
          {msg}
        </p>
      </div>
    </div>
  );
}
