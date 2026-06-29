/** Anillo de progreso circular grande con el tiempo restante en el centro. */
import { formatClock } from "../lib/format";
import type { EngineState } from "../domain/timer";
import { useT } from "../hooks/useT";

const SIZE = 280;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function TimerRing({ engine }: { engine: EngineState }) {
  const t = useT();
  const progress =
    engine.durationMs > 0 ? engine.elapsedMs / engine.durationMs : 0;
  const dashoffset = C * (1 - Math.min(1, Math.max(0, progress)));

  const phaseLabel = engine.status === "paused" ? t.phase.paused : t.phase[engine.phase];

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      role="timer"
      aria-live="polite"
      aria-label={`${phaseLabel}: ${formatClock(engine.remainingMs)}`}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-gray-200 dark:stroke-white/10"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="accent-ring transition-[stroke-dashoffset] duration-500 ease-linear"
          strokeDasharray={C}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {phaseLabel}
        </span>
        <span className="mt-1 font-sans text-6xl font-bold tabular-nums text-gray-900 dark:text-white">
          {formatClock(engine.remainingMs)}
        </span>
      </div>
    </div>
  );
}
