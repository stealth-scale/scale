/**
 * Keeps the slots on screen, with the outcome of each mounted instance.
 */

import { type MountedSlot, type MountedStore } from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";

/**
 * Returns the mounted store, with no slot on screen.
 *
 * @remarks
 *   Each `mount` records one instance, in mount order, until the function it returns is called. A
 *   slot whose last instance unmounts leaves the store. A second call of that function changes
 *   nothing.
 */
export function createMountedStore(): MountedStore {
  const instances = new Map<number, readonly [string, MountedSlot]>();
  const state = writable<ReadonlyMap<string, readonly MountedSlot[]>>(new Map());
  let next = 0;

  /**
   * Publishes every mounted instance, grouped by slot.
   */
  const publish = (): void => {
    const grouped = new Map<string, readonly MountedSlot[]>();

    for (const [slotId, slot] of instances.values()) {
      grouped.set(slotId, [...(grouped.get(slotId) ?? []), slot]);
    }

    state.set(grouped);
  };

  return {
    get: state.get,
    mount: (slotId, slot) => {
      const instance = next;

      next += 1;
      instances.set(instance, [slotId, slot]);
      publish();

      return () => {
        if (instances.delete(instance)) publish();
      };
    },
    subscribe: state.subscribe,
  };
}
