import { describe, expect, it } from "vitest";

import { relationOf, traceGraph } from "#directed-graph/trace.ts";

const CHAIN = [
  { source: "orders", target: "clean" },
  { source: "clean", target: "join" },
  { source: "join", target: "revenue" },
];

const JOINED = [...CHAIN, { source: "customers", target: "join" }];

describe("trace", () => {
  it("traces the nodes a node feeds", () => {
    expect([...traceGraph(JOINED, "clean").downstream].toSorted()).toStrictEqual([
      "join",
      "revenue",
    ]);
  });

  it("traces the nodes that feed a node", () => {
    expect([...traceGraph(JOINED, "join").upstream].toSorted()).toStrictEqual([
      "clean",
      "customers",
      "orders",
    ]);
  });

  it("stops after the hops depth states", () => {
    expect([...traceGraph(CHAIN, "orders", 1).downstream]).toStrictEqual(["clean"]);
  });

  it("walks every hop unless depth is stated", () => {
    expect([...traceGraph(CHAIN, "orders").downstream]).toStrictEqual(["clean", "join", "revenue"]);
  });

  it("walks no hop at a depth of zero", () => {
    expect(traceGraph(CHAIN, "clean", 0)).toStrictEqual({
      downstream: new Set(),
      upstream: new Set(),
    });
  });

  it("leaves the focused node out of a cycle that leads back to it", () => {
    const trace = traceGraph(
      [
        { source: "a", target: "b" },
        { source: "b", target: "a" },
      ],
      "a",
    );

    expect([[...trace.downstream], [...trace.upstream]]).toStrictEqual([["b"], ["b"]]);
  });

  it("relates the focused node as the focus", () => {
    expect(relationOf("join", "join", traceGraph(JOINED, "join"))).toBe("focus");
  });

  it("relates a node the focus feeds as downstream", () => {
    expect(relationOf("revenue", "join", traceGraph(JOINED, "join"))).toBe("downstream");
  });

  it("relates a node that feeds the focus as upstream", () => {
    expect(relationOf("customers", "join", traceGraph(JOINED, "join"))).toBe("upstream");
  });

  it("relates a node the trace did not reach as unrelated", () => {
    expect(relationOf("customers", "clean", traceGraph(JOINED, "clean"))).toBe("unrelated");
  });

  it("relates a node both upstream and downstream as downstream", () => {
    const cycle = [
      { source: "a", target: "b" },
      { source: "b", target: "a" },
    ];

    expect(relationOf("b", "a", traceGraph(cycle, "a"))).toBe("downstream");
  });
});
