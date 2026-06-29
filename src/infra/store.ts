/**
 * Persistencia de la configuración (JSON, local-first).
 *
 * Contrato `SettingsStore` con dos implementaciones detrás de la misma interfaz:
 *  - `TauriSettingsStore`: usa `tauri-plugin-store` (archivo JSON en el directorio
 *    de datos de la app).
 *  - `LocalStorageSettingsStore`: respaldo para `npm run dev` en el navegador.
 *
 * `loadSettings`/`saveSettings` siempre devuelven ajustes válidos fusionados con
 * los valores por defecto (robusto ante esquemas viejos o archivos corruptos).
 */
import type { Settings } from "../domain/types";
import { mergeSettings, DEFAULT_SETTINGS } from "../domain/defaults";
import { isTauri } from "./env";

const STORE_FILE = "settings.json";
const STORE_KEY = "settings";

export interface SettingsStore {
  load(): Promise<Settings>;
  save(settings: Settings): Promise<void>;
}

class LocalStorageSettingsStore implements SettingsStore {
  async load(): Promise<Settings> {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? mergeSettings(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }
  async save(settings: Settings): Promise<void> {
    localStorage.setItem(STORE_KEY, JSON.stringify(settings));
  }
}

class TauriSettingsStore implements SettingsStore {
  private storePromise: Promise<{
    get<T>(key: string): Promise<T | undefined>;
    set(key: string, value: unknown): Promise<void>;
    save(): Promise<void>;
  }> | null = null;

  private getStore() {
    if (!this.storePromise) {
      // Import dinámico: sólo se evalúa bajo Tauri.
      this.storePromise = import("@tauri-apps/plugin-store").then((m) =>
        m.load(STORE_FILE),
      );
    }
    return this.storePromise;
  }

  async load(): Promise<Settings> {
    try {
      const store = await this.getStore();
      const raw = await store.get<Partial<Settings>>(STORE_KEY);
      return mergeSettings(raw);
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async save(settings: Settings): Promise<void> {
    const store = await this.getStore();
    await store.set(STORE_KEY, settings);
    await store.save();
  }
}

let instance: SettingsStore | null = null;

export function getSettingsStore(): SettingsStore {
  if (!instance) {
    instance = isTauri()
      ? new TauriSettingsStore()
      : new LocalStorageSettingsStore();
  }
  return instance;
}

export const loadSettings = () => getSettingsStore().load();
export const saveSettings = (s: Settings) => getSettingsStore().save(s);
