/**
 * Catalogue page for the pin input.
 *
 * @remarks
 *   `scenesOf` generates the looks scene crossed with the statuses, the sizes scene and the
 *   attached scene from the recipe, over a four-digit code. Hand-written scenes show a one-time
 *   code in a field, a code checked when the last box fills with its error text, a masked passcode
 *   with its own label, an invite code split by a dash, and a disabled and a read-only code. The
 *   page imports the parts' barrel as a type, so the props reader finds the parts. The words are
 *   keys under `pin-input` in `locales/en/specimen/pin-input.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#pin-input/examples/index.ts";
import type * as PinInput from "#pin-input/index.ts";
import { recipe } from "#pin-input/recipe.ts";

/**
 * Code the states scene shows in every box.
 */
const CODE = ["4", "0", "7", "1"];

/**
 * States of the states scene, in reading order.
 */
const STATES = ["disabled", "readOnly"] as const;

/**
 * Maps each state to the root props that put the code in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], PinInput.RootProps>> = {
  disabled: { defaultValue: CODE, disabled: true },
  readOnly: { defaultValue: CODE, readOnly: true },
};

/**
 * Hand-written scene for a disabled and a read-only code.
 */
export const states: Scene = {
  about: "pin-input.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.code.Code {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.code,
  props: { defaultValue: CODE, disabled: true },
  title: "pin-input.states.title",
};

export default specimen({
  about: "pin-input.about",
  id: "components/forms/pin-input",
  imports: 'import { PinInput } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<PinInput.RootProps>(recipe, {
      axes: { status: { across: "variant" }, variant: {} },
      draw: (props) => <examples.code.Code {...props} />,
      example: examples.code,
      namespace: "pin-input",
      order: ["variant", "size", "status", "attached"],
    }),
    {
      about: "pin-input.verify.about",
      draw: examples.verify.Verify,
      example: examples.verify,
      title: "pin-input.verify.title",
    },
    {
      about: "pin-input.confirm.about",
      draw: examples.confirm.Confirm,
      example: examples.confirm,
      title: "pin-input.confirm.title",
    },
    {
      about: "pin-input.masked.about",
      draw: examples.passcode.Passcode,
      example: examples.passcode,
      title: "pin-input.masked.title",
    },
    {
      about: "pin-input.split.about",
      draw: examples.invite.Invite,
      example: examples.invite,
      title: "pin-input.split.title",
    },
    states,
  ],
  title: "pin-input.title",
});
