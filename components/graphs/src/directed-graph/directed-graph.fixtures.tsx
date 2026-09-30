import { act, render } from "@testing-library/react";

import { DirectedGraph } from "#directed-graph/directed-graph.tsx";
import {
  type DirectedEdge,
  type DirectedGraphProps,
  type DirectedNode,
} from "#directed-graph/types.ts";
import { elapsed, laidOut } from "#graph/graph.fixtures.tsx";

/**
 * Lists a small warehouse: two sources joined into a model that feeds a report and a churn model,
 * and a separate log feeding its own report.
 */
export const NODES: DirectedNode[] = [
  { id: "orders", kind: "Table", label: "Orders" },
  { id: "customers", kind: "Table", label: "Customers" },
  { id: "clean", kind: "Model", label: "Clean orders" },
  { id: "joined", kind: "Model", label: "Joined orders" },
  { id: "revenue", kind: "Dashboard", label: "Revenue" },
  { id: "churn", kind: "Model", label: "Churn" },
  { id: "logs", kind: "Table", label: "Web logs" },
  { id: "traffic", kind: "Dashboard", label: "Traffic" },
];

/**
 * Lists the fixture's edges, from what a node reads to what it feeds.
 */
export const EDGES: DirectedEdge[] = [
  { source: "orders", target: "clean" },
  { source: "clean", target: "joined" },
  { source: "customers", target: "joined" },
  { source: "joined", target: "revenue" },
  { source: "joined", target: "churn" },
  { source: "logs", target: "traffic" },
];

/**
 * Renders a directed graph over the fixture's nodes and edges with the props a case changes, then
 * waits inside one `act` scope for React Flow to measure, place and fit the nodes.
 */
export function traced(
  props: Partial<DirectedGraphProps> = {},
): Promise<ReturnType<typeof render>> {
  laidOut();

  return act(async () => {
    const rendered = render(
      <DirectedGraph edges={EDGES} label="Revenue lineage" nodes={NODES} {...props} />,
    );

    await elapsed();

    return rendered;
  });
}
