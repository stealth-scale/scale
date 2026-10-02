/**
 * Walks a graph's links from one node, forward or backward, within a number of hops.
 *
 * @remarks
 *   The walk stops at a node it visited before, so a cycle never hangs it. It never counts the node
 *   it starts from, so a cycle that leads back to the start does not make the start its own
 *   neighbour.
 */

/**
 * Describes a link between two nodes by their ids.
 */
export interface Link {
  /**
   * Id of the node the link leaves.
   */
  readonly source: string;

  /**
   * Id of the node the link enters.
   */
  readonly target: string;
}

/**
 * Returns the nodes a walk along the links visits from a node within a number of hops.
 *
 * @param links - The graph's links.
 * @param from - The node the walk starts from, which it never counts.
 * @param depth - How many hops the walk takes.
 * @param forward - Whether the walk follows a link from its source to its target, or back.
 */
export function walk(
  links: readonly Link[],
  from: string,
  depth: number,
  forward: boolean,
): Set<string> {
  const visited = new Set<string>();
  let frontier = new Set([from]);

  for (let hop = 0; hop < depth && frontier.size > 0; hop += 1) {
    const next = new Set<string>();

    for (const link of links) {
      const [start, end] = forward ? [link.source, link.target] : [link.target, link.source];

      if (frontier.has(start) && end !== from && !visited.has(end)) {
        visited.add(end);
        next.add(end);
      }
    }

    frontier = next;
  }

  return visited;
}
