import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import {
  CLIPPED,
  FILL,
  LIT,
  OVERFLOW,
  RAMP,
  READOUT_X,
  READOUT_Y,
  recipe,
  SHOWN,
} from "#heat/recipe.ts";
import page from "#heatmap/heatmap.specimen.tsx";

/**
 * Returns the base styles of one slot.
 */
function base(slot: string): Readonly<Record<string, unknown>> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a slot recipe's base maps each slot to its styles
  return (recipe.base as Readonly<Record<string, Readonly<Record<string, unknown>>>>)[slot] ?? {};
}

describe("recipe", () => {
  it("covers every variant axis in the scenes of the heatmap's specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Heatmap"] })).toStrictEqual([]);
  });

  it("sets className to heat", () => {
    expect(recipe.className).toBe("heat");
  });

  it("declares the shape and the size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["shape", "size"]);
  });

  it("offers the block and the square shape", () => {
    expect(valuesOf(recipe, "shape")).toStrictEqual(["block", "square"]);
  });

  it("offers the small the middle and the large size", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("defaults to middle blocks", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ shape: "block", size: "md" });
  });

  it("sets a middle block's side to 32px", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      cell: { "--heat-block": "calc({sizes.8} * var(--density, 1))" },
    });
  });

  it("sets a middle square's side to 14px", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      cell: { "--heat-square": "calc({sizes.3.5} * var(--density, 1))" },
    });
  });

  it("sets a large square's side to the 24px of a pointer target", () => {
    expect(recipe.variants?.["size"]?.["lg"]).toMatchObject({
      cell: { "--heat-square": "calc({sizes.6} * var(--density, 1))" },
    });
  });

  it("sizes a block from its side and at least as wide", () => {
    expect(recipe.variants?.["shape"]?.["block"]).toStrictEqual({
      cell: { blockSize: "var(--heat-block)", minInlineSize: "var(--heat-block)" },
    });
  });

  it("sizes a square from its side", () => {
    expect(recipe.variants?.["shape"]?.["square"]).toMatchObject({
      cell: { boxSize: "var(--heat-square)" },
    });
  });

  it("keeps a square's side as its least width in a table narrower than its columns", () => {
    expect(recipe.variants?.["shape"]?.["square"]).toMatchObject({
      cell: { minInlineSize: "var(--heat-square)" },
    });
  });

  it("rounds a square's corners by the fixed extra-small radius", () => {
    expect(recipe.variants?.["shape"]?.["square"]).toMatchObject({
      cell: { borderRadius: "xs" },
    });
  });

  it("gives the row headings beside squares no height of their own", () => {
    expect(recipe.compoundVariants?.[0]).toStrictEqual({
      className: "heat__row-heading--squared",
      css: { rowHeading: { lineHeight: "0" } },
      shape: "square",
    });
  });

  it("writes the headings and values of a middle grid one text size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      columnHeading: { textStyle: "label.sm" },
      rowHeading: { textStyle: "label.sm" },
      value: { textStyle: "body.sm" },
    });
  });

  it("fills a cell from its custom property", () => {
    expect(base("cell")).toMatchObject({ backgroundColor: `var(${FILL}, transparent)` });
  });

  it("dashes the edge of a cell without a value", () => {
    expect(base("cell")).toMatchObject({
      "&[data-state=missing]": { borderColor: "border", borderStyle: "dashed" },
    });
  });

  it("outlines the cell the readout shows in the ink inside its edge", () => {
    expect(base("cell")).toMatchObject({
      [`&[${SHOWN}]:not(:focus-visible)`]: {
        outlineColor: "fg",
        outlineOffset: "calc({borderWidths.indicator} * -1)",
      },
    });
  });

  it("prints a value in the ink contrast-color picks against the cell's fill", () => {
    expect(base("value")).toMatchObject({ color: `contrast-color(var(${FILL}))` });
  });

  it("keeps a cell's fill under forced colors", () => {
    expect(base("cell")).toMatchObject({ forcedColorAdjust: "none" });
  });

  it("edges a cell without a value in GrayText under forced colors", () => {
    expect(base("cell")).toMatchObject({
      _highContrast: { "&[data-state=missing]": { borderColor: "GrayText" } },
    });
  });

  it("places a group's words out of the table's layout", () => {
    expect(base("groupLabel")).toMatchObject({ position: "absolute" });
  });

  it("hides a group's words wider than the group from sight", () => {
    expect(base("groupLabel")).toMatchObject({ [`&[${OVERFLOW}]`]: { opacity: "0" } });
  });

  it("starts a group's words at its first column", () => {
    expect(base("groupLabel")).toMatchObject({ insetInlineStart: "0" });
  });

  it("sets the cells 2px apart on the panel", () => {
    expect(base("grid")).toStrictEqual({
      borderCollapse: "separate",
      borderSpacing: "{spacing.0.5}",
    });
  });

  it("lights a column heading with the neutral palette's subtle fill", () => {
    expect(base("columnHeading")).toMatchObject({
      [`&[${LIT}]`]: { background: "neutral.subtle", color: "fg" },
    });
  });

  it("lights a heading with Highlight under forced colors", () => {
    expect(base("rowHeading")).toMatchObject({
      [`&[${LIT}]`]: { _highContrast: { background: "Highlight", color: "HighlightText" } },
    });
  });

  it("makes the row headings sticky at the start of the grid", () => {
    expect(base("rowHeading")).toMatchObject({
      insetInlineStart: "0",
      position: "sticky",
    });
  });

  it("aligns a row heading's words to its end beside the cells", () => {
    expect(base("rowHeading")).toMatchObject({ textAlign: "end" });
  });

  it("aligns the corner's words to its end over the row headings", () => {
    expect(base("columnHeading")).toMatchObject({ "&:first-child": { textAlign: "end" } });
  });

  it("aligns the key to the grid's end", () => {
    expect(base("key")).toMatchObject({ alignSelf: "end" });
  });

  it("insets the key's end by the spacing around the outer cells", () => {
    expect(base("key")).toMatchObject({ marginInlineEnd: "{spacing.0.5}" });
  });

  it("makes the corner sticky at the start of the grid", () => {
    expect(base("columnHeading")).toMatchObject({
      "&:first-child": { insetInlineStart: "0", position: "sticky" },
    });
  });

  it("places the readout from its custom properties", () => {
    expect(base("readout")).toMatchObject({
      left: `var(${READOUT_X})`,
      top: `var(${READOUT_Y})`,
    });
  });

  it("hides the readout while its cell is out of view", () => {
    expect(base("readout")).toMatchObject({ [`&[${CLIPPED}]`]: { visibility: "hidden" } });
  });

  it("lets the pointer through the readout", () => {
    expect(base("readout")).toMatchObject({ pointerEvents: "none" });
  });

  it("runs the key's bar from its custom property from the reading start", () => {
    expect(base("bar")).toMatchObject({
      _rtl: { backgroundImage: `linear-gradient(to left, var(${RAMP}))` },
      backgroundImage: `linear-gradient(to right, var(${RAMP}))`,
    });
  });

  it("writes a diverging key's midpoint under the middle of the bar", () => {
    expect(base("midpoint")).toStrictEqual({
      gridColumn: "3",
      gridRow: "2",
      justifySelf: "center",
    });
  });

  it("matches the heatmap's tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Heatmap$/u]);
  });
});
