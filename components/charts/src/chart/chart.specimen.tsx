/**
 * Catalogue page for the chart.
 *
 * @remarks
 *   The hand-written scenes render a line chart, stacked bars, a threshold series in the error
 *   palette, a donut whose sectors are series, and the empty state. `scenesOf` generates the
 *   `ratio` scene from the payouts, one chart per ratio in an `md` room. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under `chart`
 *   in `locales/en/specimen/chart.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as latency from "#chart/examples/latency.example.tsx";
import * as payouts from "#chart/examples/payouts.example.tsx";
import * as quiet from "#chart/examples/quiet.example.tsx";
import * as signups from "#chart/examples/signups.example.tsx";
import * as storage from "#chart/examples/storage.example.tsx";
import { type RootProps } from "#chart/index.ts";
import { recipe } from "#chart/recipe.ts";

/**
 * Hand-written scene for a line chart of payouts.
 */
export const line: Scene = {
  about: "chart.payouts.about",
  draw: () => (
    <Room size="lg">
      <payouts.Payouts />
    </Room>
  ),
  example: payouts,
  title: "chart.payouts.title",
};

/**
 * Hand-written scene for stacked bars of sign-ups.
 */
export const stacked: Scene = {
  about: "chart.signups.about",
  draw: () => (
    <Room size="lg">
      <signups.Signups />
    </Room>
  ),
  example: signups,
  title: "chart.signups.title",
};

/**
 * Hand-written scene for a threshold series in the error palette.
 */
export const threshold: Scene = {
  about: "chart.latency.about",
  draw: () => (
    <Room size="lg">
      <latency.Latency />
    </Room>
  ),
  example: latency,
  title: "chart.latency.title",
};

/**
 * Hand-written scene for a donut whose sectors are series.
 */
export const donut: Scene = {
  about: "chart.storage.about",
  draw: () => (
    <Room size="md">
      <storage.Storage />
    </Room>
  ),
  example: storage,
  title: "chart.storage.title",
};

/**
 * Hand-written scene for a chart without rows.
 */
export const empty: Scene = {
  about: "chart.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "chart.quiet.title",
};

export default specimen({
  about: "chart.about",
  id: "components/charts/chart",
  imports: 'import { Chart } from "@stealthscale/component-charts";',
  scenes: [
    line,
    stacked,
    threshold,
    donut,
    empty,
    ...scenesOf<Omit<RootProps, "chart">>(recipe, {
      axes: { ratio: { direction: "column" } },
      draw: (props) => (
        <Room size="md">
          <payouts.Payouts {...props} />
        </Room>
      ),
      example: payouts,
      namespace: "chart",
    }),
  ],
  title: "chart.title",
});
