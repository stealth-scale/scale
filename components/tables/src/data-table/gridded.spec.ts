import { describe, expect, it } from "vitest";

import { EDITOR, EDITOR_ERROR, GRIDDED } from "#data-table/gridded.ts";
import { ROW_FILL } from "#data-table/properties.ts";

describe("gridded", () => {
  it("paints a selected cell in the palette's subtle role over its row", () => {
    expect(GRIDDED).toMatchObject({
      "&[aria-selected=true]": {
        backgroundImage: "linear-gradient(var(--table-row-fill), var(--table-row-fill))",
        [ROW_FILL]: "colors.colorPalette.subtle",
      },
    });
  });

  it("fills a selected cell with Highlight over Canvas under forced colors", () => {
    expect(GRIDDED).toMatchObject({
      "&[aria-selected=true]:not([data-editing])": {
        _highContrast: {
          backgroundColor: "Canvas",
          color: "HighlightText",
          focusRingColor: "HighlightText",
          forcedColorAdjust: "none",
          [ROW_FILL]: "Highlight",
        },
      },
    });
  });

  it("leaves a selected cell whose editor is open to the forced colors of its field", () => {
    expect(Object.keys(GRIDDED["&[aria-selected=true]"] ?? {})).not.toContain("_highContrast");
  });

  it("hides the selection line of a cell whose editor is open", () => {
    expect(GRIDDED).toMatchObject({ "&[data-editing]": { _after: { display: "none" } } });
  });

  it("lays the selection's edge over a cell in the palette's solid", () => {
    expect(GRIDDED).toMatchObject({
      "&[data-edges]": {
        _after: {
          borderColor: "colorPalette.solid",
          borderStyle: "solid",
          inset: "0",
          pointerEvents: "none",
          position: "absolute",
        },
      },
    });
  });

  it("positions a cell with an edge line an editor or an unsaved mark that is not pinned", () => {
    expect(GRIDDED).toMatchObject({
      "&:is([data-edges], [data-editing], [data-unsaved]):not([data-pinned])": {
        position: "relative",
      },
    });
  });

  it.each([
    { property: "borderBlockStartWidth", side: "block-start" },
    { property: "borderInlineEndWidth", side: "inline-end" },
    { property: "borderBlockEndWidth", side: "block-end" },
    { property: "borderInlineStartWidth", side: "inline-start" },
  ])(
    "rules a cell's $side side at the indicator width while the side is on the selection's edge",
    ({ property, side }) => {
      expect(GRIDDED).toMatchObject({
        "&[data-edges]": { _after: { [property]: `var(--edge-${side}, 0)` } },
        [`&[data-edges~=${side}]`]: { [`--edge-${side}`]: "borderWidths.indicator" },
      });
    },
  );

  it("rings a cell with the tab stop inside its edge under keyboard focus", () => {
    expect(GRIDDED).toMatchObject({
      "&[tabindex]": {
        _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
        focusRingColor: "colorPalette.focusRing",
        focusVisibleRing: "inside",
      },
    });
  });

  it("marks an unsaved cell's inline start with a bar in the warning palette", () => {
    expect(GRIDDED).toMatchObject({
      "&[data-unsaved]": {
        _before: { background: "warning.solid", insetInlineStart: "0", position: "absolute" },
      },
    });
  });

  it("paints an unsaved cell's bar CanvasText under forced colors", () => {
    expect(GRIDDED).toMatchObject({
      "&[data-unsaved]": {
        _before: { _highContrast: { background: "CanvasText", forcedColorAdjust: "none" } },
      },
    });
  });

  it("lays an editor over its cell's padding box", () => {
    expect(EDITOR).toMatchObject({ display: "flex", inset: "0", position: "absolute" });
  });

  it("fills the cell with the editor's control and starts its text at the cell's inset", () => {
    expect(EDITOR).toMatchObject({
      "& > :first-child": {
        "--control-inset-end": "calc(var(--table-cell-inset) - {borderWidths.control})",
        "--control-inset-start": "calc(var(--table-cell-inset) - {borderWidths.control})",
        maxBlockSize: "full",
        minBlockSize: "full",
      },
    });
  });

  it("squares the editor's control to its cell", () => {
    expect(EDITOR).toMatchObject({ "& > :first-child": { borderRadius: "none" } });
  });

  it("ends an editor's text in a column of figures", () => {
    expect(EDITOR).toMatchObject({ "[data-numeric] > &": { "& input": { textAlign: "end" } } });
  });

  it("lays a refused value's reason under the cell in the error inks", () => {
    expect(EDITOR_ERROR).toMatchObject({
      borderColor: "border.error",
      color: "fg.error",
      insetBlockStart: "100%",
      position: "absolute",
    });
  });

  it("lays a refused value's reason above the cell in a body's last row", () => {
    expect(EDITOR_ERROR).toMatchObject({
      "tr:last-child > * > * > &": {
        insetBlockEnd: "100%",
        insetBlockStart: "auto",
        marginBlockStart: "0",
      },
    });
  });

  it("sizes a refused value's reason to its words up to sizes.xs", () => {
    expect(EDITOR_ERROR).toMatchObject({ inlineSize: "max-content", maxInlineSize: "xs" });
  });

  it("lays a refused value's reason from the cell's end in a column of figures", () => {
    expect(EDITOR_ERROR).toMatchObject({
      "[data-numeric] > * > &": { insetInlineEnd: "0", insetInlineStart: "auto" },
    });
  });
});
