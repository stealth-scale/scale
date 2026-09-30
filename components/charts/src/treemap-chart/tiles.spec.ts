import { createElement } from "react";

import { describe, expect, it } from "vitest";

import { type HierarchyNode } from "#hierarchy/hierarchy.ts";
import { type Tile, tilesOf } from "#treemap-chart/tiles.ts";

/**
 * Lists a team of three services, a team of one, and a service at the top level, out of order.
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
  { children: [{ key: "cdn", value: 30 }], key: "web" },
];

/**
 * Paints every family in its key's name, faded for the web team.
 */
const FAMILY = (key: string): { color: string; opacity: string } => ({
  color: `var(--${key})`,
  opacity: key === "web" ? "0.5" : "1",
});

/**
 * Returns every tile depth first.
 */
function flat(tiles: readonly Tile[]): Tile[] {
  return tiles.flatMap((tile) => [tile, ...flat(tile.children ?? [])]);
}

describe("tiles", () => {
  it("lays out every level largest first", () => {
    const { tiles } = tilesOf(NODES, FAMILY);

    expect(flat(tiles).map((tile) => tile.name)).toStrictEqual([
      "data",
      "db",
      "queue",
      "cache",
      "web",
      "cdn",
      "search",
    ]);
  });

  it("numbers the walk depth first", () => {
    expect(flat(tilesOf(NODES, FAMILY).tiles).map((tile) => tile.walk)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]);
  });

  it("keeps the facts in the walk's order", () => {
    expect([...tilesOf(NODES, FAMILY).facts.keys()]).toStrictEqual([
      "data",
      "db",
      "queue",
      "cache",
      "web",
      "cdn",
      "search",
    ]);
  });

  it("sizes a parent by its children's sum", () => {
    expect(tilesOf(NODES, FAMILY).tiles[0]?.size).toBe(70);
  });

  it("leaves a parent's tile transparent", () => {
    expect(tilesOf(NODES, FAMILY).tiles[0]?.fill).toBe("transparent");
  });

  it("mixes a team's color for its services from the largest down", () => {
    const [data] = tilesOf(NODES, FAMILY).tiles;

    expect(data?.children?.map((tile) => tile.fill)).toStrictEqual([
      "color-mix(in oklab, var(--data) 100%, var(--colors-bg-panel))",
      "color-mix(in oklab, var(--data) 73%, var(--colors-bg-panel))",
      "color-mix(in oklab, var(--data) 45%, var(--colors-bg-panel))",
    ]);
  });

  it("fills a top-level leaf with the whole of its color", () => {
    expect(tilesOf(NODES, FAMILY).tiles.at(-1)?.fill).toBe(
      "color-mix(in oklab, var(--search) 100%, var(--colors-bg-panel))",
    );
  });

  it("gives every tile of a family the family's opacity", () => {
    const web = tilesOf(NODES, FAMILY).tiles[1];

    expect([web?.opacity, web?.children?.[0]?.opacity]).toStrictEqual(["0.5", "0.5"]);
  });

  it("titles a tile with its label", () => {
    expect(tilesOf(NODES, FAMILY).tiles[0]?.children?.[0]?.title).toBe("Database");
  });

  it("titles a tile with its key without a label", () => {
    expect(tilesOf(NODES, FAMILY).tiles[1]?.title).toBe("web");
  });

  it("titles a tile with its key when the label is not text", () => {
    const { tiles } = tilesOf(
      [{ key: "ops", label: createElement("b", null, "Ops"), value: 5 }],
      FAMILY,
    );

    expect(tiles[0]?.title).toBe("ops");
  });

  it("keeps each node's name and size for the tooltip", () => {
    expect(tilesOf(NODES, FAMILY).facts.get("db")).toStrictEqual({ label: "Database", size: 40 });
  });

  it("keeps a node's key as its name without a label", () => {
    expect(tilesOf(NODES, FAMILY).facts.get("cache")?.label).toBe("cache");
  });

  it("sums the top-level sizes", () => {
    expect(tilesOf(NODES, FAMILY).total).toBe(120);
  });

  it("leaves out a child of size 0", () => {
    const { tiles } = tilesOf(
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

    expect(tiles[0]?.children?.map((tile) => tile.name)).toStrictEqual(["a"]);
  });
});
