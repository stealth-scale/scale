/**
 * Catalogue page for the box plot.
 *
 * @remarks
 *   The box plot has no recipe of its own: the chart's recipe styles its figure and the box's
 *   parts, so every scene is hand-written. The scenes render response times in four regions, the
 *   tooltip open at a region, summaries a warehouse query returned, whiskers at 3 interquartile
 *   ranges, delivery times in the teal palette on a fixed axis, a tile without points or key, the
 *   boxes animated in with a replay, the regions at a phone's width, and a box plot without values.
 *   Every scene renders a component from `examples/` and shows that file as its source. The words
 *   are keys under `box-plot` in `locales/en/specimen/box-plot.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as far from "#box-plot/examples/far.example.tsx";
import * as quiet from "#box-plot/examples/quiet.example.tsx";
import * as regions from "#box-plot/examples/regions.example.tsx";
import * as replay from "#box-plot/examples/replay.example.tsx";
import * as shipping from "#box-plot/examples/shipping.example.tsx";
import * as slowest from "#box-plot/examples/slowest.example.tsx";
import * as tile from "#box-plot/examples/tile.example.tsx";
import * as warehouse from "#box-plot/examples/warehouse.example.tsx";

/**
 * Hand-written scene for response times in four regions.
 */
export const automatic: Scene = {
  about: "box-plot.regions.about",
  draw: () => (
    <Room size="lg">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "box-plot.regions.title",
};

/**
 * Hand-written scene for the tooltip open at a group.
 */
export const tooltip: Scene = {
  about: "box-plot.slowest.about",
  draw: () => (
    <Room size="lg">
      <slowest.Slowest />
    </Room>
  ),
  example: slowest,
  title: "box-plot.slowest.title",
};

/**
 * Hand-written scene for groups given as summaries.
 */
export const summaries: Scene = {
  about: "box-plot.warehouse.about",
  draw: () => (
    <Room size="lg">
      <warehouse.Warehouse />
    </Room>
  ),
  example: warehouse,
  title: "box-plot.warehouse.title",
};

/**
 * Hand-written scene for whiskers at 3 interquartile ranges.
 */
export const farOut: Scene = {
  about: "box-plot.far.about",
  draw: () => (
    <Room size="lg">
      <far.FarOut />
    </Room>
  ),
  example: far,
  title: "box-plot.far.title",
};

/**
 * Hand-written scene for delivery times in a palette's color on a fixed axis.
 */
export const colored: Scene = {
  about: "box-plot.shipping.about",
  draw: () => (
    <Room size="lg">
      <shipping.Shipping />
    </Room>
  ),
  example: shipping,
  title: "box-plot.shipping.title",
};

/**
 * Hand-written scene for a tile without outlier points or key.
 */
export const bare: Scene = {
  about: "box-plot.tile.about",
  draw: () => (
    <Room size="md">
      <tile.Tile />
    </Room>
  ),
  example: tile,
  title: "box-plot.tile.title",
};

/**
 * Hand-written scene for the boxes animated in, with a replay.
 */
export const animated: Scene = {
  about: "box-plot.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "box-plot.replay.title",
};

/**
 * Hand-written scene for the regions at a phone's width.
 */
export const narrow: Scene = {
  about: "box-plot.narrow.about",
  draw: () => (
    <Room size="xs">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "box-plot.narrow.title",
};

/**
 * Hand-written scene for a box plot without values.
 */
export const empty: Scene = {
  about: "box-plot.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "box-plot.quiet.title",
};

export default specimen({
  about: "box-plot.about",
  id: "components/charts/box-plot",
  imports: 'import { BoxPlot, boxStats, quantile } from "@stealthscale/component-charts";',
  scenes: [automatic, tooltip, summaries, farOut, colored, bare, animated, narrow, empty],
  title: "box-plot.title",
});
