/**
 * Catalogue page for the gauge chart.
 *
 * @remarks
 *   The gauge chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render a latency in its watch zone, the latency past its error
 *   budget, zones that end early, a throughput without zones, a value past the dial's end, a disk's
 *   use as a percentage, three gauges as tiles, the dial animated in with a replay, the latency at
 *   a phone's width, and a gauge without a reading. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `gauge-chart` in
 *   `locales/en/specimen/gauge-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as critical from "#gauge-chart/examples/critical.example.tsx";
import * as disk from "#gauge-chart/examples/disk.example.tsx";
import * as latency from "#gauge-chart/examples/latency.example.tsx";
import * as overrun from "#gauge-chart/examples/overrun.example.tsx";
import * as quiet from "#gauge-chart/examples/quiet.example.tsx";
import * as replay from "#gauge-chart/examples/replay.example.tsx";
import * as short from "#gauge-chart/examples/short.example.tsx";
import * as throughput from "#gauge-chart/examples/throughput.example.tsx";
import * as tiles from "#gauge-chart/examples/tiles.example.tsx";

/**
 * Hand-written scene for a latency in its watch zone.
 */
export const watched: Scene = {
  about: "gauge-chart.latency.about",
  draw: () => (
    <Room size="sm">
      <latency.Latency />
    </Room>
  ),
  example: latency,
  title: "gauge-chart.latency.title",
};

/**
 * Hand-written scene for a latency past its error budget.
 */
export const alarmed: Scene = {
  about: "gauge-chart.critical.about",
  draw: () => (
    <Room size="sm">
      <critical.Critical />
    </Room>
  ),
  example: critical,
  title: "gauge-chart.critical.title",
};

/**
 * Hand-written scene for zones that end before the range does.
 */
export const partial: Scene = {
  about: "gauge-chart.short.about",
  draw: () => (
    <Room size="sm">
      <short.Short />
    </Room>
  ),
  example: short,
  title: "gauge-chart.short.title",
};

/**
 * Hand-written scene for a gauge without zones.
 */
export const plain: Scene = {
  about: "gauge-chart.throughput.about",
  draw: () => (
    <Room size="sm">
      <throughput.Throughput />
    </Room>
  ),
  example: throughput,
  title: "gauge-chart.throughput.title",
};

/**
 * Hand-written scene for a value past the dial's end.
 */
export const overflowing: Scene = {
  about: "gauge-chart.overrun.about",
  draw: () => (
    <Room size="sm">
      <overrun.Overrun />
    </Room>
  ),
  example: overrun,
  title: "gauge-chart.overrun.title",
};

/**
 * Hand-written scene for a share as a percentage.
 */
export const shared: Scene = {
  about: "gauge-chart.disk.about",
  draw: () => (
    <Room size="sm">
      <disk.Disk />
    </Room>
  ),
  example: disk,
  title: "gauge-chart.disk.title",
};

/**
 * Hand-written scene for three gauges as tiles.
 */
export const tiled: Scene = {
  about: "gauge-chart.tiles.about",
  draw: () => (
    <Room size="md">
      <tiles.Tiles />
    </Room>
  ),
  example: tiles,
  title: "gauge-chart.tiles.title",
};

/**
 * Hand-written scene for the dial animated in, with a replay.
 */
export const animated: Scene = {
  about: "gauge-chart.replay.about",
  draw: () => (
    <Room size="sm">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "gauge-chart.replay.title",
};

/**
 * Hand-written scene for the latency at a phone's width.
 */
export const narrow: Scene = {
  about: "gauge-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <latency.Latency />
    </Room>
  ),
  example: latency,
  title: "gauge-chart.narrow.title",
};

/**
 * Hand-written scene for a gauge without a reading.
 */
export const empty: Scene = {
  about: "gauge-chart.quiet.about",
  draw: () => (
    <Room size="sm">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "gauge-chart.quiet.title",
};

export default specimen({
  about: "gauge-chart.about",
  id: "components/charts/gauge-chart",
  imports: 'import { GaugeChart } from "@stealthscale/component-charts";',
  scenes: [watched, alarmed, partial, plain, overflowing, shared, tiled, animated, narrow, empty],
  title: "gauge-chart.title",
});
