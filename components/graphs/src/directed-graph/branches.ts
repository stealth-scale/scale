/**
 * Works out which nodes of a directed graph collapsed nodes hide, and which nodes a node leads to.
 *
 * @remarks
 *   A root is a node no link enters. A collapsed node remains shown and hides the nodes that only
 *   routes through it lead to: a node is shown while a route from a root leads to it and passes no
 *   collapsed node. This is an org chart's rule for a tree, and it applies to a graph where a node
 *   has more than one parent. A cycle that no root leads to is shown whole, because a graph that
 *   renders nothing for bad data is worse than one that renders it. A link from a node outside the
 *   graph takes no part, so the node it enters can be a root. The walks stop at a node they visited
 *   before, so a cycle never hangs them.
 */

import { type Link } from "#graph/walk.ts";

/**
 * Returns the ids each node's links lead to, from the links that leave a known node, or from every
 * link without a set of known nodes.
 */
function childrenOf(links: readonly Link[], known?: ReadonlySet<string>): Map<string, string[]> {
  const children = new Map<string, string[]>();

  for (const { source, target } of links) {
    if (known === undefined || known.has(source)) {
      children.set(source, [...(children.get(source) ?? []), target]);
    }
  }

  return children;
}

/**
 * Returns the ids a walk visits from its starts, leaving the children of a node it stops at out of
 * the walk.
 */
function walkFrom(
  starts: readonly string[],
  children: ReadonlyMap<string, readonly string[]>,
  stops: ReadonlySet<string>,
): Set<string> {
  const visited = new Set(starts);
  const queue = [...visited];

  for (const id of queue) {
    for (const child of stops.has(id) ? [] : (children.get(id) ?? [])) {
      if (!visited.has(child)) {
        visited.add(child);
        queue.push(child);
      }
    }
  }

  return visited;
}

/**
 * Returns the ids of every node a node leads to, not counting the node itself.
 */
export function descendantsOf(links: readonly Link[], id: string): ReadonlySet<string> {
  const visited = walkFrom([id], childrenOf(links), new Set());

  visited.delete(id);

  return visited;
}

/**
 * Returns the ids of the nodes the collapsed nodes hide.
 *
 * @param ids - Every node of the graph.
 * @param links - The graph's links.
 * @param collapsed - The nodes whose branches are closed.
 */
export function hiddenBy(
  ids: readonly string[],
  links: readonly Link[],
  collapsed: ReadonlySet<string>,
): ReadonlySet<string> {
  const children = childrenOf(links, new Set(ids));
  const entered = new Set([...children.values()].flat());
  const roots = ids.filter((id) => !entered.has(id));
  const rooted = walkFrom(roots, children, new Set());
  const starts = [...roots, ...ids.filter((id) => !rooted.has(id))];
  const shown = walkFrom(starts, children, collapsed);

  return new Set(ids.filter((id) => !shown.has(id)));
}
