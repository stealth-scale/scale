import { describe, expect, expectTypeOf, it } from "vitest";

import { valuesOf } from "#matrix/values.ts";

const recipe = {
  className: "chip",
  variants: {
    size: { lg: {}, md: {}, sm: {} },
    variant: { outline: {}, solid: {} },
  },
};

describe("valuesOf", () => {
  it("returns the values an axis offers in the order the recipe states them", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("types the values as the recipe's own literals", () => {
    const values = valuesOf(recipe, "variant");

    expectTypeOf(values).toEqualTypeOf<ReadonlyArray<"outline" | "solid">>();

    expect(values).toStrictEqual(["outline", "solid"]);
  });

  it("returns nothing for a recipe that offers no axes", () => {
    expect(valuesOf<{ size: object }, "size">({}, "size")).toStrictEqual([]);
  });
});
