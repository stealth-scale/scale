/**
 * Catalogue page for the range chart.
 *
 * @remarks
 *   The range chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render a forecast with its 80% interval, a week of temperature
 *   ranges, the tooltip open at the forecast's last week, the band animated in with a replay, the
 *   forecast at a phone's width, and a range without rows. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `range-chart` in
 *   `locales/en/specimen/range-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as forecast from "#range-chart/examples/forecast.example.tsx";
import * as horizon from "#range-chart/examples/horizon.example.tsx";
import * as quiet from "#range-chart/examples/quiet.example.tsx";
import * as replay from "#range-chart/examples/replay.example.tsx";
import * as temperature from "#range-chart/examples/temperature.example.tsx";

/**
 * Hand-written scene for a forecast with its interval.
 */
export const interval: Scene = {
  about: "range-chart.forecast.about",
  draw: () => (
    <Room size="lg">
      <forecast.Forecast />
    </Room>
  ),
  example: forecast,
  title: "range-chart.forecast.title",
};

/**
 * Hand-written scene for a daily low and high.
 */
export const daily: Scene = {
  about: "range-chart.temperature.about",
  draw: () => (
    <Room size="lg">
      <temperature.Temperature />
    </Room>
  ),
  example: temperature,
  title: "range-chart.temperature.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "range-chart.horizon.about",
  draw: () => (
    <Room size="lg">
      <horizon.Horizon />
    </Room>
  ),
  example: horizon,
  title: "range-chart.horizon.title",
};

/**
 * Hand-written scene for the band animated in, with a replay.
 */
export const animated: Scene = {
  about: "range-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "range-chart.replay.title",
};

/**
 * Hand-written scene for the forecast at a phone's width.
 */
export const narrow: Scene = {
  about: "range-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <forecast.Forecast />
    </Room>
  ),
  example: forecast,
  title: "range-chart.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "range-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "range-chart.quiet.title",
};

export default specimen({
  about: "range-chart.about",
  id: "components/charts/range-chart",
  imports: 'import { RangeChart } from "@stealthscale/component-charts";',
  scenes: [interval, daily, tooltip, animated, narrow, empty],
  title: "range-chart.title",
});
