/**
 * Panel de ajustes por secciones. Cada cambio se aplica en caliente y se
 * persiste vía `controller.updateSettings` (que también re-configura el motor,
 * la apariencia, la ventana y el proveedor de fauna).
 */
import { controller } from "../state/controller";
import { useAppStore } from "../state/store";
import { useT } from "../hooks/useT";
import { AVAILABLE_SOUNDS, SOUND_LABELS, playEndSound } from "../infra";
import {
  Section,
  Row,
  Toggle,
  NumberField,
  SelectField,
  Slider,
} from "./ui";
import { ShortcutInput } from "./ShortcutInput";
import type {
  Settings,
  TimerSettings,
  NotificationSettings,
  AppearanceSettings,
  WindowSettings,
  ShortcutSettings,
  FaunaSettings,
} from "../domain/types";

export function SettingsPanel() {
  const t = useT();
  const s = useAppStore((st) => st.settings);

  const patch = (p: Partial<Settings>) => void controller.updateSettings(p);
  const timer = (p: Partial<TimerSettings>) => patch({ timer: { ...s.timer, ...p } });
  const notif = (p: Partial<NotificationSettings>) =>
    patch({ notifications: { ...s.notifications, ...p } });
  const appear = (p: Partial<AppearanceSettings>) =>
    patch({ appearance: { ...s.appearance, ...p } });
  const win = (p: Partial<WindowSettings>) => patch({ window: { ...s.window, ...p } });
  const sc = (p: Partial<ShortcutSettings>) => patch({ shortcuts: { ...s.shortcuts, ...p } });
  const fauna = (p: Partial<FaunaSettings>) => patch({ fauna: { ...s.fauna, ...p } });

  const toggleCategory = (cat: string) => {
    const has = s.fauna.categories.includes(cat);
    fauna({
      categories: has
        ? s.fauna.categories.filter((c) => c !== cat)
        : [...s.fauna.categories, cat],
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-6 text-xl font-bold" style={{ color: "var(--day-text)" }}>
        {t.settings.title}
      </h2>

      {/* Temporizador */}
      <Section title={t.settings.sections.timer}>
        <Row label={t.settings.timer.focus} htmlFor="focus">
          <NumberField id="focus" value={s.timer.focusMinutes} min={1} max={180}
            onChange={(v) => timer({ focusMinutes: v })} />
        </Row>
        <Row label={t.settings.timer.shortBreak} htmlFor="short">
          <NumberField id="short" value={s.timer.shortBreakMinutes} min={1} max={60}
            onChange={(v) => timer({ shortBreakMinutes: v })} />
        </Row>
        <Row label={t.settings.timer.longBreak} htmlFor="long">
          <NumberField id="long" value={s.timer.longBreakMinutes} min={1} max={90}
            onChange={(v) => timer({ longBreakMinutes: v })} />
        </Row>
        <Row label={t.settings.timer.perCycle} htmlFor="perCycle">
          <NumberField id="perCycle" value={s.timer.pomodorosPerCycle} min={1} max={12}
            onChange={(v) => timer({ pomodorosPerCycle: v })} />
        </Row>
        <Row label={t.settings.timer.dailyGoal} htmlFor="goal">
          <NumberField id="goal" value={s.timer.dailyGoal} min={0} max={50}
            onChange={(v) => timer({ dailyGoal: v })} />
        </Row>
        <Row label={t.settings.timer.autoStartBreaks} htmlFor="asb">
          <Toggle id="asb" label={t.settings.timer.autoStartBreaks}
            checked={s.timer.autoStartBreaks} onChange={(v) => timer({ autoStartBreaks: v })} />
        </Row>
        <Row label={t.settings.timer.autoStartFocus} htmlFor="asf">
          <Toggle id="asf" label={t.settings.timer.autoStartFocus}
            checked={s.timer.autoStartFocus} onChange={(v) => timer({ autoStartFocus: v })} />
        </Row>
        <Row label={t.settings.timer.strictMode} htmlFor="strict">
          <Toggle id="strict" label={t.settings.timer.strictMode}
            checked={s.timer.strictMode} onChange={(v) => timer({ strictMode: v })} />
        </Row>
      </Section>

      {/* Notificaciones y sonido */}
      <Section title={t.settings.sections.notifications}>
        <Row label={t.settings.notifications.desktop} htmlFor="desk">
          <Toggle id="desk" label={t.settings.notifications.desktop}
            checked={s.notifications.desktopNotifications}
            onChange={(v) => notif({ desktopNotifications: v })} />
        </Row>
        <Row label={t.settings.notifications.endSound} htmlFor="endsound">
          <Toggle id="endsound" label={t.settings.notifications.endSound}
            checked={s.notifications.endSound} onChange={(v) => notif({ endSound: v })} />
        </Row>
        <Row label={t.settings.notifications.sound} htmlFor="soundid">
          <div className="flex items-center gap-2">
            <SelectField id="soundid" value={s.notifications.endSoundId}
              options={AVAILABLE_SOUNDS.map((x) => ({ value: x, label: SOUND_LABELS[x] ?? x }))}
              onChange={(v) => notif({ endSoundId: v })} />
            <button
              type="button"
              onClick={() =>
                playEndSound(
                  s.notifications.endSoundId,
                  s.notifications.endSoundVolume || 0.7,
                )
              }
              className="settings-pill rounded-full px-3 py-1 text-sm"
              aria-label={t.settings.notifications.test}
              title={t.settings.notifications.test}
            >
              ▶ {t.settings.notifications.test}
            </button>
          </div>
        </Row>
        <Row label={t.settings.notifications.volume} htmlFor="vol">
          <Slider id="vol" value={s.notifications.endSoundVolume}
            onChange={(v) => notif({ endSoundVolume: v })} />
        </Row>
        <Row label={t.settings.notifications.ticking} htmlFor="tick">
          <Toggle id="tick" label={t.settings.notifications.ticking}
            checked={s.notifications.tickingDuringFocus}
            onChange={(v) => notif({ tickingDuringFocus: v })} />
        </Row>
      </Section>

      {/* Apariencia */}
      <Section title={t.settings.sections.appearance}>
        <Row label={t.settings.appearance.theme} htmlFor="theme">
          <SelectField id="theme" value={s.appearance.theme}
            options={[
              { value: "light", label: t.settings.appearance.themeLight },
              { value: "dark", label: t.settings.appearance.themeDark },
              { value: "system", label: t.settings.appearance.themeSystem },
            ]}
            onChange={(v) => appear({ theme: v })} />
        </Row>
        <Row label={t.settings.appearance.accent} htmlFor="accent">
          <input id="accent" type="color" value={s.appearance.accentColor}
            onChange={(e) => appear({ accentColor: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border"
            style={{ borderColor: "var(--day-horizon-from)" }} />
        </Row>
        <Row label={t.settings.appearance.language} htmlFor="lang">
          <SelectField id="lang" value={s.appearance.language}
            options={[
              { value: "es", label: "Español" },
              { value: "en", label: "English" },
            ]}
            onChange={(v) => appear({ language: v })} />
        </Row>
        <Row label={t.settings.appearance.reduceMotion} htmlFor="rm">
          <SelectField id="rm" value={s.appearance.reduceMotion}
            options={[
              { value: "system", label: t.settings.appearance.reduceMotionSystem },
              { value: "on", label: t.settings.appearance.reduceMotionOn },
              { value: "off", label: t.settings.appearance.reduceMotionOff },
            ]}
            onChange={(v) => appear({ reduceMotion: v })} />
        </Row>
      </Section>

      {/* Ventana y sistema */}
      <Section title={t.settings.sections.window}>
        <Row label={t.settings.window.minimizeToTray} htmlFor="mtt">
          <Toggle id="mtt" label={t.settings.window.minimizeToTray}
            checked={s.window.minimizeToTray} onChange={(v) => win({ minimizeToTray: v })} />
        </Row>
        <Row label={t.settings.window.alwaysOnTop} htmlFor="aot">
          <Toggle id="aot" label={t.settings.window.alwaysOnTop}
            checked={s.window.alwaysOnTop} onChange={(v) => win({ alwaysOnTop: v })} />
        </Row>
        <Row label={t.settings.window.startOnLogin} htmlFor="sol">
          <Toggle id="sol" label={t.settings.window.startOnLogin}
            checked={s.window.startOnLogin} onChange={(v) => win({ startOnLogin: v })} />
        </Row>
        <Row label={t.settings.window.blockOnBreak} htmlFor="bob">
          <Toggle id="bob" label={t.settings.window.blockOnBreak}
            checked={s.window.blockOnBreak} onChange={(v) => win({ blockOnBreak: v })} />
        </Row>
      </Section>

      {/* Atajos */}
      <Section title={t.settings.sections.shortcuts}>
        <Row label={t.settings.shortcuts.startPause} htmlFor="sc1">
          <ShortcutInput id="sc1" value={s.shortcuts.startPause}
            onChange={(v) => sc({ startPause: v })} />
        </Row>
        <Row label={t.settings.shortcuts.skip} htmlFor="sc2">
          <ShortcutInput id="sc2" value={s.shortcuts.skip} onChange={(v) => sc({ skip: v })} />
        </Row>
        <Row label={t.settings.shortcuts.reset} htmlFor="sc3">
          <ShortcutInput id="sc3" value={s.shortcuts.reset} onChange={(v) => sc({ reset: v })} />
        </Row>
        <p className="text-xs" style={{ color: "var(--day-text-soft)" }}>{t.settings.shortcuts.hint}</p>
      </Section>

      {/* Fauna del Llano */}
      <Section title={t.settings.sections.fauna}>
        <div>
          <span className="text-sm" style={{ color: "var(--day-text)" }}>
            {t.settings.fauna.categories}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { id: "mamifero", label: t.settings.fauna.catMamifero },
              { id: "ave", label: t.settings.fauna.catAve },
              { id: "reptil", label: t.settings.fauna.catReptil },
              { id: "pez", label: t.settings.fauna.catPez },
              { id: "paisaje", label: t.settings.fauna.catPaisaje },
              { id: "cultura", label: t.settings.fauna.catCultura },
            ].map((c) => (
              <button key={c.id} onClick={() => toggleCategory(c.id)}
                aria-pressed={s.fauna.categories.includes(c.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  s.fauna.categories.includes(c.id)
                    ? "accent-bg text-white"
                    : "settings-pill"
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <Row label={t.settings.fauna.showFunFact} htmlFor="ff">
          <Toggle id="ff" label={t.settings.fauna.showFunFact}
            checked={s.fauna.showFunFact} onChange={(v) => fauna({ showFunFact: v })} />
        </Row>
        <Row label={t.settings.fauna.fullScreen} htmlFor="fs">
          <Toggle id="fs" label={t.settings.fauna.fullScreen}
            checked={s.fauna.fullScreenOnBreak} onChange={(v) => fauna({ fullScreenOnBreak: v })} />
        </Row>
      </Section>

      {/* Créditos */}
      <footer className="mt-2 flex items-center justify-center gap-2 border-t pt-5"
        style={{ borderColor: "var(--day-horizon-from)" }}>
        <span className="text-xs" style={{ color: "var(--day-text-soft)" }}>
          Desarrollado por Bairon Felipe Peña Castellanos
        </span>
        <a
          href="https://www.linkedin.com/in/bairon-felipe-pe%C3%B1a-castellanos-ab18411b5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perfil de LinkedIn del desarrollador"
          title="LinkedIn"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#0A66C2", color: "#fff" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
}
