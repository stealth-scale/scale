/**
 * Catalogue page for the trend line across a scatter.
 *
 * @remarks
 *   The trend line has no recipe of its own: it is a recharts child the chart's recipe styles, so
 *   every scene is hand-written. The scenes render a strong fit with its r² in the caption, a line
 *   per series that follows the legend, a weak fit the page leaves without a line, and the strong
 *   fit at a phone's width. Every scene renders a component from `examples/` and shows that file as
 *   its source. The words are keys under `regression-overlay` in
 *   `locales/en/specimen/regression-overlay.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as channels from "#regression-overlay/examples/channels.example.tsx";
import * as fit from "#regression-overlay/examples/fit.example.tsx";
import * as weak from "#regression-overlay/examples/weak.example.tsx";

/**
 * Hand-written scene for a strong fit.
 */
export const strong: Scene = {
  about: "regression-overlay.fit.about",
  draw: () => (
    <Room size="lg">
      <fit.Fit />
    </Room>
  ),
  example: fit,
  title: "regression-overlay.fit.title",
};

/**
 * Hand-written scene for a trend line per series.
 */
export const perSeries: Scene = {
  about: "regression-overlay.channels.about",
  draw: () => (
    <Room size="lg">
      <channels.Channels />
    </Room>
  ),
  example: channels,
  title: "regression-overlay.channels.title",
};

/**
 * Hand-written scene for a weak fit without a line.
 */
export const loose: Scene = {
  about: "regression-overlay.weak.about",
  draw: () => (
    <Room size="lg">
      <weak.Weak />
    </Room>
  ),
  example: weak,
  title: "regression-overlay.weak.title",
};

/**
 * Hand-written scene for the strong fit at a phone's width.
 */
export const narrow: Scene = {
  about: "regression-overlay.narrow.about",
  draw: () => (
    <Room size="xs">
      <fit.Fit />
    </Room>
  ),
  example: fit,
  title: "regression-overlay.narrow.title",
};

export default specimen({
  about: "regression-overlay.about",
  id: "components/charts/regression-overlay",
  imports: 'import { linearRegression, RegressionOverlay } from "@stealthscale/component-charts";',
  scenes: [strong, perSeries, loose, narrow],
  title: "regression-overlay.title",
});
