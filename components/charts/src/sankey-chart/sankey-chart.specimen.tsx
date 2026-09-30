/**
 * Catalogue page for the sankey chart.
 *
 * @remarks
 *   The sankey chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render a month's visitors by channel and outcome with two rates in
 *   the caption, the tooltip at a flow, a year's income statement in compact euros, a checkout
 *   whose refunds close a loop, a support queue that loses tickets, the channels in stated palettes
 *   without values, the visitors at a phone's width, and a sankey without flows. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `sankey-chart` in `locales/en/specimen/sankey-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as income from "#sankey-chart/examples/income.example.tsx";
import * as leak from "#sankey-chart/examples/leak.example.tsx";
import * as loop from "#sankey-chart/examples/loop.example.tsx";
import * as palette from "#sankey-chart/examples/palette.example.tsx";
import * as quiet from "#sankey-chart/examples/quiet.example.tsx";
import * as signups from "#sankey-chart/examples/signups.example.tsx";
import * as visitors from "#sankey-chart/examples/visitors.example.tsx";

/**
 * Hand-written scene for a month's visitors, two rates in the caption.
 */
export const visited: Scene = {
  about: "sankey-chart.visitors.about",
  draw: () => (
    <Room size="lg">
      <visitors.Visitors />
    </Room>
  ),
  example: visitors,
  title: "sankey-chart.visitors.title",
};

/**
 * Hand-written scene for the tooltip at a flow.
 */
export const pointed: Scene = {
  about: "sankey-chart.signups.about",
  draw: () => (
    <Room size="lg">
      <signups.Signups />
    </Room>
  ),
  example: signups,
  title: "sankey-chart.signups.title",
};

/**
 * Hand-written scene for a year's income statement in compact euros.
 */
export const stated: Scene = {
  about: "sankey-chart.income.about",
  draw: () => (
    <Room size="lg">
      <income.Income />
    </Room>
  ),
  example: income,
  title: "sankey-chart.income.title",
};

/**
 * Hand-written scene for a checkout whose refunds close a loop, named in the caption.
 */
export const looped: Scene = {
  about: "sankey-chart.loop.about",
  draw: () => (
    <Room size="lg">
      <loop.Loop />
    </Room>
  ),
  example: loop,
  title: "sankey-chart.loop.title",
};

/**
 * Hand-written scene for a support queue that loses tickets, named in the caption.
 */
export const leaking: Scene = {
  about: "sankey-chart.leak.about",
  draw: () => (
    <Room size="lg">
      <leak.Leak />
    </Room>
  ),
  example: leak,
  title: "sankey-chart.leak.title",
};

/**
 * Hand-written scene for the channels in stated palettes, without values.
 */
export const tinted: Scene = {
  about: "sankey-chart.palette.about",
  draw: () => (
    <Room size="lg">
      <palette.Palette />
    </Room>
  ),
  example: palette,
  title: "sankey-chart.palette.title",
};

/**
 * Hand-written scene for the visitors at a phone's width.
 */
export const narrow: Scene = {
  about: "sankey-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <visitors.Visitors />
    </Room>
  ),
  example: visitors,
  title: "sankey-chart.narrow.title",
};

/**
 * Hand-written scene for a sankey without flows.
 */
export const empty: Scene = {
  about: "sankey-chart.quiet.about",
  draw: () => (
    <Room size="lg">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "sankey-chart.quiet.title",
};

export default specimen({
  about: "sankey-chart.about",
  id: "components/charts/sankey-chart",
  imports: 'import { SankeyChart } from "@stealthscale/component-charts";',
  scenes: [visited, pointed, stated, looped, leaking, tinted, narrow, empty],
  title: "sankey-chart.title",
});
