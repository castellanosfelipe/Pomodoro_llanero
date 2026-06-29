/**
 * Estado observable de la UI (Zustand). Mantiene un *espejo* del estado del
 * motor más los datos de presentación. La orquestación (efectos, transiciones)
 * vive en `controller.ts`, que empuja actualizaciones aquí con `setState`.
 */
import { create } from "zustand";
import type { AnimalAsset, Settings, StatsSummary } from "../domain/types";
import type { EngineState } from "../domain/timer";
import { DEFAULT_SETTINGS } from "../domain/defaults";

export type View = "timer" | "settings" | "stats";

const initialEngine: EngineState = {
  phase: "focus",
  status: "idle",
  durationMs: DEFAULT_SETTINGS.timer.focusMinutes * 60_000,
  remainingMs: DEFAULT_SETTINGS.timer.focusMinutes * 60_000,
  elapsedMs: 0,
  completedFocusInCycle: 0,
  completedFocusTotal: 0,
};

export interface AppState {
  ready: boolean;
  settings: Settings;
  engine: EngineState;
  view: View;
  animal: AnimalAsset | null;
  stats: StatsSummary | null;
  setView: (view: View) => void;
}

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  settings: DEFAULT_SETTINGS,
  engine: initialEngine,
  view: "timer",
  animal: null,
  stats: null,
  setView: (view) => set({ view }),
}));
