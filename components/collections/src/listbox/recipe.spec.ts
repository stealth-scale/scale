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
          // The machine stamps a part for the field alone. The band it stands in and the control
          // that empties it are this recipe's, because a field from another package brings a box
          // of its own and the band has to own the width the rule under it reaches.
          "control",
          "clearTrigger",
          "item",
          "itemText",
          "itemIndicator",
          "itemGroup",
          "itemGroupLabel",
          "valueText",
          // The machine stamps no part for these five. They carry nothing of it: a column that
          // holds a row's two lines together, the second line itself, the box that says a row is
          // in the set, the words a list says when it holds nothing, and the band that turns the
          // whole list on. Each reads the list's own state and is listed here so the check still
          // reports a machine part with no slot and a slot named for nothing.
          "itemLines",
          "itemDescription",
          "itemCheckbox",
          "empty",
          "selectAll",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("names its class listbox", () => {
    expect(recipe.className).toBe("listbox");
  });

  it("styles the seventeen parts a listbox draws", () => {
    expect(recipe.slots).toHaveLength(17);
  });

  it("offers the seven axes a listbox takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "columns",
      "highlight",
      "orientation",
      "radius",
      "selected",
      "size",
      "variant",
    ]);
  });

  it("draws a plain list of picked rows tinted at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      orientation: "vertical",
      radius: "l1",
      selected: "subtle",
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

  it("raises the list itself rather than the frame that also holds the label", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      overflowX: "clip",
    });
    expect(recipe.variants?.["variant"]?.["surface"]).not.toHaveProperty("root");
  });

  it("gives a raised list the axis it scrolls along back where the rows run across", () => {
    expect(recipe.compoundVariants).toContainEqual(
      expect.objectContaining({
        css: { content: { overflowX: "auto" } },
        orientation: "horizontal",
        variant: "surface",
      }),
    );
  });

  it("leaves the room a highlight is drawn in whatever look the list is drawn in", () => {
    expect(recipe.base?.["content"]).toHaveProperty("padding");
    expect(recipe.variants?.["variant"]?.["plain"]?.["content"]).not.toHaveProperty("padding");
  });

  it("takes that room back on a band so a header reaches both edges", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["selectAll"]).toMatchObject({
      inlineSize: "auto",
      marginInline: "calc({spacing.gap.xs} * -1)",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      inlineSize: "auto",
      marginInline: "calc({spacing.gap.xs} * -1)",
    });
  });

  it("indents what stands outside the list onto the line a row's words start on", () => {
    const inset = {
      paddingInlineStart: "calc({spacing.gap.xs} + calc({spacing.gap.md} * var(--density, 1)))",
    };

    expect(recipe.variants?.["size"]?.["md"]?.["label"]).toMatchObject(inset);
    expect(recipe.variants?.["size"]?.["md"]?.["valueText"]).toMatchObject(inset);
  });

  it("moves the rule under the field onto the band rather than the field", () => {
    expect(recipe.base?.["control"]).toMatchObject({ borderBlockEndWidth: "hairline" });
    expect(recipe.base?.["input"]).not.toHaveProperty("borderBlockEndWidth");
  });

  it("tracks every tag under the Listbox namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Listbox(\.\w+)?$/u]);
  });
});
