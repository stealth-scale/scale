/**
 * Catalogue page for the sunburst chart.
 *
 * @remarks
 *   The sunburst chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a month's cloud bill by team, service and resource
 *   with its total in the hole, the tooltip at the largest resource, a file server's folders in two
 *   levels, a team with a long tail of small services, the bill with one team hidden, the teams in
 *   stated palettes without totals, the bill with a credit below zero, the bill at a phone's width,
 *   the arcs animated in with a replay, and a sunburst without nodes. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `sunburst-chart` in `locales/en/specimen/sunburst-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as credit from "#sunburst-chart/examples/credit.example.tsx";
import * as hidden from "#sunburst-chart/examples/hidden.example.tsx";
import * as largest from "#sunburst-chart/examples/largest.example.tsx";
import * as palette from "#sunburst-chart/examples/palette.example.tsx";
import * as quiet from "#sunburst-chart/examples/quiet.example.tsx";
import * as replay from "#sunburst-chart/examples/replay.example.tsx";
import * as spend from "#sunburst-chart/examples/spend.example.tsx";
import * as storage from "#sunburst-chart/examples/storage.example.tsx";
import * as tail from "#sunburst-chart/examples/tail.example.tsx";

/**
 * Hand-written scene for a month's cloud bill, its total in the hole.
 */
export const billed: Scene = {
  about: "sunburst-chart.spend.about",
  draw: () => (
    <Room size="md">
      <spend.Spend />
    </Room>
  ),
  example: spend,
  title: "sunburst-chart.spend.title",
};

/**
 * Hand-written scene for the tooltip at the largest resource.
 */
export const pointed: Scene = {
  about: "sunburst-chart.largest.about",
  draw: () => (
    <Room size="md">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "sunburst-chart.largest.title",
};

/**
 * Hand-written scene for a file server's folders in two levels.
 */
export const folders: Scene = {
  about: "sunburst-chart.storage.about",
  draw: () => (
    <Room size="md">
      <storage.Storage />
    </Room>
  ),
  example: storage,
  title: "sunburst-chart.storage.title",
};

/**
 * Hand-written scene for a team with a long tail of small services.
 */
export const tailed: Scene = {
  about: "sunburst-chart.tail.about",
  draw: () => (
    <Room size="md">
      <tail.Tail />
    </Room>
  ),
  example: tail,
  title: "sunburst-chart.tail.title",
};

/**
 * Hand-written scene for the bill with the platform team hidden.
 */
export const hid: Scene = {
  about: "sunburst-chart.hidden.about",
  draw: () => (
    <Room size="md">
      <hidden.Hidden />
    </Room>
  ),
  example: hidden,
  title: "sunburst-chart.hidden.title",
};

/**
 * Hand-written scene for the teams in stated palettes, without totals.
 */
export const tinted: Scene = {
  about: "sunburst-chart.palette.about",
  draw: () => (
    <Room size="md">
      <palette.Palette />
    </Room>
  ),
  example: palette,
  title: "sunburst-chart.palette.title",
};

/**
 * Hand-written scene for the bill with a credit below zero, named in the caption.
 */
export const credited: Scene = {
  about: "sunburst-chart.credit.about",
  draw: () => (
    <Room size="md">
      <credit.Credit />
    </Room>
  ),
  example: credit,
  title: "sunburst-chart.credit.title",
};

/**
 * Hand-written scene for the bill at a phone's width.
 */
export const narrow: Scene = {
  about: "sunburst-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <spend.Spend />
    </Room>
  ),
  example: spend,
  title: "sunburst-chart.narrow.title",
};

/**
 * Hand-written scene for the arcs animated in, with a replay.
 */
export const animated: Scene = {
  about: "sunburst-chart.replay.about",
  draw: () => (
    <Room size="md">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "sunburst-chart.replay.title",
};

/**
 * Hand-written scene for a sunburst without nodes.
 */
export const empty: Scene = {
  about: "sunburst-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "sunburst-chart.quiet.title",
};

export default specimen({
  about: "sunburst-chart.about",
  id: "components/charts/sunburst-chart",
  imports: 'import { SunburstChart } from "@stealthscale/component-charts";',
  scenes: [billed, pointed, folders, tailed, hid, tinted, credited, narrow, animated, empty],
  title: "sunburst-chart.title",
});
