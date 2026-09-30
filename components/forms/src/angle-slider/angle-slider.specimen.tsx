/**
 * Catalogue page for the angle slider.
 *
 * @remarks
 *   `scenesOf` generates the looks, sizes and palettes scenes from the recipe over a layer's
 *   rotation. Hand-written scenes show the states, a gradient's angle with the CSS it writes, a
 *   wind direction in steps of 45° with the compass point as its value text, a panel's tilt checked
 *   in a field, and a rotation right to left. The page imports the parts' barrel as a type, so the
 *   props reader finds the parts. The words are keys under `angle-slider` in
 *   `locales/en/specimen/angle-slider.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#angle-slider/examples/index.ts";
import type * as AngleSlider from "#angle-slider/index.ts";
import { recipe } from "#angle-slider/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the root props that put the dial in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], AngleSlider.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for a disabled, a read-only and an invalid dial.
 */
export const states: Scene = {
  about: "angle-slider.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.rotation.Rotation {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.rotation,
  props: { invalid: true },
  title: "angle-slider.states.title",
};

/**
 * Hand-written scene for a rotation in a right-to-left document.
 */
export const rtl: Scene = {
  about: "angle-slider.rtl.about",
  draw: () => (
    <div dir="rtl">
      <examples.rotation.Rotation dir="rtl" />
    </div>
  ),
  example: examples.rotation,
  props: { dir: "rtl" },
  title: "angle-slider.rtl.title",
};

/**
 * Returns a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param key - The scene's key under `angle-slider`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @returns The scene.
 */
function roomed(key: string, example: object, Drawing: () => ReactElement): Scene {
  return {
    about: `angle-slider.${key}.about`,
    draw: () => (
      <Room size="sm">
        <Drawing />
      </Room>
    ),
    example,
    title: `angle-slider.${key}.title`,
  };
}

export default specimen({
  about: "angle-slider.about",
  id: "components/forms/angle-slider",
  imports: 'import { AngleSlider } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<AngleSlider.RootProps>(recipe, {
      draw: (props) => <examples.rotation.Rotation {...props} />,
      example: examples.rotation,
      namespace: "angle-slider",
      order: ["variant", "size", "palette"],
    }),
    states,
    roomed("controlled", examples.gradient, examples.gradient.Gradient),
    roomed("steps", examples.wind, examples.wind.Wind),
    roomed("field", examples.tilt, examples.tilt.Tilt),
    rtl,
  ],
  title: "angle-slider.title",
});
