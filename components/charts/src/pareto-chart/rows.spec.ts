import { describe, expect, it } from "vitest";

import { paretoCutoff, paretoRows } from "#pareto-chart/rows.ts";

/**
 * Lists support tickets per reason, 100 in all, in no order.
 */
const TICKETS = [
  { reason: "Login", tickets: 20 },
  { reason: "Billing", tickets: 50 },
  { reason: "Export", tickets: 10 },
  { reason: "Search", tickets: 20 },
];

describe("rows", () => {
  it("sorts the rows largest first", () => {
    expect(paretoRows(TICKETS, "tickets").map((row) => row.tickets)).toStrictEqual([
      50, 20, 20, 10,
    ]);
  });

  it("keeps rows of equal value in their order", () => {
    expect(paretoRows(TICKETS, "tickets").map((row) => row.reason)).toStrictEqual([
      "Billing",
      "Login",
      "Search",
      "Export",
    ]);
  });

  it("adds each row's share of the total", () => {
    expect(paretoRows(TICKETS, "tickets").map((row) => row.share)).toStrictEqual([
      0.5, 0.2, 0.2, 0.1,
    ]);
  });

  it("adds the running share of the total after each row", () => {
    expect(paretoRows(TICKETS, "tickets").map((row) => row.cumulative)).toStrictEqual([
      0.5, 0.7, 0.9, 1,
    ]);
  });

  it("counts a value that is not a finite number as zero", () => {
    const rows = paretoRows(
      [
        { reason: "Unknown", tickets: Number.NaN },
        { reason: "Billing", tickets: 50 },
      ],
      "tickets",
    );

    expect(rows.map((row) => [row.reason, row.share])).toStrictEqual([
      ["Billing", 1],
      ["Unknown", 0],
    ]);
  });

  it("returns every share as zero without a total", () => {
    const rows = paretoRows(
      [
        { reason: "Login", tickets: 0 },
        { reason: "Billing", tickets: 0 },
      ],
      "tickets",
    );

    expect(rows.map((row) => [row.share, row.cumulative])).toStrictEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("counts the rows it takes to add up to 80% by default", () => {
    expect(paretoCutoff(paretoRows(TICKETS, "tickets"))).toBe(3);
  });

  it("counts the row whose running share equals the threshold", () => {
    expect(paretoCutoff(paretoRows(TICKETS, "tickets"), 0.7)).toBe(2);
  });

  it("counts a running share within 1e-9 under the threshold as meeting it", () => {
    expect(
      paretoCutoff(
        [
          { cumulative: 0.799_999_999_999_999_9, share: 0.8 },
          { cumulative: 1, share: 0.2 },
        ],
        0.8,
      ),
    ).toBe(1);
  });

  it("counts every row when no running share meets the threshold", () => {
    expect(
      paretoCutoff([
        { cumulative: 0, share: 0 },
        { cumulative: 0, share: 0 },
      ]),
    ).toBe(2);
  });
});
