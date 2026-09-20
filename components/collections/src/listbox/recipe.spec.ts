import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#listbox/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Listbox"],
        parts: [
          "root",
          "label",
          "input",
          "content",
          "item",
          "itemText",
          "itemIndicator",
          "itemGroup",
          "itemGroupLabel",
          "valueText",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("names its class listbox", () => {
    expect(recipe.className).toBe("listbox");
  });

  it("styles the ten parts a listbox draws", () => {
    expect(recipe.slots).toHaveLength(10);
  });

  it("offers the four axes a listbox takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["highlight", "radius", "size", "variant"]);
  });

  it("draws a plain list at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      radius: "l1",
      size: "md",
      variant: "plain",
    });
  });

  it("offers the three marks a menu offers for the row a reader is on", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("marks the highlighted row rather than the focused one", () => {
    expect(recipe.variants?.["highlight"]?.["tint"]?.["item"]).toMatchObject({
      _highlighted: { layerStyle: "fill.muted" },
    });
  });

  it("scrolls the list rather than the frame around it", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overflowY: "auto" });
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("cuts a row's words short rather than wrapping them", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("clips a raised list so its rows keep its corners", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      overflow: "clip",
    });
  });

  it("tracks every tag under the Listbox namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Listbox(\.\w+)?$/u]);
  });
});
