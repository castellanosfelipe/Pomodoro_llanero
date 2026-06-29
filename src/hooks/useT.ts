/** Hook de traducción: devuelve el diccionario del idioma activo. */
import { useAppStore } from "../state/store";
import { getDict, type Dict } from "../i18n";

export function useT(): Dict {
  const lang = useAppStore((s) => s.settings.appearance.language);
  return getDict(lang);
}
