/** Panel de estadísticas: resumen de hoy, rachas y gráfico semanal. */
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";
import { formatDuration } from "../lib/format";
import type { Language } from "../domain/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
      <div className="text-2xl font-bold accent-text">{value}</div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

/** Abreviatura del día de la semana derivada de la fecha real (no de un índice fijo). */
function dayAbbr(dateStr: string, lang: Language): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
    weekday: "narrow",
  }).format(new Date(y, m - 1, d));
}

export function StatsPanel() {
  const t = useT();
  const stats = useAppStore((s) => s.stats);
  const lang = useAppStore((s) => s.settings.appearance.language);

  if (!stats || stats.totalCompletedFocus === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
        {t.stats.noData}
      </div>
    );
  }

  const maxFocus = Math.max(1, ...stats.week.map((d) => d.completedFocus));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {t.stats.title}
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t.stats.completedFocus} value={String(stats.today.completedFocus)} />
        <Stat label={t.stats.focusTime} value={formatDuration(stats.today.focusMs)} />
        <Stat
          label={t.stats.currentStreak}
          value={`${stats.currentStreakDays} ${t.stats.days}`}
        />
        <Stat
          label={t.stats.longestStreak}
          value={`${stats.longestStreakDays} ${t.stats.days}`}
        />
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-llano-dusk">
        {t.stats.week}
      </h3>
      <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
        {stats.week.map((day) => {
          const h = (day.completedFocus / maxFocus) * 100;
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  title={`${day.date}: ${day.completedFocus}`}
                  className={`w-full rounded-t-md ${
                    day.goalMet ? "accent-bg" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{ height: `${Math.max(4, h)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dayAbbr(day.date, lang)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {t.stats.total}: <span className="font-semibold">{stats.totalCompletedFocus}</span>{" "}
        · {formatDuration(stats.totalFocusMs)}
      </div>
    </div>
  );
}
