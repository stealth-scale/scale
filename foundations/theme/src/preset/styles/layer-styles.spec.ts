import { describe, expect, it } from "vitest";

import { WITHIN_READ_ONLY } from "#authoring/recipes/field.ts";
import { effects } from "#preset/styles/effects.ts";
import { fieldLooks } from "#preset/styles/field-looks.ts";
import { layerStyles } from "#preset/styles/layer-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("layerStyles", () => {
  it("declares six fill looks", () => {
    expect(Object.keys(tokenAt(layerStyles, "fill") ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "muted",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("declares three outline looks", () => {
    expect(Object.keys(tokenAt(layerStyles, "outline") ?? {}).toSorted()).toStrictEqual([
      "muted",
      "solid",
      "subtle",
    ]);
  });

  it("declares four indicator looks", () => {
    expect(Object.keys(tokenAt(layerStyles, "indicator") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "end",
      "start",
      "top",
    ]);
  });

  it("includes every effect layer style", () => {
    expect.hasAssertions();

    for (const effect of Object.keys(effects)) {
      expect(tokenAt(layerStyles, effect)).toBe(tokenAt(effects, effect));
    }
  });

  it("sets the ripple pace to 0 under reduced motion", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _motionReduce: { "--ripple-pace": "0" },
      "--ripple-pace": "1",
    });
  });

  it("grows the ripple from the pressed point with the centre as the fallback", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _active: {
        _after: {
          backgroundSize: "var(--ripple-start, 30%) var(--ripple-start, 30%)",
          opacity: "0.12",
        },
      },
      _after: {
        backgroundImage:
          "radial-gradient(circle closest-side, currentColor 0 70%, transparent 100%)",
        backgroundPosition: "var(--ripple-x, 50%) var(--ripple-y, 50%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "var(--ripple-scale, 170%) var(--ripple-scale, 170%)",
        opacity: "0",
      },
      position: "relative",
    });
  });

  it("removes the ripple transition while pressed", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _active: { _after: { transition: "none" } },
    });
  });

  it("transitions the ripple over durations.slower on release", () => {
    const written = JSON.stringify(tokenAt(layerStyles, "ripple"));

    expect(written).toContain("opacity calc(var(--ripple-pace) * {durations.slower})");
    expect(written).toContain("background-size calc(var(--ripple-pace) * {durations.slower})");
  });

  it("rounds the ripple with the control's corners without an overflow rule", () => {
    expect(tokenAt(layerStyles, "ripple")).not.toHaveProperty("overflow");
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _after: { borderRadius: "inherit", inset: "0" },
    });
  });

  it("sets no clip path on the ripple", () => {
    expect(JSON.stringify(tokenAt(layerStyles, "ripple"))).not.toContain("clipPath");
  });

  it("sets the solid fill with its hover and press colors", () => {
    expect(tokenAt(layerStyles, "fill.solid")).toStrictEqual({
      _active: { background: "colorPalette.solid.hover" },
      _hover: { background: "colorPalette.solid.hover" },
      background: "colorPalette.solid",
      color: "colorPalette.contrast",
    });
  });

  it("sets the control stroke width on every bordered look", () => {
    expect(tokenAt(layerStyles, "fill.surface")).toMatchObject({
      background: "colorPalette.subtle",
      borderColor: "colorPalette.muted",
      borderWidth: "control",
    });
    expect(tokenAt(layerStyles, "flat.surface")).toMatchObject({ borderWidth: "control" });
    expect(tokenAt(layerStyles, "flat.outline")).toMatchObject({ borderWidth: "control" });
    expect(tokenAt(layerStyles, "outline.muted")).toMatchObject({ borderWidth: "control" });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({ borderWidth: "control" });
  });

  it("sets the plain fill as ink with a subtle fill while pressed", () => {
    expect(tokenAt(layerStyles, "fill.plain")).toStrictEqual({
      _active: { background: "colorPalette.subtle" },
      color: "colorPalette.fg",
    });
  });

  it("lists the field looks beside the wrapped group", () => {
    expect(Object.keys(tokenAt(layerStyles, "field") ?? {}).toSorted()).toStrictEqual([
      "flushed",
      "outline",
      "subtle",
      "wrapped",
    ]);
  });

  it("lists three wrapped field looks", () => {
    expect(Object.keys(tokenAt(layerStyles, "field.wrapped") ?? {}).toSorted()).toStrictEqual([
      "flushed",
      "outline",
      "subtle",
    ]);
  });

  it("reads the wrapped read-only state from the controls inside the box", () => {
    expect(tokenAt(layerStyles, "field.wrapped.outline")).toHaveProperty([WITHIN_READ_ONLY]);
    expect(tokenAt(layerStyles, "field.wrapped.outline")).not.toHaveProperty("_readOnly");
  });

  it("takes the field looks from fieldLooks", () => {
    expect(tokenAt(layerStyles, "field.outline")).toStrictEqual(fieldLooks.outline.value);
  });

  it("sets the outline edge from the palette's muted role one step darker on hover", () => {
    expect(tokenAt(layerStyles, "outline.muted")).toMatchObject({
      _hover: { borderColor: "colorPalette.emphasized" },
      borderColor: "colorPalette.muted",
    });
  });

  it("sets the surface edge from the palette's muted role one step darker on hover", () => {
    expect(tokenAt(layerStyles, "fill.surface")).toMatchObject({
      _hover: { background: "colorPalette.muted", borderColor: "colorPalette.emphasized" },
      borderColor: "colorPalette.muted",
    });
  });

  it("sets the flat outline and surface edges from the palette's muted role", () => {
    expect(tokenAt(layerStyles, "flat.outline")).toMatchObject({
      borderColor: "colorPalette.muted",
    });
    expect(tokenAt(layerStyles, "flat.surface")).toMatchObject({
      borderColor: "colorPalette.muted",
    });
  });

  it("sets the outline edge from the palette's solid or border", () => {
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      borderColor: "colorPalette.solid",
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _hover: { borderColor: "colorPalette.border.hover" },
      borderColor: "colorPalette.border",
    });
  });

  it("steps an outline look's fill from subtle on hover to muted on press", () => {
    expect(tokenAt(layerStyles, "outline.muted")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("darkens a filled look under press", () => {
    expect(tokenAt(layerStyles, "fill.subtle")).toMatchObject({
      _active: { background: "colorPalette.emphasized" },
    });
    expect(tokenAt(layerStyles, "fill.solid")).toMatchObject({
      _active: { background: "colorPalette.solid.hover" },
    });
  });

  it("renders each indicator as a bar at the indicator width along one edge", () => {
    expect(tokenAt(layerStyles, "indicator.bottom")).toStrictEqual({
      _before: {
        background: "colorPalette.solid",
        borderEndEndRadius: "inherit",
        borderEndStartRadius: "inherit",
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
    expect(tokenAt(layerStyles, "indicator.start")).toMatchObject({
      _before: { borderEndStartRadius: "inherit", borderStartStartRadius: "inherit" },
    });
    expect(tokenAt(layerStyles, "indicator.top")).toMatchObject({
      _before: { borderStartEndRadius: "inherit", borderStartStartRadius: "inherit" },
    });
    expect(tokenAt(layerStyles, "indicator.end")).toMatchObject({
      _before: { width: "{borderWidths.indicator}" },
    });
  });

  it("sets the disabled look from the disabled tokens", () => {
    expect(tokenAt(layerStyles, "disabled")).toStrictEqual({
      cursor: "disabled",
      opacity: "disabled",
    });
  });

  it("sets glass as the panel surface at 70 percent over a backdrop blur", () => {
    expect(tokenAt(layerStyles, "glass")).toStrictEqual({
      _reducedTransparency: { backdropFilter: "none", background: "bg.panel" },
      backdropFilter: "blur({blurs.md})",
      background: "bg.panel/70",
      borderColor: "border.subtle",
      borderWidth: "control",
    });
  });
});
