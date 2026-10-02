import { describe, expect, it } from "vitest";

import { PALETTES, SERIES } from "@stealthscale/theme/authoring";

import { BASE, MARKER, SHARE, TINT, VARIANTS } from "#bar.ts";

describe("bar", () => {
  it("lays the track's range and segments along one row", () => {
    expect(BASE.track).toMatchObject({ display: "flex", position: "relative" });
  });

  it("places the marker at its custom property inside the track's ends", () => {
    expect(BASE.marker).toMatchObject({
      insetInlineStart: `clamp(0%, calc(var(${MARKER}) - {borderWidths.indicator} / 2), calc(100% - {borderWidths.indicator}))`,
      position: "absolute",
    });
  });

  it("extends the marker a quarter of the track's thickness past each side", () => {
    expect(BASE.marker).toMatchObject({ insetBlock: "-25%" });
  });

  it("paints the marker in the ink with an edge in the panel's color", () => {
    expect(BASE.marker).toMatchObject({
      backgroundColor: "fg",
      boxShadow: "0 0 0 {borderWidths.hairline} {colors.bg.panel}",
    });
  });

  it("paints the marker in CanvasText with a Canvas edge in forced colors mode", () => {
    expect(BASE.marker).toMatchObject({
      _highContrast: {
        backgroundColor: "CanvasText",
        boxShadow: "0 0 0 {borderWidths.hairline} Canvas",
        forcedColorAdjust: "none",
      },
    });
  });

  it("sizes a segment from its custom property", () => {
    expect(BASE.segment).toMatchObject({ inlineSize: `var(${SHARE})` });
  });

  it.each(SERIES)("fills the segment at place %s of every eight in that series color", (step) => {
    expect(BASE.segment).toHaveProperty([`&:where(:nth-of-type(8n + ${step}))`], {
      backgroundColor: `series.${step}`,
    });
  });

  it.each(SERIES)("fills a segment that states series %s in that series color", (step) => {
    expect(BASE.segment).toHaveProperty([`&[${TINT}="series.${step}"]`], {
      backgroundColor: `series.${step}`,
    });
  });

  it.each(PALETTES)("fills a segment that states %s in that palette's solid", (palette) => {
    expect(BASE.segment).toHaveProperty([`&[${TINT}=${palette}]`], {
      backgroundColor: "colorPalette.solid",
      colorPalette: palette,
    });
  });

  it("gives the first segment the start corners of the track", () => {
    expect(BASE.segment).toMatchObject({
      "&:first-of-type": { borderEndStartRadius: "inherit", borderStartStartRadius: "inherit" },
    });
  });

  it("gives the last segment the end corners of the track", () => {
    expect(BASE.segment).toMatchObject({
      "&:last-of-type": { borderEndEndRadius: "inherit", borderStartEndRadius: "inherit" },
    });
  });

  it("keeps the segments' colors in forced colors mode", () => {
    expect(BASE.segment).toMatchObject({ _highContrast: { forcedColorAdjust: "none" } });
  });

  it("parts adjacent segments with a Canvas hairline in forced colors mode", () => {
    expect(BASE.segment).toMatchObject({
      "& + &": {
        _highContrast: { borderInlineStartColor: "Canvas", borderInlineStartStyle: "solid" },
      },
    });
  });

  it("stops the segments' width transition under reduced motion", () => {
    expect(BASE.segment).toMatchObject({ _motionReduce: { transitionDuration: "0s" } });
  });

  it("places the label in the first column", () => {
    expect(BASE.label).toMatchObject({ gridColumn: "1" });
  });

  it("ends the value in the last column", () => {
    expect(BASE.valueText).toMatchObject({ gridColumn: "-2 / -1", justifySelf: "end" });
  });

  it("gives the range the track's corners", () => {
    expect(BASE.range).toMatchObject({ borderRadius: "inherit" });
  });

  it("fills the range with Highlight in forced colors mode", () => {
    expect(BASE.range).toMatchObject({
      _highContrast: { backgroundColor: "Highlight", forcedColorAdjust: "none" },
    });
  });

  it("outlines the track in CanvasText in forced colors mode", () => {
    expect(BASE.track).toMatchObject({
      _highContrast: { outlineColor: "CanvasText", outlineStyle: "solid" },
    });
  });

  it("stops the width transition under reduced motion", () => {
    expect(BASE.range).toMatchObject({ _motionReduce: { transitionDuration: "0s" } });
  });

  it("offers the layout palette shape size and variant axes", () => {
    expect(Object.keys(VARIANTS)).toStrictEqual(["layout", "palette", "shape", "size", "variant"]);
  });

  it("sizes the track's thickness from the gap scale", () => {
    expect(VARIANTS.size["md"]).toStrictEqual({
      track: { blockSize: "calc({spacing.gap.md} * var(--density, 1))" },
    });
  });

  it("spans the track across the row below the words when stacked", () => {
    expect(VARIANTS.layout.stacked).toStrictEqual({
      root: { gridTemplateColumns: "minmax(0, 1fr) auto" },
      track: { gridColumn: "1 / -1" },
    });
  });

  it("places the track between the words when inline", () => {
    expect(VARIANTS.layout.inline).toStrictEqual({
      root: { gridTemplateColumns: "auto minmax(0, 1fr) auto" },
      track: { gridColumn: "2" },
    });
  });
});
