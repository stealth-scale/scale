/**
 * Shares a sortable kit's state with its parts: the root's items, words and moves, the list a part
 * is in, and the item a handle drags.
 *
 * @remarks
 *   Each list writes its name and its limit, and each item its name, into the root's registries
 *   once it renders, and the drag handlers and the announcements read the registries when an event
 *   arrives, so no render waits on them. A part outside a list reads no list, which is the one list
 *   of an array.
 */

import { createContext } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

import { type SortableItems, type SortablePlace } from "#sortable/moves.ts";
import { type Words } from "#sortable/words.ts";

/**
 * Describes what a list of a board registers with the root.
 */
export interface ListEntry {
  /**
   * Name of the list, which the announcements name it by.
   */
  readonly label?: string | undefined;

  /**
   * Most items the list takes.
   */
  readonly limit?: number | undefined;
}

/**
 * Describes the root's state as its parts read it.
 */
export interface RootState {
  /**
   * ID of the element whose text is the instructions every handle is described by.
   */
  readonly instructionsId: string;

  /**
   * Items the kit renders.
   */
  readonly items: SortableItems;

  /**
   * Registry of the board's lists by their ids.
   */
  readonly lists: Map<string, ListEntry>;

  /**
   * Moves an item to a place without a drag, and returns whether the move was taken.
   */
  readonly move: (id: string, to: SortablePlace) => boolean;

  /**
   * Registry of the items' names by their ids.
   */
  readonly names: Map<string, string>;

  /**
   * Id of the list that refuses the dragged item, or undefined while none does.
   */
  readonly refusing?: string | undefined;

  /**
   * Words of the kit, with every default applied.
   */
  readonly words: Words;
}

/**
 * Provides the root's state, and reads it back inside a root.
 */
export const [RootProvider, useRootState] = createRequiredContext<RootState>("Sortable");

/**
 * Returns the root's move without a drag, for a path that needs no dragging movement.
 *
 * @remarks
 *   `move(id, { index, list })` moves an item to an index of a list, its own list when the place
 *   names none, and returns whether the list took it. A list at its limit and a list the root's
 *   rule refuses take no item. The move reports as a drop does and is announced.
 */
export function useMove(): RootState["move"] {
  return useRootState().move;
}

/**
 * Describes the list a part is in.
 */
export interface ListState {
  /**
   * Id of the list, its key in the items' record.
   */
  readonly id: string;

  /**
   * Name of the list.
   */
  readonly label?: string | undefined;
}

/**
 * Provides the list a part is in, undefined for the one list of an array.
 */
export const ListContext = createContext<ListState | undefined>(undefined);

/**
 * Describes the item a handle drags.
 */
export interface ItemState {
  /**
   * Whether the item keeps its place, which renders no handle.
   */
  readonly disabled: boolean;

  /**
   * Hands dnd-kit the element a drag starts from.
   */
  readonly handleRef: (element: Element | null) => void;

  /**
   * Name of the item.
   */
  readonly label: string;
}

/**
 * Provides the item a handle drags, and reads it back inside an item.
 */
export const [ItemProvider, useItemState] = createRequiredContext<ItemState>("Sortable.Item");
