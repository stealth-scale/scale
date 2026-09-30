/**
 * Catalogue page for the tree view.
 *
 * @remarks
 *   `scenesOf` generates the sizes, the selected looks, the palettes and the effect from the
 *   explorer example, which opens two branches and selects a file. The hand-written scenes show the
 *   selection modes, a checkable tree, links with indent guides, children loaded on demand, a
 *   filtered tree, renaming, and a controlled outline. Every tree renders in a room as wide as a
 *   sidebar. The words are keys under `tree-view` in `locales/en/specimen/tree-view.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#tree-view/examples/index.ts";
import type * as TreeView from "#tree-view/index.ts";
import { recipe } from "#tree-view/recipe.ts";

/**
 * Selection modes of the selection scene.
 */
const MODES = ["single", "multiple"] as const;

/**
 * Selected rows per mode, so the multiple cell shows two.
 */
const SELECTED = {
  multiple: ["src/components/button.tsx", "src/components/card.tsx"],
  single: ["src/components/card.tsx"],
};

/**
 * Hand-written scene for each selection mode.
 */
export const selection: Scene = {
  about: "tree-view.selection.about",
  draw: () => (
    <Matrix knob="selectionMode" of={MODES}>
      {(mode) => (
        <Room size="xs">
          <examples.explorer.Explorer defaultSelectedValue={SELECTED[mode]} selectionMode={mode} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.explorer,
  props: { defaultSelectedValue: SELECTED.single, selectionMode: "single" },
  title: "tree-view.selection.title",
};

/**
 * Builds a hand-written scene for one example in a sidebar's room.
 *
 * @param name - The key of the scene's words under `tree-view`.
 * @param example - The example module.
 * @param Drawn - The example's component.
 * @returns The scene.
 */
function roomed(name: string, example: Scene["example"], Drawn: () => ReactElement): Scene {
  return {
    about: `tree-view.${name}.about`,
    draw: () => (
      <Room size="xs">
        <Drawn />
      </Room>
    ),
    example,
    title: `tree-view.${name}.title`,
  };
}

export default specimen({
  about: "tree-view.about",
  id: "components/collections/tree-view",
  imports: 'import { TreeCollection, TreeView } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<TreeView.RootProps>(recipe, {
      axes: { selected: { direction: "row" }, size: { direction: "row" } },
      draw: (props) => (
        <Room size="xs">
          <examples.explorer.Explorer {...props} />
        </Room>
      ),
      example: examples.explorer,
      namespace: "tree-view",
      order: ["size", "selected", "palette", "effect"],
    }),
    selection,
    roomed("permissions", examples.permissions, examples.permissions.Permissions),
    roomed("docs", examples.docs, examples.docs.Docs),
    roomed("lazy", examples.lazy, examples.lazy.Lazy),
    roomed("search", examples.search, examples.search.Search),
    roomed("rename", examples.rename, examples.rename.Rename),
    roomed("outline", examples.outline, examples.outline.Outline),
  ],
  title: "tree-view.title",
});
