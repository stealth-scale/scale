/**
 * Catalogue page for the select.
 *
 * @remarks
 *   `scenesOf` generates the size, look, status and highlight scenes from a select of four
 *   accounts, each in a room at the `xs` measure, because a select fills its container.
 *   Hand-written scenes render groups, several choices with a count, rows with a description, a
 *   value the caller keeps, a select in a required field, and the disabled, read-only and invalid
 *   states. Every panel renders closed and portalled, and a reader opens one to see its rows. The
 *   words are keys under `select` in `locales/en/specimen/select.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as accounts from "#select/examples/accounts.example.tsx";
import * as currency from "#select/examples/currency.example.tsx";
import * as plans from "#select/examples/plans.example.tsx";
import * as role from "#select/examples/role.example.tsx";
import * as states from "#select/examples/states.example.tsx";
import * as teams from "#select/examples/teams.example.tsx";
import * as zones from "#select/examples/zones.example.tsx";
import { type RootProps } from "#select/index.ts";
import { recipe } from "#select/recipe.ts";

/**
 * Hand-written scene for rows in labelled groups.
 */
export const grouped: Scene = {
  about: "select.grouped.about",
  draw: () => (
    <Room size="xs">
      <zones.Zones />
    </Room>
  ),
  example: zones,
  title: "select.grouped.title",
};

/**
 * Hand-written scene for several choices, a count in the trigger and the clear trigger.
 */
export const multiple: Scene = {
  about: "select.multiple.about",
  draw: () => (
    <Room size="xs">
      <teams.Teams />
    </Room>
  ),
  example: teams,
  title: "select.multiple.title",
};

/**
 * Hand-written scene for rows with an icon and a description.
 */
export const described: Scene = {
  about: "select.described.about",
  draw: () => (
    <Room size="xs">
      <plans.Plans />
    </Room>
  ),
  example: plans,
  title: "select.described.title",
};

/**
 * Hand-written scene for a value the caller keeps.
 */
export const kept: Scene = {
  about: "select.kept.about",
  draw: () => (
    <Room size="xs">
      <currency.Currencies />
    </Room>
  ),
  example: currency,
  title: "select.kept.title",
};

/**
 * Hand-written scene for a select in a required field of a form.
 */
export const required: Scene = {
  about: "select.required.about",
  draw: () => (
    <Room size="xs">
      <role.Invitation />
    </Room>
  ),
  example: role,
  title: "select.required.title",
};

/**
 * Hand-written scene for the disabled, read-only and invalid states.
 */
export const stated: Scene = {
  about: "select.stated.about",
  draw: () => (
    <Room size="xs">
      <states.States />
    </Room>
  ),
  example: states,
  title: "select.stated.title",
};

export default specimen({
  about: "select.about",
  id: "components/forms/select",
  imports: 'import { Select } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Omit<RootProps, "collection">>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <accounts.Accounts {...props} />
        </Room>
      ),
      example: accounts,
      namespace: "select",
      order: ["size", "variant", "status", "highlight"],
    }),
    grouped,
    multiple,
    described,
    kept,
    required,
    stated,
  ],
  title: "select.title",
});
