/**
 * Catalogue page for the native select.
 *
 * @remarks
 *   `scenesOf` generates the size, look and status scenes from a select of three accounts, each in
 *   a room at the `xs` measure, because a select fills its container. Hand-written scenes render a
 *   select wired to a required field, options in groups, and the disabled and invalid states. The
 *   words are keys under `native-select` in `locales/en/specimen/native-select.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as accounts from "#native-select/examples/accounts.example.tsx";
import * as currency from "#native-select/examples/currency.example.tsx";
import * as regions from "#native-select/examples/regions.example.tsx";
import * as states from "#native-select/examples/states.example.tsx";
import { type RootProps } from "#native-select/index.ts";
import { recipe } from "#native-select/recipe.ts";

/**
 * Hand-written scene for a select wired to a required field.
 */
export const wired: Scene = {
  about: "native-select.wired.about",
  draw: () => (
    <Room size="xs">
      <currency.Currency />
    </Room>
  ),
  example: currency,
  title: "native-select.wired.title",
};

/**
 * Hand-written scene for options in groups.
 */
export const grouped: Scene = {
  about: "native-select.grouped.about",
  draw: () => (
    <Room size="xs">
      <regions.Regions />
    </Room>
  ),
  example: regions,
  title: "native-select.grouped.title",
};

/**
 * Hand-written scene for the disabled and invalid states.
 */
export const stated: Scene = {
  about: "native-select.stated.about",
  draw: () => (
    <Room size="xs">
      <states.States />
    </Room>
  ),
  example: states,
  title: "native-select.stated.title",
};

export default specimen({
  about: "native-select.about",
  id: "components/forms/native-select",
  imports: 'import { NativeSelect } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <accounts.Accounts {...props} />
        </Room>
      ),
      example: accounts,
      namespace: "native-select",
      order: ["size", "variant", "status"],
    }),
    wired,
    grouped,
    stated,
  ],
  title: "native-select.title",
});
