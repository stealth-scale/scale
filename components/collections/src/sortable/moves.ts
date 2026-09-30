/**
 * Reads and rewrites a sortable kit's items: an array for one list, or a record of lists keyed by
 * their ids, the two shapes `@dnd-kit/helpers`' `move` takes.
 *
 * @remarks
 *   A list's id is its key in the record, and the one list of an array has no id. An item's place
 *   is its list and its index in it. A move into another list is refused while that list is at its
 *   limit, not counting the item itself, and while the caller's rule refuses the move from the list
 *   the item was picked up from. A move within one list is never refused.
 */

/**
 * Describes an item the kit moves.
 */
export interface SortableItem {
  /**
   * Id of the item, unique across every list of the kit and different from every list's id.
   */
  readonly id: string;
}

/**
 * Describes a kit's items: one list as an array, or a board's lists as a record keyed by their ids.
 *
 * @typeParam T - One item.
 */
export type SortableItems<T extends SortableItem = SortableItem> = Record<string, T[]> | T[];

/**
 * Describes one item of the items a kit renders.
 *
 * @typeParam Items - The kit's items.
 */
export type ItemOf<Items> =
  Items extends Array<infer T> ? T : Items extends Record<string, Array<infer T>> ? T : never;

/**
 * Describes where an item is.
 */
export interface SortablePlace {
  /**
   * Index of the item in its list.
   */
  readonly index: number;

  /**
   * Id of the list, or undefined for the one list of an array.
   */
  readonly list?: string | undefined;
}

/**
 * Describes a move a person made: the item and the places before and after it.
 */
export interface SortableMove {
  /**
   * Place the item left.
   */
  readonly from: SortablePlace;

  /**
   * Id of the item.
   */
  readonly id: string;

  /**
   * Place the item took.
   */
  readonly to: SortablePlace;
}

/**
 * Describes why a list refuses an item: it is at its limit, or the caller's rule refuses the move.
 */
export type SortableRefusal = "full" | "refused";

/**
 * Describes the rules a move into another list follows.
 *
 * @typeParam T - One item.
 */
export interface SortableRules<T extends SortableItem> {
  /**
   * Returns whether the item may move from the list it was picked up from into another list.
   */
  readonly canMove?: ((item: T, from: string, to: string) => boolean) | undefined;

  /**
   * Returns the most items a list takes, or undefined for a list without a limit.
   */
  readonly limitOf: (list: string) => number | undefined;
}

/**
 * Returns the items of one list: an array itself, or a record's list of that id, empty for none.
 *
 * @typeParam T - One item.
 */
export function listOf<T extends SortableItem>(items: SortableItems<T>, list?: string): T[] {
  if (Array.isArray(items)) return items;

  return list === undefined ? [] : (items[list] ?? []);
}

/**
 * Describes where an item of a record is: its list, its index and the item itself.
 *
 * @typeParam T - One item.
 */
interface Found<T> {
  /**
   * Index of the item in its list.
   */
  readonly index: number;

  /**
   * The item.
   */
  readonly item: T;

  /**
   * Id of the list.
   */
  readonly list: string;
}

/**
 * Returns where an item of a record's lists is, or undefined for an item no list contains.
 *
 * @typeParam T - One item.
 */
function foundIn<T extends SortableItem>(
  items: Record<string, T[]>,
  id: string,
): Found<T> | undefined {
  for (const [list, entries] of Object.entries(items)) {
    const index = entries.findIndex((entry) => entry.id === id);
    const item = entries[index];

    if (item !== undefined) return { index, item, list };
  }

  return undefined;
}

/**
 * Returns where an item is, or undefined for an item no list contains.
 *
 * @typeParam T - One item.
 */
export function placeOf<T extends SortableItem>(
  items: SortableItems<T>,
  id: string,
): SortablePlace | undefined {
  if (!Array.isArray(items)) {
    const found = foundIn(items, id);

    return found === undefined ? undefined : { index: found.index, list: found.list };
  }

  const index = items.findIndex((item) => item.id === id);

  return index === -1 ? undefined : { index };
}

