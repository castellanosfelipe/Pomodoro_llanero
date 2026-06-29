/**
 * Almacenamiento seguro de secretos (la clave de API del modo generativo).
 *
 * Nunca se guarda en el store JSON de configuración. Bajo Tauri se delega al
 * backend Rust (comando `set_api_key`/`has_api_key`), que la coloca en el
 * llavero/credential manager del sistema. En navegador no se persiste.
 */
import { isTauri } from "./env";

export async function saveApiKey(key: string): Promise<void> {
  if (!isTauri()) return;
  const { invoke } = await import("@tauri-apps/api/core");
  await invoke("set_api_key", { key });
}

export async function hasApiKey(): Promise<boolean> {
  if (!isTauri()) return false;
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<boolean>("has_api_key");
}
