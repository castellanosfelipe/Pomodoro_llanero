/**
 * Orquestador de la aplicación.
 *
 * Es el único punto donde se cruzan dominio e infraestructura: posee el motor
 * (`PomodoroEngine`) y reacciona a sus eventos aplicando efectos
 * (notificaciones, sonido, persistencia de sesiones, selección de fauna). El
 * estado observable se publica en el store de Zustand. La UI sólo llama a los
 * métodos de control y lee el store; no conoce el motor ni la infraestructura.
 */
import { PomodoroEngine, type EngineEvent } from "../domain/timer";
import type { Session, Settings } from "../domain/types";
import { toEngineConfig, mergeSettings } from "../domain/defaults";
import {
  createMonotonicClock,
  loadSettings,
  saveSettings,
  getNotifier,
  getStatsRepo,
  setAutostart,
  setAlwaysOnTop,
  playEndSound,
  startTicking,
  stopTicking,
  tauriGenerate,
  updateTrayTitle,
  setCloseToTray,
  onTrayAction,
  enterBreakBlock,
  exitBreakBlock,
} from "../infra";
import { createFaunaProvider, type ImageProvider } from "../fauna";
import { getDict } from "../i18n";
import { formatClock } from "../lib/format";
import { useAppStore } from "./store";

const TICK_MS = 200;

export class AppController {
  private engine!: PomodoroEngine;
  private provider!: ImageProvider;
  private settings!: Settings;
  private tickHandle: number | null = null;
  private phaseStartWall = 0;
  private lastTrayText = "";
  private breakBlocked = false;

  // -------------------------------------------------------------------------
  // Arranque
  // -------------------------------------------------------------------------

  async bootstrap(): Promise<void> {
    // loadSettings() ya tiene fallback interno a DEFAULT_SETTINGS.
    this.settings = await loadSettings();

    // El motor es puro — nunca lanza.
    this.engine = new PomodoroEngine(
      toEngineConfig(this.settings.timer),
      createMonotonicClock(),
    );
    this.engine.subscribe((event, _state) => this.onEngineEvent(event));

    // Plugins nativos: toleramos fallos para que la app siempre arranque.
    try { await getStatsRepo().init(); } catch (e) { console.warn("[stats]", e); }
    try { await this.rebuildProvider(); } catch (e) { console.warn("[fauna]", e); }
    this.applyAppearance();
    try { await this.applyWindowSettings(); } catch (e) { console.warn("[window]", e); }
    try { await setCloseToTray(this.settings.window.minimizeToTray); } catch (e) { console.warn("[tray]", e); }
    void onTrayAction((action) => this.handleTrayAction(action));

    this.publishState();
    this.updateTray();
    try { await this.refreshStats(); } catch (e) { console.warn("[stats refresh]", e); }

    this.startTickLoop();
    this.bindCatchUp();

    // Siempre se alcanza, incluso si los plugins nativos fallaron.
    useAppStore.setState({ settings: this.settings, ready: true });
  }

  private handleTrayAction(action: string): void {
    if (action === "toggle") this.toggle();
    else if (action === "skip") this.skip();
    else if (action === "settings") useAppStore.setState({ view: "settings" });
  }

  /** Refleja la fase y el tiempo restante en la bandeja (sin spamear IPC). */
  private updateTray(): void {
    const s = this.engine.getState();
    const label = getDict(this.settings.appearance.language).phase[s.phase];
    const text =
      s.status === "idle" ? label : `${label} · ${formatClock(s.remainingMs)}`;
    if (text !== this.lastTrayText) {
      this.lastTrayText = text;
      void updateTrayTitle(text);
    }
  }

  // -------------------------------------------------------------------------
  // Controles (delegados por la UI / bandeja / atajos)
  // -------------------------------------------------------------------------

  start = () => this.engine.start();
  toggle = () => this.engine.toggle();
  pause = () => this.engine.pause();
  skip = () => this.engine.skip();
  reset = () => this.engine.reset();

  getEngine() {
    return this.engine;
  }

  // -------------------------------------------------------------------------
  // Ajustes
  // -------------------------------------------------------------------------

  async updateSettings(patch: Partial<Settings>): Promise<void> {
    const previous = this.settings;
    this.settings = mergeSettings({ ...previous, ...patch });

    // Aplica al motor en caliente.
    this.engine.setConfig(toEngineConfig(this.settings.timer));

    // Apariencia y ventana.
    this.applyAppearance();
    await this.applyWindowSettings();
    await setCloseToTray(this.settings.window.minimizeToTray);

    // Fauna: refiltra o reconstruye según lo que cambió.
    const faunaChanged =
      JSON.stringify(previous.fauna) !== JSON.stringify(this.settings.fauna);
    if (faunaChanged) await this.rebuildProvider();

    // Si el usuario desactiva blockOnBreak mientras hay un descanso activo, salir.
    if (!this.settings.window.blockOnBreak && this.breakBlocked) {
      this.breakBlocked = false;
      void exitBreakBlock(this.settings.window.alwaysOnTop);
    }

    // Tic-tac y persistencia.
    this.updateTicking();
    await saveSettings(this.settings);

    useAppStore.setState({ settings: this.settings });
    await this.refreshStats();
  }

  // -------------------------------------------------------------------------
  // Reacción a eventos del motor
  // -------------------------------------------------------------------------

