/** Vista principal de enfoque: anillo, puntos de ciclo, meta y controles. */
import { TimerRing } from "./TimerRing";
import { Controls } from "./Controls";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";

function CycleDots({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i < done ? "accent-bg" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export function TimerView() {
  const t = useT();
  const engine = useAppStore((s) => s.engine);
  const perCycle = useAppStore((s) => s.settings.timer.pomodorosPerCycle);
  const goal = useAppStore((s) => s.settings.timer.dailyGoal);
  const stats = useAppStore((s) => s.stats);

  const doneToday = stats?.today.completedFocus ?? 0;
  const goalMet = goal > 0 && doneToday >= goal;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <TimerRing engine={engine} />

      <CycleDots done={engine.completedFocusInCycle} total={perCycle} />

      <Controls />

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">{t.goal.title}: </span>
        {goalMet ? (
          <span className="accent-text font-semibold">{t.goal.reached}</span>
        ) : (
          <span>{t.goal.progress(doneToday, goal)}</span>
        )}
      </div>
    </div>
  );
}
