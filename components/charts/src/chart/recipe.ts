/**
 * Styles a chart's figure and parts, and restyles the classes recharts writes on its SVG with the
 * theme's tokens.
 *
 * @remarks
 *   Recharts writes its inks as presentation attributes: `#666` on tick labels, axis lines and tick
 *   marks, `#ccc` on grid lines, a polar radius axis and the cursor, `#fff` on dots, sectors and a
 *   funnel's trapezoids, `#808080` on a `Label`'s text. A CSS property applies over a presentation
 *   attribute, so the plot sets each from a role, and a `fill` or `stroke` a caller passes to an
 *   axis or a `Label` loses to it. Under forced colors neither Firefox nor Chromium replaces an SVG
 *   `fill` or `stroke`, so the series keep their colors, and the plot sets the ticks, the labels
 *   and the axis lines in `CanvasText` and the grid in `GrayText`. A bar's hairline edge in the
 *   panel's color parts the segments of a stack. A series the legend does not point at fades to the
 *   plot's `--chart-faded`. The band under the pointer and a hovered legend button fill with the
 *   neutral palette's `subtle`, which steps towards the ink in both modes, where a well such as
 *   `bg.muted` sinks below a dark panel. A pie's shares and a funnel's counts render in `fg` inside
 *   a halo in the panel's color, so they read on a mark of any color, and the pointer passes
 *   through them to the mark under them, which opens the tooltip. A treemap's tile hides a line of
 *   words it marks as wider than the tile, and a sunburst's gap takes no pointer and no edge. A
 *   flow, a sankey's band or a chord diagram's ribbon, rests at the backdrop opacity, lifts to the
 *   muted opacity while the tooltip is at the flow or at one of its nodes, and fades while the
 *   tooltip is at another mark, and so does the bar or the arc of a node the tooltip is not at. The
 *   tooltip's panel is transparent while it is empty, so a readout outside recharts' wrapper, such
 *   as a chord diagram's, shows only while it is at a mark and remains in the accessibility tree as
 *   a live region before it fills. A bar's target tick is the ink inside a halo in the panel's
 *   color, and the part of a bar's zones no zone covers fills like a track. A quadrant chart's
 *   dividing lines are in the emphasized border ink and its quadrants' names in the label ink. A
 *   point's words are the ink inside a halo in the panel's color, and a timeline marker's count is
 *   the black or white `contrast-color()` finds against the marker's color. The `rows` ratio sizes
 *   a plot by its rows, such as a timeline's lanes. The recipe has no `palette` or `effect` axis,
 *   because each series takes its own color and a chart is not a control.
 */

import { defineSlotRecipe, dense, onSlots, ratioVariants } from "@stealthscale/theme/authoring";

import { PLACED, ROWS_TALL } from "#chart/placed.ts";

/**
 * Selects the tick labels of every cartesian and polar axis.
 */
const TICKS =
  "& .recharts-text:is(.recharts-cartesian-axis-tick-value, .recharts-polar-angle-axis-tick-value, .recharts-polar-radius-axis-tick-value)";

/**
 * Selects the tick labels of a polar radius axis, which recharts writes on the ring they label,
 * over the rings and the polygons.
 */
const RADII = "& .recharts-text.recharts-polar-radius-axis-tick-value";

/**
 * Class a sector takes as a track: the rest of a gauge's dial past the reading, and the part of
 * its range no zone covers.
 */
export const TRACK = "chart-track";

/**
 * Selects a track: the rest of a radial bar's full turn behind its ring, and a gauge's track.
 *
 * @remarks
 *   The selector names the sector's class and the track's class. Its specificity of three classes
 *   applies its forced edge over the panel-colored edge of every sector, whose `:is()` counts a
 *   class and a type.
 */
const TRACKS = "& .recharts-sector:is(.recharts-radial-bar-background-sector, .chart-track)";

/**
 * Selects the line of every cartesian and polar axis and the tick marks along it.
 */
const AXES =
  "& :is(.recharts-cartesian-axis-line, .recharts-cartesian-axis-tick-line, .recharts-polar-angle-axis-line, .recharts-polar-angle-axis-tick-line, .recharts-polar-radius-axis-line)";

/**
 * Selects the text of recharts' `Label`, which a reference line or an axis renders.
 */
const LABELS = "& .recharts-text.recharts-label";

/**
 * Selects the lines of a cartesian grid, and the spokes and the ring paths of a polar one.
 */
