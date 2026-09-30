/**
 * Catalogue page for the combo chart.
 *
 * @remarks
 *   The combo chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render revenue as bars with its margin on an end axis, orders with
 *   their 7-day average on one axis, the tooltip open at the best month, the marks animated in with
 *   a replay, the revenue at a phone's width, and a range without rows. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `combo-chart` in `locales/en/specimen/combo-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as orders from "#combo-chart/examples/orders.example.tsx";
import * as peak from "#combo-chart/examples/peak.example.tsx";
import * as quiet from "#combo-chart/examples/quiet.example.tsx";
import * as replay from "#combo-chart/examples/replay.example.tsx";
import * as revenue from "#combo-chart/examples/revenue.example.tsx";

/**
 * Hand-written scene for two value axes.
 */
export const ended: Scene = {
  about: "combo-chart.revenue.about",
  draw: () => (
    <Room size="lg">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "combo-chart.revenue.title",
};

/**
 * Hand-written scene for two marks on one value axis.
 */
export const shared: Scene = {
  about: "combo-chart.orders.about",
  draw: () => (
    <Room size="lg">
      <orders.Orders />
    </Room>
  ),
  example: orders,
  title: "combo-chart.orders.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "combo-chart.peak.about",
  draw: () => (
    <Room size="lg">
      <peak.Peak />
    </Room>
  ),
  example: peak,
  title: "combo-chart.peak.title",
};

/**
 * Hand-written scene for the marks animated in, with a replay.
 */
export const animated: Scene = {
  about: "combo-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "combo-chart.replay.title",
};

/**
 * Hand-written scene for two value axes at a phone's width.
 */
export const narrow: Scene = {
  about: "combo-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <revenue.Revenue />
    </Room>
  ),
  example: revenue,
  title: "combo-chart.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "combo-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "combo-chart.quiet.title",
};

export default specimen({
  about: "combo-chart.about",
  id: "components/charts/combo-chart",
  imports: 'import { ComboChart } from "@stealthscale/component-charts";',
  scenes: [ended, shared, tooltip, animated, narrow, empty],
  title: "combo-chart.title",
});
