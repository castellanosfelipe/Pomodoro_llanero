/**
 * Motor Pomodoro — máquina de estados pura y desacoplada de la UI.
 *
 * Decisiones clave de diseño:
 *
 *  - **Precisión por timestamps (reloj monotónico).** El tiempo restante NUNCA
 *    se calcula contando ticks de `setInterval` (que se acumulan y derivan, y
 *    se congelan al suspender el equipo). En su lugar se guarda cuándo empezó
 *    el segmento en curso y cuánto se había acumulado antes; el restante se
 *    deriva de `now()`. El host sólo necesita llamar a `tick()` periódicamente
 *    para *muestrear*: la corrección viene de la aritmética de tiempos, así que
 *    si el equipo se suspende y reactiva, el siguiente `tick()` ve el tiempo
 *    real transcurrido y completa la fase correctamente.
 *
 *  - **Reloj inyectable** (`Clock`): el dominio no conoce `performance.now()`
 *    ni `Date.now()`. Los tests inyectan un reloj falso y controlan el tiempo.
 *
 *  - **Efectos como eventos.** El motor no dispara notificaciones, sonidos ni
 *    guarda en disco: emite `EngineEvent`s y el host (infra/UI) aplica los
 *    efectos. Esto mantiene el dominio puro y testeable.
 */

import type { Clock, Phase, Status } from "./types";

/** Configuración de ejecución derivada de `TimerSettings`. */
export interface EngineConfig {
  focusMs: number;
  shortBreakMs: number;
  longBreakMs: number;
  pomodorosPerCycle: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  strictMode: boolean;
}

/** Estado observable del motor (lo que la UI necesita pintar). */
export interface EngineState {
  phase: Phase;
  status: Status;
  /** Duración de la fase actual en ms. */
  durationMs: number;
  /** Tiempo restante en ms (>= 0). */
  remainingMs: number;
  /** Tiempo transcurrido en la fase actual en ms. */
  elapsedMs: number;
  /** Enfoques completados dentro del ciclo actual (0..pomodorosPerCycle). */
  completedFocusInCycle: number;
  /** Enfoques completados desde que se creó el motor (acumulado de sesión). */
  completedFocusTotal: number;
}

export type TransitionReason = "completed" | "skipped" | "reset" | "start";

/** Eventos emitidos por el motor para que el host aplique efectos. */
export type EngineEvent =
  | {
      kind: "phaseChanged";
      from: Phase;
      to: Phase;
      reason: TransitionReason;
      /** True si la nueva fase arrancó automáticamente (auto-start). */
      auto: boolean;
    }
  | {
      kind: "phaseCompleted";
      phase: Phase;
      plannedMs: number;
      actualMs: number;
    }
  | {
      kind: "phaseSkipped";
      phase: Phase;
      plannedMs: number;
      actualMs: number;
    }
  | { kind: "statusChanged"; status: Status }
  | { kind: "tick"; remainingMs: number; elapsedMs: number };

export type EngineListener = (event: EngineEvent, state: EngineState) => void;

const DEFAULT_CONFIG: EngineConfig = {
  focusMs: 25 * 60_000,
  shortBreakMs: 5 * 60_000,
  longBreakMs: 15 * 60_000,
  pomodorosPerCycle: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  strictMode: false,
};

export class PomodoroEngine {
  private config: EngineConfig;
  private readonly now: Clock;
  private readonly listeners = new Set<EngineListener>();

  // --- Estado de fase ---
  private phase: Phase = "focus";
  private status: Status = "idle";

  // --- Contadores de ciclo ---
  private completedFocusInCycle = 0;
  private completedFocusTotal = 0;

  // --- Timing interno (monotónico) ---
  /** Duración de la fase en curso (ms). */
  private durationMs: number;
  /** Marca monotónica de inicio del segmento corriendo, o null si parado. */
  private runStartedAt: number | null = null;
  /** Tiempo ya acumulado en esta fase antes del segmento actual (ms). */
  private elapsedBeforeMs = 0;

