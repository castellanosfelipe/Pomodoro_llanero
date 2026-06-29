//! Núcleo Tauri de Pomodoro Llanero.
//!
//! Mantiene la lógica nativa al mínimo: registra plugins (store JSON, SQLite,
//! notificaciones, autostart, OS), construye la bandeja y expone unos pocos
//! comandos. Toda la lógica del temporizador vive en el dominio (TypeScript),
//! desacoplada de la plataforma.

mod commands;
mod tray;

use std::sync::atomic::AtomicBool;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

/// Estado compartido. `close_to_tray` refleja el ajuste del usuario "minimizar
/// a la bandeja": cuando está activo, cerrar la ventana la oculta en vez de
/// terminar la app.
pub struct AppState {
    pub close_to_tray: AtomicBool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            close_to_tray: AtomicBool::new(true),
        })
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .invoke_handler(tauri::generate_handler![
            commands::generate_fauna_image,
            commands::set_api_key,
            commands::has_api_key,
            commands::set_close_to_tray,
            commands::update_tray,
        ])
        .setup(|app| {
            tray::build_tray(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let state = window.state::<AppState>();
                if state
                    .close_to_tray
                    .load(std::sync::atomic::Ordering::Relaxed)
                {
                    // Ocultar en lugar de cerrar: la app sigue viva en la bandeja.
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error al iniciar Pomodoro Llanero");
}
