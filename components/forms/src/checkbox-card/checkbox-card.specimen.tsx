/**
 * Catalogue page for the checkbox card.
 *
 * @remarks
 *   `scenesOf` generates the looks, the sizes, the palettes, the alignments and the layouts from
 *   the notifications example, three cards in a horizontal fieldset with the first one checked.
 *   Every value renders in a row of its own and in a room 48rem wide, because a matrix cell shrinks
 *   to its content. The states scene is hand-written, because an invalid, a read-only and a
 *   disabled card differ in props of the root and not in recipe axes. The extras scene shows cards
 *   with a price in each addon in a phone's width, one of them disabled, and the agreement scene a
 *   required card in a field. The words are keys under `checkbox-card` in
 *   `locales/en/specimen/checkbox-card.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#checkbox-card/examples/index.ts";
import type * as CheckboxCard from "#checkbox-card/index.ts";
import { recipe } from "#checkbox-card/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the props that put every card in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], CheckboxCard.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for invalid, read-only and disabled cards.
 */
export const states: Scene = {
  about: "checkbox-card.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="3xl">
          <examples.notifications.Notifications {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.notifications,
  props: { invalid: true },
  title: "checkbox-card.states.title",
};

/**
 * Hand-written scene for cards with a price in each addon, one of them disabled.
 */
export const extras: Scene = {
  about: "checkbox-card.extras.about",
  draw: () => (
    <Room size="sm">
      <examples.extras.Extras />
    </Room>
  ),
  example: examples.extras,
  title: "checkbox-card.extras.title",
};

/**
 * Hand-written scene for a required card in a field.
 */
export const agreement: Scene = {
  about: "checkbox-card.agreement.about",
  draw: () => (
    <Room size="sm">
      <examples.agreement.Agreement />
    </Room>
  ),
  example: examples.agreement,
  title: "checkbox-card.agreement.title",
};

export default specimen({
  about: "checkbox-card.about",
  id: "components/forms/checkbox-card",
  imports: 'import { CheckboxCard } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<CheckboxCard.RootProps>(recipe, {
      axes: {
        align: { direction: "column" },
        layout: { direction: "column" },
        palette: { direction: "column" },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="3xl">
          <examples.notifications.Notifications {...props} />
        </Room>
      ),
      example: examples.notifications,
      namespace: "checkbox-card",
      order: ["variant", "size", "palette", "align", "layout"],
    }),
    states,
    extras,
    agreement,
  ],
  title: "checkbox-card.title",
});
