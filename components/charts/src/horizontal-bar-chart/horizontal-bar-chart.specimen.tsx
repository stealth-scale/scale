/**
 * Catalogue page for the horizontal bar chart.
 *
 * @remarks
 *   The horizontal bar chart has no recipe of its own: the chart's recipe styles its figure, so
 *   every scene is hand-written. The scenes render sessions per country as a ranking, plan
 *   attainment per team as bullet graphs, the tooltip open at the first row, the bars animated in
 *   with a replay, the ranking at a phone's width, and a week without sessions. Every scene renders
 *   a component from `examples/` and shows that file as its source. The words are keys under
 *   `horizontal-bar-chart` in `locales/en/specimen/horizontal-bar-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as bullet from "#horizontal-bar-chart/examples/bullet.example.tsx";
import * as countries from "#horizontal-bar-chart/examples/countries.example.tsx";
import * as leader from "#horizontal-bar-chart/examples/leader.example.tsx";
import * as replay from "#horizontal-bar-chart/examples/replay.example.tsx";
import * as unvisited from "#horizontal-bar-chart/examples/unvisited.example.tsx";

/**
 * Hand-written scene for a ranking of countries.
 */
export const ranking: Scene = {
  about: "horizontal-bar-chart.countries.about",
  draw: () => (
    <Room size="lg">
      <countries.Countries />
    </Room>
  ),
  example: countries,
  title: "horizontal-bar-chart.countries.title",
};

/**
 * Hand-written scene for bullet graphs: each team against its plan, over the zones.
 */
export const bullets: Scene = {
  about: "horizontal-bar-chart.bullet.about",
  draw: () => (
    <Room size="lg">
      <bullet.Bullet />
    </Room>
  ),
  example: bullet,
  title: "horizontal-bar-chart.bullet.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "horizontal-bar-chart.leader.about",
  draw: () => (
    <Room size="lg">
      <leader.Leader />
    </Room>
  ),
  example: leader,
  title: "horizontal-bar-chart.leader.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "horizontal-bar-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "horizontal-bar-chart.replay.title",
};

/**
 * Hand-written scene for the ranking at a phone's width.
 */
export const narrow: Scene = {
  about: "horizontal-bar-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <countries.Countries />
    </Room>
  ),
  example: countries,
  title: "horizontal-bar-chart.narrow.title",
};

/**
 * Hand-written scene for a week without sessions.
 */
export const empty: Scene = {
  about: "horizontal-bar-chart.unvisited.about",
  draw: () => (
    <Room size="md">
      <unvisited.Unvisited />
    </Room>
  ),
  example: unvisited,
  title: "horizontal-bar-chart.unvisited.title",
};

export default specimen({
  about: "horizontal-bar-chart.about",
  id: "components/charts/horizontal-bar-chart",
  imports: 'import { HorizontalBarChart } from "@stealthscale/component-charts";',
  scenes: [ranking, bullets, tooltip, animated, narrow, empty],
  title: "horizontal-bar-chart.title",
});
