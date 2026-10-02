/**
 * Catalogue page for the line chart.
 *
 * @remarks
 *   The line chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render revenue in euros, latency percentiles with a dashed target,
 *   the tooltip open at the peak, the lines animated in with a replay, availability on a range of
 *   its own, spend under a reference line, a legend the caller controls, retention by cohort,
 *   releases and a freeze as annotations, flagged points, this week against last week, a crosshair,
 *   the revenue at a phone's width, and a range without rows. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `line-chart` in
 *   `locales/en/specimen/line-chart.json`. The page imports the revenue example directly, because
 *   the props reader follows a specimen's own imports and the example files they name, not an
 *   examples barrel.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as examples from "#line-chart/examples/index.ts";
import * as revenue from "#line-chart/examples/revenue.example.tsx";

/**
 * Hand-written scene for one series.
 */
export const one: Scene = {
  about: "line-chart.revenue.about",
  draw: () => (
    <Room size="lg">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "line-chart.revenue.title",
};

/**
 * Hand-written scene for several series with a dashed target.
 */
export const several: Scene = {
  about: "line-chart.latency.about",
  draw: () => (
    <Room size="lg">
      <examples.latency.Latency />
    </Room>
  ),
  example: examples.latency,
  title: "line-chart.latency.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "line-chart.peak.about",
  draw: () => (
    <Room size="lg">
      <examples.peak.Peak />
    </Room>
  ),
  example: examples.peak,
  title: "line-chart.peak.title",
};

/**
 * Hand-written scene for the lines animated in, with a replay.
 */
export const animated: Scene = {
  about: "line-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <examples.replay.Replay />
    </Room>
  ),
  example: examples.replay,
  title: "line-chart.replay.title",
};

/**
 * Hand-written scene for a value axis on a range of its own.
 */
export const domain: Scene = {
  about: "line-chart.uptime.about",
  draw: () => (
    <Room size="lg">
      <examples.uptime.Uptime />
    </Room>
  ),
  example: examples.uptime,
  title: "line-chart.uptime.title",
};

/**
 * Hand-written scene for a reference line inside the chart.
 */
export const reference: Scene = {
  about: "line-chart.budget.about",
  draw: () => (
    <Room size="lg">
      <examples.budget.Budget />
    </Room>
  ),
  example: examples.budget,
  title: "line-chart.budget.title",
};

/**
 * Hand-written scene for hidden series the caller controls.
 */
export const legend: Scene = {
  about: "line-chart.controlled.about",
  draw: () => (
    <Room size="lg">
      <examples.controlled.Controlled />
    </Room>
  ),
  example: examples.controlled,
  title: "line-chart.controlled.title",
};

/**
 * Hand-written scene for retention by cohort.
 */
export const cohorts: Scene = {
  about: "line-chart.retention.about",
  draw: () => (
    <Room size="2xl">
      <examples.retention.Retention />
    </Room>
  ),
  example: examples.retention,
  title: "line-chart.retention.title",
};

/**
 * Hand-written scene for moments and a period marked on the categories.
 */
export const annotated: Scene = {
  about: "line-chart.releases.about",
  draw: () => (
    <Room size="lg">
      <examples.releases.Releases />
    </Room>
  ),
  example: examples.releases,
  title: "line-chart.releases.title",
};

/**
 * Hand-written scene for points flagged in the error and warning palettes.
 */
export const flagged: Scene = {
  about: "line-chart.anomalies.about",
  draw: () => (
    <Room size="lg">
      <examples.anomalies.Anomalies />
    </Room>
  ),
  example: examples.anomalies,
  title: "line-chart.anomalies.title",
};

/**
 * Hand-written scene for this week against last week.
 */
export const compared: Scene = {
  about: "line-chart.comparison.about",
  draw: () => (
    <Room size="lg">
      <examples.comparison.Comparison />
    </Room>
  ),
  example: examples.comparison,
  title: "line-chart.comparison.title",
};

/**
 * Hand-written scene for a guide at the active row's value.
 */
export const crosshair: Scene = {
  about: "line-chart.guide.about",
  draw: () => (
    <Room size="lg">
      <examples.guide.Guide />
    </Room>
  ),
  example: examples.guide,
  title: "line-chart.guide.title",
};

/**
 * Hand-written scene for one series at a phone's width.
 */
export const narrow: Scene = {
  about: "line-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "line-chart.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "line-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <examples.quiet.Quiet />
    </Room>
  ),
  example: examples.quiet,
  title: "line-chart.quiet.title",
};

export default specimen({
  about: "line-chart.about",
  id: "components/charts/line-chart",
  imports: 'import { LineChart } from "@stealthscale/component-charts";',
  scenes: [
    one,
    several,
    tooltip,
    animated,
    domain,
    reference,
    legend,
    cohorts,
    annotated,
    flagged,
    compared,
    crosshair,
    narrow,
    empty,
  ],
  title: "line-chart.title",
});
