/**
 * Catalogue page for the timeline chart.
 *
 * @remarks
 *   The timeline has no recipe of its own: the chart's recipe styles its figure and its markers, so
 *   every scene is hand-written. The scenes render a day of deploys and incidents across four
 *   services, an incident's alerts in one marker with the tooltip open, a year of releases in one
 *   lane, a selection read under the chart, the markers animated in with a replay, the day at a
 *   phone's width, and a timeline without moments. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `timeline-chart` in
 *   `locales/en/specimen/timeline-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as burst from "#timeline-chart/examples/burst.example.tsx";
import * as deploys from "#timeline-chart/examples/deploys.example.tsx";
import * as quiet from "#timeline-chart/examples/quiet.example.tsx";
import * as releases from "#timeline-chart/examples/releases.example.tsx";
import * as replay from "#timeline-chart/examples/replay.example.tsx";
import * as select from "#timeline-chart/examples/select.example.tsx";

/**
 * Hand-written scene for a lane per service.
 */
export const lanes: Scene = {
  about: "timeline-chart.deploys.about",
  draw: () => (
    <Room size="lg">
      <deploys.Deploys />
    </Room>
  ),
  example: deploys,
  title: "timeline-chart.deploys.title",
};

/**
 * Hand-written scene for moments that share a marker, with the tooltip open at it.
 */
export const clusters: Scene = {
  about: "timeline-chart.burst.about",
  draw: () => (
    <Room size="lg">
      <burst.Burst />
    </Room>
  ),
  example: burst,
  title: "timeline-chart.burst.title",
};

/**
 * Hand-written scene for a timeline of one lane.
 */
export const single: Scene = {
  about: "timeline-chart.releases.about",
  draw: () => (
    <Room size="lg">
      <releases.Releases />
    </Room>
  ),
  example: releases,
  title: "timeline-chart.releases.title",
};

/**
 * Hand-written scene for a marker's moments handed to the caller.
 */
export const selection: Scene = {
  about: "timeline-chart.select.about",
  draw: () => (
    <Room size="lg">
      <select.Select />
    </Room>
  ),
  example: select,
  title: "timeline-chart.select.title",
};

/**
 * Hand-written scene for the markers animated in, with a replay.
 */
export const animated: Scene = {
  about: "timeline-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "timeline-chart.replay.title",
};

/**
 * Hand-written scene for the day at a phone's width.
 */
export const narrow: Scene = {
  about: "timeline-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <deploys.Deploys />
    </Room>
  ),
  example: deploys,
  title: "timeline-chart.narrow.title",
};

/**
 * Hand-written scene for a timeline without moments.
 */
export const empty: Scene = {
  about: "timeline-chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "timeline-chart.quiet.title",
};

export default specimen({
  about: "timeline-chart.about",
  id: "components/charts/timeline-chart",
  imports: 'import { TimelineChart } from "@stealthscale/component-charts";',
  scenes: [lanes, clusters, single, selection, animated, narrow, empty],
  title: "timeline-chart.title",
});
