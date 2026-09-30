import { describe, expect, it } from "vitest";

import { LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { drawnOf, neighborsOf } from "#network-graph/network.ts";

function sorted(ids: ReadonlySet<string>): string[] {
  return [...ids].toSorted();
}

describe("network", () => {
  it("returns every link between two nodes of the graph", () => {
    expect(drawnOf(NODES, LINKS)).toHaveLength(LINKS.length);
  });

  it("pairs each link it returns with the nodes at its ends", () => {
    const [first] = drawnOf(NODES, LINKS);

    expect([first?.from.label, first?.to.label]).toStrictEqual(["Gateway", "Auth"]);
  });

  it("returns no link whose target is not a node of the graph", () => {
    expect(drawnOf(NODES, [{ source: "gateway", target: "ghost" }])).toStrictEqual([]);
  });

  it("returns no link whose source is not a node of the graph", () => {
    expect(drawnOf(NODES, [{ source: "ghost", target: "gateway" }])).toStrictEqual([]);
  });

  it("returns no link from a node to itself", () => {
    expect(drawnOf(NODES, [{ source: "fax", target: "fax" }])).toStrictEqual([]);
  });

  it("returns a node's neighbours whichever end of the link it is", () => {
    expect(sorted(neighborsOf(LINKS, "postgres"))).toStrictEqual(["auth", "checkout", "ledger"]);
  });

  it("walks one hop unless depth is stated", () => {
    expect(sorted(neighborsOf(LINKS, "checkout"))).toStrictEqual(["gateway", "kafka", "postgres"]);
  });

  it("walks the hops depth states", () => {
    expect(sorted(neighborsOf(LINKS, "checkout", 2))).toStrictEqual([
      "auth",
      "gateway",
      "kafka",
      "ledger",
      "postgres",
    ]);
  });

  it("never counts the node the walk starts from", () => {
    expect(neighborsOf(LINKS, "checkout", 5).has("checkout")).toBe(false);
  });

  it("returns no neighbour for a node no link meets", () => {
    expect(neighborsOf(LINKS, "fax").size).toBe(0);
  });
});
