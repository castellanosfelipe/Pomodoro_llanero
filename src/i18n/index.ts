/**
 * Internacionalización. Español por defecto, Inglés disponible. Los strings
 * están externalizados en `es.ts` / `en.ts`; `Dict` es la forma de referencia
 * (la define el diccionario español) y `en` debe cumplirla.
 */
import type { Language } from "../domain/types";
import { es } from "./es";

export type Dict = typeof es;

// Carga perezosa-evitada: ambos diccionarios son pequeños y se incluyen.
import { en } from "./en";

const DICTS: Record<Language, Dict> = { es, en };

export function getDict(lang: Language): Dict {
  return DICTS[lang] ?? es;
}

export { es, en };
