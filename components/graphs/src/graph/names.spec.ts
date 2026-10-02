import { type Edge, type Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { diffedOf } from "#graph/diffed.ts";
import { namedEdges, namedGraph, namedNodes } from "#graph/names.ts";

const ORDERS: Node = { data: { label: "Orders" }, id: "orders", position: { x: 0, y: 0 } };

const CLEAN: Node = { data: { label: "Clean orders" }, id: "clean", position: { x: 0, y: 120 } };

const LINK: Edge = { id: "orders-clean", source: "orders", target: "clean" };

function arrow({ source, target }: { source: string; target: string }): string {
  return `${source} → ${target}`;
}

function changed(id: string): string | undefined {
  return id === "clean" ? "Changed" : undefined;
}

function added(): string {
  return "Added";
}

const DIFFED = diffedOf(
  {
    edges: [{ change: "removed", fields: [], id: "orders-clean", label: "Orders to Clean orders" }],
    nodes: [
      { change: "unchanged", fields: [], id: "orders", label: "Orders" },
      { change: "changed", fields: ["rows"], id: "clean", label: "Clean orders" },
    ],
  },
  {},
);

describe("names", () => {
  it("names a node by its data's label", () => {
    expect(namedNodes([ORDERS])[0]?.ariaLabel).toBe("Orders");
  });

  it("keeps a node's own name", () => {
    const node = { ...ORDERS, ariaLabel: "Order table" };

    expect(namedNodes([node])[0]).toBe(node);
  });

  it("leaves a node without a string label unnamed", () => {
    const node = { ...ORDERS, data: { label: 4 } };

    expect(namedNodes([node])[0]).toBe(node);
  });

  it("returns the same copy of a node on every call", () => {
    expect(namedNodes([ORDERS])[0]).toBe(namedNodes([ORDERS])[0]);
  });

  it("makes a new copy of a node whose label changed", () => {
    const node: Node = { data: { label: "Orders" }, id: "orders", position: { x: 0, y: 0 } };
    const first = namedNodes([node])[0];

    node.data["label"] = "Order lines";

    expect([namedNodes([node])[0] === first, namedNodes([node])[0]?.ariaLabel]).toStrictEqual([
      false,
      "Order lines",
    ]);
  });

  it("names an edge by the names of its ends", () => {
    expect(namedEdges([LINK], [ORDERS, CLEAN], arrow)[0]?.ariaLabel).toBe("Orders → Clean orders");
  });

  it("names an end without a name by its id", () => {
    expect(namedEdges([LINK], [CLEAN], arrow)[0]?.ariaLabel).toBe("orders → Clean orders");
  });

  it("keeps an edge's own name", () => {
    const edge = { ...LINK, ariaLabel: "Feeds" };

    expect(namedEdges([edge], [ORDERS, CLEAN], arrow)[0]).toBe(edge);
  });

  it("returns the same copy of an edge while its ends' names are unchanged", () => {
    expect(namedEdges([LINK], [ORDERS, CLEAN], arrow)[0]).toBe(
      namedEdges([LINK], [ORDERS, CLEAN], arrow)[0],
    );
  });

  it("makes a new copy of an edge whose end was renamed", () => {
    const renamed = { ...CLEAN, data: { label: "Cleaned orders" } };

    expect(namedEdges([LINK], [ORDERS, renamed], arrow)[0]?.ariaLabel).toBe(
      "Orders → Cleaned orders",
    );
  });

  it("names the nodes and the edges of a graph", () => {
    const graph = namedGraph({ edges: [LINK], nodes: [ORDERS, CLEAN] }, arrow);

    expect([graph.nodes?.[0]?.ariaLabel, graph.edges?.[0]?.ariaLabel]).toStrictEqual([
      "Orders",
      "Orders → Clean orders",
    ]);
  });

  it("leaves out what the graph leaves out", () => {
    expect(namedGraph({}, arrow)).toStrictEqual({});
  });

  it("names the edges of a graph without nodes by their ends' ids", () => {
    expect(namedGraph({ edges: [LINK] }, arrow).edges?.[0]?.ariaLabel).toBe("orders → clean");
  });

  it("ends a node's name with its change's word", () => {
    expect(namedNodes([CLEAN], changed)[0]?.ariaLabel).toBe("Clean orders, Changed");
  });

  it("ends a node's own name with its change's word", () => {
    const node = { ...CLEAN, ariaLabel: "Order cleaning" };

    expect(namedNodes([node], changed)[0]?.ariaLabel).toBe("Order cleaning, Changed");
  });

  it("names a node without a name by its id and its change's word", () => {
    const node = { ...CLEAN, data: {} };

    expect(namedNodes([node], changed)[0]?.ariaLabel).toBe("clean, Changed");
  });

  it("names a node without a change by its label alone", () => {
    expect(namedNodes([ORDERS], changed)[0]?.ariaLabel).toBe("Orders");
  });

  it("ends an edge's name with its change's word", () => {
    expect(namedEdges([LINK], [ORDERS, CLEAN], arrow, added)[0]?.ariaLabel).toBe(
      "Orders → Clean orders, Added",
    );
  });

  it("ends an edge's own name with its change's word", () => {
    const edge = { ...LINK, ariaLabel: "Cleaning" };

    expect(namedEdges([edge], [], arrow, added)[0]?.ariaLabel).toBe("Cleaning, Added");
  });

  it("names the nodes of a graph whose canvas marks changes", () => {
    const graph = namedGraph({ nodes: [ORDERS, CLEAN] }, arrow, DIFFED);

    expect(graph.nodes?.map((node) => node.ariaLabel)).toStrictEqual([
      "Orders",
      "Clean orders, Changed",
    ]);
  });

  it("marks the edges of a graph whose canvas marks changes", () => {
    const graph = namedGraph({ edges: [LINK], nodes: [ORDERS, CLEAN] }, arrow, DIFFED);

    expect(graph.edges?.[0]?.domAttributes).toStrictEqual({ "data-change": "removed" });
  });

  it("names the edges of a graph whose canvas marks changes", () => {
    const graph = namedGraph({ edges: [LINK], nodes: [ORDERS, CLEAN] }, arrow, DIFFED);

    expect(graph.edges?.[0]?.ariaLabel).toBe("Orders → Clean orders, Removed");
  });
});
