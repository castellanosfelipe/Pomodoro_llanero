import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @tauri-apps/cli inyecta estas variables al ejecutar `tauri dev`/`tauri build`.
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Tauri espera un puerto fijo y falla si no está disponible.
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // No vigilar el directorio de Rust: lo gestiona Tauri.
      ignored: ["**/src-tauri/**"],
    },
  },

  // Producir artefactos compatibles con el webview de cada plataforma.
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
}));
