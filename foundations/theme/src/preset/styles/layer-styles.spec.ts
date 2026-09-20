import { describe, expect, it } from "vitest";

import { effects } from "#preset/styles/effects.ts";
import { fieldLooks } from "#preset/styles/field-looks.ts";
import { layerStyles } from "#preset/styles/layer-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("layerStyles", () => {
  it("names six fills and two outlines and four indicators", () => {
    expect(Object.keys(tokenAt(layerStyles, "fill") ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "muted",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "outline") ?? {}).toSorted()).toStrictEqual([
      "solid",
      "subtle",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "indicator") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "end",
      "start",
      "top",
    ]);
  });

  it("spreads the effects beside the looks", () => {
    for (const effect of Object.keys(effects)) {
      expect(tokenAt(layerStyles, effect)).toBe(tokenAt(effects, effect));
    }
  });

  it("holds the ripple still for a reader who asked for less motion", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _motionReduce: { "--ripple-pace": "0" },
      "--ripple-pace": "1",
    });
  });

  it("grows the ripple from the point a press names and centres it where none is named", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _active: {
        _after: {
          opacity: "0.12",
          transform: "translate(-50%, -50%) scale(var(--ripple-scale, 3))",
        },
      },
      _after: {
        aspectRatio: "1",
        background: "radial-gradient(closest-side, currentColor 75%, transparent 100%)",
        clipPath: "inset(0 round inherit)",
        left: "var(--ripple-x, 50%)",
        opacity: "0",
        top: "var(--ripple-y, 50%)",
        transform: "translate(-50%, -50%) scale(0.3)",
        width: "100%",
      },
      position: "relative",
    });
  });

  it("clips the ripple to its own box rather than hiding the control's overflow", () => {
    expect(tokenAt(layerStyles, "ripple")).not.toHaveProperty("overflow");
    expect(JSON.stringify(tokenAt(layerStyles, "ripple"))).toContain("inset(0 round inherit)");
  });

  it("draws a solid fill in the palette with its hover inside it", () => {
    expect(tokenAt(layerStyles, "fill.solid")).toStrictEqual({
      _active: { background: "colorPalette.solid.hover" },
      _hover: { background: "colorPalette.solid.hover" },
      background: "colorPalette.solid",
      color: "colorPalette.contrast",
    });
  });

  it("draws a surface as a subtle fill with a border at the control's width", () => {
    expect(tokenAt(layerStyles, "fill.surface")).toMatchObject({
      background: "colorPalette.subtle",
      borderColor: "colorPalette.border",
      borderWidth: "control",
    });
    expect(tokenAt(layerStyles, "flat.surface")).toMatchObject({ borderWidth: "control" });
    expect(tokenAt(layerStyles, "flat.outline")).toMatchObject({ borderWidth: "control" });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({ borderWidth: "control" });
  });

  it("draws a plain look as the ink alone and marks a press with a fill", () => {
    expect(tokenAt(layerStyles, "fill.plain")).toStrictEqual({
      _active: { background: "colorPalette.subtle" },
      color: "colorPalette.fg",
    });
  });

  it("names three field looks and the same three for a box around a control", () => {
    expect(Object.keys(tokenAt(layerStyles, "field") ?? {}).toSorted()).toStrictEqual([
      "flushed",
      "outline",
      "subtle",
      "wrapped",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "field.wrapped") ?? {}).toSorted()).toStrictEqual([
      "flushed",
      "outline",
      "subtle",
    ]);
  });

  it("reads a wrapped look's read-only state from the control rather than from the box", () => {
    const look = JSON.stringify(tokenAt(layerStyles, "field.wrapped.outline"));

    expect(look).toContain(":has(> :read-only:not(:disabled))");
    expect(look).not.toContain("_readOnly");
  });

  it("reads the field looks from their own module", () => {
    expect(tokenAt(layerStyles, "field.outline")).toStrictEqual(fieldLooks.outline.value);
  });

  it("draws an outline in the palette's solid or its border", () => {
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      borderColor: "colorPalette.solid",
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _hover: { borderColor: "colorPalette.border.hover" },
      borderColor: "colorPalette.border",
    });
  });

  it("fills an outline in as it is hovered and further as it is pressed", () => {
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("presses a fill to the palette's emphasized and a solid fill to the ink it hovers to", () => {
    expect(tokenAt(layerStyles, "fill.subtle")).toMatchObject({
      _active: { background: "colorPalette.emphasized" },
    });
    expect(tokenAt(layerStyles, "fill.solid")).toMatchObject({
      _active: { background: "colorPalette.solid.hover" },
    });
  });

  it("draws an indicator as a bar along one edge at the indicator's width", () => {
    expect(tokenAt(layerStyles, "indicator.bottom")).toStrictEqual({
      _before: {
        background: "colorPalette.solid",
        bottom: "0",
        content: '""',
        height: "{borderWidths.indicator}",
        insetInline: "0",
        position: "absolute",
      },
      position: "relative",
    });
    expect(tokenAt(layerStyles, "indicator.start")).toMatchObject({
      _before: { insetBlock: "0", insetInlineStart: "0", width: "{borderWidths.indicator}" },
    });
    expect(tokenAt(layerStyles, "indicator.end")).toMatchObject({
      _before: { width: "{borderWidths.indicator}" },
    });
    expect(tokenAt(layerStyles, "indicator.top")).toMatchObject({
      _before: { height: "{borderWidths.indicator}" },
    });
  });

  it("draws a disabled control with the disabled cursor and opacity", () => {
    expect(tokenAt(layerStyles, "disabled")).toStrictEqual({
      cursor: "disabled",
      opacity: "disabled",
    });
  });

  it("draws glass as the panel surface at seventy percent behind a blur", () => {
    expect(tokenAt(layerStyles, "glass")).toStrictEqual({
      _reducedTransparency: { backdropFilter: "none", background: "bg.panel" },
      backdropFilter: "blur({blurs.md})",
      background: "bg.panel/70",
      borderColor: "border.subtle",
      borderWidth: "control",
    });
  });
});
