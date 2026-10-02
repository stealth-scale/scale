/**
 * Catalogue page for the area chart.
 *
 * @remarks
 *   The area chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render one area of storage in use, two overlapping areas of
 *   traffic, the tooltip open at the busiest hour, the areas animated in with a replay, a series
 *   hidden on the first render, a year of visitors zoomed with a range slider, the traffic at a
 *   phone's width, and a day without readings. Every scene renders a component from `examples/`
 *   and shows that file as its source. The words are keys under `area-chart` in
 *   `locales/en/specimen/area-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as bandwidth from "#area-chart/examples/bandwidth.example.tsx";
import * as busiest from "#area-chart/examples/busiest.example.tsx";
import * as internal from "#area-chart/examples/internal.example.tsx";
import * as offline from "#area-chart/examples/offline.example.tsx";
import * as replay from "#area-chart/examples/replay.example.tsx";
import * as storage from "#area-chart/examples/storage.example.tsx";
import * as zoom from "#area-chart/examples/zoom.example.tsx";

/**
 * Hand-written scene for one area.
 */
export const one: Scene = {
  about: "area-chart.storage.about",
  draw: () => (
    <Room size="lg">
      <storage.Storage />
    </Room>
  ),
  example: storage,
  title: "area-chart.storage.title",
};

/**
 * Hand-written scene for two overlapping areas.
 */
export const overlapping: Scene = {
  about: "area-chart.bandwidth.about",
  draw: () => (
    <Room size="lg">
      <bandwidth.Bandwidth />
    </Room>
  ),
  example: bandwidth,
  title: "area-chart.bandwidth.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "area-chart.busiest.about",
  draw: () => (
    <Room size="lg">
      <busiest.Busiest />
    </Room>
  ),
  example: busiest,
  title: "area-chart.busiest.title",
};

/**
 * Hand-written scene for the areas animated in, with a replay.
 */
export const animated: Scene = {
  about: "area-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "area-chart.replay.title",
};

/**
 * Hand-written scene for a series hidden on the first render.
 */
export const hidden: Scene = {
  about: "area-chart.internal.about",
  draw: () => (
    <Room size="lg">
      <internal.Internal />
    </Room>
  ),
  example: internal,
  title: "area-chart.internal.title",
};

/**
 * Hand-written scene for a year of rows zoomed with a range slider.
 */
export const zoomed: Scene = {
  about: "area-chart.zoom.about",
  draw: () => (
    <Room size="lg">
      <zoom.Zoom />
    </Room>
  ),
  example: zoom,
  title: "area-chart.zoom.title",
};

/**
 * Hand-written scene for the traffic at a phone's width.
 */
export const narrow: Scene = {
  about: "area-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <bandwidth.Bandwidth />
    </Room>
  ),
  example: bandwidth,
  title: "area-chart.narrow.title",
};

/**
 * Hand-written scene for a day without readings.
 */
export const empty: Scene = {
  about: "area-chart.offline.about",
  draw: () => (
    <Room size="md">
      <offline.Offline />
    </Room>
  ),
  example: offline,
  title: "area-chart.offline.title",
};

export default specimen({
  about: "area-chart.about",
  id: "components/charts/area-chart",
  imports: 'import { AreaChart } from "@stealthscale/component-charts";',
  scenes: [one, overlapping, tooltip, animated, hidden, zoomed, narrow, empty],
  title: "area-chart.title",
});
