/**
 * Catalogue page for the combobox.
 *
 * @remarks
 *   `scenesOf` generates the size, look, status and highlight scenes from a combobox of six
 *   accounts, each in a room at the `xs` measure, because a combobox fills its container.
 *   Hand-written scenes render groups, several choices shown as tags, the first match highlighted
 *   with the matched letters marked, a value the list does not have, a combobox in a required
 *   field, and the disabled, read-only and invalid states. Every panel renders closed and
 *   portalled, and a reader types into a combobox to see its rows. The words are keys under
 *   `combobox` in `locales/en/specimen/combobox.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as accounts from "#combobox/examples/accounts.example.tsx";
import * as countries from "#combobox/examples/countries.example.tsx";
import * as desks from "#combobox/examples/desks.example.tsx";
import * as handover from "#combobox/examples/handover.example.tsx";
import * as labels from "#combobox/examples/labels.example.tsx";
import * as recipients from "#combobox/examples/recipients.example.tsx";
import * as states from "#combobox/examples/states.example.tsx";
import { type RootProps } from "#combobox/index.ts";
import { recipe } from "#combobox/recipe.ts";

/**
 * Hand-written scene for rows in labelled groups.
 */
export const grouped: Scene = {
  about: "combobox.grouped.about",
  draw: () => (
    <Room size="xs">
      <desks.Desks />
    </Room>
  ),
  example: desks,
  title: "combobox.grouped.title",
};

/**
 * Hand-written scene for several choices shown as tags.
 */
export const multiple: Scene = {
  about: "combobox.multiple.about",
  draw: () => (
    <Room size="xs">
      <recipients.Recipients />
    </Room>
  ),
  example: recipients,
  title: "combobox.multiple.title",
};

/**
 * Hand-written scene for the first match highlighted and the matched letters marked.
 */
export const highlighted: Scene = {
  about: "combobox.highlighted.about",
  draw: () => (
    <Room size="xs">
      <countries.Countries />
    </Room>
  ),
  example: countries,
  title: "combobox.highlighted.title",
};

/**
 * Hand-written scene for a value the list does not have.
 */
export const custom: Scene = {
  about: "combobox.custom.about",
  draw: () => (
    <Room size="xs">
      <labels.Labels />
    </Room>
  ),
  example: labels,
  title: "combobox.custom.title",
};

/**
 * Hand-written scene for a combobox in a required field of a form.
 */
export const required: Scene = {
  about: "combobox.required.about",
  draw: () => (
    <Room size="xs">
      <handover.Handover />
    </Room>
  ),
  example: handover,
  title: "combobox.required.title",
};

/**
 * Hand-written scene for the disabled, read-only and invalid states.
 */
export const stated: Scene = {
  about: "combobox.stated.about",
  draw: () => (
    <Room size="xs">
      <states.States />
    </Room>
  ),
  example: states,
  title: "combobox.stated.title",
};

export default specimen({
  about: "combobox.about",
  id: "components/forms/combobox",
  imports: 'import { Combobox } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Omit<RootProps, "collection">>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <accounts.Accounts {...props} />
        </Room>
      ),
      example: accounts,
      namespace: "combobox",
      order: ["size", "variant", "status", "highlight"],
    }),
    grouped,
    multiple,
    highlighted,
    custom,
    required,
    stated,
  ],
  title: "combobox.title",
});
