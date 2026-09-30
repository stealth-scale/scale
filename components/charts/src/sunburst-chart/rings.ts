/**
 * Resolves a hierarchy into the rings of a sunburst: a ring per level from the middle out, each
 * listing its nodes in their parents' order, with a gap where a leaf ends above the ring.
 *
 * @remarks
 *   Each ring is a pie of its own over the same full turn, so a part's arc is inside its parent's
 *   arc only while every ring sums to the same total: a leaf that ends above the outer
 *   rings leaves a gap of its size in each ring beyond it. A top-level node takes its family's
 *   color. A part mixes the family's color by its size among its siblings, and each generation
 *   keeps 82% of the one inside it, so a part never takes its parent's exact color. The walk visits
 *   a node before its parts.
 */

import { GAP } from "#chart/recipe.ts";
import { type NodeFacts } from "#hierarchy/facts.ts";
import { type Family, mixOf, shareOf } from "#hierarchy/family.ts";
import { depthOf, type HierarchyNode, largestFirst, sizeOf } from "#hierarchy/hierarchy.ts";

/**
 * Share of a generation's color a generation beyond it keeps.
 */
const FADE = 0.82;

/**
 * Describes one arc recharts' pie renders in a ring: a node or a gap.
 *
 * @remarks
 *   Recharts spreads each row into its sector's props, so a gap's `className` is set on its path.
 */
export interface Arc {
  /**
   * Class of a gap, which the recipe hides from the pointer.
   */
  readonly className?: string;

  /**
   * CSS value of the arc's fill, transparent for a gap.
   */
  readonly fill: string;

  /**
   * Key of the node, which recharts reports to the tooltip as the entry's name, empty for a gap.
   */
  readonly name: string;

  /**
   * CSS value of the arc's opacity: its family's.
   */
  readonly opacity: string;

  /**
   * Size of the node or the gap, which the arc's angle follows.
   */
  readonly value: number;

  /**
   * Place of the arc in the keyboard walk, none for a gap.
   */
  readonly walk?: number;
}

/**
 * Describes a hierarchy resolved into rings.
 */
export interface Rings {
  /**
   * Name and size of each node that has an arc, by key, in the walk's order.
   */
  readonly facts: ReadonlyMap<string, NodeFacts>;

  /**
   * Arcs of each ring, the innermost ring first.
   */
  readonly rings: Arc[][];

  /**
   * Sum of the top-level nodes' sizes, which every ring sums to.
   */
  readonly total: number;
}

/**
 * Returns the arc of a gap of a size.
 */
function gapOf(value: number): Arc {
  return { className: GAP, fill: "transparent", name: "", opacity: "1", value };
}

/**
 * Resolves the top-level nodes into rings.
 *
 * @param nodes - The top-level nodes the legend shows.
 * @param familyOf - Returns how a top-level node's family is painted.
 */
export function ringsOf(nodes: readonly HierarchyNode[], familyOf: (key: string) => Family): Rings {
  const top = largestFirst(nodes);
  const depth = depthOf(top);
  const rings = Array.from({ length: depth }, (): Arc[] => []);
  const facts = new Map<string, NodeFacts>();

  /**
   * Adds a node's arc to its ring in its fill, a gap to every ring beyond a leaf, and the arcs of
   * the node's parts.
   */
  const place = (node: HierarchyNode, level: number, family: Family, fill: string): void => {
    const value = sizeOf(node);

    rings[level]?.push({ fill, name: node.key, opacity: family.opacity, value, walk: facts.size });
    facts.set(node.key, { label: node.label ?? node.key, size: value });

    if (node.children === undefined) {
      for (const ring of rings.slice(level + 1)) ring.push(gapOf(value));

      return;
    }

    const children = largestFirst(node.children);

    for (const [at, child] of children.entries()) {
      const share = shareOf(at, children.length) * FADE ** (level + 1);

      place(child, level + 1, family, mixOf(family.color, share));
    }
  };

  for (const node of top) {
    const family = familyOf(node.key);

    place(node, 0, family, mixOf(family.color, 100));
  }

  return { facts, rings, total: top.reduce((sum, node) => sum + sizeOf(node), 0) };
}
