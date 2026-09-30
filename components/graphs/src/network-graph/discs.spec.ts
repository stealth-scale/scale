import { describe, expect, it } from "vitest";

import { DIAMETER, discsOf } from "#network-graph/discs.ts";
import { type NetworkNode } from "#network-graph/types.ts";

function diameters(nodes: readonly NetworkNode[], links = []): number[] {
  return discsOf(nodes, links).map(({ disc }) => disc);
}

describe("discs", () => {
  it("sizes the heaviest node's disc 68px across", () => {
    expect(diameters([{ id: "a", label: "A", weight: 9 }])).toStrictEqual([68]);
  });

  it("sizes a disc of no weight 36px across", () => {
    expect(
      diameters([
        { id: "a", label: "A", weight: 9 },
        { id: "b", label: "B", weight: 0 },
      ]),
    ).toStrictEqual([68, 36]);
  });

  it("grows a disc's diameter with the square root of its share of the heaviest weight", () => {
    expect(
      diameters([
        { id: "a", label: "A", weight: 4 },
        { id: "b", label: "B", weight: 1 },
      ]),
    ).toStrictEqual([68, 36 + 32 * 0.5]);
  });

  it("weighs a node without a weight by the number of its links", () => {
    const sized = discsOf(
      [
        { id: "hub", label: "Hub" },
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      [
        { source: "hub", target: "a" },
        { source: "hub", target: "b" },
        { source: "hub", target: "c" },
        { source: "b", target: "hub" },
        { source: "c", target: "d" },
      ],
    );

    expect(sized.map(({ disc }) => disc)).toStrictEqual([
      68,
      36 + 32 * 0.5,
      36 + 32 * Math.sqrt(0.5),
      36 + 32 * Math.sqrt(0.5),
      36 + 32 * 0.5,
    ]);
  });

  it("counts a weight under zero as zero", () => {
    expect(
      diameters([
        { id: "a", label: "A", weight: 1 },
        { id: "b", label: "B", weight: -4 },
      ]),
    ).toStrictEqual([68, 36]);
  });

  it("sizes every disc 36px across while no node weighs anything", () => {
    expect(
      diameters([
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ]),
    ).toStrictEqual([36, 36]);
  });

  it("returns each node with its disc in the order it was given them", () => {
    expect(discsOf([{ id: "a", label: "A" }], []).map(({ node }) => node.id)).toStrictEqual(["a"]);
  });

  it("states the diameters' ends", () => {
    expect(DIAMETER).toStrictEqual({ max: 68, min: 36 });
  });
});
