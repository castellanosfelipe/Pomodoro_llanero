/**
 * Pantalla de descanso: la fauna del Llano es la protagonista. Muestra la
 * imagen del animal con su nombre común, nombre científico y un dato curioso.
 */
import { controller } from "../state/controller";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";
import { formatClock } from "../lib/format";

export function BreakScreen() {
  const t = useT();
  const engine = useAppStore((s) => s.engine);
  const animal = useAppStore((s) => s.animal);
  const fauna = useAppStore((s) => s.settings.fauna);
  const lang = useAppStore((s) => s.settings.appearance.language);

  const isRunning = engine.status === "running";
  const phaseLabel = t.phase[engine.phase];

  return (
    <div className="animate-fade-in relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6 text-white">
      {/* Imagen del animal */}
      {animal && (
        <img
          src={animal.imagePath}
          alt={animal.commonName[lang]}
          className={
            fauna.fullScreenOnBreak
              ? "absolute inset-0 h-full w-full object-cover"
              : "max-h-[42vh] rounded-2xl object-contain shadow-2xl"
          }
        />
      )}
      {/* Velo para legibilidad sobre la imagen a pantalla completa */}
      {fauna.fullScreenOnBreak && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
          {phaseLabel} · {formatClock(engine.remainingMs)}
        </span>

        {animal ? (
          <div className="mt-3 max-w-xl rounded-2xl bg-black/40 p-5 backdrop-blur-sm">
            <h2 className="text-3xl font-bold">{animal.commonName[lang]}</h2>
            {animal.scientificName && (
              <p className="mt-1 text-sm italic opacity-90">
                <span className="sr-only">{t.fauna.scientificName}: </span>
                {animal.scientificName}
              </p>
            )}
            {fauna.showFunFact && animal.funFact && (
              <p className="mt-3 text-base leading-relaxed opacity-95">
                <span className="font-semibold">{t.fauna.funFact} </span>
                {animal.funFact[lang]}
              </p>
            )}
            {animal.credit && (
              <p className="mt-2 text-[11px] opacity-60">{animal.credit}</p>
            )}
          </div>
        ) : (
          <h2 className="mt-3 text-2xl font-bold">{t.fauna.breakTitle}</h2>
        )}

        {/* Controles del descanso */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => controller.toggle()}
            className="accent-bg rounded-full px-6 py-2.5 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {isRunning ? t.controls.pause : t.controls.resume}
          </button>
          <button
            onClick={() => controller.skip()}
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            {t.controls.skip}
          </button>
          <button
            onClick={() => void controller.pickAnimal()}
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            {t.fauna.next}
          </button>
        </div>
      </div>
    </div>
  );
}
