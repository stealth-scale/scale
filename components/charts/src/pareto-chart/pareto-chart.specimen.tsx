/**
 * Catalogue page for the Pareto chart.
 *
 * @remarks
 *   The Pareto chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render support tickets per reason, defects per cause at a 90%
 *   threshold, the tooltip open at the second reason, the marks animated in with a replay, the
 *   tickets at a phone's width, and a range without rows. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `pareto-chart` in
 *   `locales/en/specimen/pareto-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as defects from "#pareto-chart/examples/defects.example.tsx";
import * as largest from "#pareto-chart/examples/largest.example.tsx";
import * as quiet from "#pareto-chart/examples/quiet.example.tsx";
import * as replay from "#pareto-chart/examples/replay.example.tsx";
import * as tickets from "#pareto-chart/examples/tickets.example.tsx";

/**
 * Hand-written scene for categories sorted by size with their running share.
 */
export const sorted: Scene = {
  about: "pareto-chart.tickets.about",
  draw: () => (
    <Room size="lg">
      <tickets.Tickets />
    </Room>
  ),
  example: tickets,
  title: "pareto-chart.tickets.title",
};

/**
 * Hand-written scene for a stated threshold with its label.
 */
export const threshold: Scene = {
  about: "pareto-chart.defects.about",
  draw: () => (
    <Room size="lg">
      <defects.Defects />
    </Room>
  ),
  example: defects,
  title: "pareto-chart.defects.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "pareto-chart.largest.about",
  draw: () => (
    <Room size="lg">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "pareto-chart.largest.title",
};

/**
 * Hand-written scene for the marks animated in, with a replay.
 */
export const animated: Scene = {
  about: "pareto-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "pareto-chart.replay.title",
};

/**
 * Hand-written scene for the tickets at a phone's width.
 */
export const narrow: Scene = {
  about: "pareto-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <tickets.Tickets />
    </Room>
  ),
  example: tickets,
  title: "pareto-chart.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "pareto-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "pareto-chart.quiet.title",
};

export default specimen({
  about: "pareto-chart.about",
  id: "components/charts/pareto-chart",
  imports: 'import { ParetoChart } from "@stealthscale/component-charts";',
  scenes: [sorted, threshold, tooltip, animated, narrow, empty],
  title: "pareto-chart.title",
});
