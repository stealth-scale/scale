/**
 * Catalogue page for the radial bar chart.
 *
 * @remarks
 *   The radial bar chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a plan's use of three quotas, the tooltip open at a
 *   ring, the same use without a maximum, storage past its quota, a day's activity in three hues,
 *   the rings without their tracks, three quarters of a turn, the rings animated in with a replay,
 *   the use at a phone's width, and a plan without usage. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `radial-bar-chart` in
 *   `locales/en/specimen/radial-bar-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as activity from "#radial-bar-chart/examples/activity.example.tsx";
import * as bare from "#radial-bar-chart/examples/bare.example.tsx";
import * as dial from "#radial-bar-chart/examples/dial.example.tsx";
import * as over from "#radial-bar-chart/examples/over.example.tsx";
import * as quiet from "#radial-bar-chart/examples/quiet.example.tsx";
import * as replay from "#radial-bar-chart/examples/replay.example.tsx";
import * as scaled from "#radial-bar-chart/examples/scaled.example.tsx";
import * as seats from "#radial-bar-chart/examples/seats.example.tsx";
import * as usage from "#radial-bar-chart/examples/usage.example.tsx";

/**
 * Hand-written scene for three rings against one maximum.
 */
export const quotas: Scene = {
  about: "radial-bar-chart.usage.about",
  draw: () => (
    <Room size="md">
      <usage.Usage />
    </Room>
  ),
  example: usage,
  title: "radial-bar-chart.usage.title",
};

/**
 * Hand-written scene for the tooltip open at a ring.
 */
export const tooltip: Scene = {
  about: "radial-bar-chart.seats.about",
  draw: () => (
    <Room size="md">
      <seats.Seats />
    </Room>
  ),
  example: seats,
  title: "radial-bar-chart.seats.title",
};

/**
 * Hand-written scene for the scale taken from the largest value.
 */
export const unscaled: Scene = {
  about: "radial-bar-chart.scaled.about",
  draw: () => (
    <Room size="md">
      <scaled.Scaled />
    </Room>
  ),
  example: scaled,
  title: "radial-bar-chart.scaled.title",
};

/**
 * Hand-written scene for a ring past the value of a full turn.
 */
export const overrun: Scene = {
  about: "radial-bar-chart.over.about",
  draw: () => (
    <Room size="md">
      <over.Over />
    </Room>
  ),
  example: over,
  title: "radial-bar-chart.over.title",
};

/**
 * Hand-written scene for rings in hue palettes.
 */
export const colors: Scene = {
  about: "radial-bar-chart.activity.about",
  draw: () => (
    <Room size="md">
      <activity.Activity />
    </Room>
  ),
  example: activity,
  title: "radial-bar-chart.activity.title",
};

/**
 * Hand-written scene for rings without tracks.
 */
export const trackless: Scene = {
  about: "radial-bar-chart.bare.about",
  draw: () => (
    <Room size="md">
      <bare.Bare />
    </Room>
  ),
  example: bare,
  title: "radial-bar-chart.bare.title",
};

/**
 * Hand-written scene for three quarters of a turn.
 */
export const angles: Scene = {
  about: "radial-bar-chart.dial.about",
  draw: () => (
    <Room size="md">
      <dial.Dial />
    </Room>
  ),
  example: dial,
  title: "radial-bar-chart.dial.title",
};

/**
 * Hand-written scene for the rings animated in, with a replay.
 */
export const animated: Scene = {
  about: "radial-bar-chart.replay.about",
  draw: () => (
    <Room size="md">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "radial-bar-chart.replay.title",
};

/**
 * Hand-written scene for the use at a phone's width.
 */
export const narrow: Scene = {
  about: "radial-bar-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <usage.Usage />
    </Room>
  ),
  example: usage,
  title: "radial-bar-chart.narrow.title",
};

/**
 * Hand-written scene for a plan without usage.
 */
export const empty: Scene = {
  about: "radial-bar-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "radial-bar-chart.quiet.title",
};

export default specimen({
  about: "radial-bar-chart.about",
  id: "components/charts/radial-bar-chart",
  imports: 'import { RadialBarChart } from "@stealthscale/component-charts";',
  scenes: [quotas, tooltip, unscaled, overrun, colors, trackless, angles, animated, narrow, empty],
  title: "radial-bar-chart.title",
});
