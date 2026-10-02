/**
 * Catalogue page for the action bar.
 *
 * @remarks
 *   `scenesOf` generates the placements from the selection example, whose bar acts on four
 *   invoices. The folding scene is hand-written, because it shows the toolbar inside the bar
 *   folding its actions in a narrow window, which no axis sets. Every bar renders closed and is
 *   fixed to the window while open, so a scene is as tall as its list. The words are keys under
 *   `action-bar` in `locales/en/specimen/action-bar.json`.
 */

import { type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#action-bar/examples/index.ts";
import type * as ActionBar from "#action-bar/index.ts";
import { recipe } from "#action-bar/recipe.ts";

/**
 * Hand-written scene for a bar whose toolbar folds its quieter actions in a narrow window.
 */
export const folding: Scene = {
  about: "action-bar.photos.about",
  draw: examples.photos.Photos,
  example: examples.photos,
  title: "action-bar.photos.title",
};

export default specimen({
  about: "action-bar.about",
  id: "components/screen/action-bar",
  imports: 'import { ActionBar, Toolbar } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Omit<ActionBar.RootProps, "open">>(recipe, {
      draw: (props) => <examples.selection.Selection {...props} />,
      example: examples.selection,
      namespace: "action-bar",
    }),
    folding,
  ],
  title: "action-bar.title",
});
