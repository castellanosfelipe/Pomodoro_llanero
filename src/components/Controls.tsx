/** Controles de transporte con estética llanera: iniciar/pausar, saltar, reiniciar. */
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

  const pauseBlocked = strictMode && engine.phase === "focus" && isRunning;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => controller.toggle()}
        disabled={pauseBlocked}
        className="btn-faena"
        aria-label={primaryLabel}
      >
        {primaryLabel}
      </button>
      <button
        onClick={() => controller.skip()}
        aria-label={t.controls.skip}
        className="btn-secondary"
      >
        {t.controls.skip}
      </button>
      <button
        onClick={() => controller.reset()}
        aria-label={t.controls.reset}
        className="btn-secondary"
      >
        {t.controls.reset}
      </button>
    </div>
  );
}
