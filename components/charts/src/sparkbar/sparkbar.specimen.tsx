/**
 * Catalogue page for the sparkbar.
 *
 * @remarks
 *   `scenesOf` generates the size and stretch scenes from the spark recipe. The other scenes are
 *   hand-written: deploys beside their stat, net seats with falls in the error color, orders
 *   against a target, a run with a missing reading, a named run on its own, and the bars
 *   animated in with a replay. Every scene renders a component from `examples/` and shows that file
 *   as its source. The words are keys under `sparkbar` in `locales/en/specimen/sparkbar.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import { recipe } from "#spark/recipe.ts";
import * as deploys from "#sparkbar/examples/deploys.example.tsx";
import * as incidents from "#sparkbar/examples/incidents.example.tsx";
import * as orders from "#sparkbar/examples/orders.example.tsx";
import * as outage from "#sparkbar/examples/outage.example.tsx";
import * as primary from "#sparkbar/examples/primary.example.tsx";
import * as replay from "#sparkbar/examples/replay.example.tsx";
import * as seats from "#sparkbar/examples/seats.example.tsx";

/**
 * Hand-written scene for a run beside its figure.
 */
export const figure: Scene = {
  about: "sparkbar.deploys.about",
  draw: () => (
    <Room size="sm">
      <deploys.Deploys />
    </Room>
  ),
  example: deploys,
  title: "sparkbar.deploys.title",
};

/**
 * Hand-written scene for a run of changes with its falls in the error color.
 */
export const signed: Scene = {
  about: "sparkbar.seats.about",
  draw: () => (
    <Room size="sm">
      <seats.Seats />
    </Room>
  ),
  example: seats,
  title: "sparkbar.seats.title",
};

/**
 * Hand-written scene for a run against a target.
 */
export const baseline: Scene = {
  about: "sparkbar.orders.about",
  draw: () => (
    <Room size="sm">
      <orders.Orders />
    </Room>
  ),
  example: orders,
  title: "sparkbar.orders.title",
};

/**
 * Hand-written scene for a run with a missing reading.
 */
export const gap: Scene = {
  about: "sparkbar.outage.about",
  draw: () => (
    <Room size="sm">
      <outage.Outage />
    </Room>
  ),
  example: outage,
  title: "sparkbar.outage.title",
};

/**
 * Hand-written scene for a named run on its own.
 */
export const named: Scene = {
  about: "sparkbar.incidents.about",
  draw: incidents.Incidents,
  example: incidents,
  title: "sparkbar.incidents.title",
};

/**
 * Hand-written scene for the bars animated in, with a replay.
 */
export const animated: Scene = {
  about: "sparkbar.replay.about",
  draw: replay.Replay,
  example: replay,
  title: "sparkbar.replay.title",
};

export default specimen({
  about: "sparkbar.about",
  id: "components/charts/sparkbar",
  imports: 'import { Sparkbar } from "@stealthscale/component-charts";',
  scenes: [
    figure,
    signed,
    ...scenesOf<Parameters<typeof primary.Primary>[0]>(recipe, {
      axes: {
        stretch: {
          draw: (props) => (
            <Room size="sm">
              <primary.Primary {...props} />
            </Room>
          ),
        },
      },
      draw: (props) => <primary.Primary {...props} />,
      example: primary,
      namespace: "sparkbar",
      order: ["size", "stretch"],
    }),
    baseline,
    gap,
    named,
    animated,
  ],
  title: "sparkbar.title",
});
