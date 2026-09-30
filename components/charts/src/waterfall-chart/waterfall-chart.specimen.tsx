/**
 * Catalogue page for the waterfall chart.
 *
 * @remarks
 *   The waterfall chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a revenue bridge that opens on a balance, an income
 *   statement with subtotals, a cash flow below zero, a year of headcount changes without values
 *   or connectors, the tooltip open at a fall, the bars animated in with a replay, the bridge at a
 *   phone's width, and a chart without steps. Every scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `waterfall-chart` in
 *   `locales/en/specimen/waterfall-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as bridge from "#waterfall-chart/examples/bridge.example.tsx";
import * as cash from "#waterfall-chart/examples/cash.example.tsx";
import * as churn from "#waterfall-chart/examples/churn.example.tsx";
import * as headcount from "#waterfall-chart/examples/headcount.example.tsx";
import * as profit from "#waterfall-chart/examples/profit.example.tsx";
import * as quiet from "#waterfall-chart/examples/quiet.example.tsx";
import * as replay from "#waterfall-chart/examples/replay.example.tsx";

/**
 * Hand-written scene for a bridge that opens on a balance.
 */
export const opening: Scene = {
  about: "waterfall-chart.bridge.about",
  draw: () => (
    <Room size="lg">
      <bridge.Bridge />
    </Room>
  ),
  example: bridge,
  title: "waterfall-chart.bridge.title",
};

/**
 * Hand-written scene for subtotals between groups of steps.
 */
export const subtotals: Scene = {
  about: "waterfall-chart.profit.about",
  draw: () => (
    <Room size="lg">
      <profit.Profit />
    </Room>
  ),
  example: profit,
  title: "waterfall-chart.profit.title",
};

/**
 * Hand-written scene for a running total below zero.
 */
export const negative: Scene = {
  about: "waterfall-chart.cash.about",
  draw: () => (
    <Room size="lg">
      <cash.Cash />
    </Room>
  ),
  example: cash,
  title: "waterfall-chart.cash.title",
};

/**
 * Hand-written scene for many steps without values or connectors.
 */
export const many: Scene = {
  about: "waterfall-chart.headcount.about",
  draw: () => (
    <Room size="lg">
      <headcount.Headcount />
    </Room>
  ),
  example: headcount,
  title: "waterfall-chart.headcount.title",
};

/**
 * Hand-written scene for the tooltip open at a step.
 */
export const tooltip: Scene = {
  about: "waterfall-chart.churn.about",
  draw: () => (
    <Room size="lg">
      <churn.Churn />
    </Room>
  ),
  example: churn,
  title: "waterfall-chart.churn.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "waterfall-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "waterfall-chart.replay.title",
};

/**
 * Hand-written scene for the bridge at a phone's width.
 */
export const narrow: Scene = {
  about: "waterfall-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <bridge.Bridge />
    </Room>
  ),
  example: bridge,
  title: "waterfall-chart.narrow.title",
};

/**
 * Hand-written scene for a chart without steps.
 */
export const empty: Scene = {
  about: "waterfall-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "waterfall-chart.quiet.title",
};

export default specimen({
  about: "waterfall-chart.about",
  id: "components/charts/waterfall-chart",
  imports: 'import { WaterfallChart } from "@stealthscale/component-charts";',
  scenes: [opening, subtotals, negative, many, tooltip, animated, narrow, empty],
  title: "waterfall-chart.title",
});
