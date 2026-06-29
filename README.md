# 🐆 Pomodoro Llanero

Temporizador **Pomodoro de escritorio**, **local-first** (funciona sin internet),
**totalmente configurable** y sin telemetría, que premia cada descanso con
imágenes y datos curiosos de la **fauna del Llano colombiano (Orinoquía)**.

Nativo para **macOS** (Apple Silicon + Intel) y **Windows 10/11** gracias a
**Tauri 2** (núcleo en Rust + frontend React/TypeScript).

---

## ✨ Características

- **Motor Pomodoro de precisión**: máquina de estados (Inactivo, Enfoque,
  Descanso corto, Descanso largo, Pausado) basada en **timestamps monotónicos**,
  no en `setInterval`. Sobrevive a **suspender/reactivar** el equipo y al
  segundo plano sin acumular desfase.
- **Todo configurable y persistido**: duraciones, pomodoros por ciclo, auto-inicio,
  notificaciones, sonidos, tic-tac, meta diaria, **modo estricto**, tema
  claro/oscuro/sistema, color de acento, idioma (ES/EN), comportamiento de
  ventana, **inicio con el sistema** y **atajos de teclado**.
- **Bandeja de sistema / barra de menú** con fase y tiempo restante, y controles
  rápidos (iniciar/pausar, saltar, ajustes, salir).
- **Notificaciones nativas** al terminar enfoque y descanso.
- **Fauna del Llano** (el diferenciador): en cada descanso aparece un animal
  distinto —**sin repetir** hasta agotar el set— con nombre común, nombre
  científico y un dato curioso. Detrás de la interfaz `ImageProvider`:
  - **Galería local** (por defecto, 100% offline).
  - **Generativo** (opcional, desactivado por defecto): modelo local o API.
- **Estadísticas**: pomodoros completados, tiempo de enfoque, rachas y
  cumplimiento de meta, con panel diario/semanal.
- **Accesibilidad**: navegación por teclado, etiquetas ARIA, `prefers-reduced-motion`,
  contraste.

---

## 🏗️ Arquitectura

Separación estricta en capas para que **cambiar de stack de UI no implique
reescribir el dominio**:

```
src/
├── domain/        # Dominio PURO (sin React ni Tauri). 100% testeable en Node.
│   ├── types.ts          # Settings, Session, AnimalAsset, Stats
│   ├── timer.ts          # PomodoroEngine (reloj monotónico, máquina de estados)
│   ├── stats.ts          # Agregación de estadísticas (pura)
│   └── defaults.ts       # Valores por defecto + mapeos
├── infra/         # Adaptadores de plataforma detrás de interfaces
│   ├── clock.ts          # Reloj monotónico consciente de la suspensión
│   ├── store.ts          # Persistencia de ajustes (Tauri store / localStorage)
│   ├── stats.ts          # Repositorio SQLite / respaldo localStorage
│   ├── notifications.ts  # Notificaciones nativas / API del navegador
│   ├── autostart.ts      # Inicio con el sistema
│   ├── tray.ts           # Puente con la bandeja
│   ├── sound.ts          # Síntesis de sonidos (Web Audio)
│   └── secrets.ts        # Clave de API en el llavero del SO
├── fauna/         # Función "Fauna del Llano" tras la interfaz ImageProvider
│   ├── ImageProvider.ts
│   ├── LocalGalleryProvider.ts
│   ├── GenerativeProvider.ts
│   └── shuffler.ts       # Rotación sin repetición
├── i18n/          # Strings externalizados (ES por defecto, EN)
├── state/         # Estado de UI (Zustand) + orquestador (controller.ts)
├── components/    # UI React (anillo, controles, descanso, ajustes, stats)
└── hooks/

src-tauri/         # Núcleo Rust (ventana, bandeja, plugins, comandos)
public/fauna/      # fauna.json + imágenes (placeholders generados)
```

- **Configuración** → store JSON (`tauri-plugin-store`).
- **Historial/estadísticas** → **SQLite** (`tauri-plugin-sql`); la agregación es
  una función pura del dominio.
- El **orquestador** (`src/state/controller.ts`) es el único punto donde se
  cruzan dominio e infraestructura: posee el motor, reacciona a sus eventos y
  aplica efectos (notificaciones, sonido, persistencia, fauna).

---

## 🚀 Puesta en marcha

### Requisitos

- **Node.js ≥ 18** y npm.
- **Rust** (toolchain estable) — sólo para compilar la app de escritorio:
  <https://www.rust-lang.org/tools/install>
- Dependencias de sistema de Tauri:
  <https://v2.tauri.app/start/prerequisites/>
  - **macOS**: Xcode Command Line Tools.
  - **Windows**: Microsoft C++ Build Tools + WebView2 (incluido en Win 11).

### Instalación

```bash
npm install
```

### Scripts de desarrollo

```bash
npm test            # Pruebas unitarias del dominio (vitest, corre en Node)
npm run test:watch  # Pruebas en modo watch
npm run typecheck   # Comprobación de tipos
npm run dev         # Frontend en el navegador (sin shell nativo; usa respaldos)
npm run tauri:dev   # App de escritorio NATIVA (requiere Rust)
```

> `npm run dev` permite iterar la UI sin compilar Rust: la persistencia usa
> `localStorage`, y bandeja/notificaciones nativas se degradan a no-ops o a la
> API del navegador.

