import { describe, expect, it } from "vitest";

import { type HierarchyNode } from "#hierarchy/hierarchy.ts";
import { type Arc, ringsOf } from "#sunburst-chart/rings.ts";

/**
 * Lists a service at the top level, a team of three services and a team of one service with one
 * part, out of order: 20, 70 and 30 of 120, three levels deep.
 */
const NODES: readonly HierarchyNode[] = [
  { key: "search", label: "Search", value: 20 },
  {
    children: [
      { key: "cache", value: 10 },
      { key: "db", label: "Database", value: 40 },
      { key: "queue", value: 20 },
    ],
    key: "data",
    label: "Data",
  },
  { children: [{ children: [{ key: "edge", value: 30 }], key: "cdn" }], key: "web" },
];

/**
 * Paints every family in its key's name, faded for the web team.
 */
const FAMILY = (key: string): { color: string; opacity: string } => ({
  color: `var(--${key})`,
  opacity: key === "web" ? "0.5" : "1",
});

/**
 * Returns the rings of the fixture's nodes.
 */
function ringed(): Arc[][] {
  return ringsOf(NODES, FAMILY).rings;
}

describe("rings", () => {
  it("renders a ring per level", () => {
    expect(ringed()).toHaveLength(3);
  });

  it("lists the top-level nodes largest first", () => {
    expect(ringed()[0]?.map((arc) => arc.name)).toStrictEqual(["data", "web", "search"]);
  });

  it("lists each ring's nodes in their parents' order largest first", () => {
    expect(ringed()[1]?.map((arc) => arc.name)).toStrictEqual(["db", "queue", "cache", "cdn", ""]);
  });

  it("leaves a gap in every ring beyond a leaf", () => {
    expect(ringed()[2]?.map((arc) => arc.name)).toStrictEqual(["", "", "", "edge", ""]);
  });

  it("sizes each gap by the leaf above it", () => {
    expect(ringed()[2]?.map((arc) => arc.value)).toStrictEqual([40, 20, 10, 30, 20]);
  });

  it("sums every ring to the total", () => {
    expect(ringed().map((ring) => ring.reduce((sum, arc) => sum + arc.value, 0))).toStrictEqual([
      120, 120, 120,
    ]);
  });

  it("numbers the walk depth first", () => {
    expect(ringed().map((ring) => ring.map((arc) => arc.walk))).toStrictEqual([
      [0, 4, 7],
      [1, 2, 3, 5, undefined],
      [undefined, undefined, undefined, 6, undefined],
    ]);
  });

  it("keeps the facts in the walk's order", () => {
    expect([...ringsOf(NODES, FAMILY).facts.keys()]).toStrictEqual([
      "data",
      "db",
      "queue",
      "cache",
      "web",
      "cdn",
      "edge",
      "search",
    ]);
  });

  it("fills a top-level node with the whole of its color", () => {
    expect(ringed()[0]?.[0]?.fill).toBe(
      "color-mix(in oklab, var(--data) 100%, var(--colors-bg-panel))",
    );
  });

  it("mixes a family's color for its parts at 82% of the sibling ramp", () => {
    expect(
      ringed()[1]
        ?.slice(0, 3)
        .map((arc) => arc.fill),
    ).toStrictEqual([
      "color-mix(in oklab, var(--data) 82%, var(--colors-bg-panel))",
      "color-mix(in oklab, var(--data) 59%, var(--colors-bg-panel))",
      "color-mix(in oklab, var(--data) 37%, var(--colors-bg-panel))",
    ]);
  });

  it("keeps 82% of the generation inside it for each generation", () => {
    expect(ringed()[2]?.[3]?.fill).toBe(
      "color-mix(in oklab, var(--web) 67%, var(--colors-bg-panel))",
    );
  });

  it("gives every arc of a family the family's opacity", () => {
    const [top, parts, leaves] = ringed();

    expect([top?.[1]?.opacity, parts?.[3]?.opacity, leaves?.[3]?.opacity]).toStrictEqual([
      "0.5",
      "0.5",
      "0.5",
    ]);
  });

  it("paints a gap transparent", () => {
    expect(ringed()[1]?.[4]?.fill).toBe("transparent");
  });

  it("gives a gap the gap class", () => {
    expect(ringed()[1]?.[4]?.className).toBe("chart-gap");
  });

  it("gives a gap a whole opacity", () => {
    expect(ringed()[2]?.[0]?.opacity).toBe("1");
  });

  it("gives a node's arc no class", () => {
    expect(ringed()[1]?.[0]?.className).toBeUndefined();
  });

  it("keeps each node's name and size for the tooltip", () => {
    expect(ringsOf(NODES, FAMILY).facts.get("db")).toStrictEqual({ label: "Database", size: 40 });
  });

  it("keeps a node's key as its name without a label", () => {
    expect(ringsOf(NODES, FAMILY).facts.get("cache")?.label).toBe("cache");
  });

  it("sizes a parent by its children's sum", () => {
    expect(ringsOf(NODES, FAMILY).facts.get("data")?.size).toBe(70);
  });

  it("sums the top-level sizes", () => {
    expect(ringsOf(NODES, FAMILY).total).toBe(120);
  });

  it("leaves out a child of size 0", () => {
    const { rings } = ringsOf(
      [
        {
          children: [
            { key: "a", value: 3 },
            { key: "credit", value: -2 },
          ],
          key: "p",
        },
      ],
      FAMILY,
    );

    expect(rings[1]?.map((arc) => arc.name)).toStrictEqual(["a"]);
  });

  it("renders no ring without nodes", () => {
    expect(ringsOf([], FAMILY)).toStrictEqual({ facts: new Map(), rings: [], total: 0 });
  });
});
