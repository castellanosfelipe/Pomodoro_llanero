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

/** Estado del modo bloqueo: vigilante de foco activo y su desuscriptor. */
let blockActive = false;
let unlistenFocusGuard: (() => void) | null = null;

/**
 * Activa el modo bloqueo del descanso.
 *
 * Para que el equipo quede efectivamente limitado a la app hasta que termine
 * el descanso hacen falta cuatro cosas, no solo "fullscreen":
 *
 * 1. Mostrar/desminimizar la ventana: con "minimizar a la bandeja" activo, el
 *    descanso suele llegar con la ventana oculta y el bloqueo se aplicaría a
 *    una ventana invisible.
 * 2. Pantalla completa **simple** (`setSimpleFullscreen`): en macOS no crea un
 *    Space nuevo, así que cubre el escritorio donde está el usuario y no se
 *    puede apartar con un gesto. En el resto de plataformas equivale a
 *    `setFullscreen`.
 * 3. Siempre encima + visible en todos los escritorios/Spaces.
 * 4. Vigilante de foco: si el usuario intenta escapar con Cmd/Alt+Tab, la
 *    ventana recupera el frente y el foco.
 */
export async function enterBreakBlock(): Promise<void> {
  if (!isTauri()) return;
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const w = getCurrentWindow();
  blockActive = true;

  await w.show();
  await w.unminimize();
  await w.setAlwaysOnTop(true);
  // No soportado en Windows; el resto del bloqueo funciona igual.
  try { await w.setVisibleOnAllWorkspaces(true); } catch { /* no-op */ }
  // Sin botón de cerrar: con bandeja activa, cerrar ocultaría el bloqueo.
  try { await w.setClosable(false); } catch { /* según plataforma */ }
  await w.setSimpleFullscreen(true);
  await w.setFocus();

  if (!unlistenFocusGuard) {
    unlistenFocusGuard = await w.onFocusChanged(({ payload: focused }) => {
      if (!focused && blockActive) {
        void w.show().then(() => w.setFocus());
      }
    });
  }
}

/**
 * Desactiva el modo bloqueo: retira el vigilante de foco, sale de pantalla
 * completa y restaura la preferencia `alwaysOnTop` del usuario.
 */
export async function exitBreakBlock(alwaysOnTop: boolean): Promise<void> {
  if (!isTauri()) return;
  blockActive = false;
  unlistenFocusGuard?.();
  unlistenFocusGuard = null;
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const w = getCurrentWindow();
  await w.setSimpleFullscreen(false);
  try { await w.setVisibleOnAllWorkspaces(false); } catch { /* no-op */ }
  try { await w.setClosable(true); } catch { /* según plataforma */ }
  await w.setAlwaysOnTop(alwaysOnTop);
}
