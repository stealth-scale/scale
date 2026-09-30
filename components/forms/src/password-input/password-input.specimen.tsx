/**
 * Catalogue page for the password input.
 *
 * @remarks
 *   The box, the field and the mark are the input group's parts, so the looks scene turns the
 *   input group's `variant` by hand. `scenesOf` generates the sizes scene from the toggle recipe,
 *   whose size the root passes to the box and to the toggle. The states scene shows an invalid, a
 *   read-only and a disabled field. Hand-written scenes show a new password checked on submit,
 *   three fields shown together by one checkbox, and a read-only signing secret. Every drawing is
 *   in a room of a sidebar's width or a phone's. The page imports the parts' barrel as a type, so
 *   the props reader finds the parts. The words are keys under `password-input` in
 *   `locales/en/specimen/password-input.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import { recipe as group } from "#input-group/recipe.ts";
import * as examples from "#password-input/examples/index.ts";
import type * as PasswordInput from "#password-input/index.ts";
import { recipe } from "#password-input/recipe.ts";

/**
 * Looks of the input group the password input renders in.
 */
const LOOKS = valuesOf(group, "variant");

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the field in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], PasswordInput.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for the input group's looks.
 */
export const looks: Scene = {
  about: "password-input.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => (
        <Room size="xs">
          <examples.signin.SignIn variant={variant} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.signin,
  props: { variant: "flushed" },
  title: "password-input.looks.title",
};

/**
 * Hand-written scene for an invalid, a read-only and a disabled field.
 */
export const states: Scene = {
  about: "password-input.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Room size="xs">
          <examples.signin.SignIn {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.signin,
  props: { invalid: true },
  title: "password-input.states.title",
};

/**
 * Hand-written scene for a new password checked on submit.
 */
export const created: Scene = {
  about: "password-input.newPassword.about",
  draw: () => (
    <Room size="sm">
      <examples.create.Create />
    </Room>
  ),
  example: examples.create,
  title: "password-input.newPassword.title",
};

/**
 * Hand-written scene for three fields that one checkbox shows together.
 */
export const together: Scene = {
  about: "password-input.change.about",
  draw: () => (
    <Room size="sm">
      <examples.change.Change />
    </Room>
  ),
  example: examples.change,
  title: "password-input.change.title",
};

/**
 * Hand-written scene for a read-only secret.
 */
export const secret: Scene = {
  about: "password-input.secretField.about",
  draw: () => (
    <Room size="sm">
      <examples.secret.Secret />
    </Room>
  ),
  example: examples.secret,
  title: "password-input.secretField.title",
};

export default specimen({
  about: "password-input.about",
  id: "components/forms/password-input",
  imports: 'import { PasswordInput } from "@stealthscale/component-forms";',
  scenes: [
    looks,
    ...scenesOf<PasswordInput.RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <examples.signin.SignIn {...props} />
        </Room>
      ),
      example: examples.signin,
      namespace: "password-input",
    }),
    states,
    created,
    together,
    secret,
  ],
  title: "password-input.title",
});
