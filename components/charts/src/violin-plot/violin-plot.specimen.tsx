/**
 * Catalogue page for the violin plot.
 *
 * @remarks
 *   The violin plot has no recipe of its own: the chart's recipe styles its figure and the
 *   violin's marker, so every scene is hand-written. The scenes render response times of three
 *   endpoints, the tooltip open at the endpoint with two peaks, a kernel wide enough to merge them,
 *   session lengths in the teal palette on a fixed axis, the outlines without the marker, the
 *   violins animated in with a replay, the endpoints at a phone's width, and a violin plot without
 *   values. Every scene renders a component from `examples/` and shows that file as its source. The
 *   words are keys under `violin-plot` in `locales/en/specimen/violin-plot.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as endpoints from "#violin-plot/examples/endpoints.example.tsx";
import * as outline from "#violin-plot/examples/outline.example.tsx";
import * as peaks from "#violin-plot/examples/peaks.example.tsx";
import * as plans from "#violin-plot/examples/plans.example.tsx";
import * as quiet from "#violin-plot/examples/quiet.example.tsx";
import * as replay from "#violin-plot/examples/replay.example.tsx";
import * as smooth from "#violin-plot/examples/smooth.example.tsx";

/**
 * Hand-written scene for response times of three endpoints.
 */
export const automatic: Scene = {
  about: "violin-plot.endpoints.about",
  draw: () => (
    <Room size="lg">
      <endpoints.Endpoints />
    </Room>
  ),
  example: endpoints,
  title: "violin-plot.endpoints.title",
};

/**
 * Hand-written scene for the tooltip open at a group.
 */
export const tooltip: Scene = {
  about: "violin-plot.peaks.about",
  draw: () => (
    <Room size="lg">
      <peaks.Peaks />
    </Room>
  ),
  example: peaks,
  title: "violin-plot.peaks.title",
};

/**
 * Hand-written scene for one wide kernel for every group.
 */
export const kernel: Scene = {
  about: "violin-plot.smooth.about",
  draw: () => (
    <Room size="lg">
      <smooth.Smooth />
    </Room>
  ),
  example: smooth,
  title: "violin-plot.smooth.title",
};

/**
 * Hand-written scene for session lengths in a palette's color on a fixed axis.
 */
export const colored: Scene = {
  about: "violin-plot.plans.about",
  draw: () => (
    <Room size="lg">
      <plans.Plans />
    </Room>
  ),
  example: plans,
  title: "violin-plot.plans.title",
};

/**
 * Hand-written scene for the outlines without the marker.
 */
export const bare: Scene = {
  about: "violin-plot.outline.about",
  draw: () => (
    <Room size="lg">
      <outline.Outline />
    </Room>
  ),
  example: outline,
  title: "violin-plot.outline.title",
};

/**
 * Hand-written scene for the violins animated in, with a replay.
 */
export const animated: Scene = {
  about: "violin-plot.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "violin-plot.replay.title",
};

/**
 * Hand-written scene for the endpoints at a phone's width.
 */
export const narrow: Scene = {
  about: "violin-plot.narrow.about",
  draw: () => (
    <Room size="xs">
      <endpoints.Endpoints />
    </Room>
  ),
  example: endpoints,
  title: "violin-plot.narrow.title",
};

/**
 * Hand-written scene for a violin plot without values.
 */
export const empty: Scene = {
  about: "violin-plot.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "violin-plot.quiet.title",
};

export default specimen({
  about: "violin-plot.about",
  id: "components/charts/violin-plot",
  imports:
    'import { densityPeaks, kernelDensity, silvermanBandwidth, ViolinPlot } from "@stealthscale/component-charts";',
  scenes: [automatic, tooltip, kernel, colored, bare, animated, narrow, empty],
  title: "violin-plot.title",
});
