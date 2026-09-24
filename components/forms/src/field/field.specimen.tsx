/**
 * Catalogue page for the field.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene from the email example, and the orientations scene from an
 *   empty subscribe field, so the floating label rests inside the control. The statuses
 *   scene is hand-written, because each status needs its own message and mark: a signup form with
 *   one field per status. The states scene is hand-written, because required, disabled, read-only
 *   and invalid are props of the root and not recipe axes. The count scene renders a growing
 *   `Field.Textarea` with a limit. The optional and pair scenes show a field composed with a badge
 *   and with a grid. Every scene renders a component from `examples/` and shows that file as its
 *   source. The page imports the parts' barrel as a type, so the props reader finds the parts. The
 *   words are keys under `field` in `locales/en/specimen/field.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#field/examples/index.ts";
import type * as Field from "#field/index.ts";
import { recipe } from "#field/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["default", "required", "disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the root props that put the field in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Field.RootProps>> = {
  default: {},
  disabled: { disabled: true },
  invalid: { invalid: true, required: true },
  readOnly: { readOnly: true },
  required: { required: true },
};

/**
 * Hand-written scene for the four statuses, one field each.
 */
export const statuses: Scene = {
  about: "field.status.about",
  axes: ["status"],
  draw: examples.signup.Signup,
  example: examples.signup,
  title: "field.status.title",
};

/**
 * Hand-written scene for the required, disabled, read-only and invalid states.
 */
export const states: Scene = {
  about: "field.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.email.Email {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.email,
  props: {},
  title: "field.states.title",
};

/**
 * Hand-written scene for the counter on a growing textarea.
 */
export const count: Scene = {
  about: "field.count.about",
  draw: examples.notes.Notes,
  example: examples.notes,
  title: "field.count.title",
};

/**
 * Hand-written scene for a label that holds a badge.
 */
export const optional: Scene = {
  about: "field.optional.about",
  draw: examples.optional.Optional,
  example: examples.optional,
  title: "field.optional.title",
};

/**
 * Hand-written scene for two fields in a grid.
 */
export const paired: Scene = {
  about: "field.paired.about",
  draw: examples.name.Name,
  example: examples.name,
  title: "field.paired.title",
};

export default specimen({
  about: "field.about",
  id: "components/forms/field",
  imports: 'import { Field } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Field.RootProps>(recipe, {
      axes: {
        orientation: {
          direction: "column",
          draw: (props) => <examples.subscribe.Subscribe {...props} />,
          example: examples.subscribe,
        },
      },
      draw: (props) => <examples.email.Email {...props} />,
      example: examples.email,
      namespace: "field",
      order: ["size", "orientation"],
      skip: { status: "rendered by the statuses scene, because each status needs its own message" },
    }),
    statuses,
    states,
    count,
    optional,
    paired,
  ],
  title: "field.title",
});
