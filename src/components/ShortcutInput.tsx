/** Campo que captura una combinación de teclas y la guarda como acelerador. */
import { useState } from "react";

function toAccelerator(e: React.KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("CmdOrCtrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  const code = e.code;
  let key: string | null = null;
  if (code === "Space") key = "Space";
  else if (code.startsWith("Key")) key = code.slice(3);
  else if (code.startsWith("Digit")) key = code.slice(5);
  else if (/^(Arrow|F\d|Enter|Tab|Escape)/.test(code)) key = code;
  if (!key) return null;
  parts.push(key);
  return parts.join("+");
}

export function ShortcutInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [capturing, setCapturing] = useState(false);
  return (
    <input
      id={id}
      readOnly
      value={capturing ? "…" : value}
      onFocus={() => setCapturing(true)}
      onBlur={() => setCapturing(false)}
      onKeyDown={(e) => {
        e.preventDefault();
        const accel = toAccelerator(e);
        if (accel) {
          onChange(accel);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-44 cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  );
}
