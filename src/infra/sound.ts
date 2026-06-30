/**
 * Sonidos por síntesis (Web Audio API): timbres de fin y un tic-tac opcional.
 *
 * Se sintetizan en tiempo real para no empaquetar archivos de audio y mantener
 * la app pequeña y 100% offline. Cada timbre de fin **dura al menos 2 segundos**
 * y pasa por un compresor para sonar fuerte y nítido sin saturar. El volumen es
 * configurable; respeta el silencio cuando el usuario lo desactiva.
 */

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

interface Note {
  /** Frecuencia en Hz (o frecuencia inicial si hay `glideTo`). */
  f: number;
  /** Inicio relativo en segundos. */
  t: number;
  /** Duración en segundos. */
  d: number;
  /** Glissando hasta esta frecuencia (para el canto). */
  glideTo?: number;
  type?: OscillatorType;
  /** Vibrato (profundidad en Hz) — da el carácter de "canto". */
  vibrato?: number;
}

interface SoundDef {
  notes: Note[];
  /** Ganancia pico relativa al volumen del usuario (0–1). */
  peak: number;
}

/**
 * Timbres de fin. Todos duran ≥ 2 s. El "caporal" evoca un canto de trabajo de
 * llano: una melodía silbada con glissandos y vibrato sobre escala pentatónica.
 */
const SOUNDS: Record<string, SoundDef> = {
  chime: {
    peak: 0.85,
    notes: [
      { f: 880, t: 0.0, d: 1.2 },
      { f: 1320, t: 0.18, d: 1.4 },
      { f: 880, t: 1.0, d: 1.2 },
      { f: 1320, t: 1.2, d: 1.4 },
    ],
  },
  bell: {
    peak: 0.9,
    notes: [
      { f: 660, t: 0.0, d: 1.6 },
      { f: 990, t: 0.12, d: 1.6 },
      { f: 1320, t: 0.24, d: 1.8 },
      { f: 660, t: 1.1, d: 1.4 },
      { f: 990, t: 1.2, d: 1.4 },
    ],
  },
  marimba: {
    peak: 0.85,
    notes: [
      { f: 523, t: 0.0, d: 0.7, type: "triangle" },
      { f: 659, t: 0.22, d: 0.7, type: "triangle" },
      { f: 784, t: 0.44, d: 0.8, type: "triangle" },
      { f: 1047, t: 0.66, d: 1.0, type: "triangle" },
      { f: 784, t: 1.2, d: 0.7, type: "triangle" },
      { f: 1047, t: 1.5, d: 1.0, type: "triangle" },
    ],
  },
  soft: {
    peak: 0.8,
    notes: [
      { f: 523, t: 0.0, d: 1.6, type: "sine" },
      { f: 659, t: 0.4, d: 1.6, type: "sine" },
      { f: 784, t: 0.8, d: 1.6, type: "sine" },
    ],
  },
  // Canto de caporal: melodía silbada, melismática, con glissandos y vibrato.
  caporal: {
    peak: 1.0,
    notes: [
      { f: 587, t: 0.0, d: 0.5, glideTo: 880, type: "sine", vibrato: 6 },
      { f: 880, t: 0.45, d: 0.7, glideTo: 784, type: "sine", vibrato: 9 },
      { f: 784, t: 1.1, d: 0.5, glideTo: 659, type: "sine", vibrato: 7 },
      { f: 659, t: 1.55, d: 0.9, glideTo: 587, type: "sine", vibrato: 10 },
      { f: 587, t: 2.35, d: 0.6, type: "sine", vibrato: 5 },
    ],
  },
};

export const AVAILABLE_SOUNDS = Object.keys(SOUNDS);

/** Etiquetas legibles para la UI de ajustes. */
export const SOUND_LABELS: Record<string, string> = {
  chime: "Campanilla",
  bell: "Campana",
  marimba: "Marimba",
  soft: "Suave",
  caporal: "Canto de caporal",
};

export function playEndSound(soundId: string, volume: number): void {
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (ac.state === "suspended") void ac.resume();

  const def = SOUNDS[soundId] ?? SOUNDS.chime;
  const now = ac.currentTime;
  const v = Math.min(1, Math.max(0, volume));

  // Cadena maestra: compresor + ganancia → más volumen percibido sin saturar.
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 12;
  comp.ratio.value = 4;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;
  const master = ac.createGain();
  master.gain.value = def.peak * (0.5 + v * 0.5); // base alta + escala por volumen
  comp.connect(master).connect(ac.destination);

  for (const n of def.notes) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = n.type ?? "sine";

    const start = now + n.t;
    const end = start + n.d;

    // Frecuencia (con glissando opcional).
    osc.frequency.setValueAtTime(n.f, start);
    if (n.glideTo !== undefined) {
      osc.frequency.linearRampToValueAtTime(n.glideTo, end);
    }

    // Vibrato opcional para el carácter de canto.
    if (n.vibrato) {
      const lfo = ac.createOscillator();
      const lfoGain = ac.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = n.vibrato;
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start(start);
      lfo.stop(end + 0.05);
    }

    // Envolvente.
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(1, start + 0.02);
    gain.gain.setValueAtTime(1, end - 0.08 > start ? end - 0.08 : start);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain).connect(comp);
    osc.start(start);
    osc.stop(end + 0.05);
  }
}

let tickTimer: number | null = null;

export function startTicking(volume: number): void {
  stopTicking();
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (ac.state === "suspended") void ac.resume();
  const tick = () => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "square";
    osc.frequency.value = 1000;
    const t = ac.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume * 0.06, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  };
  tickTimer = window.setInterval(tick, 1000);
}

export function stopTicking(): void {
  if (tickTimer !== null) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
}
