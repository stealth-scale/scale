/**
 * Catalogue page for the fieldset.
 *
 * @remarks
 *   `scenesOf` generates the sizes and orientations scenes from the delivery example. The statuses
 *   scene is hand-written, because each status needs its own message and mark: a checkout with
 *   one group per status. The states scene is hand-written, because disabled and invalid are props
 *   of the root and not recipe axes. Every scene renders a component from `examples/` and shows
 *   that file as its source. The words are keys under `fieldset` in
 *   `locales/en/specimen/fieldset.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as checkout from "#fieldset/examples/checkout.example.tsx";
import * as delivery from "#fieldset/examples/delivery.example.tsx";
import type * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#fieldset/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["default", "disabled", "invalid"] as const;

/**
 * Maps each state to the root props that put the group in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Fieldset.RootProps>> = {
  default: {},
  disabled: { disabled: true },
  invalid: { invalid: true },
};

/**
 * Hand-written scene for the four statuses, one group each.
 */
export const statuses: Scene = {
  about: "fieldset.status.about",
  axes: ["status"],
  draw: checkout.Checkout,
  example: checkout,
  title: "fieldset.status.title",
};

/**
 * Hand-written scene for the disabled and invalid states.
 */
export const states: Scene = {
  about: "fieldset.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <delivery.Delivery {...STATED[state]} />}
    </Matrix>
  ),
  example: delivery,
  props: {},
  title: "fieldset.states.title",
};

export default specimen({
  about: "fieldset.about",
  id: "components/forms/fieldset",
  imports: 'import { Field, Fieldset } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Fieldset.RootProps>(recipe, {
      axes: { orientation: { direction: "column" } },
      draw: (props) => <delivery.Delivery {...props} />,
      example: delivery,
      namespace: "fieldset",
      order: ["size", "orientation"],
      skip: { status: "rendered by the statuses scene, because each status needs its own message" },
    }),
    statuses,
    states,
  ],
  title: "fieldset.title",
});
