/**
 * Puente con la bandeja de sistema. El menú de la bandeja (en Rust) emite
 * `tray://action`; aquí lo escuchamos y exponemos helpers para actualizar el
 * título y la preferencia de cerrar-a-bandeja. No-op en navegador.
 */
import { isTauri } from "./env";

export async function updateTrayTitle(text: string): Promise<void> {
  if (!isTauri()) return;
  const { invoke } = await import("@tauri-apps/api/core");
  await invoke("update_tray", { title: text });
}

export async function setCloseToTray(enabled: boolean): Promise<void> {
  if (!isTauri()) return;
  const { invoke } = await import("@tauri-apps/api/core");
  await invoke("set_close_to_tray", { enabled });
}

export async function onTrayAction(
  handler: (action: string) => void,
): Promise<() => void> {
  if (!isTauri()) return () => {};
  const { listen } = await import("@tauri-apps/api/event");
  return listen<string>("tray://action", (e) => handler(e.payload));
}
