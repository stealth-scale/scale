/**
 * Shows the code snippet: every look at both sizes, and every status in every look.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The snippets are code rather than words, so they are written here and not
 *   translated. The scene words are keys under `code` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/code.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import { Code } from "#code/code.ts";
import { recipe } from "#code/recipe.ts";

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Draws a command in every look at both sizes.
 */
function Looks(): ReactElement {
  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Code size={size} variant={variant}>
          pnpm add
        </Code>
      )}
    </Matrix>
  );
}

/**
 * Draws an error code in every status in every look.
 */
function Statuses(): ReactElement {
  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Code status={status} variant={variant}>
          ENOENT
        </Code>
      )}
    </Matrix>
  );
}

/**
 * Every look at both sizes.
 */
export const looks: Scene = { about: "code.looks.about", draw: Looks, title: "code.looks.title" };

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "code.statuses.about",
  draw: Statuses,
  title: "code.statuses.title",
};

export default specimen({
  about: "code.about",
  group: "Typography",
  id: "typography/code",
  imports: 'import { Code } from "@stealthscale/component-typography";',
  scenes: [looks, statuses],
  title: "code.title",
});
