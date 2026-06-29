/** Componente raíz: arranca el controlador y enruta entre vistas. */
import { useEffect } from "react";
import { controller } from "./state/controller";
import { useAppStore } from "./state/store";
import { useShortcuts } from "./hooks/useShortcuts";
import { TopBar } from "./components/TopBar";
import { TimerView } from "./components/TimerView";
import { BreakScreen } from "./components/BreakScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatsPanel } from "./components/StatsPanel";

export default function App() {
  const ready = useAppStore((s) => s.ready);
  const view = useAppStore((s) => s.view);
  const phase = useAppStore((s) => s.engine.phase);
  const reduceMotion = useAppStore((s) => s.settings.appearance.reduceMotion);

  // Arranque único del controlador (carga ajustes, motor, fauna, stats…).
  useEffect(() => {
    void controller.bootstrap();
  }, []);

  useShortcuts();

  // Preferencia explícita de reducir movimiento del usuario.
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion === "on");
  }, [reduceMotion]);

  const onBreak = phase === "shortBreak" || phase === "longBreak";
  const immersiveBreak = onBreak && view === "timer";

  return (
    <div
      className={`flex h-full flex-col ${
        immersiveBreak
          ? "bg-llano-sky"
          : "bg-white text-gray-900 dark:bg-llano-sky dark:text-white"
      }`}
    >
      <TopBar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {!ready ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            …
          </div>
        ) : view === "settings" ? (
          <SettingsPanel />
        ) : view === "stats" ? (
          <StatsPanel />
        ) : onBreak ? (
          <BreakScreen />
        ) : (
          <TimerView />
        )}
      </main>
    </div>
  );
}
