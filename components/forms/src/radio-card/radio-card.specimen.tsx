/**
 * Catalogue page for the radio card.
 *
 * @remarks
 *   `scenesOf` generates the looks, the sizes, the palettes, the alignments and the layouts from
 *   the speeds example, a horizontal set of three cards with a price in each addon. Every value
 *   renders in a row of its own and in a room 48rem wide, because a matrix cell shrinks to its
 *   content and a grid of fitted columns has no width of its own. The states
 *   scene is hand-written, because a chosen, an invalid and a disabled set differ in props of the
 *   root and not in recipe axes. The stacked scene shows a billing cycle with the circle above
 *   centred words, the required scene a delivery choice in a field that reports an empty choice on
 *   submit, and the vertical scene a set of plans in a room of a phone's width, with one card
 *   disabled. The words are keys under `radio-card` in `locales/en/specimen/radio-card.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#radio-card/examples/index.ts";
import type * as RadioCard from "#radio-card/index.ts";
import { recipe } from "#radio-card/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["chosen", "invalid", "disabled"] as const;

/**
 * Maps each state to the root props that put the set in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], RadioCard.RootProps>> = {
  chosen: { defaultValue: "next" },
  disabled: { defaultValue: "next", disabled: true },
  invalid: { defaultValue: null, invalid: true },
};

/**
 * Hand-written scene for a chosen, an invalid and a disabled set.
 */
export const states: Scene = {
  about: "radio-card.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="3xl">
          <examples.speeds.Speeds {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.speeds,
  props: { defaultValue: "next" },
  title: "radio-card.states.title",
};

/**
 * Hand-written scene for a set with the circle above centred words.
 */
export const stacked: Scene = {
  about: "radio-card.stacked.about",
  draw: () => (
    <Room size="md">
      <examples.billing.Billing />
    </Room>
  ),
  example: examples.billing,
  title: "radio-card.stacked.title",
};

/**
 * Hand-written scene for a required set in a field that reports an empty choice on submit.
 */
export const required: Scene = {
  about: "radio-card.required.about",
  draw: () => (
    <Room size="3xl">
      <examples.delivery.Delivery />
    </Room>
  ),
  example: examples.delivery,
  title: "radio-card.required.title",
};

/**
 * Hand-written scene for a vertical set with one card disabled.
 */
export const vertical: Scene = {
  about: "radio-card.vertical.about",
  draw: () => (
    <Room size="sm">
      <examples.plans.Plans />
    </Room>
  ),
  example: examples.plans,
  title: "radio-card.vertical.title",
};

export default specimen({
  about: "radio-card.about",
  id: "components/forms/radio-card",
  imports: 'import { RadioCard } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RadioCard.RootProps>(recipe, {
      axes: {
        align: { direction: "column" },
        layout: { direction: "column" },
        palette: { direction: "column" },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="3xl">
          <examples.speeds.Speeds {...props} />
        </Room>
      ),
      example: examples.speeds,
      namespace: "radio-card",
      order: ["variant", "size", "palette", "align", "layout"],
    }),
    states,
    stacked,
    required,
    vertical,
  ],
  title: "radio-card.title",
});
