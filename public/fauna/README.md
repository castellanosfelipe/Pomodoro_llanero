# Assets de fauna del Llano

Estructura:

```
public/fauna/
├── fauna.json          # Metadatos (nombre común, científico, dato curioso, categoría)
├── fauna.schema.json   # Esquema JSON de validación
└── images/             # Imágenes (placeholders SVG hasta poner tus fotos)
```

## ✅ Cómo añadir TUS imágenes (flujo recomendado)

1. Deja cada foto en `images/` **nombrada por el `id` del animal**, con
   cualquier formato común (`.webp`, `.jpg`, `.jpeg`, `.png`, `.avif`, `.gif`).
   Recomendado: `.webp` o `.jpg`, lado largo ~1200 px.
2. Ejecuta:

   ```bash
   npm run fauna:sync
   ```

   El script cablea automáticamente cada foto en `fauna.json` (campo
   `imagePath`), deja **placeholder** en las que falten y te dice cuáles
   necesitan que rellenes `credit`/`license`.
3. Abre `fauna.json` y rellena `credit` y `license` de cada foto real.

### IDs de los animales (nombra tus archivos así)

| id | animal | archivo de ejemplo |
|----|--------|--------------------|
| `chiguiro` | Chigüiro | `chiguiro.jpg` |
| `oso-palmero` | Oso palmero | `oso-palmero.jpg` |
| `caiman-llanero` | Caimán llanero | `caiman-llanero.jpg` |
| `corocora-roja` | Corocora roja | `corocora-roja.jpg` |
| `jabiru` | Gabán / jabirú | `jabiru.jpg` |
| `tonina` | Tonina / delfín rosado | `tonina.jpg` |
| `venado-caramerudo` | Venado caramerudo | `venado-caramerudo.jpg` |
| `garza-morena` | Garza morena | `garza-morena.jpg` |
| `alcaravan` | Alcaraván | `alcaravan.jpg` |
| `charapa` | Tortuga charapa | `charapa.jpg` |
| `cachicamo` | Cachicamo | `cachicamo.jpg` |
| `jaguar` | Jaguar | `jaguar.jpg` |
| `anaconda` | Anaconda / güío | `anaconda.jpg` |
| `espatula-rosada` | Espátula rosada | `espatula-rosada.jpg` |
| `babilla` | Babilla / baba | `babilla.jpg` |
| `guacamaya` | Guacamaya azul y amarilla | `guacamaya.jpg` |
| `danta` | Danta / tapir | `danta.jpg` |
| `iguasa` | Iguasa / pato silbón | `iguasa.jpg` |
| `caribe` | Caribe / piraña | `caribe.jpg` |
| `paisaje-atardecer` | Atardecer en el estero (escena) | `paisaje-atardecer.jpg` |
| `cultura-faena` | Faena llanera (escena) | `cultura-faena.jpg` |
| `cultura-cabalgata` | Cabalgata en la sabana (escena) | `cultura-cabalgata.jpg` |

> Las **escenas** (paisaje/cultura) no llevan nombre científico: en `fauna.json`
> basta `commonName`, `funFact` y `category` ("paisaje" o "cultura").
>
> Para añadir más entradas, agrega su objeto en `fauna.json` (con un `id` nuevo)
> y vuelve a ejecutar `npm run fauna:sync`.

## ⚖️ Licencias

**Estado actual:** el titular del proyecto **confirma los derechos de uso y
publicación** de las 16 fotos incluidas (así marcado en `license` dentro de
`fauna.json`). Se conserva el `credit` de origen de cada una.

Si añades nuevas imágenes, asegúrate de tener sus derechos (CC0, CC BY, dominio
público o propias) y declara `credit`/`license` con la atribución que corresponda.

## Placeholders

Mientras falten fotos reales, `npm run fauna:sync` mantiene placeholders SVG
(generados por `scripts/placeholder.mjs`) para que la app siga 100% funcional y
offline. Para regenerar **todos** los placeholders:

```bash
npm run fauna:placeholders
```
