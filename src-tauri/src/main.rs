// Evita abrir una consola extra en Windows en compilación release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    pomodoro_llanero_lib::run()
}
