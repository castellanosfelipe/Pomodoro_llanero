/** Utilidades de formato de tiempo, independientes de la UI. */

/** Formatea milisegundos restantes como mm:ss (redondea hacia arriba). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Formatea una duración en ms como "1 h 23 min" / "23 min" / "0 min". */
export function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}
