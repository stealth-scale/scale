/**
 * Exposes the directed graph, its types and the functions it traces and hides nodes with to the
 * package barrel, which publishes them by name.
 */

export { descendantsOf, hiddenBy } from "#directed-graph/branches.ts";
export { DirectedGraph } from "#directed-graph/directed-graph.tsx";
export { type Relation, relationOf, type Trace, traceGraph } from "#directed-graph/trace.ts";
export { type TreeEdge, treeEdges } from "#directed-graph/tree.ts";
export {
  type Counts,
  type DirectedEdge,
  type DirectedGraphProps,
  type DirectedNode,
  type DirectedWords,
  type TraceMode,
} from "#directed-graph/types.ts";
export { type Link } from "#graph/walk.ts";
