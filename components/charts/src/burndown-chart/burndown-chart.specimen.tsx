/**
 * Catalogue page for the burndown chart.
 *
 * @remarks
 *   The burndown chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a sprint behind its plan, one ahead of it, one whose
 *   work grew, the tooltip open at the last reading, the lines animated in with a replay, the
 *   sprint at a phone's width, and a sprint without periods. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `burndown-chart` in
 *   `locales/en/specimen/burndown-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as ahead from "#burndown-chart/examples/ahead.example.tsx";
import * as quiet from "#burndown-chart/examples/quiet.example.tsx";
import * as replay from "#burndown-chart/examples/replay.example.tsx";
import * as scope from "#burndown-chart/examples/scope.example.tsx";
import * as sprint from "#burndown-chart/examples/sprint.example.tsx";
import * as today from "#burndown-chart/examples/today.example.tsx";

/**
 * Hand-written scene for a sprint behind its plan.
 */
export const behind: Scene = {
  about: "burndown-chart.sprint.about",
  draw: () => (
    <Room size="lg">
      <sprint.Sprint />
    </Room>
  ),
  example: sprint,
  title: "burndown-chart.sprint.title",
};

/**
 * Hand-written scene for a sprint ahead of its plan.
 */
export const early: Scene = {
  about: "burndown-chart.ahead.about",
  draw: () => (
    <Room size="lg">
      <ahead.Ahead />
    </Room>
  ),
  example: ahead,
  title: "burndown-chart.ahead.title",
};

/**
 * Hand-written scene for work that grew, without a projection.
 */
export const grown: Scene = {
  about: "burndown-chart.scope.about",
  draw: () => (
    <Room size="lg">
      <scope.Scope />
    </Room>
  ),
  example: scope,
  title: "burndown-chart.scope.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "burndown-chart.today.about",
  draw: () => (
    <Room size="lg">
      <today.Today />
    </Room>
  ),
  example: today,
  title: "burndown-chart.today.title",
};

/**
 * Hand-written scene for the lines animated in, with a replay.
 */
export const animated: Scene = {
  about: "burndown-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "burndown-chart.replay.title",
};

/**
 * Hand-written scene for the sprint at a phone's width.
 */
export const narrow: Scene = {
  about: "burndown-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <sprint.Sprint />
    </Room>
  ),
  example: sprint,
  title: "burndown-chart.narrow.title",
};

/**
 * Hand-written scene for a sprint without periods.
 */
export const empty: Scene = {
  about: "burndown-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "burndown-chart.quiet.title",
};

export default specimen({
  about: "burndown-chart.about",
  id: "components/charts/burndown-chart",
  imports: 'import { BurndownChart } from "@stealthscale/component-charts";',
  scenes: [behind, early, grown, tooltip, animated, narrow, empty],
  title: "burndown-chart.title",
});
