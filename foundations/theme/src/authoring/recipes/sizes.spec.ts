import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  below,
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  controlSizes,
  iconOnly,
  iconSizes,
  insetSizes,
  sizeVariants,
  tagSizes,
  touchTarget,
} from "#authoring/recipes/sizes.ts";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

describe("sizes", () => {
  it("reads the four semantic scales for each control size", () => {
    expect(controlSizes(["md"])).toMatchObject({
      md: {
        gap: "calc({spacing.gap.md} * var(--density, 1))",
        height: "calc({sizes.control.md} * var(--density, 1))",
        textStyle: "label.md",
      },
    });
  });

  it("reads each inset through a property with the step as the fallback", () => {
    expect(controlSizes(["md"])).toMatchObject({
      md: {
        paddingInlineEnd: "var(--control-inset-end, calc({spacing.inset.md} * var(--density, 1)))",
        paddingInlineStart:
          "var(--control-inset-start, calc({spacing.inset.md} * var(--density, 1)))",
      },
    });
  });

  it("names the two properties a component opens a side of a control with", () => {
    expect([CONTROL_INSET_START, CONTROL_INSET_END]).toStrictEqual([
      "--control-inset-start",
      "--control-inset-end",
    ]);
  });

  it("leads with one step less inset where a mark opens the control", () => {
    expect(controlSizes(["md", "4xl"])).toMatchObject({
      "4xl": {
        "&:has(> svg:first-child)": {
          paddingInlineStart: "calc({spacing.inset.3xl} * var(--density, 1))",
        },
      },
      md: {
        "&:has(> svg:first-child)": {
          paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
        },
      },
    });
  });

  it("leads with its own inset at the smallest size", () => {
    expect(controlSizes(["xs"])).toMatchObject({
      xs: {
        "&:has(> svg:first-child)": {
          paddingInlineStart: "calc({spacing.inset.xs} * var(--density, 1))",
        },
      },
    });
  });

  it("reads the icon scale for each icon size", () => {
    expect(iconSizes(["xs", "xl"])).toStrictEqual({
      xl: { boxSize: "calc({sizes.icon.xl} * var(--density, 1))" },
      xs: { boxSize: "calc({sizes.icon.xs} * var(--density, 1))" },
    });
  });

  it("draws a square control with no inset for each icon-only size", () => {
    expect(iconOnly(["md"])).toStrictEqual({
      md: { boxSize: "calc({sizes.control.md} * var(--density, 1))", padding: "0" },
    });
  });

  it("widens the hit area to a medium control or the target floor under a coarse pointer alone", () => {
    expect(Object.keys(touchTarget())).toStrictEqual(["_touch"]);
    expect(touchTarget()).toMatchObject({
      _touch: {
        _before: {
          minBlockSize: "max({sizes.6}, calc({sizes.control.md} * var(--density, 1)))",
          minInlineSize: "max({sizes.6}, calc({sizes.control.md} * var(--density, 1)))",
          position: "absolute",
        },
        position: "relative",
      },
    });
  });

  it("writes whatever a recipe states for each step it names", () => {
    expect(
      sizeVariants((size) => ({ paddingInlineEnd: `control.${size}` }), ["sm", "md"]),
    ).toStrictEqual({
      md: { paddingInlineEnd: "control.md" },
      sm: { paddingInlineEnd: "control.sm" },
    });
  });

  it("writes every step of the scale where a recipe names none", () => {
    expect(Object.keys(sizeVariants(() => ({ width: "full" })))).toHaveLength(8);
  });

  it("pads every side of a box on the inset scale", () => {
    expect(insetSizes(["md"])).toStrictEqual({
      md: { padding: "calc({spacing.inset.md} * var(--density, 1))" },
    });
  });

  it("offers every step of the inset scale where a recipe names none", () => {
    expect(Object.keys(insetSizes())).toHaveLength(8);
  });

  it("reads the step below the one it is given", () => {
    expect(below("4xl")).toBe("3xl");
    expect(below("md")).toBe("sm");
  });

  it("reads the smallest step as itself because nothing lies below it", () => {
    expect(below("xs")).toBe("xs");
  });

  it("reads the tag scale for a tag's height and the step below for the rest", () => {
    expect(tagSizes(["md"])).toStrictEqual({
      md: {
        gap: "calc({spacing.gap.sm} * var(--density, 1))",
        height: "calc({sizes.tag.md} * var(--density, 1))",
        paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
        textStyle: "label.sm",
      },
    });
  });

  it("offers every step where a recipe names none", () => {
    expect(Object.keys(tagSizes()).toSorted()).toStrictEqual(
      Object.keys(controlSizes()).toSorted(),
    );
  });

  it("reads tokens the foundation defines at every size of every scale", () => {
    const recipe = defineRecipe({
      base: touchTarget(),
      className: "x",
      variants: {
        icon: iconSizes(SIZES),
        only: iconOnly(SIZES),
        size: controlSizes(SIZES),
        tag: tagSizes(SIZES),
      },
    });

    expect(
      recipeViolations(recipe, {
        skip: {
          "recipe.values": "the three scales share their steps, so one recipe reads them all",
        },
      }),
    ).toStrictEqual([]);
  });
});
