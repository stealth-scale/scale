/**
 * Catalogue page for the sparkline.
 *
 * @remarks
 *   `scenesOf` generates the size and stretch scenes from the spark recipe. The other scenes are
 *   hand-written: revenue beside its stat, latency per service in a table, errors in the error
 *   palette, customers since launch filled under the line, latency against a target, a run with
 *   missing readings, a named run on its own, and the line animated in with a replay. Every
 *   scene renders a component from `examples/` and shows that file as its source. The words are
 *   keys under `sparkline` in `locales/en/specimen/sparkline.json`. The page imports the
 *   sparkline's barrel directly, because the props reader follows a specimen's own imports and not
 *   an examples barrel.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import { recipe } from "#spark/recipe.ts";
import * as examples from "#sparkline/examples/index.ts";
import type * as Sparkline from "#sparkline/index.ts";

/**
 * Props of a generated cell: the sparkline's props without its run.
 */
type Props = Omit<Sparkline.SparklineProps, "values">;

/**
 * Hand-written scene for a run beside its figure.
 */
export const figure: Scene = {
  about: "sparkline.revenue.about",
  draw: () => (
    <Room size="sm">
      <examples.revenue.Revenue />
    </Room>
  ),
  example: examples.revenue,
  title: "sparkline.revenue.title",
};

/**
 * Hand-written scene for runs in a table.
 */
export const table: Scene = {
  about: "sparkline.services.about",
  draw: () => (
    <Room size="md">
      <examples.services.Services />
    </Room>
  ),
  example: examples.services,
  title: "sparkline.services.title",
};

/**
 * Hand-written scene for a run in a palette.
 */
export const palette: Scene = {
  about: "sparkline.errors.about",
  draw: () => (
    <Room size="sm">
      <examples.errors.Errors />
    </Room>
  ),
  example: examples.errors,
  title: "sparkline.errors.title",
};

/**
 * Hand-written scene for a run from zero filled under its line.
 */
export const filled: Scene = {
  about: "sparkline.launch.about",
  draw: () => (
    <Room size="sm">
      <examples.launch.Launch />
    </Room>
  ),
  example: examples.launch,
  title: "sparkline.launch.title",
};

/**
 * Hand-written scene for a run against a target.
 */
export const baseline: Scene = {
  about: "sparkline.target.about",
  draw: () => (
    <Room size="sm">
      <examples.target.Target />
    </Room>
  ),
  example: examples.target,
  title: "sparkline.target.title",
};

/**
 * Hand-written scene for a run with missing readings.
 */
export const gaps: Scene = {
  about: "sparkline.offline.about",
  draw: () => (
    <Room size="sm">
      <examples.offline.Offline />
    </Room>
  ),
  example: examples.offline,
  title: "sparkline.offline.title",
};

/**
 * Hand-written scene for a named run on its own.
 */
export const named: Scene = {
  about: "sparkline.builds.about",
  draw: examples.builds.Builds,
  example: examples.builds,
  title: "sparkline.builds.title",
};

/**
 * Hand-written scene for the line animated in, with a replay.
 */
export const animated: Scene = {
  about: "sparkline.replay.about",
  draw: examples.replay.Replay,
  example: examples.replay,
  title: "sparkline.replay.title",
};

export default specimen({
  about: "sparkline.about",
  id: "components/charts/sparkline",
  imports: 'import { Sparkline } from "@stealthscale/component-charts";',
  scenes: [
    figure,
    table,
    ...scenesOf<Props>(recipe, {
      axes: {
        stretch: {
          draw: (props) => (
            <Room size="sm">
              <examples.primary.Primary {...props} />
            </Room>
          ),
        },
      },
      draw: (props) => <examples.primary.Primary {...props} />,
      example: examples.primary,
      namespace: "sparkline",
      order: ["size", "stretch"],
    }),
    palette,
    filled,
    baseline,
    gaps,
    named,
    animated,
  ],
  title: "sparkline.title",
});
