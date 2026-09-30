/**
 * Builds a sortable root's state: its registries, its words, its rules, the handlers and plugins it
 * gives dnd-kit, and its move without a drag.
 *
 * @remarks
 *   The registries and the plugins are made once for a root. The handlers and the announcements
 *   read the root's latest state through a live ref when an event arrives, because dnd-kit keeps
 *   the plugins it was first given. A move without a drag follows the drag's rules, reports as a
 *   drop does, and is announced in the kit's words through the page's polite region.
 */

import { useId, useState } from "react";

import { type Plugins } from "@dnd-kit/abstract";

import { useAnnounce, useConst, useLiveRef } from "@stealthscale/hooks";

import { type Announcing, type Snapshot } from "#sortable/announcements.ts";
import { type DragHandlers, dragHandlersOf } from "#sortable/drag.ts";
import {
  type ItemOf,
  type SortableItem,
  type SortableItems,
  type SortableMove,
  type SortablePlace,
  type SortableRules,
} from "#sortable/moves.ts";
import { outcomeOf } from "#sortable/moving.ts";
import { pluginsOf } from "#sortable/plugins.ts";
import { type ListEntry, type RootState } from "#sortable/state.ts";
import { type SortableWords, wordsOf } from "#sortable/words.ts";

/**
 * Describes what a root's state is built from.
 *
 * @typeParam Items - The kit's items.
 */
export interface RootInput<Items extends SortableItems> {
  /**
   * Returns whether an item may move from the list it was picked up from into another list.
   */
  readonly canMove?: ((item: ItemOf<Items>, from: string, to: string) => boolean) | undefined;

  /**
   * Items the kit renders.
   */
  readonly items: Items;

  /**
   * Called once with each finished move.
   */
  readonly onItemMove?: ((move: SortableMove) => void) | undefined;

  /**
   * Called with the items to render after a change.
   */
  readonly onItemsChange?: ((items: Items) => void) | undefined;

  /**
   * Caller's words, any of which may be absent.
   */
  readonly words: SortableWords;
}

/**
 * Describes a root's state and what it gives dnd-kit.
 */
export interface Root {
  /**
   * Handlers the root gives dnd-kit's provider.
   */
  readonly handlers: DragHandlers;

  /**
   * Plugins the root gives dnd-kit's provider.
   */
  readonly plugins: (defaults: Plugins) => Plugins;

  /**
   * State the root's parts read.
   */
  readonly state: RootState;
}

/**
 * Returns the rules a move into another list follows: the caller's rule and each list's limit.
 *
 * @typeParam Items - The kit's items.
 */
function rulesOf<Items extends SortableItems>(
  canMove: RootInput<Items>["canMove"],
  lists: ReadonlyMap<string, ListEntry>,
): SortableRules<SortableItem> {
  return {
    canMove:
      canMove === undefined
        ? undefined
        : (item, from, to) =>
            // eslint-disable-next-line typescript/no-unsafe-type-assertion -- Every item the kit passes is one of the caller's items.
            canMove(item as ItemOf<Items>, from, to),
    limitOf: (list) => lists.get(list)?.limit,
  };
}

/**
 * Returns the root's move without a drag, which reports and announces its outcome.
 */
function moverOf(
  latest: () => Announcing,
  report: (items: SortableItems, move: SortableMove) => void,
  announce: (message: string) => void,
): (id: string, to: SortablePlace) => boolean {
  return (id, to) => {
    const outcome = outcomeOf(latest(), id, to);

    if (outcome === undefined) return false;

    announce(outcome.sentence);

    if (outcome.items === undefined || outcome.move === undefined) return false;

    report(outcome.items, outcome.move);

    return true;
  };
}

/**
 * Builds a root's state from its items, its callbacks, its rules and its words.
 *
 * @typeParam Items - The kit's items.
 */
export function useRoot<Items extends SortableItems>(input: RootInput<Items>): Root {
  const instructionsId = useId();
  const lists = useConst(() => new Map<string, ListEntry>());
  const names = useConst(() => new Map<string, string>());
  const [refusing, setRefusing] = useState<string>();
  const words = wordsOf(input.words);
  const rules = rulesOf(input.canMove, lists);
  const snapshot = useConst<Snapshot>(() => ({ items: input.items }));
  const live = useLiveRef<Announcing>({
    items: input.items,
    lists,
    names,
    rules,
    snapshot,
    words,
  });
  const plugins = useConst(() => pluginsOf(() => live.current));
  const announce = useAnnounce();

  /**
   * Reports the items to render after a change, in the shape the caller gave.
   */
  const changed = (items: SortableItems): void => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The kit reports items of the shape and the items it was given.
    input.onItemsChange?.(items as Items);
  };
  const handlers = dragHandlersOf({
    latest: () => live.current,
    onItemMove: input.onItemMove,
    onItemsChange: changed,
    setRefusing,
  });
  const move = moverOf(
    () => live.current,
    (items, made) => {
      changed(items);
      input.onItemMove?.(made);
    },
    announce,
  );

  return {
    handlers,
    plugins,
    state: { instructionsId, items: input.items, lists, move, names, refusing, words },
  };
}
