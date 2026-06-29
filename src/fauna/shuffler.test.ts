import { describe, it, expect } from "vitest";
import { NonRepeatingPicker } from "./shuffler";

/** RNG determinista (LCG) para barajados reproducibles. */
function seededRng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

describe("NonRepeatingPicker", () => {
  it("entrega cada elemento exactamente una vez antes de repetir", () => {
    const items = ["a", "b", "c", "d"];
    const picker = new NonRepeatingPicker(items, seededRng(42));
    const draws = [picker.next(), picker.next(), picker.next(), picker.next()];
    expect(new Set(draws)).toEqual(new Set(items));
  });

  it("a lo largo de dos ciclos completos cada elemento sale dos veces", () => {
    const items = ["a", "b", "c", "d"];
    const picker = new NonRepeatingPicker(items, seededRng(7));
    const counts: Record<string, number> = {};
    for (let i = 0; i < 8; i++) {
      const v = picker.next() as string;
      counts[v] = (counts[v] ?? 0) + 1;
    }
    expect(counts).toEqual({ a: 2, b: 2, c: 2, d: 2 });
  });

  it("no repite inmediatamente al cruzar la frontera entre ciclos", () => {
    const items = ["a", "b", "c", "d"];
    const picker = new NonRepeatingPicker(items, seededRng(3));
    let prev = picker.next();
    for (let i = 0; i < 200; i++) {
      const cur = picker.next();
      expect(cur).not.toBe(prev);
      prev = cur;
    }
  });

  it("maneja conjunto vacío y de un solo elemento", () => {
    const empty = new NonRepeatingPicker<string>([], seededRng());
    expect(empty.next()).toBeUndefined();

    const single = new NonRepeatingPicker(["solo"], seededRng());
    expect(single.next()).toBe("solo");
    expect(single.next()).toBe("solo");
  });

  it("setItems reinicia la rotación", () => {
    const picker = new NonRepeatingPicker(["a", "b"], seededRng(9));
    picker.next();
    picker.setItems(["x", "y", "z"]);
    expect(picker.remaining()).toBe(0);
    const v = picker.next();
    expect(["x", "y", "z"]).toContain(v);
  });
});
