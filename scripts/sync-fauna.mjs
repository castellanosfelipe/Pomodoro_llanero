/**
 * Sincroniza las imágenes de fauna con `fauna.json`.
 *
 * Flujo pensado para tus fotos reales:
 *  1. Deja tus imágenes en `public/fauna/images/` nombradas por el `id` del
 *     animal (p. ej. `chiguiro.jpg`, `jaguar.webp`). Los ids están en fauna.json
 *     y los lista este script.
 *  2. Ejecuta:  node scripts/sync-fauna.mjs   (o  npm run fauna:sync)
 *
 * Por cada animal:
 *  - Si hay una foto real (webp/jpg/jpeg/png/avif/gif) con su id, la cablea en
 *    `imagePath` y limpia el crédito/licencia de placeholder para que rellenes
 *    la atribución real.
 *  - Si no, genera/conserva un placeholder SVG.
 *
 * Al final reporta qué animales ya tienen foto (y necesitan licencia) y cuáles
 * siguen con placeholder. NO se empaqueta ninguna imagen sin licencia: tú
 * rellenas `credit`/`license` en fauna.json.
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { svgFor } from "./placeholder.mjs";

const REAL_EXTS = ["webp", "jpg", "jpeg", "png", "avif", "gif"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const faunaPath = resolve(root, "public/fauna/fauna.json");
const imagesDir = resolve(root, "public/fauna/images");

const data = JSON.parse(await readFile(faunaPath, "utf8"));
await mkdir(imagesDir, { recursive: true });

// Índice de archivos existentes (clave en minúsculas → nombre real en disco).
const files = await readdir(imagesDir);
const byLower = new Map(files.map((f) => [f.toLowerCase(), f]));

const isPlaceholderText = (s) =>
  !s || /placeholder/i.test(s);

const withReal = [];
const withPlaceholder = [];
const needLicense = [];

for (const animal of data.animals) {
  // Busca una foto real por id, en orden de preferencia de formato.
  let realFile = null;
  for (const ext of REAL_EXTS) {
    const hit = byLower.get(`${animal.id}.${ext}`);
    if (hit) {
      realFile = hit;
      break;
    }
  }

  if (realFile) {
    animal.imagePath = `/fauna/images/${realFile}`;
    // Si seguían las marcas de placeholder, vacíalas para que pongas la real.
    if (isPlaceholderText(animal.license) || isPlaceholderText(animal.credit)) {
      animal.credit = "";
      animal.license = "";
      needLicense.push(animal.id);
    }
    withReal.push(animal.id);
  } else {
    // Sin foto real: asegura el placeholder SVG.
    const svgName = `${animal.id}.svg`;
    if (!byLower.has(svgName.toLowerCase())) {
      await writeFile(resolve(imagesDir, svgName), svgFor(animal), "utf8");
    }
    animal.imagePath = `/fauna/images/${svgName}`;
    if (!animal.credit) animal.credit = "Placeholder generado";
    if (!animal.license)
      animal.license = "Placeholder — pendiente de imagen con licencia";
    withPlaceholder.push(animal.id);
  }
}

await writeFile(faunaPath, JSON.stringify(data, null, 2) + "\n", "utf8");

// Reporte
console.log(`\n✅ Sincronizado fauna.json (${data.animals.length} animales)\n`);
console.log(`📷 Con foto real (${withReal.length}): ${withReal.join(", ") || "—"}`);
console.log(
  `🖼️  Con placeholder (${withPlaceholder.length}): ${withPlaceholder.join(", ") || "—"}`,
);
if (needLicense.length) {
  console.log(
    `\n⚠️  Rellena credit/license en fauna.json para: ${needLicense.join(", ")}`,
  );
}
if (withPlaceholder.length) {
  console.log(
    `\n💡 Para cablear las que faltan, deja en public/fauna/images/ un archivo` +
      ` por id (${REAL_EXTS.join("/")}) y vuelve a ejecutar este script.`,
  );
}
console.log("");
