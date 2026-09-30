import { describe, expect, it } from "vitest";

import { SALES } from "#data-table/examples/sales.ts";

describe("sales", () => {
  it("lists the orders of the first quarter first", () => {
    expect(SALES[0]).toStrictEqual({
      product: "laptops",
      quarter: "q1",
      region: "north",
      value: 1450,
    });
  });

  it("lists no dock sold in the west", () => {
    expect(SALES.some((sale) => sale.region === "west" && sale.product === "docks")).toBe(false);
  });

  it("lists no monitor sold in the south in the second quarter", () => {
    expect(
      SALES.some(
        (sale) => sale.region === "south" && sale.product === "monitors" && sale.quarter === "q2",
      ),
    ).toBe(false);
  });

  it("lists orders in 31 of the 36 cells of region by product by quarter", () => {
    expect(
      new Set(SALES.map((sale) => `${sale.region}/${sale.product}/${sale.quarter}`)).size,
    ).toBe(31);
  });
});
