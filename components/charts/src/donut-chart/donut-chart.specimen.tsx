/**
 * Catalogue page for the donut chart.
 *
 * @remarks
 *   The donut chart has no recipe of its own: the chart's recipe styles its figure and the figure
 *   in the hole, so every scene is hand-written. The scenes render storage with the total in the
 *   hole, the tooltip open at the largest slice, the largest share in the hole, incidents with the
 *   tail gathered, the ring animated in with a replay, the storage at a phone's width, and a chart
 *   without slices. Every scene renders a component from `examples/` and shows that file as its
 *   source. The words are keys under `donut-chart` in `locales/en/specimen/donut-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as incidents from "#donut-chart/examples/incidents.example.tsx";
import * as largest from "#donut-chart/examples/largest.example.tsx";
import * as replay from "#donut-chart/examples/replay.example.tsx";
import * as share from "#donut-chart/examples/share.example.tsx";
import * as unused from "#donut-chart/examples/unused.example.tsx";
import * as usage from "#donut-chart/examples/usage.example.tsx";

/**
 * Hand-written scene for the total in the hole.
 */
export const total: Scene = {
  about: "donut-chart.usage.about",
  draw: () => (
    <Room size="sm">
      <usage.Usage />
    </Room>
  ),
  example: usage,
  title: "donut-chart.usage.title",
};

/**
 * Hand-written scene for the tooltip open at the largest slice.
 */
export const tooltip: Scene = {
  about: "donut-chart.largest.about",
  draw: () => (
    <Room size="sm">
      <largest.Largest />
    </Room>
  ),
  example: largest,
  title: "donut-chart.largest.title",
};

/**
 * Hand-written scene for the largest share in the hole.
 */
export const leading: Scene = {
  about: "donut-chart.share.about",
  draw: () => (
    <Room size="sm">
      <share.Share />
    </Room>
  ),
  example: share,
  title: "donut-chart.share.title",
};

/**
 * Hand-written scene for the tail gathered into one slice.
 */
export const tail: Scene = {
  about: "donut-chart.incidents.about",
  draw: () => (
    <Room size="sm">
      <incidents.Incidents />
    </Room>
  ),
  example: incidents,
  title: "donut-chart.incidents.title",
};

/**
 * Hand-written scene for the ring animated in, with a replay.
 */
export const animated: Scene = {
  about: "donut-chart.replay.about",
  draw: () => (
    <Room size="sm">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "donut-chart.replay.title",
};

/**
 * Hand-written scene for the storage at a phone's width.
 */
export const narrow: Scene = {
  about: "donut-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <usage.Usage />
    </Room>
  ),
  example: usage,
  title: "donut-chart.narrow.title",
};

/**
 * Hand-written scene for a chart without slices.
 */
export const empty: Scene = {
  about: "donut-chart.unused.about",
  draw: () => (
    <Room size="sm">
      <unused.Unused />
    </Room>
  ),
  example: unused,
  title: "donut-chart.unused.title",
};

export default specimen({
  about: "donut-chart.about",
  id: "components/charts/donut-chart",
  imports: 'import { DonutChart } from "@stealthscale/component-charts";',
  scenes: [total, tooltip, leading, tail, animated, narrow, empty],
  title: "donut-chart.title",
});
