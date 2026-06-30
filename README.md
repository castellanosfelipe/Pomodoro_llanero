<div align="center">
  <img src="public/llano.svg" alt="Logo de Pomodoro Llanero" width="160"/>

  <h1>Pomodoro Llanero</h1>
  <p><strong>Concéntrate al ritmo de la sabana: un temporizador Pomodoro de escritorio que premia cada descanso con la fauna del Llano colombiano.</strong></p>

  ![Version](https://img.shields.io/badge/version-0.2.0-blue)
  ![Status](https://img.shields.io/badge/status-beta-green)
  ![License](https://img.shields.io/badge/license-MIT-orange)
  ![Platform](https://img.shields.io/badge/plataforma-macOS%20%7C%20Windows-lightgrey)
  ![Local-first](https://img.shields.io/badge/local--first-100%25%20offline-success)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es este proyecto?](#-qué-es-pomodoro-llanero)
- [Demo en vivo](#-demo-en-vivo)
- [Descargas](#-descargas)
- [Características principales](#-características-principales)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Instalación e instrucciones](#-instalación-e-instrucciones)
- [Cómo usar](#-cómo-usar)
- [Arquitectura](#-arquitectura)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 ¿Qué es Pomodoro Llanero?

**Pomodoro Llanero** es una app de escritorio para concentrarte por bloques de tiempo (la técnica Pomodoro) que convierte cada descanso en un pequeño respiro de naturaleza: aparece un animal distinto del Llano colombiano —la Orinoquía— con su nombre, su nombre científico y un dato curioso. Funciona **100% sin internet** y **sin recoger un solo dato tuyo**.

### El problema que resuelve

Las apps de productividad suelen romper tu concentración en lugar de protegerla: notificaciones, cuentas, sincronización en la nube y descansos que terminan en un scroll infinito de redes sociales que te roba más tiempo del que querías.

### La solución

Un temporizador **preciso, privado y sereno**. El descanso no te lanza a otra pantalla adictiva: te muestra un chigüiro, una corocora o una tonina del Llano, te cuenta algo sobre ella y te devuelve, descansado, a la siguiente faena.

### ¿Para quién es?

| Audiencia | Beneficio clave |
|-----------|----------------|
| 👩‍💻 **Profesionales y estudiantes** | Bloques de foco a prueba de distracciones, con descansos que reparan en vez de enganchar |
| 🌿 **Amantes de la naturaleza y la Orinoquía** | Una dosis diaria de fauna y cultura llanera mientras trabajan |
| 🔒 **Personas celosas de su privacidad** | Cero telemetría, cero cuentas, cero nube: todo vive en tu equipo |

---

## 🎬 Demo en vivo

<div align="center">

[![Probar en vivo](https://img.shields.io/badge/▶_Probar_en_vivo-Abrir_en_el_navegador-4A6741?style=for-the-badge&logo=googlechrome&logoColor=white)](https://castellanosfelipe.github.io/Pomodoro_llanero/)

</div>

> 🌐 **Pruébalo sin instalar nada:** <https://castellanosfelipe.github.io/Pomodoro_llanero/>
> Es la misma app en versión web (local-first: tus datos quedan en el navegador
> vía `localStorage`). Las funciones nativas —bandeja, bloqueo de pantalla,
> notificaciones del sistema— solo están en la app de escritorio (abajo).

<!-- TODO: grabar un video/GIF corto (10–15 s) del flujo principal: iniciar faena → fin de faena (suena el aviso) → aparece la fauna en el descanso → volver a la faena. -->
<!-- Guardar el archivo en docs/media/ y descomentar el bloque que corresponda: -->

<!-- Opción GIF (se reproduce solo en el README):
<div align="center">
  <img src="docs/media/demo.gif" alt="Flujo principal: faena, descanso y fauna del Llano" width="700"/>
  <p><em>De la faena al descanso: la fauna del Llano aparece como recompensa.</em></p>
</div>
-->

---

## ⬇️ Descargas

**Versión actual: `v0.2.1`**

<div align="center">

[![Descargar para macOS](https://img.shields.io/badge/⬇_Descargar-macOS_(Apple_Silicon)-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_aarch64.dmg)
&nbsp;
[![Descargar para Windows](https://img.shields.io/badge/⬇_Descargar-Windows_10/11-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_x64-setup.exe)

</div>

| Sistema | Descarga directa |
|---------|------------------|
| 🍎 **macOS Apple Silicon (M1–M4)** | [`Pomodoro.Llanero_0.2.1_aarch64.dmg`](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_aarch64.dmg) |
| 🍎 **macOS Intel** | [`Pomodoro.Llanero_0.2.1_x64.dmg`](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_x64.dmg) |
| 🪟 **Windows 10/11 (instalador)** | [`Pomodoro.Llanero_0.2.1_x64-setup.exe`](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_x64-setup.exe) |
| 🪟 **Windows 10/11 (MSI)** | [`Pomodoro.Llanero_0.2.1_x64_en-US.msi`](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/download/v0.2.1/Pomodoro.Llanero_0.2.1_x64_en-US.msi) |

> 📦 ¿Otra versión o no cargan los enlaces? Mira todos los instaladores en la página de **[Releases](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/latest)**.

---

## ✨ Características principales

| Feature | Descripción |
|---------|-------------|
| 🎯 **Temporizador de precisión** | Motor basado en **reloj monotónico** (no en `setInterval`): sobrevive a suspender/reactivar el equipo y al segundo plano sin acumular desfase |
| 🦫 **Fauna del Llano** | En cada descanso aparece un animal distinto —**sin repetir** hasta agotar el set de 22 especies— con nombre común, científico y un dato curioso |
| 🔒 **Local-first y privado** | Funciona sin conexión, sin cuentas y **sin telemetría**. Tus datos nunca salen de tu equipo |
| 🌅 **Identidad llanera viva** | La interfaz respira con el día (amanecer, mediodía, ocaso, noche), con vocabulario propio —*faena*, *descanso*, *siesta llanera*— y fauna ilustrada |
| ⚙️ **Totalmente configurable** | Duraciones, ciclos, auto-inicio, modo estricto, tema, idioma (ES/EN), bandeja del sistema, inicio con el equipo y atajos de teclado |
| 📊 **Estadísticas y rachas** | Faenas completadas, tiempo de foco, rachas y cumplimiento de meta diaria, con vista diaria y semanal |

---

## 📸 Capturas de pantalla

<!-- TODO: añadir capturas reales de la UI. Sugerencia de tomas (guardar en docs/media/): -->
<!-- 1. timer.png       → pantalla principal de la faena (horizonte cielo/tierra) -->
<!-- 2. break.png       → descanso con la fauna del Llano y su dato curioso -->
<!-- 3. settings.png    → panel de ajustes -->
<!-- 4. stats.png       → estadísticas y rachas -->
<!-- Reemplazar el showcase de abajo por bloques <img src="docs/media/timer.png" .../> -->

> 🖼️ **Capturas de la app en camino.** Por ahora, este es un vistazo a **la recompensa**: parte de la galería de fauna real incluida en la app.

### La recompensa: fauna del Llano

<div align="center">
  <img src="public/fauna/images/chiguiro.jpg" alt="Chigüiro (capibara) descansando en la orilla" width="240"/>
  <img src="public/fauna/images/corocora-roja.jpg" alt="Corocora roja, ibis escarlata del Llano" width="240"/>
  <img src="public/fauna/images/tonina.jpg" alt="Tonina, delfín rosado de río" width="240"/>
  <br/>
  <img src="public/fauna/images/jaguar.jpg" alt="Jaguar de la Orinoquía" width="240"/>
  <img src="public/fauna/images/oso-palmero.jpg" alt="Oso palmero (oso hormiguero gigante)" width="240"/>
  <img src="public/fauna/images/paisaje-atardecer.jpg" alt="Atardecer en la sabana del Llano" width="240"/>
  <p><em>Cada descanso muestra una especie distinta con su nombre y un dato curioso.</em></p>
</div>

---

## 🚀 Instalación e instrucciones

### 🍎 macOS (Apple Silicon e Intel)

1. Descarga el `.dmg` para tu chip desde **[Releases](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/latest)** (`aarch64` para M1–M4, `x64` para Intel).
2. Ábrelo y arrastra **Pomodoro Llanero** a la carpeta **Aplicaciones**.
3. **Primera apertura** — como la app aún no está firmada con Apple, macOS puede decir *"está dañada"* o *"desarrollador no identificado"*. Autorízala **una sola vez** con:
   ```bash
   xattr -cr "/Applications/Pomodoro Llanero.app" && open "/Applications/Pomodoro Llanero.app"
   ```
4. Listo: a partir de ahí se abre con doble clic como cualquier app.

### 🪟 Windows 10/11

1. Descarga el instalador `..._x64-setup.exe` (o `..._x64_en-US.msi`) desde **[Releases](https://github.com/castellanosfelipe/Pomodoro_llanero/releases/latest)**.
2. Ejecútalo. Si aparece **Windows protegió su PC** (SmartScreen), pulsa **Más información → Ejecutar de todas formas**.
3. Sigue el asistente. La app queda en el menú Inicio.

### 🛠️ Desde el código fuente

#### Prerrequisitos

- **Node.js** ≥ 18 y npm
- **Rust** (toolchain estable) — solo para compilar la app nativa → <https://www.rust-lang.org/tools/install>
- Dependencias de sistema de Tauri → <https://v2.tauri.app/start/prerequisites/>

#### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/castellanosfelipe/Pomodoro_llanero.git
cd Pomodoro_llanero

# 2. Instalar dependencias
npm install

# 3a. Ejecutar la app de escritorio NATIVA (requiere Rust)
npm run tauri:dev

# 3b. O iterar solo la UI en el navegador (sin shell nativo)
npm run dev
```

✅ Con `npm run tauri:dev` se abre la ventana nativa de **Pomodoro Llanero** listo para tu primera faena.

> No hay variables de entorno ni archivo `.env` que configurar: la app es local-first y funciona desde el primer arranque.

---

## 💡 Cómo usar

### Flujo básico

1. **Inicia una faena** con el botón _Iniciar faena_ (o tu atajo de teclado).
2. Trabaja concentrado hasta que suene el fin de la faena.
3. Llega el **descanso**: aparece un animal del Llano con su dato curioso. Respira.
4. Tras varias faenas, te ganas la **siesta llanera** (descanso largo). El ciclo se reinicia.

### Comandos para desarrollo

```bash
npm test            # Pruebas unitarias del dominio (Vitest, corre en Node)
npm run test:watch  # Pruebas en modo watch
npm run typecheck   # Comprobación de tipos (tsc --noEmit)
npm run dev         # Frontend en el navegador (persistencia con localStorage)
npm run tauri:dev   # App de escritorio nativa (requiere Rust)
```

### Empaquetar binarios

```bash
# Para tu arquitectura nativa
npm run tauri:build

# Targets explícitos de macOS (instala antes los targets de Rust)
rustup target add aarch64-apple-darwin x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin   # Apple Silicon → .dmg/.app
npm run tauri:build -- --target x86_64-apple-darwin    # Intel        → .dmg/.app
```

Los artefactos quedan en `src-tauri/target/release/bundle/`.

### Personalizar la galería de fauna

Las especies viven en [`public/fauna/fauna.json`](public/fauna/fauna.json) (validado contra un esquema JSON). Edítalo para añadir tus propios animales, imágenes y datos curiosos, y sincroniza con:

```bash
npm run fauna:sync
```

---

## 🏗️ Arquitectura

Separación estricta en capas para que **cambiar de stack de UI no implique reescribir el dominio**. El dominio es TypeScript puro —sin React ni Tauri— y 100% testeable en Node.

### Stack tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Interfaz** | React 18 + TypeScript + Tailwind CSS + Zustand | UI reactiva, estado de presentación y ciclo visual del día |
| **Núcleo nativo** | Tauri 2 (Rust) | Ventana, bandeja del sistema, plugins y empaquetado firmable |
| **Dominio (puro)** | TypeScript + Vitest | Motor Pomodoro (reloj monotónico), estadísticas y máquina de estados |
| **Ajustes** | `tauri-plugin-store` (JSON) | Persistencia de la configuración del usuario |
| **Historial** | `tauri-plugin-sql` (SQLite) | Sesiones y estadísticas; la agregación es una función pura |
| **Plataforma** | Notificaciones, autostart, OS, keyring | Integración nativa detrás de interfaces, con respaldos para la web |

> El **orquestador** ([`src/state/controller.ts`](src/state/controller.ts)) es el único punto donde se cruzan dominio e infraestructura: posee el motor, reacciona a sus eventos y aplica efectos (notificaciones, sonido, persistencia, fauna).

Para el detalle de decisiones de diseño, ver [`docs/DECISIONS.md`](docs/DECISIONS.md).

---

## 🗺️ Roadmap

### ✅ Completado
- [x] Motor Pomodoro de precisión (reloj monotónico, máquina de estados)
- [x] Galería de fauna local sin repetición (22 especies) con datos curiosos
- [x] Ajustes completos: duraciones, modo estricto, tema, idioma ES/EN, atajos
- [x] Bandeja del sistema, notificaciones nativas e inicio con el equipo
- [x] Estadísticas, rachas y meta diaria (SQLite)
- [x] Bloqueo de pantalla durante el descanso (pantalla completa)
- [x] Rediseño con identidad llanera (ciclo del día, fauna ilustrada)
- [x] Instaladores para macOS (Apple Silicon + Intel) y Windows

### 🔄 En progreso
- [ ] Firma y notarización de la app de macOS (Developer ID) y opción Homebrew Cask
- [ ] Capturas y GIF de demostración de la interfaz

### 🔮 Próximamente
- [ ] Modo de imágenes generativo pulido (modelo local / API, opt-in)
- [ ] Ampliar el catálogo de especies y datos curiosos
- [ ] Explorar soporte para Linux

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Puedes ayudar con código, nuevas especies para la galería, traducciones o reportando bugs.

1. Haz un fork y crea una rama: `git checkout -b mi-mejora`
2. Asegúrate de que pasan las pruebas: `npm test && npm run typecheck`
3. Abre un Pull Request describiendo el cambio

> ⚠️ **Nota de estilo del proyecto:** los commits y Pull Requests deben atribuirse únicamente a su autor humano. No incluyas co-autoría ni firmas de herramientas de IA.

---

## 📄 Licencia

**MIT** — consulta [`LICENSE`](./LICENSE) para más detalles.

---

<div align="center">
  <p>Hecho con ❤️ y orgullo llanero por <a href="https://github.com/castellanosfelipe">castellanosfelipe</a></p>
</div>
