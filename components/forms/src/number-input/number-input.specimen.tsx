/**
 * Catalogue page for the number input.
 *
 * @remarks
 *   The box, the field and the marks are the input group's parts, so the looks scene turns the
 *   input group's `variant` by hand. `scenesOf` generates the sizes scene from the trigger recipe,
 *   whose size the root passes to the box and to the triggers. The states scene shows a value out
 *   of range, a read-only input and a disabled one. The field scene shows a payout in euros named
 *   by a field's label, the percent scene a discount formatted as a percentage, the controlled
 *   scene a licence count whose caller shows the total, and the scrubber scene a value changed by
 *   dragging. Every drawing is in a room of a sidebar's width. The page imports the parts' barrel
 *   as a type, so the props reader finds the parts. The words are keys under `number-input` in
 *   `locales/en/specimen/number-input.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import { recipe as group } from "#input-group/recipe.ts";
import * as examples from "#number-input/examples/index.ts";
import type * as NumberInput from "#number-input/index.ts";
import { recipe } from "#number-input/recipe.ts";

/**
 * Looks of the input group the number input renders in.
 */
const LOOKS = valuesOf(group, "variant");

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the input in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], NumberInput.RootProps>> = {
  disabled: { disabled: true },
  invalid: { defaultValue: "60" },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for the input group's looks.
 */
export const looks: Scene = {
  about: "number-input.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => (
        <Room size="xs">
          <examples.seats.Seats variant={variant} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.seats,
  props: { variant: "flushed" },
  title: "number-input.looks.title",
};

/**
 * Hand-written scene for a value out of range, a read-only input and a disabled one.
 */
export const states: Scene = {
  about: "number-input.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Room size="xs">
          <examples.seats.Seats {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.seats,
  props: { defaultValue: "60" },
  title: "number-input.states.title",
};

/**
 * Hand-written scene for a formatted input named by a field's label.
 */
export const field: Scene = {
  about: "number-input.field.about",
  draw: () => (
    <Room size="xs">
      <examples.payout.Payout />
    </Room>
  ),
  example: examples.payout,
  title: "number-input.field.title",
};

/**
 * Hand-written scene for a discount formatted as a percentage.
 */
export const percent: Scene = {
  about: "number-input.percent.about",
  draw: () => (
    <Room size="xs">
      <examples.discount.Discount />
    </Room>
  ),
  example: examples.discount,
  title: "number-input.percent.title",
};

/**
 * Hand-written scene for a count whose caller holds the value and shows a total.
 */
export const controlled: Scene = {
  about: "number-input.controlled.about",
  draw: () => (
    <Room size="xs">
      <examples.order.Order />
    </Room>
  ),
  example: examples.order,
  title: "number-input.controlled.title",
};

/**
 * Hand-written scene for an input with a scrubber.
 */
export const scrubber: Scene = {
  about: "number-input.scrubber.about",
  draw: () => (
    <Room size="xs">
      <examples.leading.Leading />
    </Room>
  ),
  example: examples.leading,
  title: "number-input.scrubber.title",
};

export default specimen({
  about: "number-input.about",
  id: "components/forms/number-input",
  imports: 'import { NumberInput } from "@stealthscale/component-forms";',
  scenes: [
    looks,
    ...scenesOf<NumberInput.RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <examples.seats.Seats {...props} />
        </Room>
      ),
      example: examples.seats,
      namespace: "number-input",
    }),
    states,
    field,
    percent,
    controlled,
    scrubber,
  ],
  title: "number-input.title",
});
