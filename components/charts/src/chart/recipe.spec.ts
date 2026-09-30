import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#chart/chart.specimen.tsx";
import { PLACED, ROWS_TALL } from "#chart/placed.ts";
import {
  COLOR_SWATCH,
  CONNECTOR,
  FADED,
  FLOW,
  GAP,
  MEDIAN,
  NODE,
  OUTLIER,
  OVERFLOW,
  QUARTILES,
  recipe,
  SHARE,
  TARGET,
  TILE,
  TRACK,
  TREND,
  WHISKER,
} from "#chart/recipe.ts";

/**
 * Selects the tick labels of every cartesian and polar axis.
 */
const TICKS =
  "& .recharts-text:is(.recharts-cartesian-axis-tick-value, .recharts-polar-angle-axis-tick-value, .recharts-polar-radius-axis-tick-value)";

/**
 * Selects the text of recharts' `Label`.
 */
const LABELS = "& .recharts-text.recharts-label";

/**
 * Selects the line of every axis and the tick marks along it.
 */
const AXES =
  "& :is(.recharts-cartesian-axis-line, .recharts-cartesian-axis-tick-line, .recharts-polar-angle-axis-line, .recharts-polar-angle-axis-tick-line, .recharts-polar-radius-axis-line)";

/**
 * Selects the tick labels of a polar radius axis.
 */
const RADII = "& .recharts-text.recharts-polar-radius-axis-tick-value";

/**
 * Selects a radial bar's track and a gauge's.
 */
const TRACKS = "& .recharts-sector:is(.recharts-radial-bar-background-sector, .chart-track)";

/**
 * Selects the lines of a cartesian grid and the rings and spokes of a polar one.
 */
const GRID =
  "& :is(.recharts-cartesian-grid line, .recharts-polar-grid line, .recharts-polar-grid path)";

/**
 * Returns the base styles of one slot.
 */
