import { describe, expect, it } from "vitest";

import { defineRecipe, defineSlotRecipe } from "@stealthscale/theme/authoring";

import { axesOf, byStep, defaultsOf, scaleOf, slotsOf, valuesOf } from "#recipe.ts";

describe("recipe", () => {
  it("lists the values one variant offers sorted", () => {
    const recipe = defineRecipe({
      className: "button",
      variants: { variant: { ghost: {}, solid: {} } },
    });

    expect(valuesOf(recipe, "variant")).toStrictEqual(["ghost", "solid"]);
  });

  it("throws naming the recipe and the axis when the recipe offers no such variant", () => {
    expect(() => valuesOf(defineRecipe({ className: "button" }), "tone")).toThrow(/button.*tone/u);
  });

  it("lists every variant a recipe offers", () => {
    const recipe = defineRecipe({
      className: "button",
      variants: { size: { md: {} }, variant: { solid: {} } },
    });

    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
    expect(axesOf(defineRecipe({ className: "button" }))).toStrictEqual([]);
  });

  it("returns the default variant values and an empty object when a recipe declares none", () => {
    const recipe = defineRecipe({
      className: "button",
      defaultVariants: { variant: "solid" },
      variants: { variant: { ghost: {}, solid: {} } },
    });

    expect(defaultsOf(recipe)).toStrictEqual({ variant: "solid" });
    expect(defaultsOf(defineRecipe({ className: "button" }))).toStrictEqual({});
  });

  it("lists every slot a slot recipe styles sorted", () => {
    const recipe = defineSlotRecipe({ className: "dialog", slots: ["title", "content"] });

    expect(slotsOf(recipe)).toStrictEqual(["content", "title"]);
  });

  it("reads one property across a variant's values in the order given", () => {
    const recipe = {
      className: "b",
      variants: { size: { lg: { height: "11" }, md: { height: "10" }, sm: { height: "8" } } },
    };

    expect(scaleOf(recipe, "size", "height", ["sm", "md", "lg"])).toStrictEqual(["8", "10", "11"]);
  });

  it("returns undefined for a value that sets no such property", () => {
    const recipe = { className: "b", variants: { size: { sm: { paddingInline: "3" } } } };

    expect(scaleOf(recipe, "size", "height", ["sm"])).toStrictEqual([undefined]);
  });

  it("throws when the recipe offers no such variant", () => {
    expect(() => scaleOf({ className: "b" }, "size", "height", [])).toThrow("no variant called");
  });

  it("throws when the order names a value the variant does not offer", () => {
    const recipe = { className: "b", variants: { size: { sm: { height: "8" } } } };

    expect(() => scaleOf(recipe, "size", "height", ["xl"])).toThrow("offers no value xl");
  });

  it("sorts the steps of a scale numerically", () => {
    expect(["10", "2.5", "8"].toSorted(byStep)).toStrictEqual(["2.5", "8", "10"]);
  });
});
