//! Bandeja de sistema (Windows) / barra de menú (macOS).
//!
//! El menú lleva: mostrar, iniciar/pausar, saltar, ajustes y salir. Las acciones
//! que afectan al temporizador se delegan al frontend emitiendo el evento
//! `tray://action`, que el controlador de React escucha y traduce a llamadas del
//! motor. Así la lógica del Pomodoro vive en un solo sitio (el dominio).

use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Emitter, Manager,
};

pub fn build_tray(app: &App) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "Mostrar Pomodoro Llanero", true, None::<&str>)?;
    let toggle = MenuItem::with_id(app, "toggle", "Iniciar / Pausar", true, None::<&str>)?;
    let skip = MenuItem::with_id(app, "skip", "Saltar fase", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Ajustes…", true, None::<&str>)?;
    let sep = PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, "quit", "Salir", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show, &toggle, &skip, &sep, &settings, &sep, &quit])?;

    TrayIconBuilder::with_id("main")
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Pomodoro Llanero")
        .menu(&menu)
        .on_menu_event(|app, event| match event.id().as_ref() {
            "quit" => app.exit(0),
            "show" => show_main(app),
            other => {
                // Delegamos la acción al frontend (toggle/skip/settings).
                let _ = app.emit("tray://action", other.to_string());
                show_main(app);
            }
        })
        .on_tray_icon_event(|tray, event| {
            // Clic izquierdo: mostrar/enfocar la ventana.
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_main(tray.app_handle());
            }
        })
        .build(app)?;

    Ok(())
}

fn show_main<R: tauri::Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.show();
        let _ = win.set_focus();
    }
}
