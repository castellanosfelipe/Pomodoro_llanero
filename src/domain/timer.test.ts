import { describe, it, expect, beforeEach } from "vitest";
import { PomodoroEngine, type EngineConfig, type EngineEvent } from "./timer";

/** Reloj falso controlable para tiempo determinista en los tests. */
function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
    set: (v: number) => {
      t = v;
    },
  };
}

const baseConfig: Partial<EngineConfig> = {
  focusMs: 1000,
  shortBreakMs: 400,
  longBreakMs: 800,
  pomodorosPerCycle: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  strictMode: false,
};

/** Captura los eventos emitidos para aserciones. */
function recorder(engine: PomodoroEngine) {
  const events: EngineEvent[] = [];
  engine.subscribe((e) => events.push(e));
  return events;
}

describe("PomodoroEngine — estado inicial", () => {
  it("arranca inactivo en la fase de enfoque con la duración completa", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    const s = engine.getState();
    expect(s.phase).toBe("focus");
    expect(s.status).toBe("idle");
    expect(s.durationMs).toBe(1000);
    expect(s.remainingMs).toBe(1000);
    expect(s.completedFocusTotal).toBe(0);
  });
});

describe("PomodoroEngine — conteo por timestamps", () => {
  let clock: ReturnType<typeof fakeClock>;
  let engine: PomodoroEngine;

  beforeEach(() => {
    clock = fakeClock();
    engine = new PomodoroEngine(baseConfig, clock.now);
  });

  it("descuenta el restante según el reloj, no según el número de ticks", () => {
    engine.start();
    clock.advance(400);
    engine.tick();
    expect(engine.getState().remainingMs).toBe(600);

    // Muchos ticks sin avanzar el reloj NO descuentan tiempo (no hay drift).
    engine.tick();
    engine.tick();
    engine.tick();
    expect(engine.getState().remainingMs).toBe(600);
  });

  it("completa la fase tras agotar la duración", () => {
    const events = recorder(engine);
    engine.start();
    clock.advance(1000);
    engine.tick();

    const completed = events.find((e) => e.kind === "phaseCompleted");
    expect(completed).toMatchObject({
      kind: "phaseCompleted",
      phase: "focus",
      plannedMs: 1000,
      actualMs: 1000,
    });
    expect(engine.getState().phase).toBe("shortBreak");
    expect(engine.getState().completedFocusTotal).toBe(1);
  });
});

describe("PomodoroEngine — robustez ante suspensión", () => {
  it("un solo tick tras una suspensión larga completa la fase sin perder tiempo", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();

    // El equipo se suspende 1 hora durante un enfoque de 1s.
    clock.advance(60 * 60_000);
    engine.tick();

    expect(engine.getState().phase).toBe("shortBreak");
    expect(engine.getState().completedFocusTotal).toBe(1);
  });

  it("el tiempo en pausa no se contabiliza aunque el reloj avance mucho", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();
    clock.advance(300);
    engine.tick();
    expect(engine.getState().remainingMs).toBe(700);

    engine.pause();
    clock.advance(10_000); // suspensión estando en pausa
    engine.resume();

    expect(engine.getState().remainingMs).toBe(700);
  });
});

describe("PomodoroEngine — pausa / reanudar", () => {
  it("conserva el tiempo transcurrido al pausar y reanudar", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();
    clock.advance(250);
    engine.tick();
    engine.pause();
    expect(engine.getState().status).toBe("paused");
    expect(engine.getState().remainingMs).toBe(750);

    engine.resume();
    clock.advance(250);
    engine.tick();
    expect(engine.getState().remainingMs).toBe(500);
  });

  it("en modo estricto no se puede pausar durante el enfoque", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(
      { ...baseConfig, strictMode: true },
      clock.now,
    );
    engine.start();
    clock.advance(100);
    engine.tick();
    engine.pause();
    expect(engine.getState().status).toBe("running");
  });
});

describe("PomodoroEngine — ciclo y descanso largo", () => {
  it("tras N enfoques entrega un descanso largo y reinicia el ciclo", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(
      {
        ...baseConfig,
        pomodorosPerCycle: 2,
        autoStartBreaks: true,
        autoStartFocus: true,
      },
      clock.now,
    );

    const completePhase = () => {
      clock.advance(engine.getState().remainingMs);
      engine.tick();
    };

    engine.start();
    completePhase(); // enfoque 1 -> descanso corto (auto)
    expect(engine.getState().phase).toBe("shortBreak");
    completePhase(); // descanso corto -> enfoque 2 (auto)
    expect(engine.getState().phase).toBe("focus");
    completePhase(); // enfoque 2 -> descanso largo (fin de ciclo)
    expect(engine.getState().phase).toBe("longBreak");
    expect(engine.getState().completedFocusInCycle).toBe(0);
    expect(engine.getState().completedFocusTotal).toBe(2);
  });
});

describe("PomodoroEngine — saltar fase", () => {
  it("salta sin contar el enfoque como completado", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    const events = recorder(engine);
    engine.start();
    clock.advance(200);
    engine.tick();
    engine.skip();

    expect(events.some((e) => e.kind === "phaseSkipped")).toBe(true);
    expect(engine.getState().phase).toBe("shortBreak");
    expect(engine.getState().completedFocusTotal).toBe(0);
  });
});

describe("PomodoroEngine — auto-inicio", () => {
  it("auto-inicia el descanso al terminar el enfoque cuando está activado", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(
      { ...baseConfig, autoStartBreaks: true },
      clock.now,
    );
    engine.start();
    clock.advance(1000);
    engine.tick();
    expect(engine.getState().phase).toBe("shortBreak");
    expect(engine.getState().status).toBe("running");
  });

  it("no auto-inicia el descanso cuando está desactivado (queda listo)", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();
    clock.advance(1000);
    engine.tick();
    expect(engine.getState().phase).toBe("shortBreak");
    expect(engine.getState().status).toBe("idle");
  });
});

describe("PomodoroEngine — reinicio", () => {
  it("vuelve a un estado limpio de enfoque inactivo", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();
    clock.advance(500);
    engine.tick();
    engine.reset();

    const s = engine.getState();
    expect(s.phase).toBe("focus");
    expect(s.status).toBe("idle");
    expect(s.remainingMs).toBe(1000);
    expect(s.completedFocusTotal).toBe(0);
  });
});

describe("PomodoroEngine — configuración en caliente", () => {
  it("reajusta la duración de la fase en curso conservando lo transcurrido", () => {
    const clock = fakeClock();
    const engine = new PomodoroEngine(baseConfig, clock.now);
    engine.start();
    clock.advance(300);
    engine.tick();
    expect(engine.getState().remainingMs).toBe(700);

    // El usuario sube el enfoque a 2s en mitad de la fase.
    engine.setConfig({ focusMs: 2000 });
    expect(engine.getState().durationMs).toBe(2000);
    expect(engine.getState().remainingMs).toBe(1700);
  });
});
