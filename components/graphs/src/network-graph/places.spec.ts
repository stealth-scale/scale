import { describe, expect, it } from "vitest";

import { discsOf } from "#network-graph/discs.ts";
import { LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { boxOf, type Placed, type PlacesInput, placesOf } from "#network-graph/places.ts";

function placed(input: Partial<PlacesInput> = {}): Placed[] {
  return placesOf({ iterations: 300, links: LINKS, nodes: NODES, seed: 1, ...input });
}

describe("places", () => {
  it("sizes a box as wide as its disc when the disc is wider than the name", () => {
    expect(boxOf({ disc: 68, node: { id: "fax", label: "Fax" } })).toStrictEqual({
      height: 94,
      width: 68,
    });
  });

  it("sizes a box by 8.5px a character and 8px of padding when the name is wider", () => {
    expect(boxOf({ disc: 36, node: { id: "fax", label: "Fax gateway, east" } })).toStrictEqual({
      height: 62,
      width: 152.5,
    });
  });

  it("returns every node in the order given", () => {
    expect(placed().map(({ node }) => node.id)).toStrictEqual(NODES.map(({ id }) => id));
  });

  it("returns each node with the disc its links weigh it by", () => {
    const nodes = NODES.map(({ id, label }) => ({ id, label }));

    expect(placed({ nodes }).map(({ disc }) => disc)).toStrictEqual(
      discsOf(nodes, LINKS).map(({ disc }) => disc),
    );
  });

  it("returns the middle of a node's top edge as its position", () => {
    const [lone] = placed({ links: [], nodes: [{ id: "a", label: "A" }] });

    expect(lone?.position).toStrictEqual({ x: 0, y: -31 });
  });

  it("keeps two linked nodes' boxes apart when their names are wider than their discs", () => {
    const label = "A".repeat(30);
    const [a, b] = placed({
      links: [{ source: "a", target: "b" }],
      nodes: [
        { id: "a", label },
        { id: "b", label },
      ],
    });
    const across = Math.abs((a?.position.x ?? 0) - (b?.position.x ?? 0));
    const down = Math.abs((a?.position.y ?? 0) - (b?.position.y ?? 0));

    expect(across >= 263 || down >= 62).toBe(true);
  });

  it("places the nodes the same way for the same seed", () => {
    expect(placed()).toStrictEqual(placed());
  });

  it("places the nodes another way for another seed", () => {
    expect(placed({ seed: 7 })).not.toStrictEqual(placed());
  });

  it("runs the number of steps stated", () => {
    expect(placed({ iterations: 1 })).not.toStrictEqual(placed());
  });

  it("places no node for an empty graph", () => {
    expect(placed({ links: [], nodes: [] })).toStrictEqual([]);
  });
});
