/**
 * Catalogue page for the scatter plot.
 *
 * @remarks
 *   The scatter plot has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render deals of two segments, the tooltip open at the slowest
 *   mid-market deal, a shop's orders as small points, vendors in four named quadrants, risks with
 *   equal scores spread apart at two widths, the points animated in with a replay, the deals at a
 *   phone's width, and a scatter without points. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `scatter-plot` in
 *   `locales/en/specimen/scatter-plot.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as deals from "#scatter-plot/examples/deals.example.tsx";
import * as orders from "#scatter-plot/examples/orders.example.tsx";
import * as quadrants from "#scatter-plot/examples/quadrants.example.tsx";
import * as quiet from "#scatter-plot/examples/quiet.example.tsx";
import * as replay from "#scatter-plot/examples/replay.example.tsx";
import * as risks from "#scatter-plot/examples/risks.example.tsx";
import * as slowest from "#scatter-plot/examples/slowest.example.tsx";

/**
 * Hand-written scene for two series.
 */
export const two: Scene = {
  about: "scatter-plot.deals.about",
  draw: () => (
    <Room size="lg">
      <deals.Deals />
    </Room>
  ),
  example: deals,
  title: "scatter-plot.deals.title",
};

/**
 * Hand-written scene for the tooltip open at a point.
 */
export const tooltip: Scene = {
  about: "scatter-plot.slowest.about",
  draw: () => (
    <Room size="lg">
      <slowest.Slowest />
    </Room>
  ),
  example: slowest,
  title: "scatter-plot.slowest.title",
};

/**
 * Hand-written scene for points of a stated size.
 */
export const sized: Scene = {
  about: "scatter-plot.orders.about",
  draw: () => (
    <Room size="lg">
      <orders.Orders />
    </Room>
  ),
  example: orders,
  title: "scatter-plot.orders.title",
};

/**
 * Hand-written scene for four named quadrants with a name beside each point.
 */
export const quadrant: Scene = {
  about: "scatter-plot.quadrants.about",
  draw: () => (
    <Room size="lg">
      <quadrants.Quadrants />
    </Room>
  ),
  example: quadrants,
  title: "scatter-plot.quadrants.title",
};

/**
 * Hand-written scene for two points with equal scores spread apart.
 */
export const spread: Scene = {
  about: "scatter-plot.risks.about",
  draw: () => (
    <Room size="lg">
      <risks.Risks />
    </Room>
  ),
  example: risks,
  title: "scatter-plot.risks.title",
};

/**
 * Hand-written scene for the risks at a phone's width, where close names give way.
 */
export const crowded: Scene = {
  about: "scatter-plot.crowded.about",
  draw: () => (
    <Room size="xs">
      <risks.Risks />
    </Room>
  ),
  example: risks,
  title: "scatter-plot.crowded.title",
};

/**
 * Hand-written scene for the points animated in, with a replay.
 */
export const animated: Scene = {
  about: "scatter-plot.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "scatter-plot.replay.title",
};

/**
 * Hand-written scene for the deals at a phone's width.
 */
export const narrow: Scene = {
  about: "scatter-plot.narrow.about",
  draw: () => (
    <Room size="xs">
      <deals.Deals />
    </Room>
  ),
  example: deals,
  title: "scatter-plot.narrow.title",
};

/**
 * Hand-written scene for a scatter without points.
 */
export const empty: Scene = {
  about: "scatter-plot.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "scatter-plot.quiet.title",
};

export default specimen({
  about: "scatter-plot.about",
  id: "components/charts/scatter-plot",
  imports: 'import { ScatterPlot } from "@stealthscale/component-charts";',
  scenes: [two, tooltip, sized, quadrant, spread, crowded, animated, narrow, empty],
  title: "scatter-plot.title",
});
