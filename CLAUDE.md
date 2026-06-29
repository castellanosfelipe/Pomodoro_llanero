# Pomodoro Llanero — Guía del repositorio

App Pomodoro de escritorio **local-first** (Tauri 2 + React/TS) con fauna del Llano
colombiano (Orinoquía) como recompensa visual durante los descansos.

## ⚠️ Política de commits (OBLIGATORIO)

**Los commits de git de este repositorio NO deben incluir coautoría de IA.**

- No añadas líneas `Co-Authored-By: Claude ...` ni `Co-Authored-By: <cualquier IA>`.
- No añadas `Generated with ...` ni firmas de herramientas de IA en los mensajes
  de commit ni en los cuerpos de los Pull Requests.
- Los mensajes de commit deben atribuirse únicamente al autor humano configurado
  en git (`user.name` / `user.email`).

Esta política es deliberada y forma parte de los requisitos del proyecto.

## Arquitectura (resumen)

Separación estricta en tres capas para que cambiar de stack de UI no implique
reescribir el dominio:

- `src/domain/` — **Dominio puro** (sin React, sin Tauri): tipos, motor del
  temporizador basado en reloj monotónico y máquina de estados. 100% testeable
  con `vitest` en Node.
- `src/infra/` — **Infraestructura**: adaptadores de persistencia (store JSON +
  SQLite), notificaciones, bandeja, autostart, reloj. Detrás de interfaces.
- `src/fauna/` — Función "Fauna del Llano" detrás de la interfaz `ImageProvider`
  (galería local por defecto; generativo opcional y desactivado por defecto).
- `src/components/`, `src/hooks/`, `src/state/` — **UI** React.
- `src-tauri/` — Núcleo Rust (ventana, bandeja, comandos, plugins).

## Comandos

```bash
npm install            # dependencias JS
npm test               # tests unitarios del dominio (vitest, corre en Node)
npm run dev            # frontend en el navegador (sin shell nativo)
npm run tauri:dev      # app de escritorio nativa (requiere Rust)
npm run tauri:build    # binarios firmables por plataforma
```

## Principios

- **Local-first / offline / cero telemetría.** Sin red obligatoria.
- **Precisión del temporizador** basada en timestamps (reloj monotónico), nunca en
  el conteo de `setInterval`, para sobrevivir a suspender/reactivar el equipo.
- **i18n**: Español por defecto, Inglés disponible; strings externalizados.
- **Accesibilidad**: teclado, ARIA, `prefers-reduced-motion`, contraste.
