/**
 * Catalogue page for the switcher.
 *
 * @remarks
 *   The open scene renders the workspaces example at a sidebar's width with its menu staged open
 *   inside the kit's `Floated`, with `positioning={STAGED}`. `scenesOf` generates the placements on
 *   the subtle look, so the control's width shows, and the looks across the sizes, from the same
 *   example with the menu closed. The toolbar scene renders the environment example with its menu
 *   staged open. The rooms, `open` and the positioning never appear in the examples. The words are
 *   keys under `switcher` in `locales/en/specimen/switcher.json`.
 */

import { Floated, Room, type Scene, scenesOf, specimen, STAGED } from "@stealthscale/specimen";

import * as examples from "#switcher/examples/index.ts";
import type * as Switcher from "#switcher/index.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * Hand-written scene for the switcher with its menu open.
 */
export const opened: Scene = {
  about: "switcher.opened.about",
  draw: () => (
    <Room size="xs">
      <Floated>
        <examples.workspaces.Workspaces open positioning={STAGED} />
      </Floated>
    </Room>
  ),
  example: examples.workspaces,
  title: "switcher.opened.title",
};

/**
 * Hand-written scene for a switcher in a toolbar with its menu open.
 */
export const toolbar: Scene = {
  about: "switcher.toolbar.about",
  draw: () => (
    <Room size="md">
      <Floated>
        <examples.environment.Environment open positioning={STAGED} />
      </Floated>
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
    opened,
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
