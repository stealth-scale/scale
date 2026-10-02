/**
 * Catalogue page for the phone input.
 *
 * @remarks
 *   Every scene renders a component from `examples/` and shows that file as its source: a number
 *   with six countries and the value it stores, every country, flags from the caller, a number
 *   without a picker, and a number a form refuses until it is valid. `scenesOf` generates the size
 *   scene from the first example. Each field renders in a 448px room. The words are keys under
 *   `phone-input` in `locales/en/specimen/phone-input.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#phone-input/examples/index.ts";
import type * as PhoneInput from "#phone-input/index.ts";
import { recipe } from "#phone-input/recipe.ts";

/**
 * Hand-written scene for a number with six countries and the value it stores.
 */
export const contact: Scene = {
  about: "phone-input.contact.about",
  draw: () => (
    <Room size="md">
      <examples.contact.Contact />
    </Room>
  ),
  example: examples.contact,
  title: "phone-input.contact.title",
};

/**
 * Hand-written scene for every country, sorted by name.
 */
export const everywhere: Scene = {
  about: "phone-input.everywhere.about",
  draw: () => (
    <Room size="md">
      <examples.everywhere.Everywhere />
    </Room>
  ),
  example: examples.everywhere,
  title: "phone-input.everywhere.title",
};

/**
 * Hand-written scene for flags the caller passes.
 */
export const flags: Scene = {
  about: "phone-input.flags.about",
  draw: () => (
    <Room size="md">
      <examples.flags.Flags />
    </Room>
  ),
  example: examples.flags,
  title: "phone-input.flags.title",
};

/**
 * Hand-written scene for a number without a picker.
 */
export const national: Scene = {
  about: "phone-input.national.about",
  draw: () => (
    <Room size="md">
      <examples.national.National />
    </Room>
  ),
  example: examples.national,
  title: "phone-input.national.title",
};

/**
 * Hand-written scene for a number a form refuses until it is valid.
 */
export const callback: Scene = {
  about: "phone-input.callback.about",
  draw: () => (
    <Room size="md">
      <examples.callback.Callback />
    </Room>
  ),
  example: examples.callback,
  title: "phone-input.callback.title",
};

export default specimen({
  about: "phone-input.about",
  id: "components/forms/phone-input",
  imports: 'import { PhoneInput } from "@stealthscale/component-forms";',
  scenes: [
    contact,
    ...scenesOf<Partial<PhoneInput.RootProps>>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="md">
          <examples.contact.Contact {...props} />
        </Room>
      ),
      example: examples.contact,
      namespace: "phone-input",
    }),
    everywhere,
    flags,
    national,
    callback,
  ],
  title: "phone-input.title",
});
