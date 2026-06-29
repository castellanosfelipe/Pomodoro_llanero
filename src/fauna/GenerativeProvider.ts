/**
 * Proveedor generativo (OPCIONAL, desactivado por defecto).
 *
 * Genera una imagen nueva en cada descanso mediante un backend conmutable:
 *  - "local": modelo local (p. ej. Stable Diffusion vía runtime local) para
 *    mantener todo offline, a costa de tamaño/recursos.
 *  - "api": proveedor por API con clave configurable (almacenada de forma
 *    segura por el backend Rust, nunca en el store JSON).
 *
 * La generación efectiva la realiza una función inyectable `generate`, que en
 * la app real invoca un comando de Tauri (`generate_fauna_image`). Aquí sólo
 * orquestamos: tomamos un animal de la galería como "etiqueta" (nombre,
 * científico, dato) y le adosamos la imagen generada. Si la generación falla,
 * devolvemos el animal con su imagen local como respaldo (degradación elegante).
 */
import type { AnimalAsset } from "../domain/types";
import type { GenerativeSettings } from "../domain/types";
import type { ImageProvider } from "./ImageProvider";
import { LocalGalleryProvider, type FaunaLoader } from "./LocalGalleryProvider";

export interface GenerateRequest {
  backend: GenerativeSettings["backend"];
  prompt: string;
  /** Nombre común del animal a generar, para enriquecer el prompt. */
  animal: string;
}

/** Devuelve una imagen como data URL (o ruta `asset:`), o `null` si falla. */
export type GenerateFn = (req: GenerateRequest) => Promise<string | null>;

export class GenerativeProvider implements ImageProvider {
  readonly mode = "generative";

  // Reutiliza la galería para metadatos (nombre/científico/dato) y respaldo.
  private readonly base: LocalGalleryProvider;

  constructor(
    private readonly settings: GenerativeSettings,
    private readonly generate: GenerateFn,
    loader?: FaunaLoader,
    rng: () => number = Math.random,
  ) {
    this.base = new LocalGalleryProvider(loader, rng);
  }

  async ready(): Promise<void> {
    await this.base.ready();
  }

  setCategories(categories: string[] | null): void {
    this.base.setCategories(categories);
  }

  size(): number {
    return this.base.size();
  }

  async next(): Promise<AnimalAsset | null> {
    const animal = await this.base.next();
    if (!animal) return null;

    const fullPrompt = `${this.settings.prompt}. ${animal.commonName.es} (${animal.scientificName})`;
    let imagePath: string | null = null;
    try {
      imagePath = await this.generate({
        backend: this.settings.backend,
        prompt: fullPrompt,
        animal: animal.commonName.es,
      });
    } catch {
      imagePath = null;
    }

    // Degradación elegante: si no hubo imagen generada, usa la local.
    return imagePath ? { ...animal, imagePath, credit: "Generado por IA" } : animal;
  }
}
