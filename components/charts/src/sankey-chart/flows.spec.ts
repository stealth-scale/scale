import { describe, expect, it } from "vitest";

import { counted, flowBalance, sankeyCycles, type SankeyFlow } from "#sankey-chart/flows.ts";

/**
 * Lists three nodes of a sign-up flow.
 */
const NODES = [{ key: "visit" }, { key: "signup" }, { key: "paid" }];

/**
 * Lists the flows of a sign-up: 100 visits, 40 sign-ups, 10 paid.
 */
const FLOWS: readonly SankeyFlow[] = [
  { from: "visit", to: "signup", value: 40 },
  { from: "signup", to: "paid", value: 10 },
];

describe("flows", () => {
  it("counts a flow with a finite value above zero", () => {
    expect(counted({ from: "a", to: "b", value: 1 })).toBe(true);
  });

  it.each([
    { label: "zero", value: 0 },
    { label: "below zero", value: -3 },
    { label: "infinite", value: Number.POSITIVE_INFINITY },
    { label: "not a number", value: Number.NaN },
  ])("counts no flow whose value is $label", ({ value }) => {
    expect(counted({ from: "a", to: "b", value })).toBe(false);
  });

  it("returns no cycle for flows in one direction", () => {
    expect(sankeyCycles(FLOWS)).toStrictEqual([]);
  });

  it("returns a flow from a node to itself", () => {
    const loop = { from: "a", to: "a", value: 1 };

    expect(sankeyCycles([loop])).toStrictEqual([loop]);
  });

  it("returns the flow that closes a loop against the flows before it", () => {
    const back = { from: "paid", to: "visit", value: 2 };

    expect(sankeyCycles([...FLOWS, back])).toStrictEqual([back]);
  });

  it("returns the later of two flows that close a loop together", () => {
    const back = { from: "b", to: "a", value: 1 };

    expect(sankeyCycles([{ from: "a", to: "b", value: 1 }, back])).toStrictEqual([back]);
  });

  it("follows a loop through a node it passed before on another path", () => {
    const back = { from: "d", to: "a", value: 1 };

    expect(
      sankeyCycles([
        { from: "a", to: "b", value: 1 },
        { from: "a", to: "c", value: 1 },
        { from: "b", to: "d", value: 1 },
        { from: "c", to: "d", value: 1 },
        back,
      ]),
    ).toStrictEqual([back]);
  });

  it("returns no cycle when two paths meet at one node", () => {
    expect(
      sankeyCycles([
        { from: "a", to: "b", value: 1 },
        { from: "a", to: "c", value: 1 },
        { from: "b", to: "d", value: 1 },
        { from: "c", to: "d", value: 1 },
        { from: "e", to: "a", value: 1 },
      ]),
    ).toStrictEqual([]);
  });

  it("leaves out a flow without a value above zero", () => {
    expect(
      sankeyCycles([
        { from: "a", to: "b", value: 0 },
        { from: "b", to: "a", value: 1 },
      ]),
    ).toStrictEqual([]);
  });

  it("returns each node's inflow and outflow in the nodes' order", () => {
    expect(flowBalance(NODES, FLOWS)).toStrictEqual([
      { inflow: 0, key: "visit", outflow: 40 },
      { inflow: 40, key: "signup", outflow: 10 },
      { inflow: 10, key: "paid", outflow: 0 },
    ]);
  });

  it("adds up two flows between the same nodes", () => {
    expect(
      flowBalance(NODES, [...FLOWS, { from: "visit", to: "signup", value: 5 }])[1],
    ).toStrictEqual({ inflow: 45, key: "signup", outflow: 10 });
  });

  it("leaves a flow to an unknown node out of the balance", () => {
    expect(flowBalance(NODES, [{ from: "visit", to: "nowhere", value: 7 }])[0]?.outflow).toBe(0);
  });

  it("leaves a flow from an unknown node out of the balance", () => {
    expect(flowBalance(NODES, [{ from: "nowhere", to: "paid", value: 7 }])[2]?.inflow).toBe(0);
  });

  it("leaves a flow without a value above zero out of the balance", () => {
    expect(flowBalance(NODES, [{ from: "visit", to: "paid", value: -7 }])[2]?.inflow).toBe(0);
  });
});
