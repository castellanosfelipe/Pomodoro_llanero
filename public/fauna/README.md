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

> Si quieres añadir más especies, agrega su objeto en `fauna.json` (con un `id`
> nuevo) y vuelve a ejecutar `npm run fauna:sync`.

## ⚖️ Licencias (importante)

No empaquetes ninguna imagen sin **licencia compatible** (CC0, CC BY, dominio
público, o propia). Rellena `credit` y `license` en `fauna.json` con la
atribución exacta que exija la licencia de cada foto.

## Placeholders

Mientras falten fotos reales, `npm run fauna:sync` mantiene placeholders SVG
(generados por `scripts/placeholder.mjs`) para que la app siga 100% funcional y
offline. Para regenerar **todos** los placeholders:

```bash
npm run fauna:placeholders
```
