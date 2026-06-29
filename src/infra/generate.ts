/**
 * Puente al backend generativo. Invoca el comando Rust `generate_fauna_image`
 * cuando corre bajo Tauri; en navegador (o si falla) devuelve `null` para que el
 * `GenerativeProvider` degrade a la imagen local.
 */
import type { GenerateFn } from "../fauna/GenerativeProvider";
import { isTauri } from "./env";

export const tauriGenerate: GenerateFn = async (req) => {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    const result = await invoke<string | null>("generate_fauna_image", { req });
    return result ?? null;
  } catch {
    return null;
  }
};
