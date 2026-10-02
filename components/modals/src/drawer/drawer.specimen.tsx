/**
 * Catalogue page for the drawer.
 *
 * @remarks
 *   `scenesOf` generates the sizes, the placements and the contained panel from the filters
 *   example. The bottom sheet, form and top panel scenes are hand-written, because each shows a
 *   placement or a composition in the use it exists for. Every drawer renders closed and portals
 *   its backdrop and positioner to the document body, so an opened drawer covers the page and a
 *   scene is as tall as its triggers. A single trigger renders in a `Sample`, which keeps it at its
 *   own width. The words are keys under `drawer` in `locales/en/specimen/drawer.json`.
 */

import { Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#drawer/examples/index.ts";
import type * as Drawer from "#drawer/index.ts";
import { recipe } from "#drawer/recipe.ts";

/**
 * Hand-written scene for share options in a sheet at the bottom of the window.
 */
export const sheet: Scene = {
  about: "drawer.sheet.about",
  draw: () => (
    <Sample>
      <examples.share.Share />
    </Sample>
  ),
  example: examples.share,
  title: "drawer.sheet.title",
};

/**
 * Hand-written scene for a form whose submit button is in the footer.
 */
export const form: Scene = {
  about: "drawer.form.about",
  draw: () => (
    <Sample>
      <examples.task.Task />
    </Sample>
  ),
  example: examples.task,
  title: "drawer.form.title",
};

/**
 * Hand-written scene for a search panel at the top of the window.
 */
export const panel: Scene = {
  about: "drawer.panel.about",
  draw: () => (
    <Sample>
      <examples.search.Search />
    </Sample>
  ),
  example: examples.search,
  title: "drawer.panel.title",
};

export default specimen({
  about: "drawer.about",
  id: "components/modals/drawer",
  imports: 'import { Drawer } from "@stealthscale/component-modals";',
  scenes: [
    ...scenesOf<Drawer.RootProps>(recipe, {
      draw: (props) => <examples.filters.Filters {...props} />,
      example: examples.filters,
      namespace: "drawer",
      order: ["placement", "size", "contained"],
    }),
    sheet,
    form,
    panel,
  ],
  title: "drawer.title",
});
