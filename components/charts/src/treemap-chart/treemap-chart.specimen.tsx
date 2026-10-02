/**
 * Catalogue page for the treemap chart.
 *
 * @remarks
 *   The treemap chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a month's cloud bill by team and service with its two
 *   largest services in the caption, the tooltip at the largest service, a file server's folders in
 *   one level, a team with a long tail of small services, the bill with one team hidden, the teams
 *   in stated palettes without values, the bill with a credit below zero, the bill at a phone's
 *   width, the tiles animated in with a replay, and a treemap without nodes. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `treemap-chart` in `locales/en/specimen/treemap-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as credit from "#treemap-chart/examples/credit.example.tsx";
import * as hidden from "#treemap-chart/examples/hidden.example.tsx";
import * as largest from "#treemap-chart/examples/largest.example.tsx";
import * as palette from "#treemap-chart/examples/palette.example.tsx";
import * as quiet from "#treemap-chart/examples/quiet.example.tsx";
import * as replay from "#treemap-chart/examples/replay.example.tsx";
import * as spend from "#treemap-chart/examples/spend.example.tsx";
import * as storage from "#treemap-chart/examples/storage.example.tsx";
import * as tail from "#treemap-chart/examples/tail.example.tsx";

/**
 * Hand-written scene for a month's cloud bill, its two largest services named in the caption.
 */
export const billed: Scene = {
  about: "treemap-chart.spend.about",
  draw: () => (
    <Room size="lg">
      <spend.Spend />
    </Room>
  ),
  example: spend,
  title: "treemap-chart.spend.title",
};

/**
 * Hand-written scene for the tooltip at the largest service.
 */
export const pointed: Scene = {
  about: "treemap-chart.largest.about",
  draw: () => (
    <Room size="lg">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "treemap-chart.largest.title",
};

/**
 * Hand-written scene for a file server's folders in one level.
 */
export const flat: Scene = {
  about: "treemap-chart.storage.about",
  draw: () => (
    <Room size="lg">
      <storage.Storage />
    </Room>
  ),
  example: storage,
  title: "treemap-chart.storage.title",
};

/**
 * Hand-written scene for a team with a long tail of small services.
 */
export const tailed: Scene = {
  about: "treemap-chart.tail.about",
  draw: () => (
    <Room size="lg">
      <tail.Tail />
    </Room>
  ),
  example: tail,
  title: "treemap-chart.tail.title",
};

/**
 * Hand-written scene for the bill with the platform team hidden.
 */
export const hid: Scene = {
  about: "treemap-chart.hidden.about",
  draw: () => (
    <Room size="lg">
      <hidden.Hidden />
    </Room>
  ),
  example: hidden,
  title: "treemap-chart.hidden.title",
};

/**
 * Hand-written scene for the teams in stated palettes, without values.
 */
export const tinted: Scene = {
  about: "treemap-chart.palette.about",
  draw: () => (
    <Room size="lg">
      <palette.Palette />
    </Room>
  ),
  example: palette,
  title: "treemap-chart.palette.title",
};

/**
 * Hand-written scene for the bill with a credit below zero, named in the caption.
 */
export const credited: Scene = {
  about: "treemap-chart.credit.about",
  draw: () => (
    <Room size="lg">
      <credit.Credit />
    </Room>
  ),
  example: credit,
  title: "treemap-chart.credit.title",
};

/**
 * Hand-written scene for the bill at a phone's width.
 */
export const narrow: Scene = {
  about: "treemap-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <spend.Spend />
    </Room>
  ),
  example: spend,
  title: "treemap-chart.narrow.title",
};

/**
 * Hand-written scene for the tiles animated in, with a replay.
 */
export const animated: Scene = {
  about: "treemap-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "treemap-chart.replay.title",
};

/**
 * Hand-written scene for a treemap without nodes.
 */
export const empty: Scene = {
  about: "treemap-chart.quiet.about",
  draw: () => (
    <Room size="lg">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "treemap-chart.quiet.title",
};

export default specimen({
  about: "treemap-chart.about",
  id: "components/charts/treemap-chart",
  imports: 'import { TreemapChart } from "@stealthscale/component-charts";',
  scenes: [billed, pointed, flat, tailed, hid, tinted, credited, narrow, animated, empty],
  title: "treemap-chart.title",
});
