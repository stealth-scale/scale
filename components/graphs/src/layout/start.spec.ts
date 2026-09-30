import { describe, expect, it } from "vitest";

import { type Link } from "#graph/walk.ts";
import { startsOf } from "#layout/start.ts";

type Starts = ReadonlyMap<string, { readonly x: number; readonly y: number }>;

function seeded(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;

    return state / 4_294_967_296;
  };
}

function started(ids: readonly string[], links: readonly Link[], seed = 1): Starts {
  return startsOf(ids, links, seeded(seed), 100);
}

function radiusOf(starts: Starts, id: string): number {
  const start = starts.get(id);

  return Math.round(Math.hypot(start?.x ?? Number.NaN, start?.y ?? Number.NaN));
}

function angleOf(starts: Starts, id: string): number {
  const start = starts.get(id);

  return Math.atan2(start?.y ?? Number.NaN, start?.x ?? Number.NaN);
}

function gapOf(starts: Starts, a: string, b: string): number {
  const turn = Math.abs(angleOf(starts, a) - angleOf(starts, b));

  return Math.min(turn, Math.PI * 2 - turn);
}

const STAR = ["hub", "a", "b", "c", "d"];

const SPOKES: Link[] = ["a", "b", "c", "d"].map((id) => ({ source: "hub", target: id }));

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];

describe("start", () => {
  it("starts the most-linked node of a graph of one part in the middle", () => {
    const starts = started(
      ["a", "hub", "b"],
      [
        { source: "hub", target: "a" },
        { source: "hub", target: "b" },
      ],
    );

    expect(radiusOf(starts, "hub")).toBe(0);
  });

  it("starts each neighbour of the middle one step out", () => {
    const starts = started(STAR, SPOKES);

    expect(["a", "b", "c", "d"].map((id) => radiusOf(starts, id))).toStrictEqual([
      100, 100, 100, 100,
    ]);
  });

  it("starts a node one step further out for each hop", () => {
    const starts = started(
      ["a", "b", "c", "d", "e"],
      [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "c", target: "d" },
        { source: "d", target: "e" },
      ],
    );

    expect(["b", "c", "d", "e"].map((id) => radiusOf(starts, id))).toStrictEqual([
      0, 100, 200, 300,
    ]);
  });

  it("starts each part of a graph of several parts one step out", () => {
    const starts = started(["a", "b", "c"], [{ source: "a", target: "b" }]);

    expect(["a", "b", "c"].map((id) => radiusOf(starts, id))).toStrictEqual([100, 200, 100]);
  });

  it("starts the nodes of a graph without a link on one ring", () => {
    const starts = started(["a", "b", "c"], []);

    expect(["a", "b", "c"].map((id) => radiusOf(starts, id))).toStrictEqual([100, 100, 100]);
  });

  it("gives a node a share of its parent's angle as large as the branch ends it leads to", () => {
    const starts = started(
      ["hub", "big", "one", "two", "three", "small", "second", "third"],
      [
        { source: "hub", target: "big" },
        { source: "hub", target: "small" },
        { source: "hub", target: "second" },
        { source: "hub", target: "third" },
        { source: "big", target: "one" },
        { source: "big", target: "two" },
        { source: "big", target: "three" },
      ],
    );
    const gaps = [
      gapOf(starts, "one", "two"),
      gapOf(starts, "two", "three"),
      gapOf(starts, "one", "three"),
    ];

    expect(Math.min(...gaps)).toBeCloseTo(Math.PI / 3, 6);
  });

  it("starts siblings linked to each other side by side", () => {
    const links = [...SPOKES, { source: "a", target: "c" }];

    expect(
      SEEDS.map((seed) => gapOf(started(STAR, links, seed), "a", "c").toFixed(6)),
    ).toStrictEqual(SEEDS.map(() => (Math.PI / 2).toFixed(6)));
  });

  it("returns the same starts for the same number source", () => {
    expect(started(STAR, SPOKES, 3)).toStrictEqual(started(STAR, SPOKES, 3));
  });

  it("orders the neighbours another way for another number source", () => {
    const orders = SEEDS.map((seed) => {
      const starts = started(STAR, SPOKES, seed);

      return ["a", "b", "c", "d"].toSorted((x, y) => angleOf(starts, x) - angleOf(starts, y));
    });

    expect(new Set(orders.map((order) => order.join())).size).toBeGreaterThan(1);
  });

  it("ignores a link with an end outside the graph", () => {
    const ghosts = [
      { source: "ghost", target: "a" },
      { source: "b", target: "ghost" },
    ];

    expect(started(STAR, [...SPOKES, ...ghosts])).toStrictEqual(started(STAR, SPOKES));
  });

  it("returns no start for an empty graph", () => {
    expect(started([], [])).toStrictEqual(new Map());
  });
});
