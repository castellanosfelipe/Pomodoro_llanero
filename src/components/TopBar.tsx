/**
 * Barra superior flotante sobre la zona de cielo.
 * Mínima: logo + navegación. Transparente para no romper el horizonte.
 */
import { useAppStore, type View } from "../state/store";
import { useT } from "../hooks/useT";
import { assetUrl } from "../lib/asset";

function NavBtn({
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
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
        active
          ? "bg-white/20 backdrop-blur-sm"
          : "opacity-60 hover:opacity-100"
      }`}
      style={{ color: "var(--day-text)" }}
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
    <header className="flex items-center justify-between px-4 py-2">
      <button
        onClick={() => setView("timer")}
        className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
        aria-label={t.app.name}
      >
        <img src={assetUrl("llano.svg")} alt="" className="h-5 w-5" />
        <span className="text-xs font-bold tracking-wide" style={{ color: "var(--day-text)" }}>
          {t.app.name}
        </span>
      </button>
      <nav className="flex items-center gap-0.5">
        <NavBtn active={view === "stats"} label={t.controls.stats} onClick={() => go("stats")} />
        <NavBtn active={view === "settings"} label={t.controls.settings} onClick={() => go("settings")} />
      </nav>
    </header>
  );
}
