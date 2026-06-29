/**
 * Inicio con el sistema (Login Items en macOS / inicio de Windows) vía
 * `tauri-plugin-autostart`. No-op en el navegador.
 */
import { isTauri } from "./env";

export async function setAutostart(enabled: boolean): Promise<void> {
  if (!isTauri()) return;
  const mod = await import("@tauri-apps/plugin-autostart");
  const already = await mod.isEnabled();
  if (enabled && !already) await mod.enable();
  if (!enabled && already) await mod.disable();
}

export async function isAutostartEnabled(): Promise<boolean> {
  if (!isTauri()) return false;
  const mod = await import("@tauri-apps/plugin-autostart");
  return mod.isEnabled();
}