const GRID =
  "& :is(.recharts-cartesian-grid line, .recharts-polar-grid line, .recharts-polar-grid path)";

/**
 * Selects the band a bar chart renders behind the hovered category.
 */
const BAND = "& .recharts-rectangle.recharts-tooltip-cursor";

/**
 * Selects the cursor line a line or area chart renders at the hovered category, and the cross a
 * scatter renders at the hovered point.
 */
const CURSOR = "& :is(.recharts-curve, .recharts-cross).recharts-tooltip-cursor";

/**
 * Selects the white edges recharts renders around a dot, between a pie's sectors and between a
 * funnel's stages, and a scatter's points, whose edge keeps overlapping points apart.
 *
 * @remarks
 *   A reference dot is left out, because recharts edges it in its own `stroke`, such as an
 *   annotation's ring in its palette's chart color. The exclusion is inside `:where()`, so the rule
 *   keeps the specificity the chart's other edge rules are written against.
 */
const SEPARATED =
  "& :is(.recharts-active-dot circle, .recharts-dot:not(:where(.recharts-reference-dot-dot)), .recharts-sector, .recharts-symbols, .recharts-trapezoid)";

/**
 * Selects every bar, whose edge parts the segments of a stack.
 */
const BARS = "& .recharts-bar-rectangle path";

/**
 * Class a trend line takes, whose line fades with the series it summarises.
 */
export const TREND = "chart-trend";

/**
 * Class a treemap's tile takes, whose group takes its family's opacity.
 */
export const TILE = "chart-tile";

/**
 * Class a sunburst's gap takes: the arc a ring leaves where a leaf ends above it.
 */
export const GAP = "chart-gap";

/**
 * Selects a sunburst's gap, whose specificity applies over the panel-colored edge of every sector.
 */
const GAPS = "& .recharts-sector.chart-gap";

/**
 * Class a flow takes at the backdrop opacity: a sankey's band, a stroke without a fill, or a chord
 * diagram's ribbon, a fill without a stroke.
 */
export const FLOW = "chart-flow";

/**
 * Class a node takes: a sankey's bar or a chord diagram's arc, with its words.
 */
export const NODE = "chart-node";

/**
 * Selects every flow of a sankey or a chord diagram.
 */
const FLOWS = "& .chart-flow";

/**
 * Selects the flow the tooltip is at, and every flow of the node it is at.
 */
const LIT = "& .chart-flow[data-trace=lit]";

/**
 * Selects every other flow while the tooltip is at a mark.
 */
const DIMMED = "& .chart-flow[data-trace=dimmed]";

/**
 * Selects the bar of every node of a sankey.
 */
const BARS_OF_NODES = "& .chart-node .recharts-rectangle";

/**
 * Selects the bar or the arc of every node the tooltip is not at while it is at a mark.
 */
const IDLE = "& .chart-node[data-trace=dimmed] :is(.recharts-rectangle, .recharts-sector)";

/**
 * Attribute a treemap's tile writes on a line of words wider than the tile, and a node on a line
 * of words that meets another node's, which the plot hides.
 */
export const OVERFLOW = "data-overflow";

/**
 * Selects a line of words a treemap's tile or a node marks as not fitting.
 */
const OVERFLOWED = "& :is(.chart-tile, .chart-node) [data-overflow]";

/**
 * Selects the painted paths of every line, area, bar, sector, polygon, point and trend line, and
 * every treemap tile, which take a series' opacity.
 */
const MARKS =
  "& :is(.recharts-line-curve, .recharts-area-area, .recharts-area-curve, .recharts-bar-rectangle path, .recharts-sector, .recharts-polygon, .recharts-symbols, .chart-trend .recharts-reference-line-line, .chart-tile)";

/**
 * Class a `LabelList` gives each value it writes on a mark, a pie's share or a funnel's count,
 * which recharts writes on the `text` in place of `recharts-label`.
 */
export const SHARE = "chart-share";

/**
 * Selects the shares a pie writes on its slices and the counts a funnel writes on its stages.
 */
const SHARES = "& .recharts-text.chart-share";

/**
 * Class a waterfall's connectors take: the dashed lines from each bar to the next at the running
 * total.
 */
export const CONNECTOR = "chart-connector";

/**
 * Selects the line of every connector.
 */
const CONNECTORS = "& .chart-connector .recharts-reference-line-line";

