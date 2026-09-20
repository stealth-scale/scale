import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#fieldset/recipe.ts";

const PARTS = ["root", "legend", "helperText", "errorText"];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Fieldset.Root", "Fieldset.Legend"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class fieldset", () => {
    expect(recipe.className).toBe("fieldset");
  });

  it("styles the four parts a group draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers an orientation axis and a size axis and a status axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size", "status"]);
  });

  it("stacks the fields at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "vertical", size: "md" });
  });

  it("offers the two ways the fields inside a group run", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("shares a row between the fields across a group and gives each text a row of its own", () => {
    const horizontal = recipe.variants?.["orientation"]?.["horizontal"];

    expect(horizontal?.["root"]).toStrictEqual({
      "& > *": { flexBasis: "48", flexGrow: "1" },
      flexFlow: "row wrap",
    });
    expect(horizontal?.["helperText"]).toStrictEqual({ minInlineSize: "full" });
    expect(horizontal?.["errorText"]).toStrictEqual({ minInlineSize: "full" });
  });

  it("clears the browser's own border and inset from the element", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderStyle: "none",
      margin: "0",
      padding: "0",
    });
  });

  it("points a group at the error palette until a caller states another status", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "error" });
  });

  it("tracks the group and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Fieldset(\.\w+)?$/u]);
  });
});
