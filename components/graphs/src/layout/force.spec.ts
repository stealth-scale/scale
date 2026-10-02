import { type Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { type ForceLink, layoutForce, strengthOf } from "#layout/force.ts";

const SIZE = { height: 80, width: 72 };

function nodesOf(ids: readonly string[], measured = SIZE): Node[] {
  return ids.map((id) => ({ data: { label: id }, id, measured, position: { x: 0, y: 0 } }));
}

const TRIO = nodesOf(["a", "b", "c"]);

const RING = nodesOf(Array.from({ length: 40 }, (_, at) => `n${String(at)}`));

const RING_LINKS: ForceLink[] = RING.flatMap((node, at) =>
  [1, 11].map((step) => ({ source: node.id, target: RING[(at + step) % RING.length]?.id ?? "" })),
);

function centreOf(nodes: readonly Node[], id: string): { x: number; y: number } {
  const node = nodes.find((placed) => placed.id === id);

  return { x: (node?.position.x ?? 0) + 36, y: (node?.position.y ?? 0) + 40 };
}

function distance(nodes: readonly Node[], from: string, to: string): number {
  const [a, b] = [centreOf(nodes, from), centreOf(nodes, to)];

  return Math.hypot(a.x - b.x, a.y - b.y);
}

function overlaps(nodes: readonly Node[]): number {
  return nodes
    .flatMap((node, at) => nodes.slice(at + 1).map((other) => [node, other] as const))
    .filter(
      ([a, b]) =>
        Math.abs(a.position.x - b.position.x) < SIZE.width &&
        Math.abs(a.position.y - b.position.y) < SIZE.height,
    ).length;
}

function positionsOf(nodes: readonly Node[]): unknown {
  return nodes.map((node) => node.position);
}

function aspectOf(nodes: readonly Node[]): number {
  const xs = nodes.map((node) => node.position.x);
  const ys = nodes.map((node) => node.position.y);

  return (Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys));
}

describe("layoutForce", () => {
  it("returns the same positions for the same seed", () => {
    expect(positionsOf(layoutForce(RING, RING_LINKS, { seed: 3 }))).toStrictEqual(
      positionsOf(layoutForce(RING, RING_LINKS, { seed: 3 })),
    );
  });

  it("returns other positions for another seed", () => {
    expect(positionsOf(layoutForce(RING, RING_LINKS, { seed: 3 }))).not.toStrictEqual(
      positionsOf(layoutForce(RING, RING_LINKS, { seed: 9 })),
    );
  });

  it("starts from seed 1 unless stated", () => {
    expect(positionsOf(layoutForce(TRIO, []))).toStrictEqual(
      positionsOf(layoutForce(TRIO, [], { seed: 1 })),
    );
  });

  it("lays twenty unlinked nodes out wider than tall", () => {
    const loose = nodesOf(Array.from({ length: 20 }, (_, at) => `loose${String(at)}`));

    expect(aspectOf(layoutForce(loose, []))).toBeGreaterThan(1.5);
  });

  it("keeps the boxes of forty linked nodes apart", () => {
    expect(overlaps(layoutForce(RING, RING_LINKS))).toBe(0);
  });

  it("runs 300 steps unless stated", () => {
    expect(positionsOf(layoutForce(TRIO, []))).toStrictEqual(
      positionsOf(layoutForce(TRIO, [], { iterations: 300 })),
    );
  });

  it("runs the number of steps stated", () => {
    expect(positionsOf(layoutForce(TRIO, [], { iterations: 1 }))).not.toStrictEqual(
      positionsOf(layoutForce(TRIO, [])),
    );
  });

  it("pulls linked nodes closer than unlinked ones", () => {
    const placed = layoutForce(TRIO, [{ source: "a", target: "b" }]);

    expect(distance(placed, "a", "b")).toBeLessThan(distance(placed, "a", "c"));
  });

  it("pulls the ends of a stronger link closer", () => {
    const placed = layoutForce(nodesOf(["hub", "near", "far"]), [
      { source: "hub", strength: 2, target: "near" },
      { source: "hub", target: "far" },
    ]);

    expect(distance(placed, "hub", "near")).toBeLessThan(distance(placed, "hub", "far"));
  });

  it("places the graph as if a link to a node outside it were absent", () => {
    const links = [{ source: "a", target: "b" }];

    expect(
      positionsOf(layoutForce(TRIO, [...links, { source: "a", target: "ghost" }])),
    ).toStrictEqual(positionsOf(layoutForce(TRIO, links)));
  });

  it("places the graph as if a link from a node to itself were absent", () => {
    const links = [{ source: "a", target: "b" }];

    expect(positionsOf(layoutForce(TRIO, [...links, { source: "c", target: "c" }]))).toStrictEqual(
      positionsOf(layoutForce(TRIO, links)),
    );
  });

  it("keeps larger nodes farther apart", () => {
    const large = nodesOf(["a", "b", "c"], { height: 200, width: 200 });
    const links = [{ source: "a", target: "b" }];

    expect(distance(layoutForce(large, links), "a", "b")).toBeGreaterThan(
      distance(layoutForce(TRIO, links), "a", "b"),
    );
  });

  it("gives each node the size it was placed by as its initial size", () => {
    expect(layoutForce(TRIO, [])[0]).toMatchObject({ initialHeight: 80, initialWidth: 72 });
  });

  it("returns the nodes in the order it was given them with their own fields", () => {
    expect(layoutForce(TRIO, []).map((node) => node.data)).toStrictEqual([
      { label: "a" },
      { label: "b" },
      { label: "c" },
    ]);
  });

  it("returns no node for an empty graph", () => {
    expect(layoutForce([], [])).toStrictEqual([]);
  });

  it.each([
    { strength: undefined, want: 1 },
    { strength: 0.5, want: 1 },
    { strength: 1.5, want: 1.5 },
    { strength: 3, want: 2 },
  ])("returns a tie of $want for a strength of $strength", ({ strength, want }) => {
    expect(strengthOf({ source: "a", strength, target: "b" })).toBe(want);
  });
});