/**
 * Class a box's whiskers and their caps take, in the chart and in its key.
 */
export const WHISKER = "chart-whisker";

/**
 * Class a box's median line and a violin's median point take, in the chart and in its key.
 */
export const MEDIAN = "chart-median";

/**
 * Class a violin's quartile bar takes, in the chart and in its key.
 */
export const QUARTILES = "chart-quartiles";

/**
 * Class an outlier's point takes, in the chart and in its key.
 */
export const OUTLIER = "chart-outlier";

/**
 * Class a bar's target tick takes, in the chart and in its key.
 */
export const TARGET = "chart-target";

/**
 * Selects the part of a bar's zones no zone covers, a rectangle with the track's class.
 */
const BAND_TRACKS = "& rect.chart-track";

/**
 * Custom property of the opacity a series' marks take while the legend points at another series.
 */
export const FADED = "--chart-faded";

/**
 * Class of the data package's `ColorSwatch`, which the legend and the tooltip render.
 */
export const COLOR_SWATCH = "color-swatch";

/**
 * Selects the swatch of a series the legend hides.
 */
const HIDDEN_SWATCH = "&[aria-pressed=false] .color-swatch";

/**
 * Defines the chart recipe: a figure whose plot is as wide as the figure and as tall as its ratio,
 * by default the video ratio.
 */
