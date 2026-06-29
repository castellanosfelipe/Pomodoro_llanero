/** Capa de infraestructura: adaptadores de plataforma detrás de interfaces. */
export { isTauri } from "./env";
export { createMonotonicClock } from "./clock";
export { getSettingsStore, loadSettings, saveSettings } from "./store";
export { getNotifier } from "./notifications";
export { getStatsRepo } from "./stats";
export { setAutostart, isAutostartEnabled } from "./autostart";
export { setAlwaysOnTop, showAndFocusWindow } from "./window";
export { updateTrayTitle, setCloseToTray, onTrayAction } from "./tray";
export { tauriGenerate } from "./generate";
export {
  playEndSound,
  startTicking,
  stopTicking,
  AVAILABLE_SOUNDS,
} from "./sound";