  constructor(config: Partial<EngineConfig> = {}, now: Clock = Date.now) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.now = now;
    this.durationMs = this.config.focusMs;
  }

  // -------------------------------------------------------------------------
  // Suscripción
  // -------------------------------------------------------------------------

  subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: EngineEvent): void {
    const state = this.getState();
    for (const listener of this.listeners) listener(event, state);
  }

  // -------------------------------------------------------------------------
  // Lectura de estado
  // -------------------------------------------------------------------------

  /** Tiempo transcurrido en la fase actual, derivado del reloj monotónico. */
  private computeElapsed(): number {
    if (this.status === "running" && this.runStartedAt !== null) {
      // Guarda contra retrocesos del reloj: nunca restamos tiempo.
      const delta = Math.max(0, this.now() - this.runStartedAt);
      return this.elapsedBeforeMs + delta;
    }
    return this.elapsedBeforeMs;
  }

  getState(): EngineState {
    const elapsed = Math.min(this.computeElapsed(), this.durationMs);
    return {
      phase: this.phase,
      status: this.status,
      durationMs: this.durationMs,
      remainingMs: Math.max(0, this.durationMs - elapsed),
      elapsedMs: elapsed,
      completedFocusInCycle: this.completedFocusInCycle,
      completedFocusTotal: this.completedFocusTotal,
    };
  }

  getConfig(): EngineConfig {
    return { ...this.config };
  }

  // -------------------------------------------------------------------------
  // Configuración en caliente
  // -------------------------------------------------------------------------

  /**
   * Actualiza la configuración. Si cambia la duración de la fase en curso, se
   * reajusta conservando el tiempo ya transcurrido (puede completar la fase en
   * el siguiente `tick` si la nueva duración es menor que lo transcurrido).
   */
  setConfig(config: Partial<EngineConfig>): void {
    this.config = { ...this.config, ...config };
    const newDuration = this.durationForPhase(this.phase);
    if (newDuration !== this.durationMs) {
      this.durationMs = newDuration;
      this.emit({ kind: "tick", ...this.tickPayload() });
    }
  }

  private durationForPhase(phase: Phase): number {
    switch (phase) {
      case "focus":
        return this.config.focusMs;
      case "shortBreak":
        return this.config.shortBreakMs;
      case "longBreak":
        return this.config.longBreakMs;
    }
  }

  // -------------------------------------------------------------------------
  // Controles
  // -------------------------------------------------------------------------

  /** Inicia/arranca la fase actual desde `idle`, o reanuda si está pausado. */
  start(): void {
    if (this.status === "running") return;
    if (this.status === "paused") {
      this.resume();
      return;
    }
    // idle -> running
    this.beginRun();
    this.setStatus("running");
    this.emit({
      kind: "phaseChanged",
      from: this.phase,
      to: this.phase,
      reason: "start",
      auto: false,
    });
  }

  pause(): void {
    if (this.status !== "running") return;
    // Modo estricto: el enfoque no se puede pausar.
    if (this.config.strictMode && this.phase === "focus") return;
    this.elapsedBeforeMs = this.computeElapsed();
    this.runStartedAt = null;
    this.setStatus("paused");
  }

  resume(): void {
    if (this.status !== "paused") return;
    this.runStartedAt = this.now();
    this.setStatus("running");
  }

  /** Alterna entre iniciar / pausar / reanudar según el estado. */
  toggle(): void {
    if (this.status === "running") this.pause();
    else this.start();
  }

  /** Salta a la siguiente fase. No cuenta el enfoque como completado. */
  skip(): void {
    const from = this.phase;
    const elapsed = Math.min(this.computeElapsed(), this.durationMs);
    this.emit({
      kind: "phaseSkipped",
      phase: from,
      plannedMs: this.durationMs,
      actualMs: elapsed,
    });
    // Saltar no incrementa contadores de enfoque: sólo avanza de fase.
    const to = this.nextPhase(from, /* countFocus */ false);
    this.transitionTo(to, from, "skipped");
  }

  /** Reinicio completo: vuelve a un estado limpio de enfoque inactivo. */
  reset(): void {
    const from = this.phase;
    this.completedFocusInCycle = 0;
    this.completedFocusTotal = 0;
    this.phase = "focus";
    this.durationMs = this.config.focusMs;
    this.clearTiming();
    this.setStatus("idle");
    this.emit({
      kind: "phaseChanged",
      from,
      to: "focus",
      reason: "reset",
      auto: false,
    });
  }

  /**
   * Avanza el reloj: recalcula el restante y completa la fase si llegó a 0.
   * El host lo llama periódicamente (intervalo o requestAnimationFrame) sólo
   * para *muestrear*; la corrección viene de la aritmética con `now()`, de modo
   * que un solo `tick()` tras una suspensión larga completa la fase sin derivar.
   */
  tick(): void {
    if (this.status !== "running") return;
    const elapsed = this.computeElapsed();
    if (elapsed >= this.durationMs) {
      this.completeCurrentPhase();
      return;
    }
    this.emit({ kind: "tick", ...this.tickPayload() });
  }

  // -------------------------------------------------------------------------
  // Transiciones internas
  // -------------------------------------------------------------------------

  private completeCurrentPhase(): void {
    const from = this.phase;
    this.emit({
      kind: "phaseCompleted",
      phase: from,
      plannedMs: this.durationMs,
      actualMs: this.durationMs,
    });
    const to = this.nextPhase(from, /* countFocus */ true);
    this.transitionTo(to, from, "completed");
  }

  /**
   * Calcula la siguiente fase. Si `countFocus` y la fase actual es enfoque,
   * incrementa los contadores y decide entre descanso corto o largo.
   */
  private nextPhase(from: Phase, countFocus: boolean): Phase {
    if (from === "focus") {
      if (countFocus) {
        this.completedFocusInCycle += 1;
        this.completedFocusTotal += 1;
        const isCycleEnd =
          this.completedFocusInCycle >= this.config.pomodorosPerCycle;
        return isCycleEnd ? "longBreak" : "shortBreak";
      }
      // Saltar el enfoque: descanso según el progreso actual del ciclo.
      const isCycleEnd =
        this.completedFocusInCycle >= this.config.pomodorosPerCycle;
      return isCycleEnd ? "longBreak" : "shortBreak";
    }
    // Tras cualquier descanso, vuelve el enfoque.
    return "focus";
  }

  private transitionTo(to: Phase, from: Phase, reason: TransitionReason): void {
    // Al empezar un descanso largo se cierra el ciclo: reinicia el contador.
    if (to === "longBreak") this.completedFocusInCycle = 0;

    this.phase = to;
    this.durationMs = this.durationForPhase(to);
    this.clearTiming();

    const auto =
      (to === "focus" && this.config.autoStartFocus) ||
      (to !== "focus" && this.config.autoStartBreaks);

    if (auto) {
      this.beginRun();
      this.setStatus("running");
    } else {
      this.setStatus("idle");
    }

    this.emit({ kind: "phaseChanged", from, to, reason, auto });
  }

  // -------------------------------------------------------------------------
  // Utilidades de timing
  // -------------------------------------------------------------------------

  private beginRun(): void {
    this.runStartedAt = this.now();
    this.elapsedBeforeMs = 0;
  }

  private clearTiming(): void {
    this.runStartedAt = null;
    this.elapsedBeforeMs = 0;
  }

  private setStatus(status: Status): void {
    if (this.status === status) return;
    this.status = status;
    this.emit({ kind: "statusChanged", status });
  }

  private tickPayload(): { remainingMs: number; elapsedMs: number } {
    const elapsed = Math.min(this.computeElapsed(), this.durationMs);
    return {
      remainingMs: Math.max(0, this.durationMs - elapsed),
      elapsedMs: elapsed,
    };
  }
}
