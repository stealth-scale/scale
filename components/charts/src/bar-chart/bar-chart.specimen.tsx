/**
 * Catalogue page for the bar chart.
 *
 * @remarks
 *   The bar chart has no recipe of its own: the chart's recipe styles its figure, so every scene is
 *   hand-written. The scenes render sign-ups per plan per month as grouped bars, sign-ups against
 *   each month's target, the tooltip open at September, the bars animated in with a replay, refund
 *   requests without grid lines, twelve
 *   weeks at the wide ratio, the sign-ups at a phone's width, and a range without rows. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `bar-chart` in `locales/en/specimen/bar-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as crossover from "#bar-chart/examples/crossover.example.tsx";
import * as prelaunch from "#bar-chart/examples/prelaunch.example.tsx";
import * as refunds from "#bar-chart/examples/refunds.example.tsx";
import * as replay from "#bar-chart/examples/replay.example.tsx";
import * as signups from "#bar-chart/examples/signups.example.tsx";
import * as targets from "#bar-chart/examples/targets.example.tsx";
import * as weekly from "#bar-chart/examples/weekly.example.tsx";

/**
 * Hand-written scene for grouped bars.
 */
export const grouped: Scene = {
  about: "bar-chart.signups.about",
  draw: () => (
    <Room size="lg">
      <signups.Signups />
    </Room>
  ),
  example: signups,
  title: "bar-chart.signups.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "bar-chart.crossover.about",
  draw: () => (
    <Room size="lg">
      <crossover.Crossover />
    </Room>
  ),
  example: crossover,
  title: "bar-chart.crossover.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "bar-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "bar-chart.replay.title",
};

/**
 * Hand-written scene for a chart without grid lines.
 */
export const plain: Scene = {
  about: "bar-chart.refunds.about",
  draw: () => (
    <Room size="md">
      <refunds.Refunds />
    </Room>
  ),
  example: refunds,
  title: "bar-chart.refunds.title",
};

/**
 * Hand-written scene for the wide ratio.
 */
export const wide: Scene = {
  about: "bar-chart.weekly.about",
  draw: () => (
    <Room size="2xl">
      <weekly.Weekly />
    </Room>
  ),
  example: weekly,
  title: "bar-chart.weekly.title",
};

/**
 * Hand-written scene for the sign-ups at a phone's width.
 */
export const narrow: Scene = {
  about: "bar-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <signups.Signups />
    </Room>
  ),
  example: signups,
  title: "bar-chart.narrow.title",
};

/**
 * Hand-written scene for bars against targets, each target a tick.
 */
export const targeted: Scene = {
  about: "bar-chart.targets.about",
  draw: () => (
    <Room size="lg">
      <targets.Targets />
    </Room>
  ),
  example: targets,
  title: "bar-chart.targets.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "bar-chart.prelaunch.about",
  draw: () => (
    <Room size="md">
      <prelaunch.Prelaunch />
    </Room>
  ),
  example: prelaunch,
  title: "bar-chart.prelaunch.title",
};

export default specimen({
  about: "bar-chart.about",
  id: "components/charts/bar-chart",
  imports: 'import { BarChart } from "@stealthscale/component-charts";',
  scenes: [grouped, targeted, tooltip, animated, plain, wide, narrow, empty],
  title: "bar-chart.title",
});
