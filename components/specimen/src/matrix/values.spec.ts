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
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid"]);
  });

  it("returns the steps of the size axis in the order of the scale", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["sm", "md", "lg"]);
  });

  it("keeps a size the scale does not name after the steps in the recipe's order", () => {
    const measured = {
      className: "container",
      variants: { size: { full: {}, lg: {}, md: {}, prose: {}, sm: {} } },
    };

    expect(valuesOf(measured, "size")).toStrictEqual(["sm", "md", "lg", "full", "prose"]);
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
