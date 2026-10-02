/**
 * Catalogue page for the bubble chart.
 *
 * @remarks
 *   The bubble chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render accounts of two plans sized by revenue, features sized by
 *   their users, the tooltip open at the largest account, the points animated in with a replay,
 *   the accounts at a phone's width, and a chart without points. Every scene renders a component
 *   from `examples/` and shows that file as its source. The words are keys under `bubble-chart` in
 *   `locales/en/specimen/bubble-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as accounts from "#bubble-chart/examples/accounts.example.tsx";
import * as features from "#bubble-chart/examples/features.example.tsx";
import * as largest from "#bubble-chart/examples/largest.example.tsx";
import * as quiet from "#bubble-chart/examples/quiet.example.tsx";
import * as replay from "#bubble-chart/examples/replay.example.tsx";

/**
 * Hand-written scene for two series sized by a third field.
 */
export const two: Scene = {
  about: "bubble-chart.accounts.about",
  draw: () => (
    <Room size="lg">
      <accounts.Accounts />
    </Room>
  ),
  example: accounts,
  title: "bubble-chart.accounts.title",
};

/**
 * Hand-written scene for one series with a stated value domain.
 */
export const one: Scene = {
  about: "bubble-chart.features.about",
  draw: () => (
    <Room size="lg">
      <features.Features />
    </Room>
  ),
  example: features,
  title: "bubble-chart.features.title",
};

/**
 * Hand-written scene for the tooltip open at a point.
 */
export const tooltip: Scene = {
  about: "bubble-chart.largest.about",
  draw: () => (
    <Room size="lg">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "bubble-chart.largest.title",
};

/**
 * Hand-written scene for the points animated in, with a replay.
 */
export const animated: Scene = {
  about: "bubble-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "bubble-chart.replay.title",
};

/**
 * Hand-written scene for the accounts at a phone's width.
 */
export const narrow: Scene = {
  about: "bubble-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <accounts.Accounts />
    </Room>
  ),
  example: accounts,
  title: "bubble-chart.narrow.title",
};

/**
 * Hand-written scene for a chart without points.
 */
export const empty: Scene = {
  about: "bubble-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "bubble-chart.quiet.title",
};

export default specimen({
  about: "bubble-chart.about",
  id: "components/charts/bubble-chart",
  imports: 'import { BubbleChart } from "@stealthscale/component-charts";',
  scenes: [two, one, tooltip, animated, narrow, empty],
  title: "bubble-chart.title",
});
