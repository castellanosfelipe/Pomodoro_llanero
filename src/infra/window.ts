/**
 * Control de la ventana nativa (no-op en navegador).
 */
import { isTauri } from "./env";

export async function setAlwaysOnTop(on: boolean): Promise<void> {
  if (!isTauri()) return;
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().setAlwaysOnTop(on);
}

export async function showAndFocusWindow(): Promise<void> {
  if (!isTauri()) return;
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const w = getCurrentWindow();
  await w.show();
  await w.setFocus();
}
