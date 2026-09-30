import { describe, expect, it } from "vitest";

import { walk } from "#graph/walk.ts";

const CHAIN = [
  { source: "orders", target: "clean" },
  { source: "clean", target: "joined" },
  { source: "joined", target: "revenue" },
];

const CYCLE = [
  { source: "a", target: "b" },
  { source: "b", target: "a" },
];

describe("walk", () => {
  it("follows each link from its source to its target while forward", () => {
    expect([...walk(CHAIN, "clean", 5, true)]).toStrictEqual(["joined", "revenue"]);
  });

  it("follows each link from its target to its source while backward", () => {
    expect([...walk(CHAIN, "joined", 5, false)]).toStrictEqual(["clean", "orders"]);
  });

  it("stops after the hops depth states", () => {
    expect([...walk(CHAIN, "orders", 2, true)]).toStrictEqual(["clean", "joined"]);
  });

  it("visits nothing at a depth of zero", () => {
    expect(walk(CHAIN, "orders", 0, true).size).toBe(0);
  });

  it("walks every hop at an infinite depth", () => {
    expect(walk(CHAIN, "orders", Number.POSITIVE_INFINITY, true).size).toBe(3);
  });

  it("leaves the start out of a cycle that leads back to it", () => {
    expect([...walk(CYCLE, "a", 5, true)]).toStrictEqual(["b"]);
  });

  it("visits a node once when two links lead to it", () => {
    const joined = [
      { source: "a", target: "c" },
      { source: "a", target: "b" },
      { source: "b", target: "c" },
    ];

    expect([...walk(joined, "a", 5, true)]).toStrictEqual(["c", "b"]);
  });

  it("visits nothing from a node no link leaves", () => {
    expect(walk(CHAIN, "revenue", 5, true).size).toBe(0);
  });
});
