/**
 * Catalogue page for the step line chart.
 *
 * @remarks
 *   The step line chart has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render the replicas of two services every 10 minutes, the
 *   tooltip open at the API's peak, the steps animated in with a replay, the replicas at a phone's
 *   width, and a range without readings. Every scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `step-line-chart` in
 *   `locales/en/specimen/step-line-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as idle from "#step-line-chart/examples/idle.example.tsx";
import * as replay from "#step-line-chart/examples/replay.example.tsx";
import * as replicas from "#step-line-chart/examples/replicas.example.tsx";
import * as scale from "#step-line-chart/examples/scale.example.tsx";

/**
 * Hand-written scene for the replicas of two services.
 */
export const steps: Scene = {
  about: "step-line-chart.replicas.about",
  draw: () => (
    <Room size="lg">
      <replicas.Replicas />
    </Room>
  ),
  example: replicas,
  title: "step-line-chart.replicas.title",
};

/**
 * Hand-written scene for the tooltip open at a reading.
 */
export const tooltip: Scene = {
  about: "step-line-chart.scale.about",
  draw: () => (
    <Room size="lg">
      <scale.Scale />
    </Room>
  ),
  example: scale,
  title: "step-line-chart.scale.title",
};

/**
 * Hand-written scene for the steps animated in, with a replay.
 */
export const animated: Scene = {
  about: "step-line-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "step-line-chart.replay.title",
};

/**
 * Hand-written scene for the replicas at a phone's width.
 */
export const narrow: Scene = {
  about: "step-line-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <replicas.Replicas />
    </Room>
  ),
  example: replicas,
  title: "step-line-chart.narrow.title",
};

/**
 * Hand-written scene for a range without readings.
 */
export const empty: Scene = {
  about: "step-line-chart.idle.about",
  draw: () => (
    <Room size="md">
      <idle.Idle />
    </Room>
  ),
  example: idle,
  title: "step-line-chart.idle.title",
};

export default specimen({
  about: "step-line-chart.about",
  id: "components/charts/step-line-chart",
  imports: 'import { StepLineChart } from "@stealthscale/component-charts";',
  scenes: [steps, tooltip, animated, narrow, empty],
  title: "step-line-chart.title",
});
