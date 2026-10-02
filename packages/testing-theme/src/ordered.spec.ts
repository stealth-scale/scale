import { describe, expect, it } from "vitest";

import { orderViolations } from "#ordered.ts";
import { type Declared } from "#recipe.ts";

/**
 * Builds a recipe named `probe` offering one axis with the values the case lists, in that order.
 *
 * @param axis - The axis name, which decides which vocabulary the values are read against.
 * @param values - The values the axis offers, in the order the recipe declares them.
 */
function offering(axis: string, values: readonly string[]): Declared {
  return {
    className: "probe",
    variants: { [axis]: Object.fromEntries(values.map((value) => [value, { color: "fg" }])) },
  };
}

describe("orderViolations", () => {
  it("reports nothing for a scale ordered from its smallest step up", () => {
    expect(orderViolations(offering("size", ["sm", "md", "lg"]))).toStrictEqual([]);
  });

  it("names the order a size axis should take when it is listed alphabetically", () => {
    expect(orderViolations(offering("size", ["lg", "md", "sm"]))).toStrictEqual([
      "probe offers size as lg, md, sm rather than sm, md, lg",
    ]);
  });

  it("reports nothing for a set of looks ordered from the loudest down", () => {
    expect(orderViolations(offering("variant", ["subtle", "outline", "plain"]))).toStrictEqual([]);
  });

  it("names the order a variant axis should take when it is listed alphabetically", () => {
    expect(orderViolations(offering("variant", ["outline", "plain", "subtle"]))).toStrictEqual([
      "probe offers variant as outline, plain, subtle rather than subtle, outline, plain",
    ]);
  });

  it("skips an axis offering a value no vocabulary of that axis names", () => {
    expect(orderViolations(offering("variant", ["plain", "enclosed", "line"]))).toStrictEqual([]);
  });

  it("skips an axis offering a single value", () => {
    expect(orderViolations(offering("size", ["md"]))).toStrictEqual([]);
  });

  it("skips an axis it holds no vocabulary order for", () => {
    expect(orderViolations(offering("placement", ["end", "start"]))).toStrictEqual([]);
  });

  it("reports one line per axis when a recipe has two out of order", () => {
    const recipe: Declared = {
      className: "probe",
      variants: {
        ...offering("size", ["lg", "sm"]).variants,
        ...offering("status", ["warning", "success"]).variants,
      },
    };

    expect(orderViolations(recipe)).toStrictEqual([
      "probe offers size as lg, sm rather than sm, lg",
      "probe offers status as warning, success rather than success, warning",
    ]);
  });

  it("reports nothing for a recipe declaring no variants at all", () => {
    expect(orderViolations({ className: "probe" })).toStrictEqual([]);
  });
});