export const recipe = defineSlotRecipe({
  base: {
    caption: { color: "fg.muted", textStyle: "body.sm" },
    center: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      inset: "0",
      justifyContent: "center",
      pointerEvents: "none",
      position: "absolute",
      textAlign: "center",
    },
    centerLabel: { color: "fg.muted", textStyle: "body.xs" },
    centerValue: {
      color: "fg",
      fontVariantNumeric: "tabular-nums",
      fontWeight: "semibold",
      textStyle: "heading.md",
    },
    empty: {
      alignItems: "center",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "dashed",
      borderWidth: "hairline",
      color: "fg.muted",
      display: "flex",
      inlineSize: "full",
      justifyContent: "center",
      padding: dense("{spacing.inset.md}"),
      textAlign: "center",
      textStyle: "body.sm",
    },
    glyph: {
      "& > svg": { blockSize: "full", inlineSize: "full", overflow: "visible" },
      boxSize: "icon.xs",
      display: "inline-flex",
      flexShrink: "0",
    },
    heading: { color: "fg", fontWeight: "medium" },
    item: {
      _highContrast: { _hover: { outlineColor: "CanvasText", outlineStyle: "solid" } },
      _hover: { background: "neutral.subtle" },
      "&[aria-pressed=false]": { color: "fg.muted", textDecorationLine: "line-through" },
      alignItems: "center",
      background: "transparent",
      borderRadius: "l1",
      color: "fg",
      cursor: "button",
      display: "inline-flex",
      focusRingColor: "border.focus",
      focusVisibleRing: "outside",
      gap: dense("{spacing.gap.sm}"),
      [HIDDEN_SWATCH]: { opacity: "0.4" },
      minBlockSize: "6",
      paddingInline: dense("{spacing.inset.xs}"),
      textStyle: "body.sm",
    },
    key: {
      alignItems: "center",
      color: "fg.muted",
      columnGap: dense("{spacing.gap.md}"),
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      margin: "0",
      padding: "0",
      rowGap: dense("{spacing.gap.xs}"),
      textStyle: "body.sm",
    },
    keyItem: { alignItems: "center", display: "inline-flex", gap: dense("{spacing.gap.sm}") },
    legend: {
      alignItems: "center",
      borderWidth: "0",
      columnGap: dense("{spacing.gap.md}"),
      display: "flex",
      flexWrap: "wrap",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
      rowGap: dense("{spacing.gap.xs}"),
    },
    name: { color: "fg.muted", flex: "1" },
    plot: {
      ...PLACED,
      "& .recharts-surface": {
        focusRingColor: "border.focus",
        focusVisibleRing: "outside",
        overflow: "visible",
      },
      [AXES]: { _highContrast: { stroke: "CanvasText" }, stroke: "border" },
      [BAND]: { fill: "neutral.subtle" },
      [BAND_TRACKS]: {
        _highContrast: { fill: "Canvas", stroke: "GrayText" },
        fill: "neutral.subtle",
      },
      [BARS]: { stroke: "bg.panel", strokeWidth: "hairline" },
      [BARS_OF_NODES]: { transition: "opacity {durations.fast} {easings.out}" },
      [CONNECTORS]: { _highContrast: { stroke: "GrayText" }, stroke: "border.emphasized" },
      [CURSOR]: { stroke: "border" },
      [DIMMED]: { opacity: "backdrop" },
      [FADED]: "{opacity.backdrop}",
      [FLOWS]: {
        fillOpacity: "{opacity.backdrop}",
        strokeOpacity: "{opacity.backdrop}",
        transition:
          "fill-opacity {durations.fast} {easings.out}, stroke-opacity {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
      },
      [GAPS]: { pointerEvents: "none", stroke: "none" },
      [GRID]: { _highContrast: { stroke: "GrayText" }, stroke: "border.muted" },
      [IDLE]: { opacity: "muted" },
      inlineSize: "full",
      [LABELS]: { _highContrast: { fill: "CanvasText" }, fill: "fg.muted", textStyle: "body.xs" },
      [LIT]: { fillOpacity: "{opacity.muted}", strokeOpacity: "{opacity.muted}" },
      [MARKS]: { transition: "opacity {durations.fast} {easings.out}" },
      minInlineSize: "0",
      [OVERFLOWED]: { visibility: "hidden" },
      position: "relative",
      [RADII]: {
        _highContrast: { stroke: "Canvas" },
        dominantBaseline: "text-before-edge",
        paintOrder: "stroke",
        stroke: "bg.panel",
        strokeLinejoin: "round",
        strokeWidth: "ring",
      },
      [SEPARATED]: { stroke: "bg.panel" },
      [SHARES]: {
        _highContrast: { fill: "CanvasText", stroke: "Canvas" },
        fill: "fg",
        fontWeight: "semibold",
        paintOrder: "stroke",
        pointerEvents: "none",
        stroke: "bg.panel",
        strokeLinejoin: "round",
        strokeWidth: "ring",
        textStyle: "body.xs",
      },
      [TICKS]: { _highContrast: { fill: "CanvasText" }, fill: "fg.muted", textStyle: "body.xs" },
      [TRACKS]: { _highContrast: { fill: "Canvas", stroke: "GrayText" }, fill: "neutral.subtle" },
    },
    root: {
      "& .chart-median": {
        _highContrast: { fill: "Canvas", stroke: "CanvasText" },
        fill: "bg.panel",
        stroke: "fg",
      },
      "& .chart-outlier": { _highContrast: { fill: "Canvas" }, fill: "bg.panel" },
      "& .chart-quartiles": { _highContrast: { fill: "CanvasText" }, fill: "fg" },
      "& .chart-target": {
        _highContrast: { fill: "CanvasText", stroke: "Canvas" },
        fill: "fg",
        paintOrder: "stroke",
        stroke: "bg.panel",
        strokeWidth: "ring",
      },
      "& .chart-whisker": { _highContrast: { stroke: "CanvasText" }, stroke: "fg.muted" },
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.md}"),
      inlineSize: "full",
      minInlineSize: "0",
    },
    row: { alignItems: "center", display: "flex", gap: dense("{spacing.gap.sm}") },
    tooltip: {
      _empty: { opacity: "0" },
      background: "bg.popover",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "lg",
      color: "fg",
      display: "grid",
      gap: dense("{spacing.gap.xs}"),
      minInlineSize: "40",
      padding: dense("{spacing.inset.sm}"),
      textAlign: "start",
      textStyle: "body.sm",
    },
    value: { color: "fg", fontVariantNumeric: "tabular-nums", fontWeight: "medium" },
  },
  className: "chart",
  defaultVariants: { ratio: "video" },
  jsx: [/^Chart(\.\w+)?$/u],
  slots: [
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
  ],
  variants: {
    /**
     * Aspect ratio of the plot and of the empty state in its place, one of the theme's ratios, or
     * `rows` for a plot as tall as its rows.
     *
     * @remarks
     *   Recharts measures the plot's box after the first render and renders nothing in a box 0
     *   pixels high. The ratio gives the box its height before that measurement. At `rows` the box
     *   is a row of `sizes.10` per row of `--chart-rows`, one unless stated, and `sizes.12` for the
     *   axis, so a timeline of four lanes is 208px tall at any width.
     */
    ratio: onSlots({
      empty: { ...ratioVariants(), rows: ROWS_TALL },
      plot: { ...ratioVariants(), rows: ROWS_TALL },
    }),
  },
});
