//! Comandos invocables desde el frontend (capa fina; la lógica vive en JS/dominio).

use serde::Deserialize;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Manager, State};

use crate::AppState;

const KEYRING_SERVICE: &str = "pomodoro-llanero";
const KEYRING_USER: &str = "generative-api-key";

/// Petición de generación de imagen (modo generativo, opcional).
#[derive(Debug, Deserialize)]
pub struct GenReq {
    pub backend: String,
    pub prompt: String,
    pub animal: String,
}

/// Genera una imagen de fauna. **Desactivado por defecto.**
///
/// Devuelve `Ok(None)` para que el frontend degrade con elegancia a la imagen
/// local de la galería. Aquí se integraría:
///  - backend "local": un runtime de difusión local (p. ej. Stable Diffusion)
///    cargado desde `localModelPath`, generando un PNG y devolviéndolo como
///    `data:image/png;base64,...`.
///  - backend "api": una llamada HTTP al proveedor configurado usando la clave
///    recuperada de `get_api_key()`; nunca se expone la clave al frontend.
#[tauri::command]
pub async fn generate_fauna_image(req: GenReq) -> Result<Option<String>, String> {
    // Integración real pendiente; mantenemos la app 100% offline por defecto.
    let _ = (&req.backend, &req.prompt, &req.animal);
    Ok(None)
}

/// Guarda la clave de API en el llavero del sistema (almacenamiento seguro).
#[tauri::command]
pub fn set_api_key(key: String) -> Result<(), String> {
    let entry =
        keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER).map_err(|e| e.to_string())?;
    if key.is_empty() {
        // Cadena vacía => borrar credencial.
        let _ = entry.delete_password();
        return Ok(());
    }
    entry.set_password(&key).map_err(|e| e.to_string())
}

/// Indica si hay una clave de API almacenada (sin revelarla).
#[tauri::command]
pub fn has_api_key() -> bool {
    keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER)
        .and_then(|e| e.get_password())
        .is_ok()
}

/// Recupera la clave (uso interno del backend generativo).
#[allow(dead_code)]
pub fn get_api_key() -> Option<String> {
    keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER)
        .and_then(|e| e.get_password())
        .ok()
}

/// Activa/desactiva "cerrar a la bandeja" (lo controla el ajuste del usuario).
#[tauri::command]
pub fn set_close_to_tray(state: State<AppState>, enabled: bool) {
    state.close_to_tray.store(enabled, Ordering::Relaxed);
}

/// Actualiza el texto de la bandeja (fase + tiempo restante).
#[tauri::command]
pub fn update_tray(app: AppHandle, title: String) {
    if let Some(tray) = app.tray_by_id("main") {
        let _ = tray.set_tooltip(Some(title.as_str()));
        // En macOS el título se muestra junto al icono en la barra de menú.
        #[cfg(target_os = "macos")]
        let _ = tray.set_title(Some(title.as_str()));
    }
}
