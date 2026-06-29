import { describe, it, expect } from "vitest";
import { LocalGalleryProvider } from "./LocalGalleryProvider";
import type { AnimalAsset } from "../domain/types";

function asset(id: string, category: string): AnimalAsset {
  return {
    id,
    commonName: { es: id, en: id },
    scientificName: `Genus ${id}`,
    funFact: { es: "dato", en: "fact" },
    category,
    imagePath: `/fauna/images/${id}.svg`,
  };
}

const sample: AnimalAsset[] = [
  asset("chiguiro", "mamifero"),
  asset("jaguar", "mamifero"),
  asset("corocora", "ave"),
  asset("caiman", "reptil"),
];

function seededRng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

describe("LocalGalleryProvider", () => {
  it("carga el set y rota sin repetir hasta agotarlo", async () => {
    const p = new LocalGalleryProvider(async () => sample, seededRng(1));
    await p.ready();
    const draws: string[] = [];
    for (let i = 0; i < sample.length; i++) {
      draws.push((await p.next())!.id);
    }
    expect(new Set(draws).size).toBe(sample.length);
  });

  it("filtra por categorías habilitadas", async () => {
    const p = new LocalGalleryProvider(async () => sample, seededRng(2));
    await p.ready();
    p.setCategories(["ave"]);
    expect(p.size()).toBe(1);
    const a = await p.next();
    expect(a!.category).toBe("ave");
  });

  it("si el filtro deja el set vacío usa el set completo (no rompe el descanso)", async () => {
    const p = new LocalGalleryProvider(async () => sample, seededRng(3));
    await p.ready();
    p.setCategories(["inexistente"]);
    const a = await p.next();
    expect(a).not.toBeNull();
  });
});
