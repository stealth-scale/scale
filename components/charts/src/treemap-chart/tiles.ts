/**
 * Resolves a hierarchy into the rows recharts' treemap lays out: each level largest first, each
 * tile's fill and opacity, and its place in the keyboard walk.
 *
 * @remarks
 *   Every tile under a top-level node mixes the node's color over the panel by its size among its
 *   siblings. Only the leaves are painted: a parent's tile is transparent under its children, so
 *   the panel shows in the gaps between them. Every tile of a family takes the family's opacity,
 *   which the legend fades. A node of size 0 has no tile. The walk visits a parent before its
 *   children.
 */

import { type NodeFacts } from "#hierarchy/facts.ts";
import { type Family, mixOf, shareOf } from "#hierarchy/family.ts";
import { type HierarchyNode, largestFirst, sizeOf } from "#hierarchy/hierarchy.ts";

/**
 * Describes one row recharts lays out as a tile.
 *
 * @remarks
 *   Recharts spreads each row into its tile's props and computes `name`, `value`, `depth`, `index`
 *   and the geometry itself, so a row has no field of those names but `name`.
 */
export interface Tile {
  /**
   * Tiles the node is made of.
   */
  readonly children?: Tile[];

  /**
   * CSS value of the tile's fill, transparent for a parent.
   */
  readonly fill: string;

  /**
   * Key of the node, which recharts reports to the tooltip as the entry's name.
   */
  readonly name: string;

  /**
   * CSS value of the tile's opacity: its family's.
   */
  readonly opacity: string;

  /**
   * Any other field, because recharts types a row as a record of fields.
   */
  readonly [field: string]: unknown;

  /**
   * Size of the node, which recharts lays the tile out by and reports to the tooltip.
   */
  readonly size: number;

  /**
   * Words written on the tile: the node's label where it is text, else its key.
   */
  readonly title: string;

  /**
   * Place of the tile in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Describes a hierarchy resolved into tiles.
 */
export interface Tiling {
  /**
   * Name and size of each node that has a tile, by key, in the walk's order.
   */
  readonly facts: ReadonlyMap<string, NodeFacts>;

  /**
   * Top-level tiles, largest first.
   */
  readonly tiles: Tile[];

  /**
   * Sum of the top-level tiles' sizes.
   */
  readonly total: number;
}

/**
 * Returns the words written on a node's tile: its label where it is text, else its key.
 */
function titleOf(node: HierarchyNode): string {
  return typeof node.label === "string" ? node.label : node.key;
}

/**
 * Resolves the top-level nodes into tiles.
 *
 * @param nodes - The top-level nodes the legend shows.
 * @param familyOf - Returns how a top-level node's family is painted.
 */
export function tilesOf(
  nodes: readonly HierarchyNode[],
  familyOf: (key: string) => Family,
): Tiling {
  const facts = new Map<string, NodeFacts>();

  /**
   * Returns the tile of a node painted in its family and, for a leaf, in its fill, with the tiles
   * under it in the walk's order.
   */
  const tileOf = (node: HierarchyNode, family: Family, fill: string): Tile => {
    const walk = facts.size;
    const size = sizeOf(node);
    const row = { name: node.key, opacity: family.opacity, size, title: titleOf(node), walk };

    facts.set(node.key, { label: node.label ?? node.key, size });

    if (node.children === undefined) return { ...row, fill };

    const children = largestFirst(node.children);

    return {
      ...row,
      children: children.map((child, at) =>
        tileOf(child, family, mixOf(family.color, shareOf(at, children.length))),
      ),
      fill: "transparent",
    };
  };

  const top = largestFirst(nodes);
  const tiles = top.map((node) => {
    const family = familyOf(node.key);

    return tileOf(node, family, mixOf(family.color, 100));
  });

  return { facts, tiles, total: top.reduce((sum, node) => sum + sizeOf(node), 0) };
}