---

## 📦 Empaquetado y firma

Genera los binarios con:

```bash
npm run tauri:build
```

Los artefactos quedan en `src-tauri/target/release/bundle/`.

### macOS (Apple Silicon + Intel)

```bash
# Para tu arquitectura nativa
npm run tauri:build

# Targets explícitos (instala antes los targets de Rust)
rustup target add aarch64-apple-darwin x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin   # Apple Silicon → .dmg/.app
npm run tauri:build -- --target x86_64-apple-darwin    # Intel        → .dmg/.app
```

Firma y notarización (opcional, para distribución fuera de la Mac App Store):

```bash
export APPLE_CERTIFICATE="..."            # certificado Developer ID (base64)
export APPLE_CERTIFICATE_PASSWORD="..."
export APPLE_SIGNING_IDENTITY="Developer ID Application: Tu Nombre (TEAMID)"
export APPLE_ID="tu@apple.id"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="TEAMID"
npm run tauri:build
```

### Windows 10/11

```powershell
npm run tauri:build   # genera .msi (WiX) y .exe (NSIS)
```

Firma con certificado de Authenticode (opcional): configura
`tauri.conf.json › bundle.windows.certificateThumbprint` o usa `signtool`.

### Iconos

Ya generados en `src-tauri/icons/`. Para regenerarlos desde el SVG:

```bash
npm run tauri icon public/llano.svg
```

### CI y publicación de versiones

- `.github/workflows/build.yml` (**ci**): en cada push/PR corre tipos y pruebas
  (Node, sin toolchain nativo). Rápido y barato.
- `.github/workflows/release.yml` (**release**): al crear un **tag `v*`** compila
  en una matriz (macOS Apple Silicon + Intel, Windows) y **publica los binarios
  en GitHub Releases** con `tauri-action`.

Para publicar una versión:

```bash
# Sube la versión en package.json / src-tauri/tauri.conf.json y Cargo.toml, luego:
git tag v0.1.0
git push origin v0.1.0
```

El workflow crea un **borrador de Release** con los instaladores adjuntos; revísalo
y públicalo desde la pestaña *Releases* de GitHub. Para firmar/notarizar macOS,
define los secrets `APPLE_*` (ver comentarios en `release.yml`). En Windows, los
binarios sin firmar muestran un aviso de SmartScreen hasta que firmes con
Authenticode.

> Distribuir la app de escritorio se hace por **GitHub Releases**, no por GitHub
> Pages/Vercel (esos son para sitios web). Todos los datos siguen siendo locales.

---

## 🦫 Fauna del Llano

- Metadatos: [`public/fauna/fauna.json`](public/fauna/fauna.json) — 19 especies +
  3 escenas (paisaje/cultura), nombre común/científico y dato curioso en ES/EN.
- Imágenes: `public/fauna/images/` — 16 fotos reales del Llano + 6 placeholders SVG
  para las especies aún sin foto. Derechos de uso y publicación **confirmados por
  el titular del proyecto**; se conserva el crédito de origen.

### Añadir tus imágenes

1. Deja cada foto en `public/fauna/images/` **nombrada por el `id`** del animal
   (`chiguiro.jpg`, `jaguar.webp`, …; la tabla de ids está en
   [`public/fauna/README.md`](public/fauna/README.md)).
2. Ejecuta `npm run fauna:sync` — cablea cada foto en `fauna.json`, conserva
   placeholders para las que falten y te indica cuáles necesitan licencia.
3. Rellena `credit`/`license` de cada foto real en `fauna.json`.

### ⚖️ Licencias de imágenes

El titular del proyecto **confirma los derechos de uso y publicación** de las
imágenes incluidas; cada entrada conserva su `credit` de origen en `fauna.json`.
Si en el futuro añades nuevas imágenes, asegúrate igualmente de tener sus derechos
(CC0/CC BY/dominio público/propias) y declara `credit`/`license`.

### Modo generativo (opcional, desactivado por defecto)

Detrás de la misma interfaz `ImageProvider`. Dos backends:
- **Local**: integra un runtime de difusión (p. ej. Stable Diffusion) en
  `src-tauri/src/commands.rs::generate_fauna_image` (mantiene todo offline).
- **API**: la clave del usuario se guarda en el **llavero del sistema**
  (Keychain/Credential Manager), nunca en el JSON de configuración.

Si la generación falla o está desactivada, la app **degrada con elegancia** a la
imagen local. Prioridad siempre a la opción local/offline.

---

## 🔒 Privacidad

Local-first, **cero telemetría**, sin red obligatoria. Todos los datos
(configuración y estadísticas) viven en tu equipo. La única salida de red posible
es el modo generativo por API, que es **opt-in** y requiere tu propia clave.

---

## 🧪 Pruebas

El dominio (motor del temporizador, agregación de estadísticas y rotación de
fauna) está cubierto por pruebas que corren en Node sin toolchain nativo:

```bash
npm test
```

Incluyen precisión tras suspensión, ciclo de descanso largo, modo estricto,
auto-inicio, saltar fase, rachas/meta y rotación sin repetición.

---

## 📄 Licencia

Código bajo licencia MIT (ver [`LICENSE`](LICENSE)). Las imágenes de fauna tienen
su propia licencia (ver arriba).
