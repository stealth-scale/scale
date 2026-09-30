/**
 * Writes the words a sortable kit gives a screen reader, each a prop with an English default.
 *
 * @remarks
 *   A handle is named by its item, so a list of handles is not a list of identical names, and it
 *   states a role description in the caller's words over dnd-kit's English "draggable". The
 *   instructions a handle is described by name the keys, because nothing about a focused button
 *   shows that Space lifts it. Each announcement names the item, its position of the list's count
 *   and, on a board, the list, because a position alone does not name the list it is in.
 */

import { omitUndefined } from "@stealthscale/hooks";

/**
 * Describes where an announcement puts an item.
 */
export interface SortableAnnouncement {
  /**
   * Number of items in the list the item is in.
   */
  readonly count: number;

  /**
   * Name of the item.
   */
  readonly item: string;

  /**
   * Name of the list, or undefined for the one list of an array.
   */
  readonly list?: string | undefined;

  /**
   * Position of the item in the list, from 1.
   */
  readonly position: number;
}

/**
 * Describes a list that refuses an item.
 */
export interface SortableRefused {
  /**
   * Name of the item.
   */
  readonly item: string;

  /**
   * Most items the list takes, or undefined for a list the caller's rule refuses.
   */
  readonly limit?: number | undefined;

  /**
   * Name of the list.
   */
  readonly list: string;
}

/**
 * Describes the words of a sortable kit, each with an English default.
 */
export interface SortableWords {
  /**
   * Writes the announcement of a drag that was cancelled, with the place the item went back to.
   */
  readonly cancelledLabel?: ((at: SortableAnnouncement) => string) | undefined;

  /**
   * Writes the announcement of a drop, with the place the item took.
   */
  readonly droppedLabel?: ((at: SortableAnnouncement) => string) | undefined;

  /**
   * Writes the announcement of a list at its limit refusing the item.
   */
  readonly fullLabel?: ((refused: SortableRefused) => string) | undefined;

  /**
   * Writes the name of an item's handle from the item's name.
   */
  readonly handleLabel?: ((item: string) => string) | undefined;

  /**
   * Instructions every handle is described by.
   */
  readonly instructions?: string | undefined;

  /**
   * Writes the announcement of an item picked up, with the place it left.
   */
  readonly liftedLabel?: ((at: SortableAnnouncement) => string) | undefined;

  /**
   * Writes the announcement of an item moved during a drag, with the place it would take.
   */
  readonly movedLabel?: ((at: SortableAnnouncement) => string) | undefined;

  /**
   * Writes the announcement of the caller's rule refusing the item a list.
   */
  readonly refusedLabel?: ((refused: SortableRefused) => string) | undefined;

  /**
   * Role description every handle states in place of "button".
   */
  readonly roleDescription?: string | undefined;
}

/**
 * Describes the words with every default applied.
 */
export type Words = Required<{ [Key in keyof SortableWords]: NonNullable<SortableWords[Key]> }>;

/**
 * Writes where an item is: its position of the count, and the list on a board.
 */
function placed({ count, list, position }: SortableAnnouncement): string {
  const at = `position ${String(position)} of ${String(count)}`;

  return list === undefined ? at : `${at} in ${list}`;
}

/**
 * Lists the English words.
 */
export const WORDS: Words = {
  cancelledLabel: (at) => `Put ${at.item} back at ${placed(at)}.`,
  droppedLabel: (at) => `Dropped ${at.item} at ${placed(at)}.`,
  fullLabel: ({ limit, list }) => `${list} is full at ${String(limit)} items.`,
  handleLabel: (item) => `Move ${item}`,
  instructions:
    "Press Space or Enter to pick the item up, the arrow keys to move it, Space or Enter to drop it and Escape to put it back.",
  liftedLabel: (at) => `Picked up ${at.item} at ${placed(at)}.`,
  movedLabel: (at) => `Moved ${at.item} to ${placed(at)}.`,
  refusedLabel: ({ item, list }) => `${item} cannot move to ${list}.`,
  roleDescription: "sortable",
};

/**
 * Returns the caller's words over the English defaults.
 *
 * @param words - The caller's words, any of which may be absent.
 */
export function wordsOf(words: SortableWords): Words {
  return { ...WORDS, ...omitUndefined(words) };
}
