import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#alert/recipe.ts";

const PARTS = ["root", "indicator", "content", "title", "description", "aside"];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Alert.Root", "Alert.Title", "Alert.Indicator"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class alert", () => {
    expect(recipe.className).toBe("alert");
  });

  it("styles the six parts an alert draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the six axes an alert takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "layout",
      "motion",
      "radius",
      "size",
      "status",
      "variant",
    ]);
  });

  it("draws a subtle notice at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      layout: "stacked",
      radius: "l3",
      size: "md",
      status: "info",
      variant: "subtle",
    });
  });

  it("offers the four statuses and the neutral one", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("names an intent for every status rather than a hue", () => {
    expect.hasAssertions();

    for (const [status, styles] of Object.entries(recipe.variants?.["status"] ?? {})) {
      expect(styles).toStrictEqual({ root: { colorPalette: status } });
    }
  });

  it("offers the five flat looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("offers the three steps a notice is read at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("steps the root's room and the mark's box at one name", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      root: {
        gap: "calc({spacing.gap.md} * var(--density, 1))",
        padding: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "body.md",
      },
    });
  });

  it("wraps a long word rather than pushing the aside off the end", () => {
    expect(recipe.base?.["content"]).toMatchObject({ minInlineSize: "0" });
  });

  it("leaves the mark the root's ink so a solid alert marks itself in the measured pair", () => {
    expect(recipe.base?.["indicator"]).not.toHaveProperty("color");
  });

  it("tracks the alert and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Alert(\.\w+)?$/u]);
  });
});
