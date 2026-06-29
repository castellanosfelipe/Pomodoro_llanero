# Notas de decisiones técnicas

Registro de las decisiones de diseño y sus implicaciones.

## 1. Stack: Tauri 2 + React/TS/Vite/Tailwind

**Por qué.** Binarios pequeños, sensación nativa, arranque rápido, bajo consumo
en reposo, bandeja, notificaciones nativas, almacenamiento local y empaquetado
para macOS (Apple Silicon + Intel) y Windows. El webview del sistema evita
embeber un Chromium completo (a diferencia de Electron).

**Implicación.** Se requiere toolchain de Rust para compilar la app de
escritorio. Para iterar la UI sin Rust, `npm run dev` corre en el navegador con
respaldos de infraestructura.

## 2. Dominio desacoplado de la UI (regla de oro del enunciado)

El motor del temporizador, la máquina de estados, la agregación de estadísticas
y la rotación de fauna viven en `src/domain` y `src/fauna` como **código puro**:
sin React, sin Tauri, con dependencias inyectadas (reloj, RNG, loaders). Toda la
plataforma queda detrás de interfaces en `src/infra`.

**Implicación.** Cambiar de stack de UI (p. ej. a SwiftUI/WinUI 3 nativos o a
Flutter) no obliga a reescribir el dominio: basta con reimplementar los
adaptadores. Además, el dominio es 100% testeable en Node, sin entorno gráfico.

## 3. Precisión del temporizador: timestamps, no conteo de ticks

El restante **nunca** se calcula restando 1 segundo por cada `setInterval`. Se
guarda cuándo empezó el segmento en curso y cuánto se había acumulado antes; el
restante se deriva de `now()`. `setInterval` se usa sólo como **muestreador**
(cada 200 ms) para refrescar la UI; la corrección viene de la aritmética de
tiempos.

**Reloj (`src/infra/clock.ts`).** Se usa el reloj de pared (`Date.now`) porque
**sí avanza durante la suspensión** del equipo, y se envuelve en un guardián que
nunca retrocede (neutraliza saltos de NTP). Resultado: **monotónico y consciente
de la suspensión**.

**Recuperación.** Al volver de segundo plano/suspensión (`visibilitychange`,
`focus`) se fuerza un `tick` inmediato. Un solo `tick` tras una suspensión larga
completa la fase sin perder tiempo (probado en `timer.test.ts`).

## 4. Persistencia: JSON para config, SQLite para historial

- **Configuración** → `tauri-plugin-store` (un JSON en el directorio de datos).
  Estructura pequeña, lectura/escritura completa, fácil de migrar (`schemaVersion`
  + `mergeSettings`).
- **Historial/estadísticas** → SQLite (`tauri-plugin-sql`): muchas filas,
  consultas y agregaciones eficientes. La agregación (rachas, meta, semana) es
  una **función pura** del dominio, así que es idéntica y testeable
  independientemente del almacén.

En el navegador (`npm run dev`) ambos degradan a `localStorage`.

## 5. Fauna: interfaz `ImageProvider`, galería local por defecto

**Modo elegido por defecto: galería local.** Cumple el requisito *local-first*:
funciona 100% sin red, con metadatos en `fauna.json` e imágenes empaquetadas.

**Rotación sin repetición** (`NonRepeatingPicker`): baraja todo el set y lo
entrega uno a uno; al agotarlo rebaraja evitando repetir el último mostrado.

**Modo generativo: opcional y desactivado por defecto.** Detrás de la misma
interfaz, con dos backends conmutables (modelo local / API). Implicaciones:
mayor tamaño/recursos (local) o dependencia de red y clave propia (API). Por eso
no es el predeterminado. Ante cualquier fallo, **degradación elegante** a la
imagen local.

**Imágenes.** La galería incluye 16 fotos del Llano (especies + escenas de
paisaje/cultura) con derechos de uso y publicación **confirmados por el titular
del proyecto**; cada una conserva su crédito de origen. Las 6 especies sin foto
usan un placeholder SVG generado (`scripts/placeholder.mjs`). El flujo para
añadir/actualizar imágenes es `npm run fauna:sync` (ver `public/fauna/README.md`).

## 6. Seguridad de la clave de API

La clave del modo generativo por API **no** se guarda en el JSON de
configuración. Se delega al backend Rust, que la coloca en el **llavero del
sistema** (Keychain en macOS, Credential Manager en Windows) vía el crate
`keyring`. El frontend sólo puede consultar *si existe* (`has_api_key`), nunca
leerla.

## 7. Sonidos por síntesis (Web Audio)

El timbre de fin y el tic-tac se sintetizan en tiempo real con la Web Audio API
en vez de empaquetar archivos de audio: app más pequeña, 100% offline y volumen
configurable.

## 8. Atajos de teclado

Implementados **dentro de la app** (a nivel de ventana) parseando aceleradores en
formato Tauri. Cubren el caso con la app enfocada y no requieren permisos extra.
Para atajos **globales** del sistema se puede añadir
`tauri-plugin-global-shortcut` sin tocar el dominio.

## 9. Bandeja: la lógica vive en un solo sitio

El menú de la bandeja (Rust) no implementa lógica de Pomodoro: emite el evento
`tray://action` que el orquestador de React traduce a llamadas del motor. Así la
máquina de estados sigue siendo la única fuente de verdad. El título de la
bandeja se actualiza desde el frontend (`update_tray`) sólo cuando cambia el
texto, para no saturar el IPC.

## 10. i18n y accesibilidad

Strings externalizados en `src/i18n` (ES por defecto, EN). El diccionario español
define la forma `Dict`; el inglés debe cumplirla (verificado por el compilador).
Accesibilidad: roles/labels ARIA, `role="timer"` con `aria-live`, foco visible,
soporte de `prefers-reduced-motion` y de un ajuste explícito de reducir
movimiento.

## Limitaciones conocidas / trabajo futuro

- Fauna: 16 fotos con derechos confirmados por el titular; 6 especies aún en
  placeholder a la espera de su foto.
- El backend generativo (`generate_fauna_image`) es un stub que devuelve `None`
  (degradación a galería). Falta cablear un runtime local o un proveedor API.
- Atajos globales del sistema (fuera de foco) quedan como mejora opcional.
- Pruebas: cubren el dominio puro. La UI podría añadir pruebas con Testing
  Library / un E2E con WebDriver de Tauri.
