/**
 * Catalogue page for the candlestick chart.
 *
 * @remarks
 *   The candlestick chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render a month of a share's daily prices, the tooltip open at
 *   its largest day, a currency pair to four decimals with a flat day, a dashed line at the month's
 *   opening price, the candles animated in with a replay, the month at a phone's width, and a
 *   candlestick chart without prices. Every scene renders a component from `examples/` and shows
 *   that file as its source. The words are keys under `candlestick-chart` in
 *   `locales/en/specimen/candlestick-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as busiest from "#candlestick-chart/examples/busiest.example.tsx";
import * as daily from "#candlestick-chart/examples/daily.example.tsx";
import * as opening from "#candlestick-chart/examples/opening.example.tsx";
import * as pair from "#candlestick-chart/examples/pair.example.tsx";
import * as quiet from "#candlestick-chart/examples/quiet.example.tsx";
import * as replay from "#candlestick-chart/examples/replay.example.tsx";

/**
 * Hand-written scene for a month of a share's daily prices.
 */
export const automatic: Scene = {
  about: "candlestick-chart.daily.about",
  draw: () => (
    <Room size="lg">
      <daily.Daily />
    </Room>
  ),
  example: daily,
  title: "candlestick-chart.daily.title",
};

/**
 * Hand-written scene for the tooltip open at a day.
 */
export const tooltip: Scene = {
  about: "candlestick-chart.busiest.about",
  draw: () => (
    <Room size="lg">
      <busiest.Busiest />
    </Room>
  ),
  example: busiest,
  title: "candlestick-chart.busiest.title",
};

/**
 * Hand-written scene for a currency pair with a flat day.
 */
export const decimals: Scene = {
  about: "candlestick-chart.pair.about",
  draw: () => (
    <Room size="lg">
      <pair.Pair />
    </Room>
  ),
  example: pair,
  title: "candlestick-chart.pair.title",
};

/**
 * Hand-written scene for a reference line at the month's opening price.
 */
export const referenced: Scene = {
  about: "candlestick-chart.opening.about",
  draw: () => (
    <Room size="lg">
      <opening.Opening />
    </Room>
  ),
  example: opening,
  title: "candlestick-chart.opening.title",
};

/**
 * Hand-written scene for the candles animated in, with a replay.
 */
export const animated: Scene = {
  about: "candlestick-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "candlestick-chart.replay.title",
};

/**
 * Hand-written scene for the month at a phone's width.
 */
export const narrow: Scene = {
  about: "candlestick-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <daily.Daily />
    </Room>
  ),
  example: daily,
  title: "candlestick-chart.narrow.title",
};

/**
 * Hand-written scene for a candlestick chart without prices.
 */
export const empty: Scene = {
  about: "candlestick-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "candlestick-chart.quiet.title",
};

export default specimen({
  about: "candlestick-chart.about",
  id: "components/charts/candlestick-chart",
  imports:
    'import { candleChange, candleDirection, CandlestickChart } from "@stealthscale/component-charts";',
  scenes: [automatic, tooltip, decimals, referenced, animated, narrow, empty],
  title: "candlestick-chart.title",
});
