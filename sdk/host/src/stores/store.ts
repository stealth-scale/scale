/**
 * Builds the value-and-listeners pair every store of the host is made of.
 */

import { type Store } from "@stealthscale/sdk-plugin";

/**
 * Describes a store the host changes: the reader the hooks of `sdk-plugin` see, and a setter only
 * the host calls.
 */
export interface Writable<T> extends Store<T> {
  /**
   * Replaces the value and calls every listener, where the value is another object.
   */
  readonly set: (value: T) => void;
}

/**
 * Returns a store that keeps one value and calls its listeners after each change.
 *
 * @remarks
 *   The listeners run over a copy of the set, so a listener that subscribes or unsubscribes while
 *   the others run changes the next notification and not this one. Setting the same object again
 *   calls no listener, because `useSyncExternalStore` compares snapshots by identity.
 * @param initial - The value before the first change.
 */
export function writable<T>(initial: T): Writable<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;

      value = next;

      // eslint-disable-next-line unicorn/no-useless-spread -- the loop runs over a copy, so a listener added during it waits for the next change
      for (const listener of [...listeners]) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
