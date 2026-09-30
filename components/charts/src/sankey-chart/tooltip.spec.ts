import { describe, expect, it } from "vitest";

import { numberFormatter } from "#chart/format.ts";
import { writersOf } from "#hierarchy/facts.ts";
import { type Fact } from "#sankey-chart/graph.ts";
import { type FlowFacts, tooltipOf, WORDS } from "#sankey-chart/tooltip.ts";

/**
 * Lists a source, a middle node, a sink, and a flow of 30 out of 110 from the source.
 */
const FACTS = new Map<string, Fact>([
  ["organic", { inflow: 0, kind: "node", outflow: 110, title: "Organic search" }],
  ["signup", { inflow: 60, kind: "node", outflow: 45, title: "Signed up" }],
  ["left", { inflow: 100, kind: "node", outflow: 0, title: "Left" }],
  ["organic - left", { kind: "flow", share: 30 / 110, title: "Organic search → Left", value: 30 }],
]);

/**
 * Reads the facts in English with the default words.
 */
const READ: FlowFacts = {
  facts: FACTS,
  words: WORDS,
  writers: writersOf({ formatNumber: (options) => numberFormatter("en-US", options) }, {}),
};

describe("tooltip", () => {
  it("heads the tooltip with a node's name", () => {
    expect(tooltipOf(READ).headingOf([{ name: "signup" }])).toBe("Signed up");
  });

  it("heads the tooltip with a flow's two names", () => {
    expect(tooltipOf(READ).headingOf([{ name: "organic - left" }])).toBe("Organic search → Left");
  });

  it("writes a node's inflow and outflow", () => {
    expect(tooltipOf(READ).rowsOf([{ name: "signup" }])).toStrictEqual([
      { key: "inflow", name: "In", value: "60" },
      { key: "outflow", name: "Out", value: "45" },
    ]);
  });

  it("writes no inflow for a source", () => {
    expect(
      tooltipOf(READ)
        .rowsOf([{ name: "organic" }])
        .map((row) => row.key),
    ).toStrictEqual(["outflow"]);
  });

  it("writes no outflow for a sink", () => {
    expect(
      tooltipOf(READ)
        .rowsOf([{ name: "left" }])
        .map((row) => row.key),
    ).toStrictEqual(["inflow"]);
  });

  it("writes a flow's value and its share of its source to two significant digits", () => {
    expect(tooltipOf(READ).rowsOf([{ name: "organic - left" }])).toStrictEqual([
      { key: "value", name: "Value", value: "30" },
      { key: "share", name: "Of source", value: "27%" },
    ]);
  });

  it("names the rows with the stated words", () => {
    expect(
      tooltipOf({
        ...READ,
        words: { inflow: "Entered", outflow: "Left", share: "Share", value: "Visitors" },
      })
        .rowsOf([{ name: "signup" }])
        .map((row) => row.name),
    ).toStrictEqual(["Entered", "Left"]);
  });

  it("writes no heading for a name no mark has", () => {
    expect(tooltipOf(READ).headingOf([{ name: "ghost" }])).toBeUndefined();
  });

  it("writes no row for a name no mark has", () => {
    expect(tooltipOf(READ).rowsOf([{ name: "ghost" }])).toStrictEqual([]);
  });

  it("writes no heading without entries", () => {
    expect(tooltipOf(READ).headingOf([])).toBeUndefined();
  });
});
