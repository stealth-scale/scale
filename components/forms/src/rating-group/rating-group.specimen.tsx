/**
 * Catalogue page for the rating group.
 *
 * @remarks
 *   `scenesOf` generates the sizes and palettes scenes from the recipe over a hotel stay.
 *   Hand-written scenes show the states, a read-only average in halves, words that follow the
 *   pointer, a required rating in a form, hearts in place of stars, and a half rating right to
 *   left. The page imports the parts' barrel as a type, so the props reader finds the parts. The
 *   words are keys under `rating-group` in `locales/en/specimen/rating-group.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#rating-group/examples/index.ts";
import type * as RatingGroup from "#rating-group/index.ts";
import { recipe } from "#rating-group/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the root props that put the rating in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], RatingGroup.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for a disabled, a read-only and an invalid rating.
 */
export const states: Scene = {
  about: "rating-group.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.stay.Stay {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.stay,
  props: { invalid: true },
  title: "rating-group.states.title",
};

/**
 * Hand-written scene for a half rating in a right-to-left document.
 */
export const rtl: Scene = {
  about: "rating-group.rtl.about",
  draw: () => (
    <div dir="rtl">
      <examples.stay.Stay allowHalf defaultValue={3.5} dir="rtl" />
    </div>
  ),
  example: examples.stay,
  props: { allowHalf: true, defaultValue: 3.5, dir: "rtl" },
  title: "rating-group.rtl.title",
};

/**
 * Returns a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param key - The scene's key under `rating-group`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @returns The scene.
 */
function roomed(key: string, example: object, Drawing: () => ReactElement): Scene {
  return {
    about: `rating-group.${key}.about`,
    draw: () => (
      <Room size="sm">
        <Drawing />
      </Room>
    ),
    example,
    title: `rating-group.${key}.title`,
  };
}

export default specimen({
  about: "rating-group.about",
  id: "components/forms/rating-group",
  imports: 'import { RatingGroup } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RatingGroup.RootProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => <examples.stay.Stay {...props} />,
      example: examples.stay,
      namespace: "rating-group",
      order: ["size", "palette"],
    }),
    states,
    roomed("half", examples.average, examples.average.Average),
    roomed("hover", examples.support, examples.support.Support),
    roomed("field", examples.review, examples.review.Review),
    roomed("glyph", examples.useful, examples.useful.Useful),
    rtl,
  ],
  title: "rating-group.title",
});
