/**
 * Shows the keycap: every look at every size, and every status in every look.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The size is crossed with the look and the look with the status, because each
 *   pair reads as a grid rather than as two lists. The keys are the keys themselves and are not
 *   translated: the escape key where the look and the size are what change, and a shortcut where
 *   the status is. The scene words are keys under `kbd` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/kbd.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen } from "@stealthscale/specimen";

import { Kbd, type KbdProps } from "#kbd/kbd.ts";
import { recipe } from "#kbd/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Esc",
  imports: 'import { Kbd } from "@stealthscale/component-typography";',
  name: "Kbd",
};

/**
 * Draws the escape key, which is what a look and a size are read against.
 */
function Escape(props: KbdProps): ReactElement {
  return <Kbd {...props}>Esc</Kbd>;
}

/**
 * Draws a shortcut, which is what a status is read against.
 */
function Shortcut(props: KbdProps): ReactElement {
  return <Kbd {...props}>⌘K</Kbd>;
}

export default specimen({
  about: "kbd.about",
  id: "components/typography/kbd",
  imports: 'import { Kbd } from "@stealthscale/component-typography";',
  scenes: scenesOf<KbdProps>(recipe, {
    axes: {
      status: { across: "variant", draw: (props) => <Shortcut {...props} /> },
      variant: { across: "size" },
    },
    draw: (props) => <Escape {...props} />,
    namespace: "kbd",
    order: ["variant", "status"],
    sample: SAMPLE,
  }),
  title: "kbd.title",
});
