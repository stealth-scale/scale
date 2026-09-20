import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#field/recipe.ts";

const PARTS = [
  "root",
  "label",
  "requiredIndicator",
  "control",
  "helperText",
  "counter",
  "errorText",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Field.Root", "Field.Label", "Field.Control"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class field", () => {
    expect(recipe.className).toBe("field");
  });

  it("styles the seven parts a field draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers an orientation axis and a size axis and a status axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size", "status"]);
  });

  it("stacks the label above the control at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "vertical", size: "md" });
  });

  it("offers the two places a label sits", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("stacks every part but the label under the control when the label sits beside it", () => {
    const horizontal = recipe.variants?.["orientation"]?.["horizontal"];

    expect(horizontal?.["root"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
    });

    expect(horizontal?.["control"]).toStrictEqual({ gridColumn: "2" });
    expect(horizontal?.["helperText"]).toStrictEqual({ gridColumn: "2" });
    expect(horizontal?.["counter"]).toStrictEqual({ gridColumn: "2" });
    expect(horizontal?.["errorText"]).toStrictEqual({ gridColumn: "2" });
    expect(horizontal?.["label"]).not.toHaveProperty("gridColumn");
  });

  it("draws the message and the required mark in the palette the status sets", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({ color: "colorPalette.fg" });
    expect(recipe.base?.["requiredIndicator"]).toMatchObject({ color: "colorPalette.fg" });
  });

  it("points a field at the error palette until a caller states another status", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "error" });
  });

  it("wraps a long word rather than pushing the control out of the field", () => {
    expect(recipe.base?.["control"]).toMatchObject({ minInlineSize: "0" });
  });

  it("tracks the field and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Field(\.\w+)?$/u]);
  });
});
