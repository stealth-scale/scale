import { describe, expect, it } from "vitest";

import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";
import { graphOf, nameOf } from "#sankey-chart/graph.ts";

/**
 * Lists two channels, a sign-up, a node for the visitors who left, a node no flow touches, and a
 * second node keyed like the sign-up.
 */
const NODES: readonly SankeyNode[] = [
  { key: "organic", label: "Organic search" },
  { color: "teal", key: "paid", label: "Paid search" },
  { key: "signup", label: "Signed up" },
  { key: "left" },
  { key: "unused", label: "Unused" },
  { key: "signup", label: "Second sign-up" },
];

/**
 * Lists the visitors' flows out of order, with a second organic sign-up flow, a loop back, a flow
 * to an unknown node and a flow of zero: 110 organic and 50 paid visitors.
 */
const FLOWS: readonly SankeyFlow[] = [
  { from: "paid", to: "signup", value: 20 },
  { from: "organic", to: "signup", value: 30 },
  { from: "organic", to: "left", value: 70 },
  { from: "paid", to: "left", value: 30 },
  { from: "organic", to: "signup", value: 10 },
  { from: "signup", to: "organic", value: 5 },
  { from: "paid", to: "ghost", value: 3 },
  { from: "paid", to: "left", value: 0 },
];

describe("graph", () => {
  it("names a flow by its nodes' keys joined by a dash", () => {
    expect(nameOf("paid", "left")).toBe("paid - left");
  });

  it("passes recharts the flows between known nodes with a value above zero", () => {
    expect(graphOf(NODES, FLOWS).data.links).toHaveLength(4);
  });

  it("adds up the flows between the same two nodes", () => {
    expect(graphOf(NODES, FLOWS).data.links[0]?.value).toBe(40);
  });

  it("leaves out a flow that closes a loop", () => {
    expect(graphOf(NODES, FLOWS).facts.has("signup - organic")).toBe(false);
  });

  it("names each node for recharts by its key without the nodes no flow touches", () => {
    expect(graphOf(NODES, FLOWS).data.nodes).toStrictEqual([
      { name: "organic" },
      { name: "paid" },
      { name: "signup" },
      { name: "left" },
    ]);
  });

  it("keeps the first of two nodes with one key", () => {
    expect(graphOf(NODES, FLOWS).nodes[2]?.title).toBe("Signed up");
  });

  it("orders the flows by their source in the nodes' order", () => {
    expect(graphOf(NODES, FLOWS).data.links).toStrictEqual([
      { source: 0, target: 2, value: 40 },
      { source: 0, target: 3, value: 70 },
      { source: 1, target: 2, value: 20 },
      { source: 1, target: 3, value: 30 },
    ]);
  });

  it("numbers each node in the walk before the flows it sends", () => {
    const graph = graphOf(NODES, FLOWS);

    expect([
      graph.nodes.map((node) => node.walk),
      graph.flows.map((flow) => flow.walk),
    ]).toStrictEqual([
      [0, 3, 6, 7],
      [1, 2, 4, 5],
    ]);
  });

  it("marks a node that sends no flow as a sink", () => {
    expect(graphOf(NODES, FLOWS).nodes.map((node) => node.sink)).toStrictEqual([
      false,
      false,
      true,
      true,
    ]);
  });

  it("sizes a node by the larger of its inflow and outflow", () => {
    expect(graphOf(NODES, FLOWS).nodes.map((node) => node.value)).toStrictEqual([110, 50, 60, 100]);
  });

  it("titles a node with its key without a label", () => {
    expect(graphOf(NODES, FLOWS).nodes[3]?.title).toBe("left");
  });

  it("keeps a node's stated palette", () => {
    expect(graphOf(NODES, FLOWS).nodes.map((node) => node.color)).toStrictEqual([
      undefined,
      "teal",
      undefined,
      undefined,
    ]);
  });

  it("keys a node's fact by its key with its inflow and outflow", () => {
    expect(graphOf(NODES, FLOWS).facts.get("signup")).toStrictEqual({
      inflow: 60,
      kind: "node",
      outflow: 0,
      title: "Signed up",
    });
  });

  it("keys a flow's fact by its name with its value and its share of its source", () => {
    expect(graphOf(NODES, FLOWS).facts.get("paid - left")).toStrictEqual({
      kind: "flow",
      share: 0.6,
      title: "Paid search → left",
      value: 30,
    });
  });

  it("heads a flow's fact with its two nodes' labels", () => {
    expect(graphOf(NODES, FLOWS).facts.get("organic - signup")?.title).toBe(
      "Organic search → Signed up",
    );
  });

  it("returns an empty graph without a flow to render", () => {
    expect(graphOf(NODES, [])).toStrictEqual({
      data: { links: [], nodes: [] },
      facts: new Map(),
      flows: [],
      nodes: [],
    });
  });
});
