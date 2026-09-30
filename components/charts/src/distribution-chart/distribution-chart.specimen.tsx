/**
 * Catalogue page for the distribution chart.
 *
 * @remarks
 *   The distribution chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render delivery times of two regions, session lengths of two
 *   plans as shares, the tooltip open at a bin, a series the legend hides at first, the bars
 *   animated in with a replay, the regions at a phone's width, and a chart without values. Every
 *   scene renders a component from `examples/` and shows that file as its source. The words are
 *   keys under `distribution-chart` in `locales/en/specimen/distribution-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as busiest from "#distribution-chart/examples/busiest.example.tsx";
import * as hidden from "#distribution-chart/examples/hidden.example.tsx";
import * as quiet from "#distribution-chart/examples/quiet.example.tsx";
import * as regions from "#distribution-chart/examples/regions.example.tsx";
import * as replay from "#distribution-chart/examples/replay.example.tsx";
import * as sessions from "#distribution-chart/examples/sessions.example.tsx";

/**
 * Hand-written scene for two series counted into the same bins.
 */
export const two: Scene = {
  about: "distribution-chart.regions.about",
  draw: () => (
    <Room size="lg">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "distribution-chart.regions.title",
};

/**
 * Hand-written scene for series of different sizes as shares.
 */
export const shares: Scene = {
  about: "distribution-chart.sessions.about",
  draw: () => (
    <Room size="lg">
      <sessions.Sessions />
    </Room>
  ),
  example: sessions,
  title: "distribution-chart.sessions.title",
};

/**
 * Hand-written scene for the tooltip open at a bin.
 */
export const tooltip: Scene = {
  about: "distribution-chart.busiest.about",
  draw: () => (
    <Room size="lg">
      <busiest.Busiest />
    </Room>
  ),
  example: busiest,
  title: "distribution-chart.busiest.title",
};

/**
 * Hand-written scene for a series the legend hides at first.
 */
export const hiding: Scene = {
  about: "distribution-chart.hidden.about",
  draw: () => (
    <Room size="lg">
      <hidden.Hidden />
    </Room>
  ),
  example: hidden,
  title: "distribution-chart.hidden.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "distribution-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "distribution-chart.replay.title",
};

/**
 * Hand-written scene for the regions at a phone's width.
 */
export const narrow: Scene = {
  about: "distribution-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "distribution-chart.narrow.title",
};

/**
 * Hand-written scene for a chart without values.
 */
export const empty: Scene = {
  about: "distribution-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "distribution-chart.quiet.title",
};

export default specimen({
  about: "distribution-chart.about",
  id: "components/charts/distribution-chart",
  imports: 'import { DistributionChart } from "@stealthscale/component-charts";',
  scenes: [two, shares, tooltip, hiding, animated, narrow, empty],
  title: "distribution-chart.title",
});
