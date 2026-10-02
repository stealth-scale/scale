/**
 * Catalogue page for the radar chart.
 *
 * @remarks
 *   The radar chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render a service's scorecard over two quarters, the tooltip open at
 *   the score that fell, one team's profile, three teams as outlines, coverage with the scale
 *   written, the scorecard with two spokes swapped, the polygons animated in with a replay, the
 *   scorecard at a phone's width, and a quarter without scores. Every scene renders a component
 *   from `examples/` and shows that file as its source. The words are keys under `radar-chart` in
 *   `locales/en/specimen/radar-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as coverage from "#radar-chart/examples/coverage.example.tsx";
import * as drop from "#radar-chart/examples/drop.example.tsx";
import * as order from "#radar-chart/examples/order.example.tsx";
import * as profile from "#radar-chart/examples/profile.example.tsx";
import * as quiet from "#radar-chart/examples/quiet.example.tsx";
import * as replay from "#radar-chart/examples/replay.example.tsx";
import * as scorecard from "#radar-chart/examples/scorecard.example.tsx";
import * as teams from "#radar-chart/examples/teams.example.tsx";

/**
 * Hand-written scene for two series on five spokes.
 */
export const two: Scene = {
  about: "radar-chart.scorecard.about",
  draw: () => (
    <Room size="lg">
      <scorecard.Scorecard />
    </Room>
  ),
  example: scorecard,
  title: "radar-chart.scorecard.title",
};

/**
 * Hand-written scene for the tooltip open at a spoke.
 */
export const tooltip: Scene = {
  about: "radar-chart.drop.about",
  draw: () => (
    <Room size="lg">
      <drop.Drop />
    </Room>
  ),
  example: drop,
  title: "radar-chart.drop.title",
};

/**
 * Hand-written scene for one filled series.
 */
export const one: Scene = {
  about: "radar-chart.profile.about",
  draw: () => (
    <Room size="lg">
      <profile.Profile />
    </Room>
  ),
  example: profile,
  title: "radar-chart.profile.title",
};

/**
 * Hand-written scene for three series as outlines.
 */
export const outlines: Scene = {
  about: "radar-chart.teams.about",
  draw: () => (
    <Room size="lg">
      <teams.Teams />
    </Room>
  ),
  example: teams,
  title: "radar-chart.teams.title",
};

/**
 * Hand-written scene for the radius ticks written up the top spoke.
 */
export const scale: Scene = {
  about: "radar-chart.coverage.about",
  draw: () => (
    <Room size="lg">
      <coverage.Coverage />
    </Room>
  ),
  example: coverage,
  title: "radar-chart.coverage.title",
};

/**
 * Hand-written scene for the same scores with two spokes swapped.
 */
export const swapped: Scene = {
  about: "radar-chart.order.about",
  draw: () => (
    <Room size="lg">
      <order.Order />
    </Room>
  ),
  example: order,
  title: "radar-chart.order.title",
};

/**
 * Hand-written scene for the polygons animated in, with a replay.
 */
export const animated: Scene = {
  about: "radar-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "radar-chart.replay.title",
};

/**
 * Hand-written scene for the scorecard at a phone's width.
 */
export const narrow: Scene = {
  about: "radar-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <scorecard.Scorecard />
    </Room>
  ),
  example: scorecard,
  title: "radar-chart.narrow.title",
};

/**
 * Hand-written scene for a quarter without scores.
 */
export const empty: Scene = {
  about: "radar-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "radar-chart.quiet.title",
};

export default specimen({
  about: "radar-chart.about",
  id: "components/charts/radar-chart",
  imports: 'import { RadarChart } from "@stealthscale/component-charts";',
  scenes: [two, tooltip, one, outlines, scale, swapped, animated, narrow, empty],
  title: "radar-chart.title",
});
