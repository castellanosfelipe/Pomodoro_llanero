/**
 * Sonidos por síntesis (Web Audio API): un timbre de fin y un tic-tac opcional.
 *
 * Se sintetizan en tiempo real para no empaquetar archivos de audio y mantener
 * la app pequeña y 100% offline. El volumen es configurable; respeta el silencio
 * cuando el usuario desactiva el sonido.
 */

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

/** Distintos timbres de fin seleccionables. */
const SOUND_FREQS: Record<string, number[]> = {
  chime: [880, 1320],
  bell: [660, 990, 1320],
  marimba: [523, 659, 784],
  soft: [523],
};

export const AVAILABLE_SOUNDS = Object.keys(SOUND_FREQS);

export function playEndSound(soundId: string, volume: number): void {
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (ac.state === "suspended") void ac.resume();
  const freqs = SOUND_FREQS[soundId] ?? SOUND_FREQS.chime;
  const now = ac.currentTime;
  freqs.forEach((f, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    const start = now + i * 0.16;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume * 0.3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.55);
  });
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
