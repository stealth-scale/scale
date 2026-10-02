import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#fieldset/fieldset.specimen.tsx";
import { recipe } from "#fieldset/recipe.ts";

const PARTS = ["root", "legend", "helperText", "errorText"];

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Fieldset.Root", "Fieldset.Legend"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name fieldset", () => {
    expect(recipe.className).toBe("fieldset");
  });

  it("declares the four slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size", "status"]);
  });

  it("defaults to a vertical group at size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "vertical", size: "md" });
  });

  it("offers two orientations", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("floats the legend so the root's gap reaches it", () => {
    expect(recipe.base?.["legend"]).toMatchObject({
      float: "inline-start",
      inlineSize: "full",
      padding: "0",
    });
  });

  it("wraps a horizontal group's fields and gives the legend and texts a row each", () => {
    const horizontal = recipe.variants?.["orientation"]?.["horizontal"];

    expect(horizontal?.["root"]).toStrictEqual({
      "& > *": { flexBasis: "48", flexGrow: "1" },
      flexFlow: "row wrap",
    });
    expect(horizontal?.["legend"]).toStrictEqual({ minInlineSize: "full" });
    expect(horizontal?.["helperText"]).toStrictEqual({ minInlineSize: "full" });
    expect(horizontal?.["errorText"]).toStrictEqual({ minInlineSize: "full" });
  });

  it("sets the md texts in the sm body role at the snug line height", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["helperText"]).toStrictEqual({
      lineHeight: "snug",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["errorText"]).toMatchObject({
      lineHeight: "snug",
      textStyle: "body.sm",
    });
  });

  it("sets the md legend in the sm heading role", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["legend"]).toStrictEqual({
      textStyle: "heading.sm",
    });
  });

  it("leaves the legend's weight to the heading role", () => {
    expect(recipe.base?.["legend"]).not.toHaveProperty("fontWeight");
  });

  it("centres an error text's mark on its first line", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({
      "& > svg": { marginBlockStart: "calc((1lh - 1em) / 2)" },
      alignItems: "start",
    });
  });

  it("clears the fieldset element's border padding margin and minimum width", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    });
  });

  it("defaults the error text to the error palette", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "error" });
  });

  it("tracks JSX named Fieldset and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Fieldset(\.\w+)?$/u]);
  });
});
