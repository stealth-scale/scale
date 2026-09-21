/**
 * Shows the keycap: every look at every size, and every status in every look.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The keys are the keys themselves and are not translated. The scene words
 *   are keys under `kbd` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/kbd.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import { Kbd } from "#kbd/kbd.ts";
import { recipe } from "#kbd/recipe.ts";

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Draws the escape key in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Kbd size={size} variant={variant}>
          Esc
        </Kbd>
      )}
    </Matrix>
  );
}

/**
 * Draws the command key in every status in every look.
 */
function Statuses(): ReactElement {
  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Kbd status={status} variant={variant}>
          ⌘K
        </Kbd>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = { about: "kbd.looks.about", draw: Looks, title: "kbd.looks.title" };

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "kbd.statuses.about",
  draw: Statuses,
  title: "kbd.statuses.title",
};

export default specimen({
  about: "kbd.about",
  group: "Typography",
  id: "typography/kbd",
  imports: 'import { Kbd } from "@stealthscale/component-typography";',
  scenes: [looks, statuses],
  title: "kbd.title",
});
