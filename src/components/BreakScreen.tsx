/**
 * Pantalla de descanso con horizonte llanero.
 * La fauna ocupa el cielo; info del animal y controles en la zona de tierra.
 */
import { controller } from "../state/controller";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";
import { formatClock } from "../lib/format";
import { assetUrl } from "../lib/asset";
import { FaunaCompanion } from "./FaunaCompanion";
import { PalmaLlanera } from "./fauna/PalmaLlanera";
import type { DayState } from "../hooks/useDayState";

interface BreakScreenProps {
  dayState: DayState;
}

export function BreakScreen({ dayState }: BreakScreenProps) {
  const t = useT();
  const engine = useAppStore((s) => s.engine);
  const animal = useAppStore((s) => s.animal);
  const fauna = useAppStore((s) => s.settings.fauna);
  const lang = useAppStore((s) => s.settings.appearance.language);

  const isRunning = engine.status === "running";
  const phaseLabel = t.phase[engine.phase];

  return (
    <div className="flex h-full flex-col">
      {/* ZONA DE CIELO */}
      <div
        className="sky-zone relative flex flex-1 flex-col items-center justify-end overflow-hidden pb-2 pt-4"
        style={{ flexBasis: "62%" }}
      >
        {/* Imagen del animal (pantalla completa opcional) */}
        {animal && fauna.fullScreenOnBreak && (
          <>
            <img
              src={assetUrl(animal.imagePath)}
              alt={animal.commonName[lang]}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        )}

        {/* Imagen en tarjeta (no pantalla completa) */}
        {animal && !fauna.fullScreenOnBreak && (
          <img
            src={assetUrl(animal.imagePath)}
            alt={animal.commonName[lang]}
            className="relative z-10 max-h-[38vh] rounded-2xl object-contain shadow-2xl"
          />
        )}

        {/* Si no hay imagen: fauna SVG compañera */}
        {!animal && (
          <div className="relative z-10 mt-4">
            <FaunaCompanion faunaKey={dayState.faunaKey} phase={engine.phase} />
          </div>
        )}

        {/* Tiempo restante flotando */}
        <div
          className="relative z-10 mt-3 font-timer text-5xl"
          style={{ color: fauna.fullScreenOnBreak ? "#FFFFFF" : "var(--day-text)" }}
          role="timer"
          aria-live="polite"
          aria-label={`${phaseLabel}: ${formatClock(engine.remainingMs)}`}
        >
          {formatClock(engine.remainingMs)}
        </div>

        {/* Palmas decorativas */}
        <div className="pointer-events-none absolute bottom-0 left-3 z-0 opacity-25" aria-hidden>
          <PalmaLlanera height={64} color={dayState.isDark ? "#8B6030" : "#4A6741"} />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-3 z-0 opacity-18" aria-hidden>
          <PalmaLlanera height={50} color={dayState.isDark ? "#8B6030" : "#4A6741"} />
        </div>

        <div className="horizon-line" aria-hidden />
      </div>

      {/* ZONA DE TIERRA */}
      <div
        className="earth-zone flex flex-col items-center justify-center gap-3 px-5 py-4"
        style={{ flexBasis: "38%" }}
      >
        {/* Nombre y dato curioso del animal */}
        {animal ? (
          <div className="text-center">
            <h2 className="text-lg font-bold" style={{ color: "var(--day-text)" }}>
              {animal.commonName[lang]}
            </h2>
            {animal.scientificName && (
              <p className="text-xs italic" style={{ color: "var(--day-text-soft)" }}>
                {animal.scientificName}
              </p>
            )}
            {fauna.showFunFact && animal.funFact && (
              <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--day-text-soft)" }}>
                <span className="font-semibold">{t.fauna.funFact} </span>
                {animal.funFact[lang]}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm font-medium" style={{ color: "var(--day-text)" }}>
            {t.fauna.breakTitle}
          </p>
        )}

        {/* Modo actual */}
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--day-accent)" }}
        >
          {phaseLabel}
        </span>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => controller.toggle()}
            className="btn-faena"
          >
            {isRunning ? t.controls.pause : t.controls.resume}
          </button>
          <button
            onClick={() => controller.skip()}
            className="btn-secondary"
          >
            {t.controls.skip}
          </button>
          <button
            onClick={() => void controller.pickAnimal()}
            className="btn-secondary"
          >
            {t.fauna.next}
          </button>
        </div>

        {animal?.credit && (
          <p className="text-[10px] opacity-50" style={{ color: "var(--day-text-soft)" }}>
            {animal.credit}
          </p>
        )}
      </div>
    </div>
  );
}
