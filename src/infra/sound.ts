/**
 * Sonidos por síntesis (Web Audio API): timbres de fin y un tic-tac opcional.
 *
 * Se sintetizan en tiempo real para no empaquetar archivos de audio y mantener
 * la app pequeña y 100% offline. Cada timbre de fin dura ~2 segundos. El volumen
 * del usuario (0–1) escala la ganancia; al máximo se obtiene el diseño original
 * de cada sonido. Respeta el silencio cuando el usuario lo desactiva.
 */

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

/** Una nota con envolvente attack/decay sobre el destino maestro. */
function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
): void {
  const osc = ac.createOscillator();
  const gainNode = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gainNode);
  gainNode.connect(ac.destination);
  const t0 = ac.currentTime + start;
  gainNode.gain.setValueAtTime(0, t0);
  gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Reproductores de fin. `v` es el volumen del usuario (0–1). */
const SOUNDS: Record<string, (ac: AudioContext, v: number) => void> = {
  // Campana clásica (~2.2 s)
  chime: (ac, v) => {
    tone(ac, 523.25, 0, 2.0, 0.18 * v);
    tone(ac, 659.25, 0.1, 2.0, 0.16 * v);
    tone(ac, 783.99, 0.2, 2.2, 0.14 * v);
  },
  // Cuerdas: arpegio ascendente (~2.3 s)
  harp: (ac, v) => {
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((f, i) => tone(ac, f, i * 0.13, 1.2, 0.13 * v, "triangle"));
  },
  // Pop con cola (~2 s)
  pop: (ac, v) => {
    tone(ac, 880, 0, 0.3, 0.22 * v);
    tone(ac, 440, 0.05, 1.8, 0.1 * v);
  },
};

export const AVAILABLE_SOUNDS = Object.keys(SOUNDS);

/** Etiquetas legibles para la UI de ajustes. */
export const SOUND_LABELS: Record<string, string> = {
  chime: "Campana",
  harp: "Cuerdas",
  pop: "Pop",
};

export function playEndSound(soundId: string, volume: number): void {
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (ac.state === "suspended") void ac.resume();
  const play = SOUNDS[soundId] ?? SOUNDS.chime;
  play(ac, Math.min(1, Math.max(0, volume)));
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
