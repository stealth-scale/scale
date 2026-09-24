/**
 * Catalogue page for the switcher.
 *
 * @remarks
 *   The sidebar scene renders the workspaces example at a sidebar's width. `scenesOf` generates the
 *   placements on the subtle look, so the control's width shows, and the looks across the sizes,
 *   from the same example. The toolbar scene renders the environment example in a toolbar. Every
 *   switcher renders closed and portals its menu to the document body, so an opened menu renders
 *   over the page. The rooms never appear in the examples. The words are keys under `switcher` in
 *   `locales/en/specimen/switcher.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#switcher/examples/index.ts";
import type * as Switcher from "#switcher/index.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * Hand-written scene for the switcher at a sidebar's width.
 */
export const sidebar: Scene = {
  about: "switcher.sidebar.about",
  draw: () => (
    <Room size="xs">
      <examples.workspaces.Workspaces />
    </Room>
  ),
  example: examples.workspaces,
  title: "switcher.sidebar.title",
};

/**
 * Hand-written scene for a switcher in a toolbar.
 */
export const toolbar: Scene = {
  about: "switcher.toolbar.about",
  draw: () => (
    <Room size="md">
      <examples.environment.Environment />
    </Room>
  ),
  example: examples.environment,
  title: "switcher.toolbar.title",
};

export default specimen({
  about: "switcher.about",
  id: "components/screen/switcher",
  imports: 'import { Switcher } from "@stealthscale/component-screen";',
  scenes: [
    sidebar,
    ...scenesOf<Switcher.RootProps>(recipe, {
      axes: {
        placement: {
          draw: (props) => (
            <Room size="xs">
              <examples.workspaces.Workspaces {...props} />
            </Room>
          ),
          with: { variant: "subtle" },
        },
        variant: { across: "size" },
      },
      draw: (props) => <examples.workspaces.Workspaces {...props} />,
      example: examples.workspaces,
      namespace: "switcher",
      order: ["placement", "variant"],
    }),
    toolbar,
  ],
  title: "switcher.title",
});
