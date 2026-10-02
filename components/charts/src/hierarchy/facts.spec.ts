import { describe, expect, it } from "vitest";

import { numberFormatter } from "#chart/format.ts";
import { type Facts, tooltipOf, WORDS, writersOf } from "#hierarchy/facts.ts";

/**
 * Writers in English with the sizes in euros.
 */
const WRITERS = writersOf(
  { formatNumber: (options) => numberFormatter("en-US", options) },
  { currency: "EUR", maximumFractionDigits: 0, style: "currency" },
);

/**
 * Lists two nodes of a total of 66,000.
 */
const READ: Facts = {
  facts: new Map([
    ["k8s", { label: "Kubernetes", size: 21_800 }],
    ["sliver", { label: "Sliver", size: 20 }],
  ]),
  total: 66_000,
  words: WORDS,
  writers: WRITERS,
};

describe("facts", () => {
  it("writes a size with valueOptions", () => {
    expect(WRITERS.formatValue(21_800)).toBe("€21,800");
  });

  it("writes a share on a mark in whole percents", () => {
    expect(WRITERS.formatShare(0.3303)).toBe("33%");
  });

  it("writes a share in the tooltip to two significant digits", () => {
    expect(WRITERS.formatRate(0.4454)).toBe("45%");
  });

  it("heads the tooltip with the node's name", () => {
    expect(tooltipOf(READ).headingOf([{ name: "k8s" }])).toBe("Kubernetes");
  });

  it("writes the node's size and share in the tooltip", () => {
    expect(tooltipOf(READ).rowsOf([{ name: "k8s" }])).toStrictEqual([
      { key: "value", name: "Value", value: "€21,800" },
      { key: "share", name: "Of total", value: "33%" },
    ]);
  });

  it("writes a sliver's share to two significant digits", () => {
    expect(tooltipOf(READ).rowsOf([{ name: "sliver" }])[1]?.value).toBe("0.03%");
  });

  it("names the rows with the stated words", () => {
    expect(
      tooltipOf({ ...READ, words: { share: "Share", value: "Spend" } })
        .rowsOf([{ name: "k8s" }])
        .map((row) => row.name),
    ).toStrictEqual(["Spend", "Share"]);
  });

  it("writes no row for entries that name no node", () => {
    expect(tooltipOf(READ).rowsOf([])).toStrictEqual([]);
  });

  it("writes no row for an entry whose name is not a key", () => {
    expect(tooltipOf(READ).rowsOf([{ name: 3 }])).toStrictEqual([]);
  });

  it("names the rows Value and Of total unless stated", () => {
    expect(WORDS).toStrictEqual({ share: "Of total", value: "Value" });
  });
});
