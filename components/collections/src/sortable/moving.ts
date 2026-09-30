/**
 * Moves an item without a drag, for a path that needs no dragging movement, such as a menu's
 * "Move up" (WCAG 2.5.7).
 *
 * @remarks
 *   The move follows the drag's rules: a list at its limit and a list the caller's rule refuses
 *   take no item, and the outcome names why. A taken move names the item's new place in the same
 *   words a drag uses.
 */

import {
  type Announcing,
  placeWords,
  refusedAt,
  refusedSentence,
} from "#sortable/announcements.ts";
import {
  relocated,
  type SortableItems,
  type SortableMove,
  type SortablePlace,
} from "#sortable/moves.ts";

/**
 * Describes the outcome of a move without a drag: the items and the move it made, or the refusal.
 */
export interface Outcome {
  /**
   * Items after the move, absent for a refused move.
   */
  readonly items?: SortableItems;

  /**
   * Move made, absent for a refused move.
   */
  readonly move?: SortableMove;

  /**
   * Sentence a screen reader hears: the item's new place, or why the list refused it.
   */
  readonly sentence: string;
}

/**
 * Returns the outcome of moving an item to a place, or undefined for an item no list contains.
 *
 * @param state - The kit's state: items, lists, names, rules and words.
 * @param id - Id of the item.
 * @param to - Place to move it to. A place without a list keeps it in its own list.
 */
export function outcomeOf(state: Announcing, id: string, to: SortablePlace): Outcome | undefined {
  const moved = relocated(state.items, id, to);

  if (moved === undefined) return undefined;

  const refused = refusedAt(state, id, moved.from.list, moved.to);

  if (refused !== undefined) return { sentence: refusedSentence(state, id, refused) };

  return {
    items: moved.items,
    move: { from: moved.from, id, to: moved.to },
    sentence: state.words.movedLabel(placeWords(state, id, moved.to)),
  };
}