/**
 * Returns the item of an id, or undefined for an item no list contains.
 *
 * @typeParam T - One item.
 */
export function itemOf<T extends SortableItem>(items: SortableItems<T>, id: string): T | undefined {
  return Array.isArray(items) ? items.find((item) => item.id === id) : foundIn(items, id)?.item;
}

/**
 * Describes a move applied to the items: the items after it, and the places the item left and
 * took.
 *
 * @typeParam Items - The kit's items.
 */
export interface Relocated<Items extends SortableItems> {
  /**
   * Place the item left.
   */
  readonly from: SortablePlace;

  /**
   * Items after the move.
   */
  readonly items: Items;

  /**
   * Place the item took.
   */
  readonly to: SortablePlace;
}

/**
 * Returns the index an item takes in a list of a length, clamped to the list's ends.
 */
function clamped(index: number, length: number): number {
  return Math.min(Math.max(index, 0), length);
}

/**
 * Returns the move of an item in an array, or undefined when the array lacks it.
 */
function inArray(
  items: SortableItem[],
  id: string,
  to: SortablePlace,
): Relocated<SortableItems> | undefined {
  const index = items.findIndex((entry) => entry.id === id);
  const item = items[index];

  if (item === undefined) return undefined;

  const rest = items.toSpliced(index, 1);
  const at = clamped(to.index, rest.length);

  return { from: { index }, items: rest.toSpliced(at, 0, item), to: { index: at } };
}

/**
 * Returns the move of an item among a record's lists, or undefined when no list contains it.
 */
function inRecord(
  items: Record<string, SortableItem[]>,
  id: string,
  to: SortablePlace,
): Relocated<SortableItems> | undefined {
  const found = foundIn(items, id);

  if (found === undefined) return undefined;

  const list = to.list ?? found.list;
  const lists = { ...items, [found.list]: listOf(items, found.list).toSpliced(found.index, 1) };
  const rest = lists[list] ?? [];
  const at = clamped(to.index, rest.length);

  return {
    from: { index: found.index, list: found.list },
    items: { ...lists, [list]: rest.toSpliced(at, 0, found.item) },
    to: { index: at, list },
  };
}

/**
 * Returns the move of an item to a place, or undefined when no list contains the item.
 *
 * @remarks
 *   An index past a list's end puts the item last. A place without a list keeps the item in its
 *   own list, and a list id the record lacks adds that list. The items after the move keep the
 *   shape of the items they were made from.
 * @typeParam Items - The kit's items.
 */
export function relocated<Items extends SortableItems>(
  items: Items,
  id: string,
  to: SortablePlace,
): Relocated<Items> | undefined {
  const all: SortableItems = items;
  const move = Array.isArray(all) ? inArray(all, id, to) : inRecord(all, id, to);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The items after the move keep the shape and the items of the items they were made from.
  return move as Relocated<Items> | undefined;
}

/**
 * Describes a move from one list into another.
 */
export interface Crossing {
  /**
   * Id of the list the item was picked up from, or undefined for the one list of an array.
   */
  readonly from?: string | undefined;

  /**
   * Id of the list the item is over.
   */
  readonly to: string;
}

/**
 * Returns why a list refuses an item moved into it from the list it was picked up from, or
 * undefined while the list takes it.
 *
 * @typeParam T - One item.
 * @param items - The kit's items.
 * @param id - Id of the item.
 * @param crossing - The list the item was picked up from and the list it is over.
 * @param rules - The caller's rule and each list's limit.
 */
export function refusalOf<T extends SortableItem>(
  items: SortableItems<T>,
  id: string,
  { from, to }: Crossing,
  rules: SortableRules<T>,
): SortableRefusal | undefined {
  if (from === undefined || from === to) return undefined;

  const limit = rules.limitOf(to);
  const count = listOf(items, to).filter((entry) => entry.id !== id).length;

  if (limit !== undefined && count >= limit) return "full";

  const item = itemOf(items, id);

  return item === undefined || rules.canMove === undefined || rules.canMove(item, from, to)
    ? undefined
    : "refused";
}
