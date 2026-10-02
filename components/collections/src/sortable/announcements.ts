/**
 * Writes what a sortable kit announces during a drag, from its words and its latest state.
 *
 * @remarks
 *   The accessibility plugin of dnd-kit asks for a sentence when a drag starts, when it passes a
 *   target and when it ends, and it asks before the kit's own handlers run. A sentence during a
 *   drag names the place the target offers: the target item's place in its list, or the end of a
 *   list that is the target itself. A target that is the item, which dnd-kit reports once it has
 *   sorted the list, adds nothing. A list that refuses the item names the reason. A drop names the
 *   place the item took, and a cancel or a drop on a full list names the place it went back to.
 */

import { type Draggable, type Droppable } from "@dnd-kit/dom";

import {
  listOf,
  refusalOf,
  type SortableItem,
  type SortableItems,
  type SortablePlace,
  type SortableRefusal,
  type SortableRules,
} from "#sortable/moves.ts";
import { type ListEntry } from "#sortable/state.ts";
import { type SortableAnnouncement, type Words } from "#sortable/words.ts";

/**
 * Describes the state an announcement reads when an event arrives.
 */
export interface Announcing {
  /**
   * Items the kit renders.
   */
  readonly items: SortableItems;

  /**
   * Registry of the board's lists by their ids.
   */
  readonly lists: ReadonlyMap<string, ListEntry>;

  /**
   * Registry of the items' names by their ids.
   */
  readonly names: ReadonlyMap<string, string>;

  /**
   * Rules a move into another list follows.
   */
  readonly rules: SortableRules<SortableItem>;

  /**
   * Record of the current drag, which the drag's start writes.
   */
  readonly snapshot: Snapshot;

  /**
   * Words of the kit, with every default applied.
   */
  readonly words: Words;
}

/**
 * Describes the record of a drag: the items and the item's place from before it.
 */
export interface Snapshot {
  /**
   * Items from before the drag, which a cancel restores.
   */
  items: SortableItems;

  /**
   * Place the dragged item was picked up from, or undefined between drags.
   */
  origin?: SortablePlace | undefined;
}

/**
 * Describes the item a drag moves, as dnd-kit's sortable reports it.
 */
export interface Source {
  /**
   * Id of the list the item is in during the drag.
   */
  readonly group?: number | string | undefined;

  /**
   * Id of the item.
   */
  readonly id: number | string;

  /**
   * Index of the item in its list during the drag.
   */
  readonly index: number;

  /**
   * Id of the list the item was picked up from.
   */
  readonly initialGroup?: number | string | undefined;

  /**
   * Index the item was picked up from.
   */
  readonly initialIndex: number;
}

/**
 * Describes what a drag is over: another item's sortable, or a list of a board.
 */
export interface Target {
  /**
   * Id of the list an item target is in.
   */
  readonly group?: number | string | undefined;

  /**
   * Id of the target: an item's id, or a list's id.
   */
  readonly id: number | string;

  /**
   * Index of an item target in its list.
   */
  readonly index?: number | undefined;

  /**
   * Kind of the target: `list` for a list of a board.
   */
  readonly type?: unknown;
}

/**
 * Describes the refusal of a list: its id and why it refuses the item.
 */
export type Refused = readonly [list: string, refusal: SortableRefusal];

/**
 * Describes a drag operation as an announcement reads it.
 */
export interface Operation {
  /**
   * Item the drag moves.
   */
  readonly source: Draggable | null;

  /**
   * Drop target the drag is over, or null for none.
   */
  readonly target: Droppable | null;
}

/**
 * Describes the start of a drag as an announcement reads it.
 */
export interface Started {
  /**
   * The drag operation, whose target is not read.
   */
  readonly operation: Pick<Operation, "source">;
}

/**
 * Describes a target a drag passes as an announcement reads it.
 */
export interface Passed {
  /**
   * The drag operation.
   */
  readonly operation: Operation;
}

/**
 * Describes the end of a drag as an announcement reads it.
 */
export interface Ended extends Passed {
  /**
   * Whether the drag was cancelled.
   */
  readonly canceled: boolean;
}

/**
 * Describes the announcements dnd-kit's accessibility plugin asks for.
 */
export interface Announcements {
  /**
   * Writes the sentence of a drag's end.
   */
  readonly dragend: (event: Ended) => string;

  /**
   * Writes the sentence of a target the drag passes, or none.
   */
  readonly dragover: (event: Passed) => string | undefined;

  /**
   * Writes the sentence of an item picked up.
   */
  readonly dragstart: (event: Started) => string;
}

/**
 * Returns the place the dragged item was picked up from: the one the kit recorded when the drag
 * started, else the one dnd-kit reports.
 *
 * @remarks
 *   A row's sortable reports the list the row started in, and a move into another list mounts the
 *   row anew, so after such a move the sortable reports the new list. The kit's record keeps the
 *   first.
 */
