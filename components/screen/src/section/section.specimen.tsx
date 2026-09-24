/**
 * Catalogue page for the section.
 *
 * @remarks
 *   `scenesOf` generates the looks from the payment example in a `2xl` room, and the annotated
 *   scene on a card in a `4xl` room, because two columns need the width. The sizes scene renders
 *   the sizes example, because the buttons take the section's size through their own provider. The
 *   folding scene renders the billing example in an `xs` and an `xl` room, so the narrow section
 *   folds its actions and the wide one keeps them. The staged sections render as a `div`, because
 *   each would otherwise be a landmark with the same name. The rooms and `as` never appear in the
 *   examples. The words are keys under `section` in `locales/en/specimen/section.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#section/examples/index.ts";
import type * as Section from "#section/index.ts";
import { recipe } from "#section/recipe.ts";

/**
 * Rooms of the folding scene: one narrower than the `sm` breakpoint and one wider.
 */
const ROOMS = ["xs", "xl"] as const;

/**
 * Hand-written scene for the three sizes.
 */
export const sizes: Scene = {
  about: "section.size.about",
  axes: ["size"],
  draw: () => (
    <Room size="2xl">
      <examples.sizes.Sizes />
    </Room>
  ),
  example: examples.sizes,
  title: "section.size.title",
};

/**
 * Hand-written scene for the actions a narrow section folds.
 */
export const folding: Scene = {
  about: "section.folding.about",
  draw: () => (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <examples.billing.Billing as="div" />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.billing,
  title: "section.folding.title",
};

export default specimen({
  about: "section.about",
  id: "components/screen/section",
  imports: 'import { Section } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Section.RootProps>(recipe, {
      axes: {
        annotated: {
          direction: "column",
          draw: (props) => (
            <Room size="4xl">
              <examples.payment.Payment {...props} as="div" />
            </Room>
          ),
          with: { variant: "surface" },
        },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="2xl">
          <examples.payment.Payment {...props} as="div" />
        </Room>
      ),
      example: examples.payment,
      namespace: "section",
      order: ["variant", "annotated"],
      skip: { size: "The sizes scene renders every size with its buttons at the same size." },
    }),
    sizes,
    folding,
  ],
  title: "section.title",
});
