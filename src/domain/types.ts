/**
 * Tipos de dominio compartidos por toda la app.
 *
 * Este módulo es **puro**: no importa React ni Tauri. Define los contratos
 * (`Settings`, `Session`, `AnimalAsset`, `Stats`) que viajan entre el dominio,
 * la infraestructura y la UI.
 */

// ---------------------------------------------------------------------------
// Temporizador / máquina de estados
// ---------------------------------------------------------------------------

/** Fase del ciclo Pomodoro. */
export type Phase = "focus" | "shortBreak" | "longBreak";

/**
 * Estado de ejecución. Combinado con `Phase` cubre los cinco estados del
 * enunciado: Inactivo (`idle`), Enfoque/DescansoCorto/DescansoLargo
 * (`running` + fase), y Pausado (`paused`).
 */
export type Status = "idle" | "running" | "paused";

/** Fuente de tiempo inyectable. Devuelve milisegundos monotónicos. */
export type Clock = () => number;

// ---------------------------------------------------------------------------
// Configuración (persistida en store JSON local)
// ---------------------------------------------------------------------------

export type ThemeMode = "light" | "dark" | "system";
export type Language = "es" | "en";
export type ReduceMotionPref = "system" | "on" | "off";
export type FaunaMode = "gallery" | "generative";
export type GenerativeBackend = "local" | "api";

export interface TimerSettings {
  /** Duración de enfoque en minutos (def. 25). */
  focusMinutes: number;
  /** Descanso corto en minutos (def. 5). */
  shortBreakMinutes: number;
  /** Descanso largo en minutos (def. 15). */
  longBreakMinutes: number;
  /** Pomodoros de enfoque antes de un descanso largo (def. 4). */
  pomodorosPerCycle: number;
  /** Auto-iniciar los descansos al terminar el enfoque. */
  autoStartBreaks: boolean;
  /** Auto-iniciar el enfoque al terminar el descanso. */
  autoStartFocus: boolean;
  /** Modo estricto: sin pausa durante el enfoque. */
  strictMode: boolean;
  /** Meta diaria de pomodoros completados. */
  dailyGoal: number;
}

export interface NotificationSettings {
  desktopNotifications: boolean;
  endSound: boolean;
  /** Volumen del sonido de fin, 0..1. */
  endSoundVolume: number;
  /** Identificador del sonido de fin (personalizable). */
  endSoundId: string;
  /** Tic-tac durante el enfoque. */
  tickingDuringFocus: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  /** Color de acento en hex (#rrggbb). */
  accentColor: string;
  language: Language;
  reduceMotion: ReduceMotionPref;
}

export interface WindowSettings {
  minimizeToTray: boolean;
  alwaysOnTop: boolean;
  /** Iniciar con el sistema (Login Items macOS / inicio Windows). */
  startOnLogin: boolean;
}

export interface ShortcutSettings {
  /** Aceleradores en formato Tauri (p. ej. "CmdOrCtrl+Shift+Space"). */
  startPause: string;
  skip: string;
  reset: string;
}

export interface GenerativeSettings {
  backend: GenerativeBackend;
  /** Nombre del proveedor por API (la clave se guarda en almacén seguro). */
  apiProvider: string;
  /** Ruta del modelo local (p. ej. Stable Diffusion). */
  localModelPath: string;
  /** Prompt base para la generación. */
  prompt: string;
}

export interface FaunaSettings {
  mode: FaunaMode;
  /** Categorías de animales habilitadas (mamifero, ave, reptil, ...). */
  categories: string[];
  showFunFact: boolean;
  fullScreenOnBreak: boolean;
  generative: GenerativeSettings;
}

export interface Settings {
  /** Versión del esquema para migraciones futuras. */
  schemaVersion: number;
  timer: TimerSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  window: WindowSettings;
  shortcuts: ShortcutSettings;
  fauna: FaunaSettings;
}

// ---------------------------------------------------------------------------
// Historial / estadísticas (persistido en SQLite)
// ---------------------------------------------------------------------------

export type SessionKind = Phase;

/** Una sesión registrada en el historial. */
export interface Session {
  id?: number;
  kind: SessionKind;
  /** Epoch ms de inicio (reloj de pared, para el historial). */
  startedAt: number;
  /** Epoch ms de fin. */
  endedAt: number;
  /** Duración planificada en ms. */
  plannedMs: number;
  /** Duración real en ms. */
  actualMs: number;
  /** True si llegó a 0; false si se saltó/abortó. */
  completed: boolean;
}

export interface DailyStats {
  /** Fecha local en formato YYYY-MM-DD. */
  date: string;
  completedFocus: number;
  focusMs: number;
  goal: number;
  goalMet: boolean;
}

export interface StatsSummary {
  today: DailyStats;
  /** Últimos 7 días, del más antiguo al más reciente. */
  week: DailyStats[];
  currentStreakDays: number;
  longestStreakDays: number;
  totalCompletedFocus: number;
  totalFocusMs: number;
}

// ---------------------------------------------------------------------------
// Fauna del Llano
// ---------------------------------------------------------------------------

export type LocalizedText = { es: string; en: string };

/** Metadato de un animal del Llano. Contrato del `ImageProvider`. */
export interface AnimalAsset {
  id: string;
  commonName: LocalizedText;
  scientificName: string;
  funFact: LocalizedText;
  /** Categoría: "mamifero" | "ave" | "reptil" | "anfibio" | ... */
  category: string;
  /** Ruta de imagen relativa a /public (galería) o data URL (generativo). */
  imagePath: string;
  /** Crédito y licencia de la imagen (verificar antes de empaquetar). */
  credit?: string;
  license?: string;
}
