/**
 * Contrato de proveedor de imágenes de fauna.
 *
 * Toda la función "Fauna del Llano" vive detrás de esta interfaz, de modo que
 * la galería local (offline, por defecto) y el modo generativo (opcional) son
 * intercambiables sin tocar la UI ni el dominio.
 */
import type { AnimalAsset } from "../domain/types";

export interface ImageProvider {
  /** Identificador del modo ("gallery" | "generative"). */
  readonly mode: string;

  /** Inicializa el proveedor (carga metadatos, valida backend, etc.). */
  ready(): Promise<void>;

  /** Restringe las categorías de animales que se mostrarán. */
  setCategories(categories: string[] | null): void;

  /**
   * Devuelve el siguiente animal a mostrar en el descanso, sin repetir hasta
   * agotar el conjunto disponible. `null` si no hay nada que mostrar.
   */
  next(): Promise<AnimalAsset | null>;

  /** Número de elementos disponibles tras aplicar el filtro de categorías. */
  size(): number;
}
