import { describe, it, expect } from "vitest";
import { summarizeSessions, dayKey } from "./stats";
import type { Session } from "./types";

function focus(date: Date, completed = true, ms = 25 * 60_000): Session {
  return {
    kind: "focus",
    startedAt: date.getTime(),
    endedAt: date.getTime() + ms,
    plannedMs: ms,
    actualMs: ms,
    completed,
  };
}

const now = new Date(2026, 5, 29, 12, 0, 0); // 29 jun 2026, 12:00 local
const d = (day: number) => new Date(2026, 5, day, 10, 0, 0);

describe("summarizeSessions", () => {
  const sessions: Session[] = [
    // Hoy (29): 3 enfoques completados + 1 saltado (no cuenta)
    focus(d(29)),
    focus(d(29)),
    focus(d(29)),
    focus(d(29), false),
    // Ayer (28): 2 completados -> cumple meta (goal 2)
    focus(d(28)),
    focus(d(28)),
    // Antier (27): 1 completado -> NO cumple meta, rompe la racha
    focus(d(27)),
    // Run anterior de 3 días (10,11,12) con meta cumplida
    focus(d(10)),
    focus(d(10)),
    focus(d(11)),
    focus(d(11)),
    focus(d(12)),
    focus(d(12)),
    // Un descanso no debe contar
    { ...focus(d(29)), kind: "shortBreak" },
  ];

  const summary = summarizeSessions(sessions, 2, now);

  it("agrega los enfoques completados de hoy", () => {
    expect(summary.today.date).toBe(dayKey(now));
    expect(summary.today.completedFocus).toBe(3);
    expect(summary.today.goalMet).toBe(true);
  });

  it("calcula la racha actual (días consecutivos cumpliendo meta)", () => {
    expect(summary.currentStreakDays).toBe(2); // 28 y 29
  });

  it("calcula la mejor racha histórica", () => {
    expect(summary.longestStreakDays).toBe(3); // 10, 11, 12
  });

  it("la semana tiene 7 días y termina hoy", () => {
    expect(summary.week).toHaveLength(7);
    expect(summary.week[6].date).toBe(dayKey(now));
  });

  it("ignora descansos y enfoques no completados en los totales", () => {
    // 3 (hoy) + 2 (28) + 1 (27) + 6 (10-12) = 12 enfoques completados
    expect(summary.totalCompletedFocus).toBe(12);
  });
});
