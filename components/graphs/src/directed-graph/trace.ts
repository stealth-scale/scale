/**
 * Traces a directed graph from one node: the nodes that feed it and the nodes it feeds, within a
 * number of hops.
 *
 * @remarks
 *   A lineage question is "what feeds this" and "what breaks if this breaks". The focused node is
 *   in neither set, so a cycle that leads back to it does not make it its own ancestor. A node that
 *   is both upstream and downstream, which happens only in a cycle, counts as downstream, because
 *   what breaks is the more consequential of the two. The walks stop at a node they visited
 *   before, so a cycle never hangs them.
 */

import { type Link, walk } from "#graph/walk.ts";

/**
 * Describes the nodes a trace found in each direction.
 */
export interface Trace {
  /**
   * Ids of the nodes the focused node feeds.
   */
  readonly downstream: ReadonlySet<string>;

  /**
   * Ids of the nodes that feed the focused node.
   */
  readonly upstream: ReadonlySet<string>;
}

/**
 * Describes where a node is against the focused node.
 */
export type Relation = "downstream" | "focus" | "unrelated" | "upstream";

/**
 * Returns the nodes that feed a node and the nodes it feeds, within `depth` hops.
 *
 * @param links - Every edge of the graph, by the ids of its ends.
 * @param id - The node the trace starts from, which is in neither set.
 * @param depth - How many hops each way count. Every hop unless stated.
 */
export function traceGraph(
  links: readonly Link[],
  id: string,
  depth: number = Number.POSITIVE_INFINITY,
): Trace {
  return { downstream: walk(links, id, depth, true), upstream: walk(links, id, depth, false) };
}

/**
 * Returns where a node is against the focused node of a trace.
 */
export function relationOf(id: string, focus: string, trace: Trace): Relation {
  if (id === focus) return "focus";
  if (trace.downstream.has(id)) return "downstream";

  return trace.upstream.has(id) ? "upstream" : "unrelated";
}
