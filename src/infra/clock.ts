/**
 * Reloj monotónico para el motor del temporizador.
 *
 * Usa el reloj de pared (`Date.now`) como fuente porque éste **sí avanza
 * mientras el equipo está suspendido**, de modo que al reactivar el equipo el
 * temporizador refleja el tiempo real transcurrido (criterio de aceptación).
 * Para evitar el único defecto del reloj de pared —que puede saltar hacia atrás
 * por ajustes de NTP/usuario— envolvemos la fuente en un guardián que nunca
 * devuelve un valor menor que el anterior, garantizando monotonicidad.
 *
 * Resultado: monotónico **y** consciente de la suspensión, lo mejor de ambos.
 */
import type { Clock } from "../domain/types";

export function createMonotonicClock(source: () => number = Date.now): Clock {
  let last = -Infinity;
  return () => {
    const t = source();
    if (t > last) last = t;
    return last;
  };
}
