/**
 * Valores por defecto de configuración y utilidades de conversión.
 *
 * Español por defecto, modo galería (offline), generativo desactivado, sin
 * telemetría: todo coherente con los requisitos local-first.
 */

import type { Settings, TimerSettings } from "./types";
import type { EngineConfig } from "./timer";

export const SETTINGS_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  timer: {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    pomodorosPerCycle: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    strictMode: false,
    dailyGoal: 8,
  },
  notifications: {
    desktopNotifications: true,
    endSound: true,
    endSoundVolume: 0.7,
    endSoundId: "chime",
    tickingDuringFocus: false,
  },
  appearance: {
    theme: "system",
    accentColor: "#e07a3f", // dusk llanero
    language: "es",
    reduceMotion: "system",
  },
  window: {
    minimizeToTray: true,
    alwaysOnTop: false,
    startOnLogin: false,
  },
  shortcuts: {
    startPause: "CmdOrCtrl+Shift+Space",
    skip: "CmdOrCtrl+Shift+S",
    reset: "CmdOrCtrl+Shift+R",
  },
  fauna: {
    mode: "gallery",
    categories: ["mamifero", "ave", "reptil"],
    showFunFact: true,
    fullScreenOnBreak: true,
    generative: {
      backend: "local",
      apiProvider: "",
      localModelPath: "",
      prompt:
        "fauna del Llano colombiano, Orinoquía, fotografía de naturaleza, luz dorada",
    },
  },
};

const MIN = 60_000;

/** Convierte `TimerSettings` (minutos) en `EngineConfig` (ms) para el motor. */
export function toEngineConfig(t: TimerSettings): EngineConfig {
  return {
    focusMs: Math.round(t.focusMinutes * MIN),
    shortBreakMs: Math.round(t.shortBreakMinutes * MIN),
    longBreakMs: Math.round(t.longBreakMinutes * MIN),
    pomodorosPerCycle: t.pomodorosPerCycle,
    autoStartBreaks: t.autoStartBreaks,
    autoStartFocus: t.autoStartFocus,
    strictMode: t.strictMode,
  };
}

/**
 * Fusiona ajustes persistidos (posiblemente parciales o de un esquema viejo)
 * con los valores por defecto. Robusto frente a campos faltantes y migraciones.
 */
export function mergeSettings(partial: unknown): Settings {
  const p = (partial ?? {}) as Partial<Settings>;
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    timer: { ...DEFAULT_SETTINGS.timer, ...p.timer },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...p.notifications },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...p.appearance },
    window: { ...DEFAULT_SETTINGS.window, ...p.window },
    shortcuts: { ...DEFAULT_SETTINGS.shortcuts, ...p.shortcuts },
    fauna: {
      ...DEFAULT_SETTINGS.fauna,
      ...p.fauna,
      generative: {
        ...DEFAULT_SETTINGS.fauna.generative,
        ...p.fauna?.generative,
      },
    },
  };
}
