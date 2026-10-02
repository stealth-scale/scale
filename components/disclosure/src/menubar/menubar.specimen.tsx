/**
 * Catalogue page for the menubar.
 *
 * @remarks
 *   `scenesOf` generates the sizes, one bar per row, and the palettes from the editor example. The
 *   editor, options, icons, tab stop, right-to-left, folded and controlled scenes are hand-written,
 *   because each shows a part or a behaviour that no axis sets. Every menu renders closed and
 *   portals its panel to the document body, so a scene is as tall as its bar. The folded scene
 *   renders in an `xs` room, which a bar of eight menus does not fit at any width. The words are
 *   keys under `menubar` in `locales/en/specimen/menubar.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#menubar/examples/index.ts";
import type * as Menubar from "#menubar/index.ts";
import { recipe } from "#menubar/recipe.ts";

/**
 * Hand-written scene for an editor's bar with commands, keys, a separator and a submenu.
 */
export const editor: Scene = {
  about: "menubar.editor.about",
  draw: () => <examples.editor.Editor />,
  example: examples.editor,
  title: "menubar.editor.title",
};

/**
 * Hand-written scene for checkbox and radio rows, and a name that reads the chosen radio.
 */
export const options: Scene = {
  about: "menubar.options.about",
  draw: examples.options.Options,
  example: examples.options,
  title: "menubar.options.title",
};

/**
 * Hand-written scene for rows that lead with an icon, an inset row and a critical row.
 */
export const icons: Scene = {
  about: "menubar.icons.about",
  draw: examples.icons.Icons,
  example: examples.icons,
  title: "menubar.icons.title",
};

/**
 * Hand-written scene for the bar's one tab stop between two buttons.
 */
export const stop: Scene = {
  about: "menubar.stop.about",
  draw: examples.stop.Stop,
  example: examples.stop,
  title: "menubar.stop.title",
};

/**
 * Hand-written scene for a bar in a right-to-left document.
 */
export const rtl: Scene = {
  about: "menubar.rtl.about",
  draw: examples.rtl.Rtl,
  example: examples.rtl,
  title: "menubar.rtl.title",
};

/**
 * Hand-written scene for a bar too narrow for its names, which folds into one menu.
 */
export const folded: Scene = {
  about: "menubar.folded.about",
  draw: () => (
    <Room size="xs">
      <examples.folded.Folded />
    </Room>
  ),
  example: examples.folded,
  title: "menubar.folded.title",
};

/**
 * Hand-written scene for a bar whose open menu the caller keeps.
 */
export const controlled: Scene = {
  about: "menubar.controlled.about",
  draw: examples.controlled.Controlled,
  example: examples.controlled,
  title: "menubar.controlled.title",
};

export default specimen({
  about: "menubar.about",
  id: "components/disclosure/menubar",
  imports: 'import { Menubar } from "@stealthscale/component-disclosure";',
  scenes: [
    editor,
    ...scenesOf<Menubar.RootProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => <examples.editor.Editor {...props} />,
      example: examples.editor,
      namespace: "menubar",
      order: ["size", "palette"],
    }),
    options,
    icons,
    stop,
    rtl,
    folded,
    controlled,
  ],
  title: "menubar.title",
});
