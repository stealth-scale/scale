import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#listbox/listbox.specimen.tsx";
import { recipe } from "#listbox/recipe.ts";
import { SELECTED } from "#listbox/selected.ts";

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
        names: ["Listbox"],
        parts: [
          "root",
          "label",
          "input",
          "content",
          "control",
          "clearTrigger",
          "item",
          "itemText",
          "itemIndicator",
          "itemGroup",
          "itemGroupLabel",
          "valueText",
          "frame",
          "itemLines",
          "itemDescription",
          "itemCheckbox",
          "empty",
          "selectAll",
          "viewport",
          "rows",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name listbox", () => {
    expect(recipe.className).toBe("listbox");
  });

  it("declares twenty slots", () => {
    expect(recipe.slots).toHaveLength(20);
  });

  it("declares nine axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "columns",
      "effect",
      "highlight",
      "orientation",
      "palette",
      "radius",
      "selected",
      "size",
      "variant",
    ]);
  });

  it("defaults to a plain vertical list at size md with a tint highlight and a subtle fill", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      orientation: "vertical",
      radius: "l1",
      selected: "subtle",
      size: "md",
      variant: "plain",
    });
  });

  it("offers the eight palettes", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["primary"]).toStrictEqual({
      root: { colorPalette: "primary" },
    });
  });

  it("glows a selected row under the glow effect", () => {
    expect(recipe.variants?.["effect"]?.["glow"]?.["item"]).toStrictEqual({
      _selected: { layerStyle: "glow.sm" },
    });
  });

  it("offers three highlights", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("marks the highlighted row under the tint highlight", () => {
    expect(recipe.variants?.["highlight"]?.["tint"]?.["item"]).toMatchObject({
      _highlighted: { layerStyle: "fill.muted" },
    });
  });

  it("hides the content while it has no rows", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "&:has(.listbox__rows:empty)": { display: "none" },
    });
  });

  it("aligns the empty text to the start", () => {
    expect(recipe.base?.["empty"]).toMatchObject({ textAlign: "start" });
  });

  it("fills a checkbox from its parent row's state only", () => {
    const rules = Object.keys(recipe.base?.["itemCheckbox"] ?? {}).filter((one) =>
      one.includes("&"),
    );

    expect(rules).toStrictEqual([
      "[data-selected] > &, [data-state=checked] > &, [data-state=indeterminate] > &",
    ]);
  });

  it("edges a checkbox in CanvasText under forced colors", () => {
    expect(recipe.base?.["itemCheckbox"]?.["_highContrast"]).toStrictEqual({
      borderColor: "CanvasText",
      forcedColorAdjust: "none",
    });
  });

  it("fills a checked checkbox with CanvasText under forced colors", () => {
    expect(recipe.base?.["itemCheckbox"]).toMatchObject({
      "[data-selected] > &, [data-state=checked] > &, [data-state=indeterminate] > &": {
        _highContrast: { background: "CanvasText", borderColor: "CanvasText", color: "Canvas" },
      },
    });
  });

  it("reads the selected axis from SELECTED", () => {
    expect(recipe.variants?.["selected"]).toStrictEqual(SELECTED);
  });

  it("moves the scroll area's focus ring inside the content's edge", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "--scroll-area-ring-offset": "calc({borderWidths.ring} * -1)",
    });
  });

  it("leaves the scrolling to the scroll area inside the content", () => {
    expect(recipe.base?.["content"]).not.toHaveProperty("overflowY");
  });

  it("keeps a revealed row the list's padding from the viewport's edge", () => {
    expect(recipe.base?.["viewport"]).toStrictEqual({ scrollPadding: "{spacing.gap.xs}" });
  });

  it("sets no scrolling on the root", () => {
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("centres a row's parts on its height", () => {
    expect(recipe.base?.["item"]).toMatchObject({ alignItems: "center" });
  });

  it("grows a row's text into the width the row leaves", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({ flex: "1", minInlineSize: "0" });
  });

  it("truncates a row's text", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("sets the surface look on the frame", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["frame"]).toMatchObject({
      background: "bg.panel",
      borderRadius: "l2",
    });
  });

  it("sets the surface look on no other slot", () => {
    expect(Object.keys(recipe.variants?.["variant"]?.["surface"] ?? {})).toStrictEqual(["frame"]);
  });

  it("clips the frame's overflow", () => {
    expect(recipe.base?.["frame"]).toMatchObject({ overflow: "hidden" });
  });

  it("runs the rows of a horizontal list in a row", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["rows"]).toStrictEqual({
      flexDirection: "row",
    });
  });

  it("pads the rows in every look", () => {
    expect(recipe.base?.["rows"]).toMatchObject({ padding: "{spacing.gap.xs}" });
  });

  it("tiles the rows of a list with columns", () => {
    expect(recipe.variants?.["columns"]?.["2"]).toMatchObject({ rows: { display: "grid" } });
  });

  it("sets the row height on the content", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["content"]).toHaveProperty("--listbox-row");
  });

  it("sets no padding on a plain frame", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["frame"]).not.toHaveProperty("padding");
  });

  it("pads a row with the inset at both ends", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toMatchObject({
      paddingInline: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("starts the text of the field and the select-all row on the rows' text line", () => {
    const start = {
      paddingInlineStart: "calc({spacing.gap.xs} + calc({spacing.inset.md} * var(--density, 1)))",
    };

    expect(recipe.variants?.["size"]?.["md"]?.["selectAll"]).toMatchObject(start);
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject(start);
  });

  it("ends the field and the select-all row at a row's end inset", () => {
    const end = {
      paddingInlineEnd: "calc({spacing.gap.xs} + calc({spacing.inset.md} * var(--density, 1)))",
    };

    expect(recipe.variants?.["size"]?.["md"]?.["selectAll"]).toMatchObject(end);
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject(end);
  });

  it("sets no margin on the field or the select-all row", () => {
    const bands = JSON.stringify([
      recipe.variants?.["size"]?.["md"]?.["selectAll"],
      recipe.variants?.["size"]?.["md"]?.["control"],
    ]);

    expect(bands).not.toContain("margin");
  });

  it("starts the parts outside the rows on the rows' text line", () => {
    const inset = {
      paddingInlineStart: "calc({spacing.gap.xs} + calc({spacing.inset.md} * var(--density, 1)))",
    };

    expect(recipe.variants?.["size"]?.["md"]?.["empty"]).toMatchObject(inset);

    expect(recipe.variants?.["size"]?.["md"]?.["label"]).toMatchObject(inset);
    expect(recipe.variants?.["size"]?.["md"]?.["valueText"]).toMatchObject(inset);
  });

  it("sets the block-end rule on the control", () => {
    expect(recipe.base?.["control"]).toMatchObject({ borderBlockEndWidth: "hairline" });
  });

  it("sets no border on the field", () => {
    expect(recipe.base?.["input"]).not.toHaveProperty("borderBlockEndWidth");
  });

  it("tracks JSX named Listbox and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Listbox(\.\w+)?$/u]);
  });
});
