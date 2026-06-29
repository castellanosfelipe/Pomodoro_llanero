/**
 * Compañero de fauna para la zona de cielo del timer.
 * El animal presente depende de la franja del día y del modo (faena/descanso).
 * Sus micro-movimientos son el pulso de la app — discretos, no continuos.
 */
import { useEffect, useRef, useState } from "react";
import type { FaunaKey } from "../hooks/useDayState";
import type { Phase } from "../domain/types";
import { Garza } from "./fauna/Garza";
import { Chiguiro } from "./fauna/Chiguiro";
import { Corocora } from "./fauna/Corocora";
import { Caiman } from "./fauna/Caiman";
import { Tonina } from "./fauna/Tonina";

interface FaunaCompanionProps {
  faunaKey: FaunaKey;
  phase: Phase;
}

export function FaunaCompanion({ faunaKey, phase }: FaunaCompanionProps) {
  const [animateHead, setAnimateHead] = useState(false);
  const [showTonina, setShowTonina] = useState(false);
  const headTimerRef = useRef<number | null>(null);
  const toninaTimerRef = useRef<number | null>(null);

  // Micro-movimiento de la garza: gira la cabeza cada 45–60 s
  useEffect(() => {
    if (faunaKey !== "garza") return;
    const schedule = () => {
      const delay = 45_000 + Math.random() * 15_000;
      headTimerRef.current = window.setTimeout(() => {
        setAnimateHead(true);
        setTimeout(() => setAnimateHead(false), 2200);
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      if (headTimerRef.current) clearTimeout(headTimerRef.current);
    };
  }, [faunaKey]);

  // Tonina aparece 2–3 veces en el descanso largo con intervalos de 20–30 s
  useEffect(() => {
    if (phase !== "longBreak") return;
    let count = 0;
    const appear = () => {
      setShowTonina(true);
      setTimeout(() => setShowTonina(false), 1400);
      count++;
      if (count < 3) {
        const delay = 20_000 + Math.random() * 10_000;
        toninaTimerRef.current = window.setTimeout(appear, delay);
      }
    };
    toninaTimerRef.current = window.setTimeout(appear, 2000);
    return () => {
      if (toninaTimerRef.current) clearTimeout(toninaTimerRef.current);
    };
  }, [phase]);

  // Descanso largo: la tonina toma protagonismo
  if (phase === "longBreak") {
    return (
      <div className="relative flex items-end justify-center">
        {showTonina && (
          <Tonina size={100} leaping className="absolute bottom-0 left-1/2 -translate-x-1/2" />
        )}
        {!showTonina && <div style={{ height: 56, width: 100 }} />}
      </div>
    );
  }

  switch (faunaKey) {
    case "garza":
      return (
        <Garza
          size={80}
          animateHead={animateHead}
          className="drop-shadow-md"
        />
      );
    case "chiguiro":
      return (
        <Chiguiro
          size={110}
          floating={phase === "shortBreak"}
          className="drop-shadow-sm"
        />
      );
    case "corocora":
      return (
        <Corocora
          size={90}
          className="drop-shadow-md"
        />
      );
    case "caiman":
      return (
        <Caiman
          size={120}
          className="drop-shadow-sm opacity-90"
        />
      );
    default:
      return <Garza size={80} />;
  }
}
