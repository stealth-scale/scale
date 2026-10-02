/**
 * Catalogue page for the polar area chart.
 *
 * @remarks
 *   The polar area chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a day of requests, the tooltip open at noon, the day
 *   against a capacity, a year of rainfall, a month of wind in the teal palette, the rose without
 *   names, a hidden wedge, the wedges animated in with a replay, the day at a phone's width, and a
 *   day without requests. Every scene renders a component from `examples/` and shows that file as
 *   its source. The words are keys under `polar-area-chart` in
 *   `locales/en/specimen/polar-area-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as bare from "#polar-area-chart/examples/bare.example.tsx";
import * as capacity from "#polar-area-chart/examples/capacity.example.tsx";
import * as hidden from "#polar-area-chart/examples/hidden.example.tsx";
import * as noon from "#polar-area-chart/examples/noon.example.tsx";
import * as quiet from "#polar-area-chart/examples/quiet.example.tsx";
import * as rainfall from "#polar-area-chart/examples/rainfall.example.tsx";
import * as replay from "#polar-area-chart/examples/replay.example.tsx";
import * as requests from "#polar-area-chart/examples/requests.example.tsx";
import * as wind from "#polar-area-chart/examples/wind.example.tsx";

/**
 * Hand-written scene for a day of requests.
 */
export const day: Scene = {
  about: "polar-area-chart.requests.about",
  draw: () => (
    <Room size="md">
      <requests.Requests />
    </Room>
  ),
  example: requests,
  title: "polar-area-chart.requests.title",
};

/**
 * Hand-written scene for the tooltip open at noon.
 */
export const tooltip: Scene = {
  about: "polar-area-chart.noon.about",
  draw: () => (
    <Room size="md">
      <noon.Noon />
    </Room>
  ),
  example: noon,
  title: "polar-area-chart.noon.title",
};

/**
 * Hand-written scene for a full radius fixed at a capacity.
 */
export const capped: Scene = {
  about: "polar-area-chart.capacity.about",
  draw: () => (
    <Room size="md">
      <capacity.Capacity />
    </Room>
  ),
  example: capacity,
  title: "polar-area-chart.capacity.title",
};

/**
 * Hand-written scene for twelve months.
 */
export const year: Scene = {
  about: "polar-area-chart.rainfall.about",
  draw: () => (
    <Room size="md">
      <rainfall.Rainfall />
    </Room>
  ),
  example: rainfall,
  title: "polar-area-chart.rainfall.title",
};

/**
 * Hand-written scene for the compass in the teal palette.
 */
export const colors: Scene = {
  about: "polar-area-chart.wind.about",
  draw: () => (
    <Room size="md">
      <wind.Wind />
    </Room>
  ),
  example: wind,
  title: "polar-area-chart.wind.title",
};

/**
 * Hand-written scene for the rose without names.
 */
export const nameless: Scene = {
  about: "polar-area-chart.bare.about",
  draw: () => (
    <Room size="md">
      <bare.Bare />
    </Room>
  ),
  example: bare,
  title: "polar-area-chart.bare.title",
};

/**
 * Hand-written scene for a wedge the legend hides.
 */
export const hiding: Scene = {
  about: "polar-area-chart.hidden.about",
  draw: () => (
    <Room size="md">
      <hidden.Hidden />
    </Room>
  ),
  example: hidden,
  title: "polar-area-chart.hidden.title",
};

/**
 * Hand-written scene for the wedges animated in, with a replay.
 */
export const animated: Scene = {
  about: "polar-area-chart.replay.about",
  draw: () => (
    <Room size="md">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "polar-area-chart.replay.title",
};

/**
 * Hand-written scene for the day at a phone's width.
 */
export const narrow: Scene = {
  about: "polar-area-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <requests.Requests />
    </Room>
  ),
  example: requests,
  title: "polar-area-chart.narrow.title",
};

/**
 * Hand-written scene for a day without requests.
 */
export const empty: Scene = {
  about: "polar-area-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "polar-area-chart.quiet.title",
};

export default specimen({
  about: "polar-area-chart.about",
  id: "components/charts/polar-area-chart",
  imports: 'import { PolarAreaChart } from "@stealthscale/component-charts";',
  scenes: [day, tooltip, capped, year, colors, nameless, hiding, animated, narrow, empty],
  title: "polar-area-chart.title",
});
