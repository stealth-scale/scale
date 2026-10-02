import { act, render } from "@testing-library/react";

import { elapsed, laidOut } from "#graph/graph.fixtures.tsx";
import { NetworkGraph } from "#network-graph/network-graph.tsx";
import {
  type NetworkGraphProps,
  type NetworkLink,
  type NetworkNode,
} from "#network-graph/types.ts";

/**
 * Lists a payments platform's services: a gateway, two core services, a worker, two stores, and a
 * fax gateway nothing calls.
 */
export const NODES: NetworkNode[] = [
  { id: "gateway", label: "Gateway", weight: 9 },
  { id: "auth", label: "Auth", weight: 7 },
  { id: "checkout", label: "Checkout", weight: 8 },
  { id: "ledger", label: "Ledger", weight: 6 },
  { id: "postgres", label: "Postgres", weight: 8 },
  { id: "kafka", label: "Kafka", weight: 7 },
  { id: "fax", label: "Fax", weight: 1 },
];

/**
 * Lists the calls between the fixture's services.
 */
export const LINKS: NetworkLink[] = [
  { source: "gateway", strength: 2, target: "auth" },
  { source: "gateway", strength: 2, target: "checkout" },
  { source: "auth", target: "postgres" },
  { source: "checkout", strength: 2, target: "postgres" },
  { source: "checkout", strength: 2, target: "kafka" },
  { source: "ledger", strength: 2, target: "kafka" },
  { source: "ledger", target: "postgres" },
];

/**
 * Renders a network graph over the fixture's nodes and links with the props a case changes, then
 * waits inside one `act` scope for React Flow to measure the nodes and fit the view.
 */
export function linked(props: Partial<NetworkGraphProps> = {}): Promise<ReturnType<typeof render>> {
  laidOut();

  return act(async () => {
    const rendered = render(
      <NetworkGraph label="Service topology" links={LINKS} nodes={NODES} {...props} />,
    );

    await elapsed();

    return rendered;
  });
}