  private onEngineEvent(event: EngineEvent): void {
    this.publishState();
    this.updateTray();

    switch (event.kind) {
      case "phaseChanged":
        if (event.reason === "start" || event.auto) {
          this.phaseStartWall = Date.now();
        }
        if (event.to !== "focus") void this.pickAnimal();
        this.updateTicking();
        this.applyBreakBlock(event.to);
        // Celebración al completar un ciclo (inicio de siesta llanera)
        if (event.to === "longBreak" && event.reason === "completed") {
          useAppStore.setState({ showCelebration: true });
          setTimeout(() => useAppStore.setState({ showCelebration: false }), 3500);
        }
        break;

      case "phaseCompleted":
        void this.recordSession(event.phase, event.plannedMs, event.actualMs, true);
        this.announce(event.phase);
        this.updateTicking();
        break;

      case "phaseSkipped":
        void this.recordSession(event.phase, event.plannedMs, event.actualMs, false);
        this.updateTicking();
        break;

      case "statusChanged":
        this.updateTicking();
        break;

      case "tick":
        break;
    }
  }

  private announce(phase: Session["kind"]): void {
    const { notifications } = this.settings;
    const t = getDict(this.settings.appearance.language).notifications;
    if (phase === "focus") {
      if (notifications.desktopNotifications)
        void getNotifier().notify(t.focusDoneTitle, t.focusDoneBody);
    } else if (notifications.desktopNotifications) {
      void getNotifier().notify(t.breakDoneTitle, t.breakDoneBody);
    }
    if (notifications.endSound)
      playEndSound(notifications.endSoundId, notifications.endSoundVolume);
  }

  private async recordSession(
    kind: Session["kind"],
    plannedMs: number,
    actualMs: number,
    completed: boolean,
  ): Promise<void> {
    const endedAt = Date.now();
    const startedAt = this.phaseStartWall || endedAt - actualMs;
    const session: Session = { kind, startedAt, endedAt, plannedMs, actualMs, completed };
    await getStatsRepo().recordSession(session);
    await this.refreshStats();
  }

  // -------------------------------------------------------------------------
  // Fauna
  // -------------------------------------------------------------------------

  private async rebuildProvider(): Promise<void> {
    this.provider = createFaunaProvider(this.settings.fauna, {
      generate: tauriGenerate,
    });
    await this.provider.ready();
    this.provider.setCategories(this.settings.fauna.categories);
  }

  /** Elige y publica el siguiente animal (sin repetir). Pública para "otro". */
  async pickAnimal(): Promise<void> {
    const animal = await this.provider.next();
    useAppStore.setState({ animal });
  }

  // -------------------------------------------------------------------------
  // Apariencia / ventana
  // -------------------------------------------------------------------------

  private applyBreakBlock(phase: string): void {
    const onBreak = phase === "shortBreak" || phase === "longBreak";
    if (this.settings.window.blockOnBreak && onBreak && !this.breakBlocked) {
      this.breakBlocked = true;
      void enterBreakBlock();
    } else if ((!onBreak || !this.settings.window.blockOnBreak) && this.breakBlocked) {
      this.breakBlocked = false;
      void exitBreakBlock(this.settings.window.alwaysOnTop);
    }
  }

  private applyAppearance(): void {
    if (typeof document === "undefined") return;
    const { theme, accentColor } = this.settings.appearance;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.setProperty("--accent", accentColor);
  }

  private async applyWindowSettings(): Promise<void> {
    await setAlwaysOnTop(this.settings.window.alwaysOnTop);
    await setAutostart(this.settings.window.startOnLogin);
  }

  // -------------------------------------------------------------------------
  // Tic-tac
  // -------------------------------------------------------------------------

  private updateTicking(): void {
    const s = this.engine.getState();
    const on =
      this.settings.notifications.tickingDuringFocus &&
      s.phase === "focus" &&
      s.status === "running";
    if (on) startTicking(this.settings.notifications.endSoundVolume);
    else stopTicking();
  }

  // -------------------------------------------------------------------------
  // Bucle de muestreo + recuperación tras suspensión/segundo plano
  // -------------------------------------------------------------------------

  private startTickLoop(): void {
    if (this.tickHandle !== null) clearInterval(this.tickHandle);
    this.tickHandle = window.setInterval(() => this.engine.tick(), TICK_MS);
  }

  /** Detiene el bucle de muestreo (p. ej. al cerrar). */
  dispose(): void {
    if (this.tickHandle !== null) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
    stopTicking();
  }

  /**
   * Al volver del segundo plano o de la suspensión, fuerza un `tick` inmediato
   * para que el motor recupere el tiempo real transcurrido sin esperar al
   * siguiente intervalo.
   */
  private bindCatchUp(): void {
    if (typeof document === "undefined") return;
    const catchUp = () => this.engine.tick();
    document.addEventListener("visibilitychange", catchUp);
    window.addEventListener("focus", catchUp);
  }

  private publishState(): void {
    useAppStore.setState({ engine: this.engine.getState() });
  }

  private async refreshStats(): Promise<void> {
    const summary = await getStatsRepo().getSummary(this.settings.timer.dailyGoal);
    useAppStore.setState({ stats: summary });
  }
}

/** Singleton del controlador, accesible por bandeja/atajos fuera de React. */
export const controller = new AppController();
