import { defineConfig } from "vitest/config";

// Configuración de pruebas. El dominio se prueba en Node (sin DOM); los
// componentes que lo necesiten usan jsdom.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [["src/components/**", "jsdom"]],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/domain/**", "src/fauna/**"],
      reporter: ["text", "html"],
    },
  },
});
