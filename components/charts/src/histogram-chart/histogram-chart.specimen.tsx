/**
 * Catalogue page for the histogram.
 *
 * @remarks
 *   The histogram has no recipe of its own: the chart's recipe styles its figure, so every scene is
 *   hand-written. The scenes render response times in Freedman–Diaconis' bins, the tooltip open at
 *   the tallest bin, fewer bins, a clipped range, order values in the teal palette, the bars
 *   animated in with a replay, the response times at a phone's width, and a histogram without
 *   values. Every scene renders a component from `examples/` and shows that file as its source.
 *   The words are keys under `histogram-chart` in `locales/en/specimen/histogram-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as clipped from "#histogram-chart/examples/clipped.example.tsx";
import * as coarse from "#histogram-chart/examples/coarse.example.tsx";
import * as latency from "#histogram-chart/examples/latency.example.tsx";
import * as orders from "#histogram-chart/examples/orders.example.tsx";
import * as peak from "#histogram-chart/examples/peak.example.tsx";
import * as quiet from "#histogram-chart/examples/quiet.example.tsx";
import * as replay from "#histogram-chart/examples/replay.example.tsx";

/**
 * Hand-written scene for response times in the automatic bins.
 */
export const automatic: Scene = {
  about: "histogram-chart.latency.about",
  draw: () => (
    <Room size="lg">
      <latency.Latency />
    </Room>
  ),
  example: latency,
  title: "histogram-chart.latency.title",
};

/**
 * Hand-written scene for the tooltip open at a bin.
 */
export const tooltip: Scene = {
  about: "histogram-chart.peak.about",
  draw: () => (
    <Room size="lg">
      <peak.Peak />
    </Room>
  ),
  example: peak,
  title: "histogram-chart.peak.title",
};

/**
 * Hand-written scene for fewer bins.
 */
export const fewer: Scene = {
  about: "histogram-chart.coarse.about",
  draw: () => (
    <Room size="lg">
      <coarse.Coarse />
    </Room>
  ),
  example: coarse,
  title: "histogram-chart.coarse.title",
};

/**
 * Hand-written scene for a clipped range.
 */
export const ranged: Scene = {
  about: "histogram-chart.clipped.about",
  draw: () => (
    <Room size="lg">
      <clipped.Clipped />
    </Room>
  ),
  example: clipped,
  title: "histogram-chart.clipped.title",
};

/**
 * Hand-written scene for order values in a palette's color.
 */
export const colored: Scene = {
  about: "histogram-chart.orders.about",
  draw: () => (
    <Room size="lg">
      <orders.Orders />
    </Room>
  ),
  example: orders,
  title: "histogram-chart.orders.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "histogram-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "histogram-chart.replay.title",
};

/**
 * Hand-written scene for the response times at a phone's width.
 */
export const narrow: Scene = {
  about: "histogram-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <latency.Latency />
    </Room>
  ),
  example: latency,
  title: "histogram-chart.narrow.title",
};

/**
 * Hand-written scene for a histogram without values.
 */
export const empty: Scene = {
  about: "histogram-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "histogram-chart.quiet.title",
};

export default specimen({
  about: "histogram-chart.about",
  id: "components/charts/histogram-chart",
  imports: 'import { binValues, HistogramChart } from "@stealthscale/component-charts";',
  scenes: [automatic, tooltip, fewer, ranged, colored, animated, narrow, empty],
  title: "histogram-chart.title",
});
