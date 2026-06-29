/**
 * Genera placeholders SVG para **todos** los animales de `fauna.json`.
 *
 * Útil para regenerar el set completo. Para un flujo que respeta tus fotos
 * reales y sólo rellena lo que falta, usa `sync-fauna.mjs`.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { svgFor } from "./placeholder.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const faunaPath = resolve(root, "public/fauna/fauna.json");
const outDir = resolve(root, "public/fauna/images");

const raw = JSON.parse(await readFile(faunaPath, "utf8"));
await mkdir(outDir, { recursive: true });

let count = 0;
for (const animal of raw.animals) {
  await writeFile(resolve(outDir, `${animal.id}.svg`), svgFor(animal), "utf8");
  count++;
}
console.log(`Generados ${count} placeholders en ${outDir}`);
