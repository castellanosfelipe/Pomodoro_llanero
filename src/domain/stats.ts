/**
 * Agregación de estadísticas — función pura y testeable.
 *
 * A partir del historial de sesiones calcula el resumen diario/semanal, el
 * cumplimiento de meta y las rachas. Vive en el dominio para no depender de
 * SQLite ni de la UI; los repositorios sólo aportan los datos crudos.
 */
import type { Session, DailyStats, StatsSummary } from "./types";

/** Clave de día local en formato YYYY-MM-DD. */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

interface DayAgg {
  completedFocus: number;
  focusMs: number;
}

export function summarizeSessions(
  sessions: readonly Session[],
  goal: number,
  now: Date = new Date(),
): StatsSummary {
  const byDay = new Map<string, DayAgg>();
  let totalCompletedFocus = 0;
  let totalFocusMs = 0;

  for (const s of sessions) {
    if (s.kind !== "focus" || !s.completed) continue;
    const key = dayKey(new Date(s.startedAt));
    const agg = byDay.get(key) ?? { completedFocus: 0, focusMs: 0 };
    agg.completedFocus += 1;
    agg.focusMs += s.actualMs;
    byDay.set(key, agg);
    totalCompletedFocus += 1;
    totalFocusMs += s.actualMs;
  }

  const metGoal = (agg: DayAgg | undefined): boolean => {
    const focus = agg?.completedFocus ?? 0;
    return goal > 0 ? focus >= goal : focus > 0;
  };

  const toDaily = (key: string): DailyStats => {
    const agg = byDay.get(key);
    return {
      date: key,
      completedFocus: agg?.completedFocus ?? 0,
      focusMs: agg?.focusMs ?? 0,
      goal,
      goalMet: metGoal(agg),
    };
  };

  const todayKey = dayKey(now);
  const today = toDaily(todayKey);

  // Últimos 7 días, del más antiguo al más reciente.
  const week: DailyStats[] = [];
  for (let i = 6; i >= 0; i--) week.push(toDaily(dayKey(addDays(now, -i))));

  // Racha actual: días consecutivos cumpliendo meta terminando hoy (o ayer si
  // hoy aún no se ha cumplido, para no mostrar 0 a mitad de jornada).
  let currentStreakDays = 0;
  let cursor = metGoal(byDay.get(todayKey)) ? new Date(now) : addDays(now, -1);
  while (metGoal(byDay.get(dayKey(cursor)))) {
    currentStreakDays += 1;
    cursor = addDays(cursor, -1);
  }

  // Mejor racha: el run consecutivo más largo de días con meta cumplida.
  const metDays = new Set(
    [...byDay.entries()].filter(([, a]) => metGoal(a)).map(([k]) => k),
  );
  let longestStreakDays = 0;
  for (const key of metDays) {
    const prev = dayKey(addDays(new Date(`${key}T00:00:00`), -1));
    if (metDays.has(prev)) continue; // no es el inicio de un run
    let len = 0;
    let c = new Date(`${key}T00:00:00`);
    while (metDays.has(dayKey(c))) {
      len += 1;
      c = addDays(c, 1);
    }
    if (len > longestStreakDays) longestStreakDays = len;
  }

  return {
    today,
    week,
    currentStreakDays,
    longestStreakDays,
    totalCompletedFocus,
    totalFocusMs,
  };
}
