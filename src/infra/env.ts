/**
 * Detección de entorno. La app corre tanto bajo Tauri (escritorio nativo) como
 * en un navegador (`npm run dev`, tests E2E). Toda la infraestructura degrada a
 * un sustituto de navegador cuando Tauri no está presente, para poder iterar la
 * UI sin compilar Rust.
 */
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
