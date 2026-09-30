/**
 * Catalogue page for the stacked area chart.
 *
 * @remarks
 *   The stacked area chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render sessions per source stacked into each day's total,
 *   requests per client as shares of each month, the tooltip open at Thursday, the bands animated
 *   in with a replay, the sessions at a phone's width, and a week without sessions. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `stacked-area-chart` in `locales/en/specimen/stacked-area-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as launch from "#stacked-area-chart/examples/launch.example.tsx";
import * as replay from "#stacked-area-chart/examples/replay.example.tsx";
import * as share from "#stacked-area-chart/examples/share.example.tsx";
import * as traffic from "#stacked-area-chart/examples/traffic.example.tsx";
import * as untracked from "#stacked-area-chart/examples/untracked.example.tsx";

/**
 * Hand-written scene for series stacked into a total.
 */
export const totals: Scene = {
  about: "stacked-area-chart.traffic.about",
  draw: () => (
    <Room size="lg">
      <traffic.Traffic />
    </Room>
  ),
  example: traffic,
  title: "stacked-area-chart.traffic.title",
};

/**
 * Hand-written scene for series stacked into shares.
 */
export const shares: Scene = {
  about: "stacked-area-chart.share.about",
  draw: () => (
    <Room size="lg">
      <share.Share />
    </Room>
  ),
  example: share,
  title: "stacked-area-chart.share.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "stacked-area-chart.launch.about",
  draw: () => (
    <Room size="lg">
      <launch.Launch />
    </Room>
  ),
  example: launch,
  title: "stacked-area-chart.launch.title",
};

/**
 * Hand-written scene for the bands animated in, with a replay.
 */
export const animated: Scene = {
  about: "stacked-area-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "stacked-area-chart.replay.title",
};

/**
 * Hand-written scene for the sessions at a phone's width.
 */
export const narrow: Scene = {
  about: "stacked-area-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <traffic.Traffic />
    </Room>
  ),
  example: traffic,
  title: "stacked-area-chart.narrow.title",
};

/**
 * Hand-written scene for a week without sessions.
 */
export const empty: Scene = {
  about: "stacked-area-chart.untracked.about",
  draw: () => (
    <Room size="md">
      <untracked.Untracked />
    </Room>
  ),
  example: untracked,
  title: "stacked-area-chart.untracked.title",
};

export default specimen({
  about: "stacked-area-chart.about",
  id: "components/charts/stacked-area-chart",
  imports: 'import { StackedAreaChart } from "@stealthscale/component-charts";',
  scenes: [totals, shares, tooltip, animated, narrow, empty],
  title: "stacked-area-chart.title",
});
