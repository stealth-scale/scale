/**
 * Sizes a network's discs by each node's weight against the heaviest node's.
 *
 * @remarks
 *   A disc is 36px across for no weight and 68px for the heaviest node. Its area grows with the
 *   weight, so its diameter grows with the weight's square root. A node without a weight weighs the
 *   number of its links, and a weight under zero counts as zero. While no node weighs anything,
 *   every disc is 36px across.
 */

import { type NetworkLink, type NetworkNode } from "#network-graph/types.ts";

/**
 * Smallest and largest diameter of a disc, in pixels.
 */
export const DIAMETER = { max: 68, min: 36 };

/**
 * Describes a node with the diameter of its disc.
 */
export interface Sized {
  /**
   * Diameter of the node's disc, in pixels.
   */
  readonly disc: number;

  /**
   * The node as the caller passed it.
   */
  readonly node: NetworkNode;
}

/**
 * Returns each node, in order, with the diameter of its disc.
 *
 * @param nodes - The graph's nodes.
 * @param links - The links the canvas renders, which a node without a weight is weighed by.
 */
export function discsOf(nodes: readonly NetworkNode[], links: readonly NetworkLink[]): Sized[] {
  const degree = new Map<string, number>();

  for (const { source, target } of links) {
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);
  }

  const weighed = nodes.map((node) => ({
    node,
    weight: Math.max(node.weight ?? degree.get(node.id) ?? 0, 0),
  }));
  const heaviest = Math.max(0, ...weighed.map(({ weight }) => weight));
  const span = DIAMETER.max - DIAMETER.min;

  return weighed.map(({ node, weight }) => ({
    disc: DIAMETER.min + span * (heaviest === 0 ? 0 : Math.sqrt(weight / heaviest)),
    node,
  }));
}
