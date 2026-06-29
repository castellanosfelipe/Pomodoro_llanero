/**
 * Contador de faenas del ciclo como garzas posadas en el horizonte.
 * Al completar el ciclo (4 faenas), todas levantan vuelo.
 */
import { useEffect, useRef, useState } from "react";
import { GarzaSilueta } from "./fauna/Garza";

interface GarceroCounterProps {
  completed: number;
  total: number;
  /** Se dispara cuando se acaba de completar el ciclo */
  allFlying?: boolean;
}

export function GarceroCounter({
  completed,
  total,
  allFlying = false,
}: GarceroCounterProps) {
  const [flyingIdx, setFlyingIdx] = useState<number[]>([]);
  const prevAllFlying = useRef(false);

  // Animación secuencial de vuelo al completar el ciclo
  useEffect(() => {
    if (allFlying && !prevAllFlying.current) {
      prevAllFlying.current = true;
      // Cada garza levanta vuelo con 200 ms de delay entre ellas
      for (let i = 0; i < total; i++) {
        setTimeout(
          () => setFlyingIdx((prev) => [...prev, i]),
          i * 220,
        );
      }
      // Limpia después de la animación
      setTimeout(() => {
        setFlyingIdx([]);
        prevAllFlying.current = false;
      }, total * 220 + 1500);
    }
  }, [allFlying, total]);

  return (
    <div
      className="flex items-end gap-2"
      role="status"
      aria-label={`${completed} de ${total} faenas del ciclo`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <GarzaSilueta
          key={i}
          size={22}
          completed={i < completed}
          flying={flyingIdx.includes(i)}
        />
      ))}
    </div>
  );
}
