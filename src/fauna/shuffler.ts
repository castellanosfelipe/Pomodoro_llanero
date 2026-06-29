/**
 * Selector aleatorio **sin repetición** hasta agotar el conjunto.
 *
 * Se usa para rotar la fauna en cada descanso: baraja todos los animales y los
 * va entregando uno a uno; al agotarse, vuelve a barajar evitando que el primer
 * elemento del nuevo ciclo repita al último del anterior. El RNG es inyectable
 * para tener tests deterministas.
 */
export class NonRepeatingPicker<T> {
  private bag: T[] = [];
  private last: T | undefined;

  constructor(
    private items: readonly T[] = [],
    private readonly rng: () => number = Math.random,
  ) {}

  /** Reemplaza el conjunto y vacía la bolsa actual. */
  setItems(items: readonly T[]): void {
    this.items = items;
    this.bag = [];
    this.last = undefined;
  }

  /** Cuántos elementos quedan antes de rebarajar. */
  remaining(): number {
    return this.bag.length;
  }

  /** Entrega el siguiente elemento sin repetir hasta agotar el conjunto. */
  next(): T | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) {
      this.last = this.items[0];
      return this.items[0];
    }
    if (this.bag.length === 0) this.refill();
    const value = this.bag.pop() as T;
    this.last = value;
    return value;
  }

  private refill(): void {
    const next = this.shuffle([...this.items]);
    // Evita que el primero a entregar (el último del array tras barajar)
    // repita inmediatamente al último entregado del ciclo anterior.
    if (next.length > 1 && next[next.length - 1] === this.last) {
      const swapIdx = Math.floor(this.rng() * (next.length - 1));
      const tmp = next[next.length - 1];
      next[next.length - 1] = next[swapIdx];
      next[swapIdx] = tmp;
    }
    this.bag = next;
  }

  /** Fisher–Yates con RNG inyectable. */
  private shuffle(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }
}
