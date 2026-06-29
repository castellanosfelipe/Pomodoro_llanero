/** Controles de transporte: iniciar/pausar, saltar, reiniciar. */
import { controller } from "../state/controller";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";

export function Controls() {
  const t = useT();
  const engine = useAppStore((s) => s.engine);
  const strictMode = useAppStore((s) => s.settings.timer.strictMode);

  const isRunning = engine.status === "running";
  const primaryLabel = isRunning
    ? t.controls.pause
    : engine.status === "paused"
      ? t.controls.resume
      : t.controls.start;

  // En modo estricto no se puede pausar durante el enfoque.
  const pauseBlocked = strictMode && engine.phase === "focus" && isRunning;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => controller.toggle()}
        disabled={pauseBlocked}
        className="accent-bg rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        {primaryLabel}
      </button>
      <button
        onClick={() => controller.skip()}
        aria-label={t.controls.skip}
        className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {t.controls.skip}
      </button>
      <button
        onClick={() => controller.reset()}
        aria-label={t.controls.reset}
        className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {t.controls.reset}
      </button>
    </div>
  );
}
