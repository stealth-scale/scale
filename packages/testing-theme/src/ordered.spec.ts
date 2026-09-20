import { describe, expect, it } from "vitest";

import { orderViolations } from "#ordered.ts";
import { type Declared } from "#recipe.ts";

/**
 * Writes a recipe offering one axis with the values a case states.
 */
function offering(axis: string, values: readonly string[]): Declared {
  return {
    className: "probe",
    variants: { [axis]: Object.fromEntries(values.map((value) => [value, { color: "fg" }])) },
  };
}

describe("orderViolations", () => {
  it("accepts a scale that runs from its smallest step up", () => {
    expect(orderViolations(offering("size", ["sm", "md", "lg"]))).toStrictEqual([]);
  });

  it("reports a scale listed alphabetically", () => {
    expect(orderViolations(offering("size", ["lg", "md", "sm"]))).toStrictEqual([
      "probe offers size as lg, md, sm rather than sm, md, lg",
    ]);
  });

  it("accepts a set of looks that runs from the loudest down", () => {
    expect(orderViolations(offering("variant", ["subtle", "outline", "plain"]))).toStrictEqual([]);
  });

  it("reports a set of looks listed alphabetically", () => {
    expect(orderViolations(offering("variant", ["outline", "plain", "subtle"]))).toStrictEqual([
      "probe offers variant as outline, plain, subtle rather than subtle, outline, plain",
    ]);
  });

  it("leaves an axis holding a value no vocabulary names alone", () => {
    expect(orderViolations(offering("variant", ["plain", "enclosed", "line"]))).toStrictEqual([]);
  });

  it("leaves an axis of one value alone", () => {
    expect(orderViolations(offering("size", ["md"]))).toStrictEqual([]);
  });

  it("leaves an axis no vocabulary covers alone", () => {
    expect(orderViolations(offering("placement", ["end", "start"]))).toStrictEqual([]);
  });

  it("reads every axis a recipe offers", () => {
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

  it("accepts a recipe with no axes at all", () => {
    expect(orderViolations({ className: "probe" })).toStrictEqual([]);
  });
});
