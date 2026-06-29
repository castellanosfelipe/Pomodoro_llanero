/**
 * Notificaciones de escritorio nativas. Detrás de la interfaz `Notifier` para
 * desacoplar la UI del plugin de Tauri y degradar a la API del navegador en dev.
 */
import { isTauri } from "./env";

export interface Notifier {
  notify(title: string, body: string): Promise<void>;
}

class TauriNotifier implements Notifier {
  async notify(title: string, body: string): Promise<void> {
    const mod = await import("@tauri-apps/plugin-notification");
    let granted = await mod.isPermissionGranted();
    if (!granted) granted = (await mod.requestPermission()) === "granted";
    if (granted) mod.sendNotification({ title, body });
  }
}

class BrowserNotifier implements Notifier {
  async notify(title: string, body: string): Promise<void> {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") await Notification.requestPermission();
    if (Notification.permission === "granted") new Notification(title, { body });
  }
}

let instance: Notifier | null = null;
export function getNotifier(): Notifier {
  if (!instance) instance = isTauri() ? new TauriNotifier() : new BrowserNotifier();
  return instance;
}
