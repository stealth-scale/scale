/**
 * Holds the length of a field's value, which the control writes and the counter reads.
 *
 * @remarks
 *   The control and the counter are siblings under the root, so the root holds a store between
 *   them. The control writes after layout and the counter reads through `useSyncExternalStore`, so
 *   no state is written from an effect. A write that changes nothing notifies no one. A server
 *   render reads 0, because layout effects do not run there.
 */

/**
 * Describes the store of one field's value length.
 */
export interface Tally {
  /**
   * Returns the length of the value, in UTF-16 code units.
   */
  readonly get: () => number;

  /**
   * Writes the length of the value and notifies every subscriber when it changed.
   */
  readonly set: (length: number) => void;

  /**
   * Adds a listener and returns the function that removes it.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Returns an empty store at a length of 0.
 */
export function tally(): Tally {
  let length = 0;
  const listeners = new Set<() => void>();

  return {
    get: () => length,
    set: (next) => {
      if (next === length) return;

      length = next;

      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
