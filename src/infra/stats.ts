/**
 * Repositorio de historial/estadísticas.
 *
 * `StatsRepo` guarda sesiones y entrega un resumen. La agregación
 * (`summarizeSessions`) es pura y vive en el dominio; aquí sólo persistimos y
 * leemos. Dos implementaciones: SQLite (`tauri-plugin-sql`) y un respaldo en
 * `localStorage` para desarrollo en navegador.
 */
import type { Session, StatsSummary } from "../domain/types";
import { summarizeSessions } from "../domain/stats";
import { isTauri } from "./env";

export interface StatsRepo {
  init(): Promise<void>;
  recordSession(s: Session): Promise<void>;
  allSessions(): Promise<Session[]>;
  getSummary(goal: number): Promise<StatsSummary>;
}

interface SqlDatabase {
  execute(query: string, bind?: unknown[]): Promise<unknown>;
  select<T>(query: string, bind?: unknown[]): Promise<T>;
}

interface SessionRow {
  id: number;
  kind: string;
  started_at: number;
  ended_at: number;
  planned_ms: number;
  actual_ms: number;
  completed: number;
}

class TauriStatsRepo implements StatsRepo {
  private dbPromise: Promise<SqlDatabase> | null = null;

  private getDb(): Promise<SqlDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = import("@tauri-apps/plugin-sql").then(
        async (m) => (await m.default.load("sqlite:stats.db")) as SqlDatabase,
      );
    }
    return this.dbPromise;
  }

  async init(): Promise<void> {
    const db = await this.getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        ended_at INTEGER NOT NULL,
        planned_ms INTEGER NOT NULL,
        actual_ms INTEGER NOT NULL,
        completed INTEGER NOT NULL
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at);`,
    );
  }

  async recordSession(s: Session): Promise<void> {
    const db = await this.getDb();
    await db.execute(
      `INSERT INTO sessions (kind, started_at, ended_at, planned_ms, actual_ms, completed)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [s.kind, s.startedAt, s.endedAt, s.plannedMs, s.actualMs, s.completed ? 1 : 0],
    );
  }

  async allSessions(): Promise<Session[]> {
    const db = await this.getDb();
    const rows = await db.select<SessionRow[]>(
      `SELECT * FROM sessions ORDER BY started_at ASC`,
    );
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind as Session["kind"],
      startedAt: r.started_at,
      endedAt: r.ended_at,
      plannedMs: r.planned_ms,
      actualMs: r.actual_ms,
      completed: r.completed === 1,
    }));
  }

  async getSummary(goal: number): Promise<StatsSummary> {
    return summarizeSessions(await this.allSessions(), goal);
  }
}

const LS_KEY = "stats.sessions";

class LocalStatsRepo implements StatsRepo {
  async init(): Promise<void> {}

  private read(): Session[] {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Session[];
    } catch {
      return [];
    }
  }

  async recordSession(s: Session): Promise<void> {
    const all = this.read();
    all.push({ ...s, id: all.length + 1 });
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  async allSessions(): Promise<Session[]> {
    return this.read();
  }

  async getSummary(goal: number): Promise<StatsSummary> {
    return summarizeSessions(this.read(), goal);
  }
}

let instance: StatsRepo | null = null;
export function getStatsRepo(): StatsRepo {
  if (!instance) instance = isTauri() ? new TauriStatsRepo() : new LocalStatsRepo();
  return instance;
}
