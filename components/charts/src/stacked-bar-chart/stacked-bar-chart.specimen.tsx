/**
 * Catalogue page for the stacked bar chart.
 *
 * @remarks
 *   The stacked bar chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render revenue per plan per month in euros, the tooltip open
 *   at September, the segments animated in with a replay, the revenue at a phone's width, and a
 *   range without rows. Every scene renders a component from `examples/` and shows that file as its
 *   source. The words are keys under `stacked-bar-chart` in
 *   `locales/en/specimen/stacked-bar-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as replay from "#stacked-bar-chart/examples/replay.example.tsx";
import * as revenue from "#stacked-bar-chart/examples/revenue.example.tsx";
import * as split from "#stacked-bar-chart/examples/split.example.tsx";
import * as unbooked from "#stacked-bar-chart/examples/unbooked.example.tsx";

/**
 * Hand-written scene for totals split by plan.
 */
export const totals: Scene = {
  about: "stacked-bar-chart.revenue.about",
  draw: () => (
    <Room size="lg">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "stacked-bar-chart.revenue.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "stacked-bar-chart.split.about",
  draw: () => (
    <Room size="lg">
      <split.Split />
    </Room>
  ),
  example: split,
  title: "stacked-bar-chart.split.title",
};

/**
 * Hand-written scene for the segments animated in, with a replay.
 */
export const animated: Scene = {
  about: "stacked-bar-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "stacked-bar-chart.replay.title",
};

/**
 * Hand-written scene for the revenue at a phone's width.
 */
export const narrow: Scene = {
  about: "stacked-bar-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "stacked-bar-chart.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "stacked-bar-chart.unbooked.about",
  draw: () => (
    <Room size="md">
      <unbooked.Unbooked />
    </Room>
  ),
  example: unbooked,
  title: "stacked-bar-chart.unbooked.title",
};

export default specimen({
  about: "stacked-bar-chart.about",
  id: "components/charts/stacked-bar-chart",
  imports: 'import { StackedBarChart } from "@stealthscale/component-charts";',
  scenes: [totals, tooltip, animated, narrow, empty],
  title: "stacked-bar-chart.title",
});
