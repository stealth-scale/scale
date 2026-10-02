/**
 * Keeps what the pages on screen contribute to slots with `Into`, by slot, in order.
 */

import { type ReactNode } from "react";

import { type PageContribution, type PageStore } from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";

/**
 * Describes one contribution as the store keeps it.
 */
interface Placed {
  /**
   * The content the slot renders.
   */
  readonly content: ReactNode;

  /**
   * Rank among the slot's contributions, ascending.
   */
  readonly order: number;

  /**
   * Number of the `place` call that made the contribution, which orders contributions of equal
   * rank.
   */
  readonly sequence: number;

  /**
   * Qualified id of the slot.
   */
  readonly slotId: string;
}

/**
 * Returns the page store, with no contribution.
 *
 * @remarks
 *   A slot lists its contributions by `order`, then in the order they were placed. A contribution
 *   renders nothing until its content is filled, and keeps its place while its content changes. A
 *   `place` for a key already placed replaces the contribution, and the earlier `place`'s leave
 *   function then changes nothing.
 */
export function createPageStore(): PageStore {
  const placed = new Map<string, Placed>();
  const state = writable<ReadonlyMap<string, readonly PageContribution[]>>(new Map());
  let sequence = 0;

  /**
   * Publishes every contribution, grouped by slot and ordered.
   */
  const publish = (): void => {
    const ordered = [...placed].toSorted(
      ([, one], [, other]) => one.order - other.order || one.sequence - other.sequence,
    );
    const grouped = new Map<string, readonly PageContribution[]>();

    for (const [key, { content, order, slotId }] of ordered) {
      grouped.set(slotId, [...(grouped.get(slotId) ?? []), { content, key, order }]);
    }

    state.set(grouped);
  };

  return {
    fill: (key, content) => {
      const contribution = placed.get(key);

      if (contribution === undefined || contribution.content === content) return;

      placed.set(key, { ...contribution, content });
      publish();
    },
    get: state.get,
    place: (slotId, key, order) => {
      sequence += 1;

      const mine = sequence;

      placed.set(key, { content: null, order, sequence: mine, slotId });
      publish();

      return () => {
        if (placed.get(key)?.sequence !== mine) return;

        placed.delete(key);
        publish();
      };
    },
    subscribe: state.subscribe,
  };
}
