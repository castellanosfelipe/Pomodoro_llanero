/**
 * Ciclo del día llanero.
 *
 * La sabana tiene seis momentos distintos de luz; la app los refleja
 * actualizando las CSS custom properties en el root cada minuto con
 * una transición de 60 s para que el cambio sea imperceptible en el
 * momento pero evidente si se abre la app dos horas después.
 */
import { useEffect, useState } from "react";

export type DaySlot = "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
export type FaunaKey = "garza" | "chiguiro" | "corocora" | "caiman";

export interface DayState {
  slot: DaySlot;
  faunaKey: FaunaKey;
  isDark: boolean;
  canvasColor: string;
  canvasMidColor: string;
  textColor: string;
  textSoftColor: string;
  accentColor: string;
  skyFrom: string;
  skyTo: string;
  horizonFrom: string;
  horizonTo: string;
}

interface SlotDef {
  startMin: number;
  endMin: number;
  state: DayState;
}

const SLOTS: SlotDef[] = [
  // 5:00 – 7:00  Amanecer
  {
    startMin: 5 * 60,
    endMin: 7 * 60,
    state: {
      slot: "dawn",
      faunaKey: "garza",
      isDark: true,
      canvasColor: "#1A0F08",
      canvasMidColor: "#2E1A0E",
      textColor: "#F5E6C8",
      textSoftColor: "#C8A070",
      accentColor: "#C1440E",
      skyFrom: "#3A1A08",
      skyTo: "#1A0F08",
      horizonFrom: "#C4581A",
      horizonTo: "#E8A22A",
    },
  },
  // 7:00 – 12:00  Mañana despejada
  {
    startMin: 7 * 60,
    endMin: 12 * 60,
    state: {
      slot: "morning",
      faunaKey: "garza",
      isDark: false,
      canvasColor: "#FDF6E3",
      canvasMidColor: "#F0E4C2",
      textColor: "#2C1810",
      textSoftColor: "#6B4226",
      accentColor: "#8B4513",
      skyFrom: "#87CEEB",
      skyTo: "#FDF6E3",
      horizonFrom: "#D4A843",
      horizonTo: "#A8C4D4",
    },
  },
  // 12:00 – 15:00  Mediodía
  {
    startMin: 12 * 60,
    endMin: 15 * 60,
    state: {
      slot: "noon",
      faunaKey: "chiguiro",
      isDark: false,
      canvasColor: "#FFF8E7",
      canvasMidColor: "#F5ECC5",
      textColor: "#1A0F08",
      textSoftColor: "#4A3020",
      accentColor: "#3D7AB5",
      skyFrom: "#E8F4FD",
      skyTo: "#FFF8E7",
      horizonFrom: "#C8B87A",
      horizonTo: "#DDE8F0",
    },
  },
  // 15:00 – 18:00  Tarde
  {
    startMin: 15 * 60,
    endMin: 18 * 60,
    state: {
      slot: "afternoon",
      faunaKey: "garza",
      isDark: true,
      canvasColor: "#2A1F0E",
      canvasMidColor: "#3D2B14",
      textColor: "#F5E6C8",
      textSoftColor: "#C8A070",
      accentColor: "#E8722A",
      skyFrom: "#5A3A1A",
      skyTo: "#2A1F0E",
      horizonFrom: "#E8722A",
      horizonTo: "#C4A050",
    },
  },
  // 18:00 – 20:00  Ocaso
  {
    startMin: 18 * 60,
    endMin: 20 * 60,
    state: {
      slot: "dusk",
      faunaKey: "corocora",
      isDark: true,
      canvasColor: "#1A0808",
      canvasMidColor: "#2E0E0E",
      textColor: "#FFE4C4",
      textSoftColor: "#D4A07C",
      accentColor: "#C1440E",
      skyFrom: "#8B1A00",
      skyTo: "#1A0808",
      horizonFrom: "#C1440E",
      horizonTo: "#8B1A40",
    },
  },
  // 20:00 – 5:00  Noche
  {
    startMin: 20 * 60,
    endMin: 29 * 60, // continúa después de medianoche
    state: {
      slot: "night",
      faunaKey: "caiman",
      isDark: true,
      canvasColor: "#0A0A0D",
      canvasMidColor: "#13131A",
      textColor: "#C8D4E0",
      textSoftColor: "#8898A8",
      accentColor: "#4A8FBF",
      skyFrom: "#0A0A0D",
      skyTo: "#13131A",
      horizonFrom: "#1A2A3A",
      horizonTo: "#0A0A0D",
    },
  },
];

const NIGHT = SLOTS[SLOTS.length - 1].state;

function stateForMinutes(m: number): DayState {
  // Antes del amanecer (0–5am) → noche
  if (m < 5 * 60) return NIGHT;
  for (const { startMin, endMin, state } of SLOTS) {
    if (m >= startMin && m < endMin) return state;
  }
  return NIGHT;
}

function applyToCss(s: DayState): void {
  const r = document.documentElement.style;
  r.setProperty("--day-canvas",       s.canvasColor);
  r.setProperty("--day-canvas-mid",   s.canvasMidColor);
  r.setProperty("--day-text",         s.textColor);
  r.setProperty("--day-text-soft",    s.textSoftColor);
  r.setProperty("--day-accent",       s.accentColor);
  r.setProperty("--day-sky-from",     s.skyFrom);
  r.setProperty("--day-sky-to",       s.skyTo);
  r.setProperty("--day-horizon-from", s.horizonFrom);
  r.setProperty("--day-horizon-to",   s.horizonTo);
}

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function useDayState(): DayState {
  const [state, setState] = useState<DayState>(() =>
    stateForMinutes(nowMinutes()),
  );

  useEffect(() => {
    applyToCss(state);

    const id = setInterval(() => {
      const next = stateForMinutes(nowMinutes());
      if (next.slot !== state.slot) {
        setState(next);
        applyToCss(next);
      }
    }, 60_000);

    return () => clearInterval(id);
  }, [state]);

  return state;
}
