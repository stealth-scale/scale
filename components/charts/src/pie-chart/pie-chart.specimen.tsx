/**
 * Catalogue page for the pie chart.
 *
 * @remarks
 *   The pie chart has no recipe of its own: the chart's recipe styles its figure, so every scene is
 *   hand-written. The scenes render customers per plan, the tooltip open at the largest slice,
 *   revenue per region in euros, browsers with the tail gathered, survey answers with one hidden,
 *   a quota without shares, the slices animated in with a replay, the plans at a phone's width,
 *   and a chart without slices. Every scene renders a component from `examples/` and shows that
 *   file as its source. The words are keys under `pie-chart` in
 *   `locales/en/specimen/pie-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as browsers from "#pie-chart/examples/browsers.example.tsx";
import * as largest from "#pie-chart/examples/largest.example.tsx";
import * as plans from "#pie-chart/examples/plans.example.tsx";
import * as quota from "#pie-chart/examples/quota.example.tsx";
import * as regions from "#pie-chart/examples/regions.example.tsx";
import * as replay from "#pie-chart/examples/replay.example.tsx";
import * as survey from "#pie-chart/examples/survey.example.tsx";
import * as unlaunched from "#pie-chart/examples/unlaunched.example.tsx";

/**
 * Hand-written scene for the plan mix.
 */
export const mix: Scene = {
  about: "pie-chart.plans.about",
  draw: () => (
    <Room size="sm">
      <plans.Plans />
    </Room>
  ),
  example: plans,
  title: "pie-chart.plans.title",
};

/**
 * Hand-written scene for the tooltip open at the largest slice.
 */
export const tooltip: Scene = {
  about: "pie-chart.largest.about",
  draw: () => (
    <Room size="sm">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "pie-chart.largest.title",
};

/**
 * Hand-written scene for values written in a currency.
 */
export const currency: Scene = {
  about: "pie-chart.regions.about",
  draw: () => (
    <Room size="sm">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "pie-chart.regions.title",
};

/**
 * Hand-written scene for the tail gathered into one slice.
 */
export const tail: Scene = {
  about: "pie-chart.browsers.about",
  draw: () => (
    <Room size="sm">
      <browsers.Browsers />
    </Room>
  ),
  example: browsers,
  title: "pie-chart.browsers.title",
};

/**
 * Hand-written scene for a slice hidden on the first render.
 */
export const hidden: Scene = {
  about: "pie-chart.survey.about",
  draw: () => (
    <Room size="sm">
      <survey.Survey />
    </Room>
  ),
  example: survey,
  title: "pie-chart.survey.title",
};

/**
 * Hand-written scene for a pie without shares.
 */
export const unlabelled: Scene = {
  about: "pie-chart.quota.about",
  draw: () => (
    <Room size="sm">
      <quota.Quota />
    </Room>
  ),
  example: quota,
  title: "pie-chart.quota.title",
};

/**
 * Hand-written scene for the slices animated in, with a replay.
 */
export const animated: Scene = {
  about: "pie-chart.replay.about",
  draw: () => (
    <Room size="sm">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "pie-chart.replay.title",
};

/**
 * Hand-written scene for the plan mix at a phone's width.
 */
export const narrow: Scene = {
  about: "pie-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <plans.Plans />
    </Room>
  ),
  example: plans,
  title: "pie-chart.narrow.title",
};

/**
 * Hand-written scene for a chart without slices.
 */
export const empty: Scene = {
  about: "pie-chart.unlaunched.about",
  draw: () => (
    <Room size="sm">
      <unlaunched.Unlaunched />
    </Room>
  ),
  example: unlaunched,
  title: "pie-chart.unlaunched.title",
};

export default specimen({
  about: "pie-chart.about",
  id: "components/charts/pie-chart",
  imports: 'import { PieChart } from "@stealthscale/component-charts";',
  scenes: [mix, tooltip, currency, tail, hidden, unlabelled, animated, narrow, empty],
  title: "pie-chart.title",
});
