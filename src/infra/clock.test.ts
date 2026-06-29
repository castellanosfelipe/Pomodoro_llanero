import { describe, it, expect } from "vitest";
import { createMonotonicClock } from "./clock";

describe("createMonotonicClock", () => {
  it("avanza con la fuente cuando ésta crece (incluye tiempo de suspensión)", () => {
    let t = 1000;
    const clock = createMonotonicClock(() => t);
    expect(clock()).toBe(1000);
    t = 5000; // p. ej. el equipo estuvo suspendido
    expect(clock()).toBe(5000);
  });

  it("nunca retrocede ante un salto hacia atrás del reloj (NTP/usuario)", () => {
    let t = 1000;
    const clock = createMonotonicClock(() => t);
    expect(clock()).toBe(1000);
    t = 800; // ajuste de reloj hacia atrás
    expect(clock()).toBe(1000); // clamp: se mantiene monotónico
    t = 1200;
    expect(clock()).toBe(1200);
  });
});
