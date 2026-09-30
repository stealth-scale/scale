/**
 * Reads a network's links: the links the canvas renders with the nodes at their ends, and the
 * nodes one node connects to.
 *
 * @remarks
 *   A link whose end is not a node of the graph is ordinary in a filtered graph, and a link from a
 *   node to itself renders nothing, so neither is rendered, counted or weighed. A network's links
 *   read the same either way round, so the walk from a node follows each link both ways. The walk
 *   never counts the node it starts from, and stops at a node it visited before.
 */

import { walk } from "#graph/walk.ts";
import { type NetworkLink, type NetworkNode } from "#network-graph/types.ts";

/**
 * Describes a link the canvas renders, with the nodes at its ends.
 */
export interface Drawn {
  /**
   * Node at the link's source.
   */
  readonly from: NetworkNode;

  /**
   * The link as the caller passed it.
   */
  readonly link: NetworkLink;

  /**
   * Node at the link's target.
   */
  readonly to: NetworkNode;
}

/**
 * Returns the links between two different nodes of the graph, each with the nodes at its ends.
 */
export function drawnOf(nodes: readonly NetworkNode[], links: readonly NetworkLink[]): Drawn[] {
  const known = new Map(nodes.map((node) => [node.id, node]));

  return links.flatMap((link) => {
    const from = known.get(link.source);
    const to = known.get(link.target);

    return from === undefined || to === undefined || from === to ? [] : [{ from, link, to }];
  });
}

/**
 * Returns the nodes within `depth` hops of a node, following each link either way round.
 *
 * @param links - The graph's links.
 * @param id - The node the walk starts from, which is never among the nodes it returns.
 * @param depth - How many hops count. 1 unless stated.
 */
export function neighborsOf(links: readonly NetworkLink[], id: string, depth = 1): Set<string> {
  const both = links.flatMap(({ source, target }) => [
    { source, target },
    { source: target, target: source },
  ]);

  return walk(both, id, depth, true);
}
