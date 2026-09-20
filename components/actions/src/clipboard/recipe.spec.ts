import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#clipboard/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Clipboard"] })).toStrictEqual([]);
  });

  it("names its class clipboard", () => {
    expect(recipe.className).toBe("clipboard");
  });

  it("draws the seven parts a clipboard is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "control",
      "indicator",
      "input",
      "label",
      "root",
      "trigger",
      "valueText",
    ]);
  });

  it("offers the one axis a clipboard takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the three sizes a label and a control row are set at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("sets the label's role and the gaps together at each size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      control: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      label: { textStyle: "label.md" },
      root: { gap: "calc({spacing.gap.sm} * var(--density, 1))" },
    });
  });

  it("stacks the label over the control row", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "flex", flexDirection: "column" });
  });

  it("draws no control look on the trigger because the caller draws it as a button", () => {
    expect(recipe.base?.["trigger"]).toBeUndefined();
  });

  it("tracks the tag named Clipboard and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Clipboard(\.\w+)?$/u]);
  });
});
