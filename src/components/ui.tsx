/** Primitivas de UI accesibles y reutilizables para los paneles de ajustes. */
import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-llano-dusk">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Row({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={htmlFor} className="text-sm text-gray-700 dark:text-gray-200">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "accent-bg" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function NumberField({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      id={id}
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  );
}

export function SelectField<T extends string>({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Slider({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      id={id}
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-32 accent-[color:var(--accent)]"
    />
  );
}

export function TextField({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-48 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  );
}
