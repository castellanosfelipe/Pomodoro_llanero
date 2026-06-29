/**
 * Fábrica de proveedores de fauna. Selecciona la implementación detrás de la
 * interfaz `ImageProvider` según los ajustes del usuario.
 */
import type { FaunaSettings } from "../domain/types";
import type { ImageProvider } from "./ImageProvider";
import { LocalGalleryProvider, type FaunaLoader } from "./LocalGalleryProvider";
import { GenerativeProvider, type GenerateFn } from "./GenerativeProvider";

export type { ImageProvider } from "./ImageProvider";
export { LocalGalleryProvider, defaultFaunaLoader } from "./LocalGalleryProvider";
export { GenerativeProvider } from "./GenerativeProvider";
export { NonRepeatingPicker } from "./shuffler";

export interface FaunaProviderDeps {
  loader?: FaunaLoader;
  /** Sólo necesaria para el modo generativo. */
  generate?: GenerateFn;
  rng?: () => number;
}

/** Crea el proveedor adecuado y aplica el filtro de categorías. */
export function createFaunaProvider(
  settings: FaunaSettings,
  deps: FaunaProviderDeps = {},
): ImageProvider {
  const provider: ImageProvider =
    settings.mode === "generative" && deps.generate
      ? new GenerativeProvider(
          settings.generative,
          deps.generate,
          deps.loader,
          deps.rng,
        )
      : new LocalGalleryProvider(deps.loader, deps.rng);

  provider.setCategories(settings.categories);
  return provider;
}
