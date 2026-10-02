/**
 * Styles the lines, words and marks a chart places over its plot: a quadrant chart's dividing lines
 * and names, the words beside a scatter's points, a timeline's markers, an annotation's words and
 * the crosshair, and sizes a plot by its rows.
 *
 * @remarks
 *   The chart recipe spreads `PLACED` into its plot's styles and takes `ROWS_TALL` as its `rows`
 *   ratio. Each selector names the class its part renders with, so no rule applies to another
 *   chart's marks. The dividing lines are in the emphasized border ink and the quadrants' names in
 *   the label ink. A point's words are the ink inside a halo in the panel's color, and a marker's
 *   count is the black or white `contrast-color()` finds against the marker's color. An
 *   annotation's words are the label ink inside the same halo, and the crosshair takes the
 *   cursor's border ink.
 */

/**
 * Class a quadrant chart's two dividing lines take.
 */
export const DIVISION = "chart-division";

/**
 * Selects the line of each of a quadrant chart's dividing lines.
 */
const DIVISIONS = "& .chart-division .recharts-reference-line-line";

/**
 * Class the name of a quadrant takes, written in its corner of the plot.
 */
export const QUADRANT = "chart-quadrant";

/**
 * Selects the names of a quadrant chart's quadrants.
 */
const QUADRANT_NAMES = "& .recharts-text.chart-quadrant";

/**
 * Class the words beside a point take, such as a vendor's name on a quadrant chart.
 */
export const POINT_LABEL = "chart-point-label";

/**
 * Selects the words beside the points of a scatter.
 */
const POINT_LABELS = "& .recharts-text.chart-point-label";

/**
 * Class a timeline's marker takes: a dot for one moment, or a pill with the count of a cluster.
 */
export const MARKER = "chart-marker";

/**
 * Custom property of a timeline marker's color, which fills the dot or the pill and which the
 * count's ink contrasts with.
 */
export const MARKER_FILL = "--chart-marker";

/**
 * Selects the dot or the pill of every timeline marker.
 */
const MARKER_SHAPES = "& .chart-marker > :is(circle, rect)";

/**
 * Selects the count a timeline marker writes on its pill.
 */
const MARKER_COUNTS = "& .chart-marker > text";

/**
 * Selects a timeline marker the chart selects on a press.
 */
const MARKER_PRESSES = "& .chart-marker[data-press]";

/**
 * Class an annotation's mark takes: a moment's rule, a period's wash or a point's ring.
 */
export const ANNOTATION = "chart-annotation";

/**
 * Class the words of an annotation take.
 */
export const ANNOTATION_LABEL = "chart-annotation-label";

/**
 * Selects the words of every annotation.
 */
const ANNOTATION_LABELS = "& .recharts-text.chart-annotation-label";

/**
 * Class the crosshair's guide takes.
 */
export const CROSSHAIR = "chart-crosshair";

/**
 * Selects the line of the crosshair's guide.
 */
const CROSSHAIR_LINE = "& .chart-crosshair .recharts-reference-line-line";

/**
 * Custom property of the number of rows a plot at the `rows` ratio is tall, such as a timeline's
 * lanes.
 */
export const ROWS = "--chart-rows";

/**
 * Sizes a plot by its rows: a row of `sizes.10` per row and `sizes.12` for the axis under them.
 */
export const ROWS_TALL = {
  aspectRatio: "auto",
  blockSize: "calc(var(--chart-rows, 1) * {sizes.10} + {sizes.12})",
};

/**
 * Styles of the lines, words and marks a chart places over its plot, which the plot spreads.
 */
export const PLACED = {
  [ANNOTATION_LABELS]: {
    _highContrast: { fill: "CanvasText", stroke: "Canvas" },
    fill: "fg.muted",
    paintOrder: "stroke",
    pointerEvents: "none",
    stroke: "bg.panel",
    strokeLinejoin: "round",
    strokeWidth: "ring",
    textStyle: "body.xs",
  },
  [CROSSHAIR_LINE]: { _highContrast: { stroke: "CanvasText" }, stroke: "border" },
  [DIVISIONS]: { _highContrast: { stroke: "CanvasText" }, stroke: "border.emphasized" },
  [MARKER_COUNTS]: {
    fill: "contrast-color(var(--chart-marker))",
    fontWeight: "semibold",
    pointerEvents: "none",
    textStyle: "body.xs",
  },
  [MARKER_PRESSES]: { cursor: "button" },
  [MARKER_SHAPES]: {
    _highContrast: { stroke: "Canvas" },
    fill: "var(--chart-marker)",
    stroke: "bg.panel",
    strokeWidth: "ring",
  },
  [POINT_LABELS]: {
    _highContrast: { fill: "CanvasText", stroke: "Canvas" },
    fill: "fg",
    paintOrder: "stroke",
    pointerEvents: "none",
    stroke: "bg.panel",
    strokeLinejoin: "round",
    strokeWidth: "ring",
    textStyle: "body.xs",
  },
  [QUADRANT_NAMES]: {
    _highContrast: { fill: "CanvasText" },
    fill: "fg.muted",
    fontWeight: "medium",
    pointerEvents: "none",
    textStyle: "body.xs",
  },
};
