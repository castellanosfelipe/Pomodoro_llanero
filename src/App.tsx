/** Componente raíz: arranca el controlador, aplica el ciclo del día y enruta vistas. */
import { useEffect } from "react";
import { controller } from "./state/controller";
import { useAppStore } from "./state/store";
import { useShortcuts } from "./hooks/useShortcuts";
import { useDayState } from "./hooks/useDayState";
import { TopBar } from "./components/TopBar";
import { TimerView } from "./components/TimerView";
import { BreakScreen } from "./components/BreakScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatsPanel } from "./components/StatsPanel";
import { CelebrationOverlay } from "./components/CelebrationOverlay";

export default function App() {
  const ready = useAppStore((s) => s.ready);
  const view = useAppStore((s) => s.view);
  const phase = useAppStore((s) => s.engine.phase);
  const reduceMotion = useAppStore((s) => s.settings.appearance.reduceMotion);
  const dayState = useDayState();

  useEffect(() => {
    void controller.bootstrap();
  }, []);

  useShortcuts();

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion === "on");
  }, [reduceMotion]);

  const onBreak = phase === "shortBreak" || phase === "longBreak";
  const showBreak = onBreak && view === "timer";

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ background: "var(--day-canvas)", color: "var(--day-text)" }}
    >
      <TopBar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {!ready ? (
          <div
            className="flex flex-1 items-center justify-center text-sm"
            style={{ color: "var(--day-text-soft)" }}
          >
            …
          </div>
        ) : view === "settings" ? (
          <SettingsPanel />
        ) : view === "stats" ? (
          <StatsPanel />
        ) : showBreak ? (
          <BreakScreen dayState={dayState} />
        ) : (
          <TimerView dayState={dayState} />
        )}
      </main>

      <CelebrationOverlay />
    </div>
  );
}
