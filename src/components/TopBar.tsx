/** Barra superior: identidad de la app y navegación entre vistas. */
import { useAppStore, type View } from "../state/store";
import { useT } from "../hooks/useT";
import { assetUrl } from "../lib/asset";

function NavButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "accent-bg text-white"
          : "text-gray-500 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export function TopBar() {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  const go = (v: View) => setView(view === v ? "timer" : v);

  return (
    <header className="flex items-center justify-between px-4 py-2.5">
      <button
        onClick={() => setView("timer")}
        className="flex items-center gap-2"
        aria-label={t.app.name}
      >
        <img src={assetUrl("llano.svg")} alt="" className="h-6 w-6" />
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {t.app.name}
        </span>
      </button>
      <nav className="flex items-center gap-1">
        <NavButton active={view === "stats"} label={t.controls.stats} onClick={() => go("stats")} />
        <NavButton active={view === "settings"} label={t.controls.settings} onClick={() => go("settings")} />
      </nav>
    </header>
  );
}
