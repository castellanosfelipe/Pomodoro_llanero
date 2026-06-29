# Assets de fauna del Llano

Estructura:

```
public/fauna/
├── fauna.json          # Metadatos (nombre común, científico, dato curioso, categoría)
├── fauna.schema.json   # Esquema JSON de validación
└── images/             # Imágenes (hoy: placeholders SVG generados)
```

## Placeholders

Los SVG de `images/` son **placeholders generados** por
`scripts/gen-placeholders.mjs` a partir de `fauna.json`. La app es 100%
funcional y offline con ellos.

```bash
node scripts/gen-placeholders.mjs
```

## Sustituir por imágenes reales (verificar licencia)

1. Consigue imágenes con **licencia compatible** (CC0, CC BY, dominio público,
   o propias). Fuentes habituales: Wikimedia Commons, iNaturalist (revisa la
   licencia de cada foto), bancos de dominio público.
2. Colócalas en `images/` (recomendado `.webp` o `.jpg`, lado largo ~1200 px).
3. Actualiza en `fauna.json` los campos `imagePath`, `credit` y `license` de
   cada animal con la atribución exacta exigida por la licencia.
4. **No empaquetes** ninguna imagen sin licencia verificada.

> Los nombres científicos y datos provienen de fuentes de divulgación; verifica
> antes de publicar.