export function originOf(state: Announcing, source: Source): SortablePlace {
  return (
    state.snapshot.origin ?? { index: source.initialIndex, list: listIdOf(source.initialGroup) }
  );
}

/**
 * Returns a list's id as the kit writes it: a string, or undefined for the one list of an array.
 */
export function listIdOf(group?: number | string): string | undefined {
  return group === undefined ? undefined : String(group);
}

/**
 * Returns the item a drag moves, which every draggable of the kit is.
 *
 * @param source - The drag operation's source.
 */
export function sourceOf(source: Draggable | null): Source {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- Every draggable of the kit is an item's sortable, which reports its index and its list.
  return source as unknown as Source;
}

/**
 * Returns the place a target offers an item: an item target's place, or the end of a list target
 * without the item.
 */
export function targetPlaceOf(items: SortableItems, id: string, target: Target): SortablePlace {
  if (target.type !== "list") return { index: target.index ?? 0, list: listIdOf(target.group) };

  const list = String(target.id);

  return { index: listOf(items, list).filter((item) => item.id !== id).length, list };
}

/**
 * Returns the list of a place that refuses an item and why, or undefined while it takes it.
 *
 * @param state - The kit's items, lists, names, rules and words.
 * @param id - Id of the item.
 * @param from - Id of the list the item was picked up from.
 * @param place - Place the item would take, absent for none.
 */
export function refusedAt(
  state: Announcing,
  id: string,
  from: string | undefined,
  place?: SortablePlace,
): Refused | undefined {
  const list = place?.list;

  if (list === undefined) return undefined;

  const refusal = refusalOf(state.items, id, { from, to: list }, state.rules);

  return refusal === undefined ? undefined : [list, refusal];
}

/**
 * Returns an item's name, or its id for an item that registered none.
 */
export function nameOf(state: Announcing, id: string): string {
  return state.names.get(id) ?? id;
}

/**
 * Returns the sentence of a list refusing an item: the list is full, or the rule refuses it.
 */
export function refusedSentence(state: Announcing, id: string, refused: Refused): string {
  const [list, refusal] = refused;
  const entry = state.lists.get(list);
  const words = { item: nameOf(state, id), limit: entry?.limit, list: entry?.label ?? list };

  return refusal === "full" ? state.words.fullLabel(words) : state.words.refusedLabel(words);
}

/**
 * Returns the words that place an item: its name, its position of its list's count, and the
 * list's name.
 */
export function placeWords(
  state: Announcing,
  id: string,
  place: SortablePlace,
): SortableAnnouncement {
  const others = listOf(state.items, place.list).filter((item) => item.id !== id);

  return {
    count: others.length + 1,
    item: nameOf(state, id),
    list: place.list === undefined ? undefined : state.lists.get(place.list)?.label,
    position: place.index + 1,
  };
}

/**
 * Returns the sentence of a target a drag passes, or undefined for no target and for the item
 * itself.
 */
export function overSentence(
  state: Announcing,
  source: Source,
  target: null | Target,
): string | undefined {
  const id = String(source.id);

  if (target === null || String(target.id) === id) return undefined;

  const place = targetPlaceOf(state.items, id, target);
  const refused = refusedAt(state, id, originOf(state, source).list, place);

  return refused === undefined
    ? state.words.movedLabel(placeWords(state, id, place))
    : refusedSentence(state, id, refused);
}

/**
 * Returns the sentence of a drag's end: the place the item took, the place it went back to after
 * a cancel or a drop on a full list, or the rule's refusal.
 */
export function endSentence(
  state: Announcing,
  source: Source,
  target: null | Target,
  canceled: boolean,
): string {
  const id = String(source.id);
  const place = target === null ? undefined : targetPlaceOf(state.items, id, target);
  const origin = originOf(state, source);
  const refused = refusedAt(state, id, origin.list, place);

  if (refused?.[1] === "refused") return refusedSentence(state, id, refused);

  if (canceled || refused !== undefined) {
    return state.words.cancelledLabel(placeWords(state, id, origin));
  }

  const at = { index: source.index, list: listIdOf(source.group) };

  return state.words.droppedLabel(placeWords(state, id, at));
}

/**
 * Returns the announcements dnd-kit's accessibility plugin asks for, reading the kit's state as of
 * its last render when each event arrives.
 *
 * @param latest - Returns the kit's state as of its last render.
 */
export function announcementsOf(latest: () => Announcing): Announcements {
  return {
    dragend: ({ canceled, operation }) =>
      endSentence(latest(), sourceOf(operation.source), operation.target, canceled),
    dragover: ({ operation }) =>
      overSentence(latest(), sourceOf(operation.source), operation.target),
    dragstart: ({ operation }) => {
      const state = latest();
      const source = sourceOf(operation.source);
      const place = { index: source.index, list: listIdOf(source.group) };

      return state.words.liftedLabel(placeWords(state, String(source.id), place));
    },
  };
}
