/**
 * Catalogue page for the percent stacked bar chart.
 *
 * @remarks
 *   The percent stacked bar chart has no recipe of its own: the chart's recipe styles its figure,
 *   so every scene is hand-written. The scenes render customers per plan in each region as shares,
 *   the tooltip open at the Americas, the segments animated in with a replay, the mix at a phone's
 *   width, and a chart without rows. Every scene renders a component from `examples/` and shows
 *   that file as its source. The words are keys under `percent-stacked-bar` in
 *   `locales/en/specimen/percent-stacked-bar.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as mix from "#percent-stacked-bar/examples/mix.example.tsx";
import * as region from "#percent-stacked-bar/examples/region.example.tsx";
import * as replay from "#percent-stacked-bar/examples/replay.example.tsx";
import * as unsold from "#percent-stacked-bar/examples/unsold.example.tsx";

/**
 * Hand-written scene for shares per region.
 */
export const shares: Scene = {
  about: "percent-stacked-bar.mix.about",
  draw: () => (
    <Room size="lg">
      <mix.Mix />
    </Room>
  ),
  example: mix,
  title: "percent-stacked-bar.mix.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "percent-stacked-bar.region.about",
  draw: () => (
    <Room size="lg">
      <region.Region />
    </Room>
  ),
  example: region,
  title: "percent-stacked-bar.region.title",
};

/**
 * Hand-written scene for the segments animated in, with a replay.
 */
export const animated: Scene = {
  about: "percent-stacked-bar.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "percent-stacked-bar.replay.title",
};

/**
 * Hand-written scene for the mix at a phone's width.
 */
export const narrow: Scene = {
  about: "percent-stacked-bar.narrow.about",
  draw: () => (
    <Room size="xs">
      <mix.Mix />
    </Room>
  ),
  example: mix,
  title: "percent-stacked-bar.narrow.title",
};

/**
 * Hand-written scene for a chart without rows.
 */
export const empty: Scene = {
  about: "percent-stacked-bar.unsold.about",
  draw: () => (
    <Room size="md">
      <unsold.Unsold />
    </Room>
  ),
  example: unsold,
  title: "percent-stacked-bar.unsold.title",
};

export default specimen({
  about: "percent-stacked-bar.about",
  id: "components/charts/percent-stacked-bar",
  imports: 'import { PercentStackedBar } from "@stealthscale/component-charts";',
  scenes: [shares, tooltip, animated, narrow, empty],
  title: "percent-stacked-bar.title",
});
