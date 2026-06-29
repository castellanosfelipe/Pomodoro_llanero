/**
 * Vista principal de la faena.
 * Layout horizonte llanero: 62% cielo (timer + fauna) / 38% tierra (controles).
 */
import { useRef, useState } from "react";
import { formatClock } from "../lib/format";
import { Controls } from "./Controls";
import { FaunaCompanion } from "./FaunaCompanion";
import { GarceroCounter } from "./GarceroCounter";
import { PalmaLlanera } from "./fauna/PalmaLlanera";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";
import type { DayState } from "../hooks/useDayState";

interface TimerViewProps {
  dayState: DayState;
}

function TaskInput() {
  const t = useT();
  const currentTask = useAppStore((s) => s.currentTask);
  const setCurrentTask = useAppStore((s) => s.setCurrentTask);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={currentTask}
        maxLength={80}
        placeholder={t.task.placeholder}
        onChange={(e) => setCurrentTask(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") setEditing(false);
        }}
        className="w-full max-w-xs bg-transparent text-center text-sm outline-none"
        style={{ color: "var(--day-text-soft)" }}
        aria-label={t.task.placeholder}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="max-w-xs truncate text-center text-sm transition-opacity hover:opacity-80"
      style={{ color: "var(--day-text-soft)" }}
      aria-label={t.task.placeholder}
    >
      {currentTask || t.task.placeholder}
    </button>
  );
}

export function TimerView({ dayState }: TimerViewProps) {
  const t = useT();
  const engine = useAppStore((s) => s.engine);
  const perCycle = useAppStore((s) => s.settings.timer.pomodorosPerCycle);
  const goal = useAppStore((s) => s.settings.timer.dailyGoal);
  const stats = useAppStore((s) => s.stats);
  const showCelebration = useAppStore((s) => s.showCelebration);

  const doneToday = stats?.today.completedFocus ?? 0;
  const goalMet = goal > 0 && doneToday >= goal;

  const progress =
    engine.durationMs > 0
      ? Math.min(1, engine.elapsedMs / engine.durationMs)
      : 0;

  const phaseLabel =
    engine.status === "paused"
      ? t.phase.paused
      : t.phase[engine.phase];

  const modePillClass =
    engine.phase === "focus"
      ? "mode-pill mode-pill-faena"
      : engine.phase === "shortBreak"
        ? "mode-pill mode-pill-descanso"
        : "mode-pill mode-pill-siesta";

  return (
    <div className="flex h-full flex-col" aria-label="Timer">
      {/* ZONA DE CIELO — 62% */}
      <div
        className="sky-zone relative flex flex-1 flex-col items-center justify-end overflow-hidden pb-2 pt-4"
        style={{ flexBasis: "62%" }}
      >
        {/* Velo de progreso sutil — oscurece el cielo conforme avanza la faena */}
        <div
          className="sky-progress-veil"
          style={{ opacity: progress * 0.22 }}
          aria-hidden
        />

        {/* Modo / estado actual */}
        <div className={modePillClass} aria-label={phaseLabel}>
          {phaseLabel}
        </div>

        {/* Tiempo grande en Palatino */}
        <div
          className="relative z-10 mt-2 font-timer text-7xl"
          style={{ color: "var(--day-text)" }}
          role="timer"
          aria-live="polite"
          aria-label={`${phaseLabel}: ${formatClock(engine.remainingMs)}`}
        >
          {formatClock(engine.remainingMs)}
        </div>

        {/* Tarea en curso */}
        <div className="relative z-10 mt-2">
          <TaskInput />
        </div>

        {/* Compañero de fauna — posado en el horizonte */}
        <div className="relative z-10 mt-4 flex items-end">
          <FaunaCompanion faunaKey={dayState.faunaKey} phase={engine.phase} />
        </div>

        {/* Palmas de horizonte (decorativas) */}
        <div className="pointer-events-none absolute bottom-0 left-3 z-0 opacity-30" aria-hidden>
          <PalmaLlanera height={72} color={dayState.isDark ? "#8B6030" : "#4A6741"} />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-3 z-0 opacity-20" aria-hidden>
          <PalmaLlanera height={56} color={dayState.isDark ? "#8B6030" : "#4A6741"} />
        </div>

        {/* Línea del horizonte */}
        <div className="horizon-line" aria-hidden />
      </div>

      {/* ZONA DE TIERRA — 38% */}
      <div
        className="earth-zone flex flex-col items-center justify-center gap-4 px-4 py-4"
        style={{ flexBasis: "38%" }}
      >
        {/* Contador de garzas del ciclo */}
        <GarceroCounter
          completed={engine.completedFocusInCycle}
          total={perCycle}
          allFlying={showCelebration}
        />

        {/* Controles */}
        <Controls />

        {/* Meta del día */}
        <p className="text-xs" style={{ color: "var(--day-text-soft)" }}>
          {goalMet ? (
            <span style={{ color: "var(--day-accent)", fontWeight: 600 }}>
              {t.goal.reached}
            </span>
          ) : (
            t.goal.progress(doneToday, goal)
          )}
        </p>
      </div>
    </div>
  );
}
