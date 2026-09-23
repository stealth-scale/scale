import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#listbox/listbox.specimen.tsx";
import { recipe } from "#listbox/recipe.ts";

describe("recipe", () => {
  it("collapses the rows where there are none so the empty line reads as the first row", () => {
    expect(recipe.base?.["content"]).toMatchObject({ "&:empty": { display: "none" } });
    expect(recipe.base?.["empty"]).toMatchObject({ textAlign: "start" });
  });

  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("fills a row's box from that row alone rather than from any ancestor", () => {
    const rules = Object.keys(recipe.base?.["itemCheckbox"] ?? {}).filter((one) =>
      one.includes("&"),
    );

    expect(rules).toStrictEqual([
      "[data-selected] > &, [data-state=checked] > &, [data-state=indeterminate] > &",
    ]);
  });

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
          // The machine stamps no part for these six. They carry nothing of it: the box the list
          // is drawn in, a column that holds a row's two lines together, the second line itself,
          // the box that says a row is in the set, the words a list says when it holds nothing,
          // and the band that turns the whole list on. Each reads the list's own state and is
          // listed here so the check still reports a machine part with no slot and a slot named
          // for nothing.
          "frame",
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

  it("styles the eighteen parts a listbox draws", () => {
    expect(recipe.slots).toHaveLength(18);
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

  it("raises the box the field and the rows share rather than the whole list", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["frame"]).toMatchObject({
      background: "bg.panel",
      borderRadius: "l2",
    });
    expect(recipe.variants?.["variant"]?.["surface"]).not.toHaveProperty("root");
    expect(recipe.variants?.["variant"]?.["surface"]).not.toHaveProperty("content");
  });

  it("cuts the rows back to the box's corner rather than to the list's", () => {
    expect(recipe.base?.["frame"]).toMatchObject({ overflow: "hidden" });
    expect(recipe.base?.["content"]).toMatchObject({ overflowY: "auto" });
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
    expect(recipe.variants?.["variant"]?.["plain"]?.["frame"]).not.toHaveProperty("padding");
  });

  it("starts a band's words on the line a row's words start on", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["selectAll"]).toMatchObject({
      paddingInlineStart: "calc({spacing.gap.xs} + calc({spacing.gap.md} * var(--density, 1)))",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      paddingInlineStart: "calc({spacing.gap.xs} + calc({spacing.gap.md} * var(--density, 1)))",
    });
  });

  it("ends every band where a row ends", () => {
    const ends = "calc({spacing.gap.xs} + calc({spacing.inset.md} * var(--density, 1)))";

    expect(recipe.variants?.["size"]?.["md"]?.["selectAll"]).toMatchObject({
      paddingInlineEnd: ends,
    });
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      paddingInlineEnd: ends,
    });
  });

  it("pulls no band out of the box it is drawn in", () => {
    const bands = JSON.stringify([
      recipe.variants?.["size"]?.["md"]?.["selectAll"],
      recipe.variants?.["size"]?.["md"]?.["control"],
    ]);

    expect(bands).not.toContain("marginInline");
    expect(bands).not.toContain("marginBlockStart");
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
