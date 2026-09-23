import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#input-group/input-group.specimen.tsx";
import { recipe } from "#input-group/recipe.ts";

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
        names: [
          "InputGroup.Root",
          "InputGroup.Row",
          "InputGroup.Field",
          "InputGroup.Mark",
          "InputGroup.Addon",
        ],
        parts: ["root", "row", "field", "mark", "addon"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name input-group", () => {
    expect(recipe.className).toBe("input-group");
  });

  it("declares the root row field mark and addon slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "row", "field", "mark", "addon"]);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "size", "status", "variant"]);
  });

  it("defaults to a centred outline box at size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ align: "center", size: "md", variant: "outline" });
  });

  it("offers the eight control sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("offers three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["flushed", "outline", "subtle"]);
  });

  it("lays the root out as a row", () => {
    expect(recipe.base?.["root"]).toMatchObject({ display: "flex", inlineSize: "full" });
  });

  it("strips the field of every box style", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      background: "transparent",
      borderStyle: "none",
      outline: "none",
      padding: "0",
    });
  });

  it("lets a field with a size attribute keep that width", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      "&[size]": { flex: "none", inlineSize: "auto" },
    });
  });

  it("sets the md field one control height less both edges", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["field"]).toMatchObject({
      blockSize: "calc(calc({sizes.control.md} * var(--density, 1)) - {borderWidths.control} * 2)",
    });
  });

  it("sets the md inset one size smaller than the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--input-group-inset": "calc({spacing.inset.sm} * var(--density, 1))",
    });
  });

  it("sets the flushed inset to the smallest inset", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]?.["root"]).toMatchObject({
      "--input-group-inset": "calc({spacing.inset.xs} * var(--density, 1))",
    });
  });

  it("pads the root by the inset", () => {
    expect(recipe.base?.["root"]).toMatchObject({ paddingInline: "var(--input-group-inset)" });
  });

  it("sizes a mark's icon relative to the group's text", () => {
    expect(recipe.base?.["mark"]).toMatchObject({ "& svg": { boxSize: "1.25em" } });
  });

  it("draws a divider on an addon's inner side in the edge color", () => {
    expect(recipe.base?.["addon"]).toMatchObject({
      "&:not(:first-child)": { borderInlineStartColor: "var(--field-edge)" },
      "&:not(:last-child)": { borderInlineEndColor: "var(--field-edge)" },
    });
  });

  it("pulls an addon at the start onto the box's edge", () => {
    expect(recipe.base?.["addon"]).toMatchObject({
      "&:first-child": { marginInlineStart: "calc(var(--input-group-inset) * -1)" },
    });
  });

  it("insets a field beside an addon by the inset", () => {
    expect(recipe.base?.["addon"]).toMatchObject({
      "&:not(:last-child)": { marginInlineEnd: "calc(var(--input-group-inset) - 0.5em)" },
    });
  });

  it("fills a filled addon one surface step darker than an outline box", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["addon"]).toStrictEqual({
      "&[data-look=filled]": { background: "bg.subtle" },
    });
  });

  it("fills a filled addon one surface step darker than a subtle box", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["addon"]).toStrictEqual({
      "&[data-look=filled]": { background: "bg.muted" },
    });
  });

  it("sets no fill on an addon in the base", () => {
    expect(recipe.base?.["addon"]).not.toHaveProperty("background");
  });

  it("draws a divider with the inset on both sides between two adjacent fields", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      "& + &": {
        borderInlineStartColor: "var(--field-edge)",
        marginInlineStart: "calc(var(--input-group-inset) - 0.5em)",
        paddingInlineStart: "var(--input-group-inset)",
      },
    });
  });

  it("paints the divider between two fields in CanvasText under forced colors", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      "& + &": { _highContrast: { borderInlineStartColor: "CanvasText" } },
    });
  });

  it("pulls a button at the end of the row to 4px from the edge", () => {
    expect(recipe.base?.["mark"]).toMatchObject({
      "&:last-child:has(> :is(a, button))": {
        marginInlineEnd: "calc({spacing.1} - var(--input-group-inset))",
      },
    });
  });

  it("stacks the rows of a root that contains rows and hands the inset to them", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&:has(> .input-group__row)": { flexDirection: "column", paddingInline: "0" },
    });
    expect(recipe.base?.["row"]).toMatchObject({ paddingInline: "var(--input-group-inset)" });
  });

  it("draws a divider in the edge color above every row after the first", () => {
    expect(recipe.base?.["row"]).toMatchObject({
      "&:not(:first-child)": { borderBlockStartColor: "var(--field-edge)" },
    });
  });

  it("squares an addon's corners on the side a row shares with another row", () => {
    expect(recipe.base?.["row"]).toMatchObject({
      "&:not(:first-child) > .input-group__addon": { borderStartStartRadius: "0" },
      "&:not(:last-child) > .input-group__addon": { borderEndStartRadius: "0" },
    });
  });

  it("sets the gap between items to half the text size", () => {
    expect(recipe.base?.["root"]).toMatchObject({ columnGap: "0.5em" });
    expect(recipe.base?.["row"]).toMatchObject({ columnGap: "0.5em" });
  });

  it("grows a field from zero into the free width", () => {
    expect(recipe.base?.["field"]).toMatchObject({ flex: "1 1 0", inlineSize: "0" });
  });

  it("applies the wrapped field look to the root", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["root"]).toStrictEqual({
      layerStyle: "field.wrapped.subtle",
    });
  });

  it("tracks JSX named InputGroup and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^InputGroup(\.\w+)?$/u]);
  });
});
