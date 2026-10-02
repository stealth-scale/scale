/**
 * Places a node graph's nodes in ranks with dagre, so its edges run down the canvas or across it.
 *
 * @remarks
 *   Dagre centres a node on the point it returns, and React Flow places a node by its top-left
 *   corner, so each position is that point less half the node's size. A node's size is the size
 *   React Flow measured, else its stated `width` and `height`, else its `initialWidth` and
 *   `initialHeight`, else 256 by 44 pixels. A node comes back with that size as its initial size,
 *   which React Flow applies to the node's wrapper until it measures the card inside and which the
 *   overview map sizes the node by. After the measurement the wrapper, and the focus ring on it,
 *   fit the card. Ranks are 128px apart and the nodes of one
 *   rank 48px apart, which leaves room for the names of ports outside a node's box. An edge whose
 *   ends are not both nodes of the graph takes no part. Dagre knows no ports, and it places the
 *   targets of one node in the reverse of the order their edges are added, so the edges are added
 *   last first: the targets of a node, and the sources of a node, follow the order of their edges,
 *   and edges listed in their ports' order do not cross.
 */

import { type EdgeLabel, Graph, type GraphLabel, layout, type NodeLabel } from "@dagrejs/dagre";
import { type Edge, type Node, Position } from "@xyflow/react";

import { sizeOf } from "#layout/size.ts";

/**
 * Describes the way a graph's edges run: down the canvas, or across it to the right.
 */
export type GraphDirection = "down" | "right";

/**
 * Space between two ranks and between two nodes of one rank, in pixels.
 */
const SPACING = { nodesep: 48, ranksep: 128 };

/**
 * Describes how `layoutGraph` places the ranks.
 */
export interface RankOptions {
  /**
   * Way the edges run. Down unless stated.
   */
  readonly direction?: GraphDirection | undefined;

  /**
   * Space between two nodes of one rank, in pixels. 48 unless stated.
   */
  readonly nodesep?: number | undefined;

  /**
   * Space between two ranks, in pixels. 128 unless stated.
   */
  readonly ranksep?: number | undefined;
}

/**
 * Returns the nodes placed in ranks, each with the size it was placed by as its initial size and
 * the sides its edges leave and enter.
 *
 * @typeParam N - One node of the graph.
 * @param nodes - The graph's nodes, in any order.
 * @param edges - The links between the nodes, of which one to a node outside `nodes` takes no part.
 * @param options - The direction and the spacing.
 */
export function layoutGraph<N extends Node>(
  nodes: readonly N[],
  edges: readonly Edge[],
  options: RankOptions = {},
): N[] {
  const { direction = "down", nodesep = SPACING.nodesep, ranksep = SPACING.ranksep } = options;
  const graph = new Graph<GraphLabel, NodeLabel, EdgeLabel>();
  const down = direction === "down";

  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ nodesep, rankdir: down ? "TB" : "LR", ranksep });

  for (const node of nodes) graph.setNode(node.id, { ...sizeOf(node) });

  for (const edge of edges.toReversed()) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }

  layout(graph);

  return nodes.map((node) => {
    const { height, width } = sizeOf(node);
    const { x = 0, y = 0 } = graph.node(node.id);

    return {
      ...node,
      initialHeight: height,
      initialWidth: width,
      position: { x: x - width / 2, y: y - height / 2 },
      sourcePosition: down ? Position.Bottom : Position.Right,
      targetPosition: down ? Position.Top : Position.Left,
    };
  });
}
