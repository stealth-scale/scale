/**
 * Reads a value derived from the host's stores in a component.
 */

import { useSyncExternalStore } from "react";

import { type Store } from "#host/stores.ts";

/**
 * Returns what the selector reads from the stores, and renders the component again when the result
 * changes.
 *
 * @remarks
 *   React compares each result with the last one by `Object.is`. A selector that returns a
 *   primitive, or an object a store keeps until it changes, therefore renders the component only
 *   when the selected value changes. A server renders from the same selector, because a host per
 *   request keeps the request's stores.
 * @param stores - Every store the selector reads.
 * @param selector - Function that derives the value from the stores' current values.
 */
export function useSelector<T>(stores: ReadonlyArray<Store<unknown>>, selector: () => T): T {
  /**
   * Subscribes the listener to every store the selector reads, and returns a function that stops
   * every subscription.
   */
  const subscribe = (listener: () => void): (() => void) => {
    const stops = stores.map((store) => store.subscribe(listener));

    return () => {
      for (const stop of stops) stop();
    };
  };

  return useSyncExternalStore(subscribe, selector, selector);
}
