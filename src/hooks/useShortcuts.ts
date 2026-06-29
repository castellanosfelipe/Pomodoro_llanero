/**
 * Atajos de teclado dentro de la app, configurables por el usuario. Parsea
 * aceleradores en formato Tauri (p. ej. "CmdOrCtrl+Shift+Space") y los compara
 * con el evento de teclado usando `event.code` para ser robusto ante Shift y
 * distribuciones de teclado.
 *
 * (El backend Rust puede además registrar atajos *globales* del sistema con
 * `tauri-plugin-global-shortcut`; estos cubren el caso con la app enfocada.)
 */
import { useEffect } from "react";
import { useAppStore } from "../state/store";
import { controller } from "../state/controller";

function codeToKey(code: string): string {
  if (code === "Space") return "space";
  if (code.startsWith("Key")) return code.slice(3).toLowerCase();
  if (code.startsWith("Digit")) return code.slice(5);
  return code.toLowerCase();
}

function matches(accel: string, e: KeyboardEvent): boolean {
  const parts = accel.toLowerCase().split("+");
  const wantMod = parts.some((p) =>
    ["cmdorctrl", "ctrl", "control", "cmd", "command", "meta", "super"].includes(p),
  );
  const wantShift = parts.includes("shift");
  const wantAlt = parts.includes("alt") || parts.includes("option");
  const key = parts[parts.length - 1];

  const modOk = !wantMod || e.ctrlKey || e.metaKey;
  return (
    modOk &&
    wantShift === e.shiftKey &&
    wantAlt === e.altKey &&
    codeToKey(e.code) === key
  );
}

export function useShortcuts(): void {
  const shortcuts = useAppStore((s) => s.settings.shortcuts);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // No interferir mientras se escribe en un campo.
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;

      if (matches(shortcuts.startPause, e)) {
        e.preventDefault();
        controller.toggle();
      } else if (matches(shortcuts.skip, e)) {
        e.preventDefault();
        controller.skip();
      } else if (matches(shortcuts.reset, e)) {
        e.preventDefault();
        controller.reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);
}
