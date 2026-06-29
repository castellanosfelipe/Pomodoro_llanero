/**
 * Proveedor por defecto: galería local 100% offline.
 *
 * Carga los metadatos de `fauna.json` (empaquetados) y entrega los animales en
 * rotación sin repetición. El *loader* es inyectable para desacoplar de `fetch`
 * y poder testear sin red ni Tauri.
 */
import type { AnimalAsset } from "../domain/types";
import type { ImageProvider } from "./ImageProvider";
import { NonRepeatingPicker } from "./shuffler";

export type FaunaLoader = () => Promise<AnimalAsset[]>;

/** Loader por defecto: lee el JSON servido desde /public/fauna. */
export const defaultFaunaLoader: FaunaLoader = async () => {
  const res = await fetch("/fauna/fauna.json");
  if (!res.ok) throw new Error(`No se pudo cargar fauna.json (${res.status})`);
  const data = (await res.json()) as { animals: AnimalAsset[] };
  return data.animals;
};

export class LocalGalleryProvider implements ImageProvider {
  readonly mode = "gallery";

  private all: AnimalAsset[] = [];
  private categories: string[] | null = null;
  private readonly picker: NonRepeatingPicker<AnimalAsset>;

  constructor(
    private readonly loader: FaunaLoader = defaultFaunaLoader,
    rng: () => number = Math.random,
  ) {
    this.picker = new NonRepeatingPicker<AnimalAsset>([], rng);
  }

  async ready(): Promise<void> {
    this.all = await this.loader();
    this.applyFilter();
  }

  setCategories(categories: string[] | null): void {
    this.categories = categories && categories.length > 0 ? categories : null;
    this.applyFilter();
  }

  private applyFilter(): void {
    const filtered = this.categories
      ? this.all.filter((a) => this.categories!.includes(a.category))
      : this.all;
    // Si el filtro deja el set vacío, caemos al set completo para no romper
    // la recompensa visual del descanso.
    this.picker.setItems(filtered.length > 0 ? filtered : this.all);
  }

  size(): number {
    return this.categories
      ? this.all.filter((a) => this.categories!.includes(a.category)).length
      : this.all.length;
  }

  async next(): Promise<AnimalAsset | null> {
    return this.picker.next() ?? null;
  }
}
