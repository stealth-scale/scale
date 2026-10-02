/**
 * Catalogue page for the radio group.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes, palettes and statuses by looks, and the alignment
 *   scene, each from an example. The alignment scene renders in a room of a sidebar's width, so the
 *   words wrap. The states scene is hand-written, because an empty, a chosen, an invalid, a
 *   read-only and a disabled group differ in props of the root and not in recipe axes. The
 *   orientation scene shows a horizontal group, and the fieldset scene a group named by a legend
 *   with one option disabled. Every scene renders a component from `examples/` and shows that file
 *   as its source. The words are keys under `radio-group` in
 *   `locales/en/specimen/radio-group.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#radio-group/examples/index.ts";
import type * as RadioGroup from "#radio-group/index.ts";
import { recipe } from "#radio-group/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["empty", "chosen", "invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the group in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], RadioGroup.RootProps>> = {
  chosen: { defaultValue: "next" },
  disabled: { defaultValue: "next", disabled: true },
  empty: { defaultValue: null },
  invalid: { defaultValue: null, invalid: true },
  readOnly: { defaultValue: "next", readOnly: true },
};

/**
 * Hand-written scene for an empty, a chosen, an invalid, a read-only and a disabled group.
 */
export const states: Scene = {
  about: "radio-group.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.windows.Windows {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.windows,
  props: { defaultValue: null },
  title: "radio-group.states.title",
};

/**
 * Hand-written scene for a group laid out in a row.
 */
export const orientation: Scene = {
  about: "radio-group.orientation.about",
  draw: examples.billing.Billing,
  example: examples.billing,
  title: "radio-group.orientation.title",
};

/**
 * Hand-written scene for a group inside a fieldset.
 */
export const fieldset: Scene = {
  about: "radio-group.fieldset.about",
  draw: () => (
    <Room size="sm">
      <examples.speed.Speed />
    </Room>
  ),
  example: examples.speed,
  title: "radio-group.fieldset.title",
};

export default specimen({
  about: "radio-group.about",
  id: "components/forms/radio-group",
  imports: 'import { RadioGroup } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RadioGroup.RootProps>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="xs">
              <examples.schedule.Schedule {...props} />
            </Room>
          ),
          example: examples.schedule,
        },
        palette: { across: "variant" },
        status: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <examples.windows.Windows {...props} />,
      example: examples.windows,
      namespace: "radio-group",
      order: ["variant", "palette", "status", "align"],
    }),
    states,
    orientation,
    fieldset,
  ],
  title: "radio-group.title",
});
