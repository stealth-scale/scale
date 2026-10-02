/**
 * Catalogue page for the input group.
 *
 * @remarks
 *   Ten hand-written scenes show the group in use, each in a room of a phone's width: search,
 *   password, addons, country code, card number, card details in one row, card details in two rows,
 *   counter, button and a disabled group. `scenesOf` generates the looks scene, the sizes scene,
 *   the statuses scene crossed with the looks, and the alignment scene. The sizes are not crossed
 *   with the looks, because three 4xl groups side by side leave a phone-width field no room. The
 *   states scene is hand-written, because focus, `readOnly` and `aria-invalid` are states of the
 *   field, not recipe axes. Its focused row renders inside `Focused`. The disabled group has its
 *   own scene, because a disabled `fieldset` around the group disables its fields. Every scene
 *   renders a component from `examples/` and shows that file as its source. The page imports the
 *   parts' barrel as a type, so the props reader finds the parts. The words are keys under
 *   `input-group` in `locales/en/specimen/input-group.json`.
 */

import { type ReactElement } from "react";

import { Focused, Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#input-group/examples/index.ts";
import type * as InputGroup from "#input-group/index.ts";
import { recipe } from "#input-group/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["rest", "focused", "readOnly", "invalid"] as const;

/**
 * Maps each state to the field props that put the group in it. `Focused` stages the focused state.
 */
const STATED: Readonly<Record<(typeof STATES)[number], InputGroup.FieldProps>> = {
  focused: {},
  invalid: { "aria-invalid": true },
  readOnly: { readOnly: true },
  rest: {},
};

/**
 * Builds a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param name - Key of the scene under `input-group.scenes`.
 * @param example - Example module, whose source the scene shows.
 * @param Example - Component the example module exports.
 * @returns The scene.
 */
function roomed(name: string, example: object, Example: () => ReactElement): Scene {
  return {
    about: `input-group.scenes.${name}.about`,
    draw: () => (
      <Room size="sm">
        <Example />
      </Room>
    ),
    example,
    title: `input-group.scenes.${name}.title`,
  };
}

/**
 * Hand-written scenes, one per example of the group in use.
 */
export const shown: readonly Scene[] = [
  roomed("search", examples.search, examples.search.Search),
  roomed("password", examples.password, examples.password.Password),
  roomed("website", examples.website, examples.website.Website),
  roomed("phone", examples.phone, examples.phone.Phone),
  roomed("cardNumber", examples.cardNumber, examples.cardNumber.CardNumber),
  roomed("card", examples.card, examples.card.Card),
  roomed("payment", examples.payment, examples.payment.Payment),
  roomed("counter", examples.counter, examples.counter.Counter),
  roomed("coupon", examples.coupon, examples.coupon.Coupon),
];

/**
 * Looks of an addon, filled and plain.
 */
const ADDON_LOOKS = ["filled", "plain"] as const;

/**
 * Hand-written scene for the two looks of an addon.
 */
export const addons: Scene = {
  about: "input-group.addons.about",
  draw: () => (
    <Room size="sm">
      <Matrix knob="look" of={ADDON_LOOKS}>
        {(look) => <examples.rate.Rate look={look} />}
      </Matrix>
    </Room>
  ),
  example: examples.rate,
  props: { look: "plain" },
  title: "input-group.addons.title",
};

/**
 * Hand-written scene for the focus, read-only and invalid states.
 */
export const states: Scene = {
  about: "input-group.states.about",
  draw: () => (
    <Room size="sm">
      <Matrix knob="state" of={STATES}>
        {(state) =>
          state === "focused" ? (
            <Focused>
              <examples.price.Price />
            </Focused>
          ) : (
            <examples.price.Price {...STATED[state]} />
          )
        }
      </Matrix>
    </Room>
  ),
  example: examples.price,
  props: { "aria-invalid": true },
  title: "input-group.states.title",
};

export default specimen({
  about: "input-group.about",
  id: "components/forms/input-group",
  imports: 'import { InputGroup } from "@stealthscale/component-forms";',
  scenes: [
    ...shown,
    addons,
    ...scenesOf<InputGroup.RootProps>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="sm">
              <examples.notes.Notes {...props} />
            </Room>
          ),
          example: examples.notes,
        },
        status: { across: "variant" },
        variant: {},
      },
      draw: (props) => <examples.amount.Amount {...props} />,
      example: examples.amount,
      namespace: "input-group",
      order: ["variant", "size", "status", "align"],
    }),
    states,
    roomed("locked", examples.locked, examples.locked.Locked),
  ],
  title: "input-group.title",
});
