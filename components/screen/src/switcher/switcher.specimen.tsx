/**
 * Catalogue page for the switcher.
 *
 * @remarks
 *   The first three scenes render the switcher where an application renders it: at the head of a
 *   sidebar in an app shell whose navigation closes to icons, in a toolbar at a card's width and at
 *   a phone's width, and on its own with a page per workspace. The composed scene renders an
 *   environment switcher from the parts in a toolbar. `scenesOf` generates the looks, the palettes,
 *   the sizes and the placements from the workspaces example. Every switcher renders closed and
 *   portals its menu to the document body. The rooms and the boxes never appear in the examples.
 *   The words are keys under `switcher` in `locales/en/specimen/switcher.json`.
 */

import { Stack } from "@stealthscale/component-layout";
import { Room, Sample, type Scene, scenesOf, Screen, specimen } from "@stealthscale/specimen";

import * as examples from "#switcher/examples/index.ts";
import type * as Switcher from "#switcher/index.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * Hand-written scene for the switcher at the head of a sidebar in an app shell.
 */
export const sidebar: Scene = {
  about: "switcher.sidebar.about",
  draw: () => (
    <Screen size="md">
      <examples.console.Console />
    </Screen>
  ),
  example: examples.console,
  frame: "bleed",
  title: "switcher.sidebar.title",
};

/**
 * Hand-written scene for the switcher in a toolbar, wide and at a phone's width.
 */
export const toolbar: Scene = {
  about: "switcher.toolbar.about",
  draw: () => (
    <Stack gap="md">
      <Sample place="stretch" variant="outline">
        <examples.bar.Bar />
      </Sample>
      <Room size="sm">
        <Sample place="stretch" variant="outline">
          <examples.bar.Bar />
        </Sample>
      </Room>
    </Stack>
  ),
  example: examples.bar,
  title: "switcher.toolbar.title",
};

/**
 * Hand-written scene for the switcher on its own, a link per workspace.
 */
export const alone: Scene = {
  about: "switcher.alone.about",
  draw: examples.linked.Linked,
  example: examples.linked,
  title: "switcher.alone.title",
};

/**
 * Hand-written scene for a switcher composed from its parts.
 */
export const composed: Scene = {
  about: "switcher.composed.about",
  draw: () => (
    <Room size="md">
      <examples.environment.Environment />
    </Room>
  ),
  example: examples.environment,
  title: "switcher.composed.title",
};

export default specimen({
  about: "switcher.about",
  id: "components/screen/switcher",
  imports: 'import { Switcher } from "@stealthscale/component-screen";',
  scenes: [
    sidebar,
    toolbar,
    alone,
    ...scenesOf<Switcher.RootProps>(recipe, {
      axes: {
        palette: { with: { variant: "subtle" } },
        placement: {
          draw: (props) => (
            <Room size="xs">
              <examples.workspaces.Workspaces {...props} />
            </Room>
          ),
          with: { variant: "outline" },
        },
        size: {
          draw: (props) => (
            <Room size="xs">
              <examples.workspaces.Workspaces {...props} />
            </Room>
          ),
          with: { placement: "sidebar", variant: "outline" },
        },
      },
      draw: (props) => <examples.workspaces.Workspaces {...props} />,
      example: examples.workspaces,
      namespace: "switcher",
      order: ["variant", "palette", "size", "placement"],
    }),
    composed,
  ],
  title: "switcher.title",
});
