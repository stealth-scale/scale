import { type Edge, type Node, Position } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { layoutGraph } from "#layout/rank.ts";

const NODES: Node[] = ["orders", "daily", "monthly"].map((id) => ({
  data: {},
  id,
  position: { x: 0, y: 0 },
}));

const EDGES: Edge[] = [
  { id: "orders-daily", source: "orders", target: "daily" },
  { id: "orders-monthly", source: "orders", target: "monthly" },
];

function placedOf(nodes: readonly Node[], id: string): Node | undefined {
  return nodes.find((node) => node.id === id);
}

function gap(nodes: readonly Node[], from: string, to: string, axis: "x" | "y"): number {
  return (placedOf(nodes, to)?.position[axis] ?? 0) - (placedOf(nodes, from)?.position[axis] ?? 0);
}

describe("layoutGraph", () => {
  it("places a target one rank of 128px below its source when the edges run down", () => {
    expect(gap(layoutGraph(NODES, EDGES), "orders", "daily", "y")).toBe(44 + 128);
  });

  it("places a target one rank of 128px right of its source when the edges run right", () => {
    expect(gap(layoutGraph(NODES, EDGES, { direction: "right" }), "orders", "daily", "x")).toBe(
      256 + 128,
    );
  });

  it("puts the nodes of one rank 48px apart", () => {
    expect(Math.abs(gap(layoutGraph(NODES, EDGES), "daily", "monthly", "x"))).toBe(256 + 48);
  });

  it("takes the stated space between ranks", () => {
    expect(gap(layoutGraph(NODES, EDGES, { ranksep: 60 }), "orders", "daily", "y")).toBe(44 + 60);
  });

  it("takes the stated space between the nodes of a rank", () => {
    expect(Math.abs(gap(layoutGraph(NODES, EDGES, { nodesep: 20 }), "daily", "monthly", "x"))).toBe(
      256 + 20,
    );
  });

  it("leaves a node's size to React Flow's measurement", () => {
    const placed = layoutGraph(NODES, EDGES)[0];

    expect([placed?.width, placed?.height]).toStrictEqual([undefined, undefined]);
  });

  it("gives each node the size it was placed by as its initial size", () => {
    expect(layoutGraph(NODES, EDGES)[0]).toMatchObject({ initialHeight: 44, initialWidth: 256 });
  });

  it("places a node by its initial size without a stated size", () => {
    const sized = NODES.map((node) =>
      node.id === "orders" ? { ...node, initialHeight: 60, initialWidth: 220 } : node,
    );
    const placed = layoutGraph(sized, EDGES);

    expect([
      placedOf(placed, "orders")?.position.x,
      placedOf(placed, "daily")?.position.y,
    ]).toStrictEqual([280 - 110, 60 + 128]);
  });

  it("keeps a node's stated size", () => {
    const sized = NODES.map((node) =>
      node.id === "orders" ? { ...node, height: 90, width: 200 } : node,
    );

    expect(placedOf(layoutGraph(sized, EDGES), "orders")).toMatchObject({ height: 90, width: 200 });
  });

  it("leaves a node by its bottom while the edges run down", () => {
    expect(layoutGraph(NODES, EDGES)[0]?.sourcePosition).toBe(Position.Bottom);
  });

  it("enters a node by its top while the edges run down", () => {
    expect(layoutGraph(NODES, EDGES)[0]?.targetPosition).toBe(Position.Top);
  });

  it("leaves a node by its right side while the edges run right", () => {
    expect(layoutGraph(NODES, EDGES, { direction: "right" })[0]?.sourcePosition).toBe(
      Position.Right,
    );
  });

  it("enters a node by its left side while the edges run right", () => {
    expect(layoutGraph(NODES, EDGES, { direction: "right" })[0]?.targetPosition).toBe(
      Position.Left,
    );
  });

  it("places a node by its measured size before its stated size", () => {
    const sized = NODES.map((node) =>
      node.id === "orders"
        ? { ...node, height: 90, measured: { height: 120, width: 300 }, width: 200 }
        : node,
    );
    const placed = layoutGraph(sized, EDGES);

    expect([
      placedOf(placed, "orders")?.position.x,
      placedOf(placed, "daily")?.position.y,
    ]).toStrictEqual([280 - 150, 120 + 128]);
  });

  it("places a node by its stated size without a measurement", () => {
    const sized = NODES.map((node) =>
      node.id === "orders" ? { ...node, height: 90, width: 200 } : node,
    );
    const placed = layoutGraph(sized, EDGES);

    expect([
      placedOf(placed, "orders")?.position.x,
      placedOf(placed, "daily")?.position.y,
    ]).toStrictEqual([280 - 100, 90 + 128]);
  });

  it("places a node by its top-left corner", () => {
    expect(placedOf(layoutGraph(NODES, EDGES), "orders")?.position).toStrictEqual({
      x: 152,
      y: 0,
    });
  });

  it("places the targets of one node in the order of their edges", () => {
    const placed = layoutGraph(NODES, [
      { id: "orders-monthly", source: "orders", target: "monthly" },
      { id: "orders-daily", source: "orders", target: "daily" },
    ]);

    expect(gap(placed, "monthly", "daily", "x")).toBeGreaterThan(0);
  });

  it("places the sources of one node in the order of their edges", () => {
    const placed = layoutGraph(NODES, [
      { id: "monthly-orders", source: "monthly", target: "orders" },
      { id: "daily-orders", source: "daily", target: "orders" },
    ]);

    expect(gap(placed, "monthly", "daily", "x")).toBeGreaterThan(0);
  });

  it("places the graph as if an edge to a node outside it were absent", () => {
    const placed = layoutGraph(NODES, [
      ...EDGES,
      { id: "orders-archive", source: "orders", target: "archive" },
    ]);

    expect(placed.map((node) => node.position)).toStrictEqual(
      layoutGraph(NODES, EDGES).map((node) => node.position),
    );
  });

  it("returns the nodes in the order it was given them", () => {
    expect(layoutGraph(NODES, EDGES).map((node) => node.id)).toStrictEqual([
      "orders",
      "daily",
      "monthly",
    ]);
  });

  it("keeps each node's own fields", () => {
    const named: Node[] = ["orders", "daily", "monthly"].map((id) => ({
      data: { label: id },
      id,
      position: { x: 0, y: 0 },
    }));

    expect(placedOf(layoutGraph(named, EDGES), "daily")?.data).toStrictEqual({ label: "daily" });
  });
});
