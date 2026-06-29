/**
 * Resuelve una ruta de asset respetando el `base` de Vite.
 *
 * - En Tauri (y en `npm run dev`) el base es "/", así que las rutas absolutas
 *   como `/fauna/images/x.jpg` quedan igual.
 * - En GitHub Pages (project site) el base es "/Pomodoro_llanero/", y esta
 *   función antepone ese prefijo para que los assets no den 404.
 *
 * Deja intactas las URLs absolutas (http), `blob:` y `data:` (p. ej. imágenes
 * generadas), que no deben llevar prefijo.
 */
export function assetUrl(path: string): string {
  if (/^(data:|blob:|https?:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}