function base(slot: string): unknown {
  return (recipe.base as Readonly<Record<string, unknown>> | undefined)?.[slot];
}

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Chart"] })).toStrictEqual([]);
  });

  it("sets className to chart", () => {
    expect(recipe.className).toBe("chart");
  });

  it("declares seventeen slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "plot",
      "center",
      "centerValue",
      "centerLabel",
      "empty",
      "caption",
      "legend",
      "item",
      "key",
      "keyItem",
      "glyph",
      "tooltip",
      "heading",
      "row",
      "name",
      "value",
    ]);
  });

  it("declares the ratio axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["ratio"]);
  });

  it("offers every ratio of the theme with rows", () => {
    expect(valuesOf(recipe, "ratio")).toStrictEqual([
      "golden",
      "landscape",
      "portrait",
      "rows",
      "square",
      "ultrawide",
      "video",
      "wide",
    ]);
  });

  it("sizes a plot at the rows ratio by its rows", () => {
    expect(recipe.variants?.["ratio"]?.["rows"]).toMatchObject({ plot: ROWS_TALL });
  });

  it("sizes the empty state at the rows ratio by its rows", () => {
    expect(recipe.variants?.["ratio"]?.["rows"]).toMatchObject({ empty: ROWS_TALL });
  });

  it("spreads the placed styles into the plot", () => {
    expect(base("plot")).toMatchObject(PLACED);
  });

  it("defaults to the video ratio", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ ratio: "video" });
  });

  it("sets the plot's aspect ratio from the ratio axis", () => {
    expect(recipe.variants?.["ratio"]?.["wide"]).toMatchObject({ plot: { aspectRatio: "wide" } });
  });

  it("sets the empty state's aspect ratio from the ratio axis", () => {
    expect(recipe.variants?.["ratio"]?.["wide"]).toMatchObject({ empty: { aspectRatio: "wide" } });
  });

  it("aligns the tooltip's words to the start inside a centered part", () => {
    expect(base("tooltip")).toMatchObject({ textAlign: "start" });
  });

  it("makes the tooltip's panel transparent while it is empty", () => {
    expect(base("tooltip")).toMatchObject({ _empty: { opacity: "0" } });
  });

  it("names the class of the data package's color swatch", () => {
    expect(COLOR_SWATCH).toBe("color-swatch");
  });

  it("fades the swatch of a hidden series", () => {
    expect(base("item")).toMatchObject({
      [`&[aria-pressed=false] .${COLOR_SWATCH}`]: { opacity: "0.4" },
    });
  });

  it("sets recharts' tick labels in the muted ink at the xs body style", () => {
    expect(base("plot")).toMatchObject({ [TICKS]: { fill: "fg.muted", textStyle: "body.xs" } });
  });

  it("sets recharts' tick labels in CanvasText under forced colors", () => {
    expect(base("plot")).toMatchObject({ [TICKS]: { _highContrast: { fill: "CanvasText" } } });
  });

  it("sets the text of recharts' labels in the muted ink at the xs body style", () => {
    expect(base("plot")).toMatchObject({ [LABELS]: { fill: "fg.muted", textStyle: "body.xs" } });
  });

  it("sets the text of recharts' labels in CanvasText under forced colors", () => {
    expect(base("plot")).toMatchObject({ [LABELS]: { _highContrast: { fill: "CanvasText" } } });
  });

  it("sets recharts' axis lines in the border ink", () => {
    expect(base("plot")).toMatchObject({ [AXES]: { stroke: "border" } });
  });

  it("sets recharts' axis lines in CanvasText under forced colors", () => {
    expect(base("plot")).toMatchObject({ [AXES]: { _highContrast: { stroke: "CanvasText" } } });
  });

  it("sets recharts' grid lines in the muted border", () => {
    expect(base("plot")).toMatchObject({ [GRID]: { stroke: "border.muted" } });
  });

  it("sets recharts' grid lines in GrayText under forced colors", () => {
    expect(base("plot")).toMatchObject({ [GRID]: { _highContrast: { stroke: "GrayText" } } });
  });

  it("sets the faded opacity of a series to the backdrop opacity", () => {
    expect(base("plot")).toMatchObject({ [FADED]: "{opacity.backdrop}" });
  });

  it("names the faded opacity's custom property", () => {
    expect(FADED).toBe("--chart-faded");
  });

  it("names the class of a gauge's track", () => {
    expect(TRACK).toBe("chart-track");
  });

  it("fills each ring's track with the neutral palette's subtle role", () => {
    expect(base("plot")).toMatchObject({ [TRACKS]: { fill: "neutral.subtle" } });
  });

  it("edges each ring's track in GrayText on Canvas under forced colors", () => {
    expect(base("plot")).toMatchObject({
      [TRACKS]: { _highContrast: { fill: "Canvas", stroke: "GrayText" } },
    });
  });

  it("hangs each radius tick label from the ring it labels", () => {
    expect(base("plot")).toMatchObject({ [RADII]: { dominantBaseline: "text-before-edge" } });
  });

  it("writes each radius tick label inside a halo in the panel's color", () => {
    expect(base("plot")).toMatchObject({
      [RADII]: { paintOrder: "stroke", stroke: "bg.panel", strokeWidth: "ring" },
    });
  });

  it("paints a radius tick label's halo in Canvas under forced colors", () => {
    expect(base("plot")).toMatchObject({ [RADII]: { _highContrast: { stroke: "Canvas" } } });
  });

  it("transitions the opacity of every mark at the fast duration", () => {
    expect(base("plot")).toMatchObject({
      [`& :is(.recharts-line-curve, .recharts-area-area, .recharts-area-curve, .recharts-bar-rectangle path, .recharts-sector, .recharts-polygon, .recharts-symbols, .${TREND} .recharts-reference-line-line, .${TILE})`]:
        { transition: "opacity {durations.fast} {easings.out}" },
    });
  });

  it("names the class of a trend line", () => {
    expect(TREND).toBe("chart-trend");
  });

  it("names the class of a treemap's tile", () => {
    expect(TILE).toBe("chart-tile");
  });

  it("hides a line of words a tile or a node marks with the overflow attribute", () => {
    expect(base("plot")).toMatchObject({
      [`& :is(.${TILE}, .${NODE}) [${OVERFLOW}]`]: { visibility: "hidden" },
    });
  });

  it("names the class of a flow", () => {
    expect(FLOW).toBe("chart-flow");
  });

  it("names the class of a node", () => {
    expect(NODE).toBe("chart-node");
  });

  it("rests a flow's stroke and fill at the backdrop opacity", () => {
    expect(base("plot")).toMatchObject({
      [`& .${FLOW}`]: { fillOpacity: "{opacity.backdrop}", strokeOpacity: "{opacity.backdrop}" },
    });
  });

  it("lifts a lit flow's stroke and fill to the muted opacity", () => {
    expect(base("plot")).toMatchObject({
      [`& .${FLOW}[data-trace=lit]`]: {
        fillOpacity: "{opacity.muted}",
        strokeOpacity: "{opacity.muted}",
      },
    });
  });

  it("fades a dimmed flow by the backdrop opacity", () => {
    expect(base("plot")).toMatchObject({
      [`& .${FLOW}[data-trace=dimmed]`]: { opacity: "backdrop" },
    });
  });

  it("fades the bar or the arc of a dimmed node to the muted opacity", () => {
    expect(base("plot")).toMatchObject({
      [`& .${NODE}[data-trace=dimmed] :is(.recharts-rectangle, .recharts-sector)`]: {
        opacity: "muted",
      },
    });
  });

  it("transitions a flow's opacities at the fast duration", () => {
    expect(base("plot")).toMatchObject({
      [`& .${FLOW}`]: {
        transition:
          "fill-opacity {durations.fast} {easings.out}, stroke-opacity {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
      },
    });
  });

  it("transitions a node's bar at the fast duration", () => {
    expect(base("plot")).toMatchObject({
      [`& .${NODE} .recharts-rectangle`]: { transition: "opacity {durations.fast} {easings.out}" },
    });
  });

  it("names the class of a sunburst's gap", () => {
    expect(GAP).toBe("chart-gap");
  });

  it("takes the pointer and the edge off a gap", () => {
    expect(base("plot")).toMatchObject({
      [`& .recharts-sector.${GAP}`]: { pointerEvents: "none", stroke: "none" },
    });
  });

  it("edges every mark recharts outlines in white in the panel's color but a reference dot", () => {
    expect(base("plot")).toMatchObject({
      "& :is(.recharts-active-dot circle, .recharts-dot:not(:where(.recharts-reference-dot-dot)), .recharts-sector, .recharts-symbols, .recharts-trapezoid)":
        { stroke: "bg.panel" },
    });
  });

  it("sets the cursor line and a scatter's cross in the border ink", () => {
    expect(base("plot")).toMatchObject({
      "& :is(.recharts-curve, .recharts-cross).recharts-tooltip-cursor": { stroke: "border" },
    });
  });

  it("names the class of a pie's shares", () => {
    expect(SHARE).toBe("chart-share");
  });

  it("sets a pie's shares in the ink inside a halo in the panel's color", () => {
    expect(base("plot")).toMatchObject({
      [`& .recharts-text.${SHARE}`]: {
        fill: "fg",
        paintOrder: "stroke",
        stroke: "bg.panel",
        strokeWidth: "ring",
      },
    });
  });

  it("lets the pointer through a share to the mark under it", () => {
    expect(base("plot")).toMatchObject({
      [`& .recharts-text.${SHARE}`]: { pointerEvents: "none" },
    });
  });

  it("sets a pie's shares in CanvasText inside Canvas under forced colors", () => {
    expect(base("plot")).toMatchObject({
      [`& .recharts-text.${SHARE}`]: {
        _highContrast: { fill: "CanvasText", stroke: "Canvas" },
      },
    });
  });

  it("names the class of a waterfall's connectors", () => {
    expect(CONNECTOR).toBe("chart-connector");
  });

  it("sets a waterfall's connectors in the emphasized border ink", () => {
    expect(base("plot")).toMatchObject({
      [`& .${CONNECTOR} .recharts-reference-line-line`]: { stroke: "border.emphasized" },
    });
  });

  it("sets a waterfall's connectors in GrayText under forced colors", () => {
    expect(base("plot")).toMatchObject({
      [`& .${CONNECTOR} .recharts-reference-line-line`]: {
        _highContrast: { stroke: "GrayText" },
      },
    });
  });

  it("places the center over the whole plot without taking the pointer", () => {
    expect(base("center")).toMatchObject({
      inset: "0",
      pointerEvents: "none",
      position: "absolute",
    });
  });

  it("sets the center's figure in tabular numerals", () => {
    expect(base("centerValue")).toMatchObject({ fontVariantNumeric: "tabular-nums" });
  });

  it("sets the center's label in the muted ink", () => {
    expect(base("centerLabel")).toMatchObject({ color: "fg.muted" });
  });

  it("edges every bar with a hairline in the panel's color", () => {
    expect(base("plot")).toMatchObject({
      "& .recharts-bar-rectangle path": { stroke: "bg.panel", strokeWidth: "hairline" },
    });
  });

  it("fills the band under the pointer with the neutral palette's subtle fill", () => {
    expect(base("plot")).toMatchObject({
      "& .recharts-rectangle.recharts-tooltip-cursor": { fill: "neutral.subtle" },
    });
  });

  it("fills a hovered legend button with the neutral palette's subtle fill", () => {
    expect(base("item")).toMatchObject({ _hover: { background: "neutral.subtle" } });
  });

  it("rings the focused chart surface", () => {
    expect(base("plot")).toMatchObject({
      "& .recharts-surface": { focusRingColor: "border.focus", focusVisibleRing: "outside" },
    });
  });

  it("resets the box styles a browser gives the legend fieldset", () => {
    expect(base("legend")).toMatchObject({
      borderWidth: "0",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    });
  });

  it("strikes a hidden series' name through", () => {
    expect(base("item")).toMatchObject({
      "&[aria-pressed=false]": { color: "fg.muted", textDecorationLine: "line-through" },
    });
  });

  it("sets the key's names in the muted ink at the sm body style", () => {
    expect(base("key")).toMatchObject({ color: "fg.muted", textStyle: "body.sm" });
  });

  it("lists the key's entries without markers", () => {
    expect(base("key")).toMatchObject({ listStyle: "none", margin: "0", padding: "0" });
  });

  it("sizes a key's glyph as the legend sizes a swatch", () => {
    expect(base("glyph")).toMatchObject({ boxSize: "icon.xs", flexShrink: "0" });
  });

  it("fits the caller's svg to the glyph's box", () => {
    expect(base("glyph")).toMatchObject({
      "& > svg": { blockSize: "full", inlineSize: "full", overflow: "visible" },
    });
  });

  it("names the classes of a box's parts", () => {
    expect([WHISKER, MEDIAN, OUTLIER]).toStrictEqual([
      "chart-whisker",
      "chart-median",
      "chart-outlier",
    ]);
  });

  it("names the class of a violin's quartile bar", () => {
    expect(QUARTILES).toBe("chart-quartiles");
  });

  it("fills a violin's quartile bar with the ink and CanvasText under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${QUARTILES}`]: { _highContrast: { fill: "CanvasText" }, fill: "fg" },
    });
  });

  it("fills a violin's median point with the panel and Canvas under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${MEDIAN}`]: { _highContrast: { fill: "Canvas" }, fill: "bg.panel" },
    });
  });

  it("sets a box's whiskers in the muted ink and CanvasText under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${WHISKER}`]: { _highContrast: { stroke: "CanvasText" }, stroke: "fg.muted" },
    });
  });

  it("sets a box's median in the ink and CanvasText under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${MEDIAN}`]: { _highContrast: { stroke: "CanvasText" }, stroke: "fg" },
    });
  });

  it("fills an outlier's point with the panel and Canvas under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${OUTLIER}`]: { _highContrast: { fill: "Canvas" }, fill: "bg.panel" },
    });
  });

  it("names the class of a bar's target tick", () => {
    expect(TARGET).toBe("chart-target");
  });

  it("fills a target tick with the ink inside a halo in the panel's color", () => {
    expect(base("root")).toMatchObject({
      [`& .${TARGET}`]: {
        fill: "fg",
        paintOrder: "stroke",
        stroke: "bg.panel",
        strokeWidth: "ring",
      },
    });
  });

  it("fills a target tick with CanvasText inside a Canvas halo under forced colors", () => {
    expect(base("root")).toMatchObject({
      [`& .${TARGET}`]: { _highContrast: { fill: "CanvasText", stroke: "Canvas" } },
    });
  });

  it("fills the part of a bar's zones no zone covers like a track", () => {
    expect(base("plot")).toMatchObject({
      "& rect.chart-track": {
        _highContrast: { fill: "Canvas", stroke: "GrayText" },
        fill: "neutral.subtle",
      },
    });
  });

  it("matches every Chart tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Chart(\.\w+)?$/u]);
  });
});
