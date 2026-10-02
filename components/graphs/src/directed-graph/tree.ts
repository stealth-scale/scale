/**
 * Turns a flat list whose items name their parent into the edges of a tree.
 *
 * @remarks
 *   An HR system, a file index or a category table stores a hierarchy as a parent field on each
 *   item, so a caller does not rebuild it into nested children. An item whose parent is not in the
 *   list becomes a root, so a list filtered to one department still renders. Each edge's id is the
 *   parent's id and the child's id, joined by a hyphen.
 */

/**
 * Describes an edge of a tree: its id and the ids of its parent and its child.
 */
export interface TreeEdge {
  /**
   * The parent's id and the child's id, joined by a hyphen.
   */
  readonly id: string;

  /**
   * Id of the parent.
   */
  readonly source: string;

  /**
   * Id of the child.
   */
  readonly target: string;
}

/**
 * Describes an item of a flat list by its identity, which its children name as their parent.
 */
interface TreeItem {
  /**
   * Identity of the item.
   */
  readonly id: string;
}

/**
 * Returns an edge from each item's parent to the item, for every item whose parent is in the list.
 *
 * @typeParam T - One item of the list.
 * @param items - The items, in any order.
 * @param parentOf - Returns an item's parent's id, or undefined for an item without one.
 */
export function treeEdges<T extends TreeItem>(
  items: readonly T[],
  parentOf: (item: T) => string | undefined,
): TreeEdge[] {
  const ids = new Set(items.map((item) => item.id));

  return items.flatMap((item) => {
    const parent = parentOf(item);

    return parent !== undefined && ids.has(parent)
      ? [{ id: `${parent}-${item.id}`, source: parent, target: item.id }]
      : [];
  });
}
