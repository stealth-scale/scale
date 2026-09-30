/**
 * Catalogue page for the JSON tree view.
 *
 * @remarks
 *   `scenesOf` generates the size scene from a payout response. The hand-written scenes show every
 *   type of value, three opening depths, quoted keys, the preview options, links, masked values and
 *   a log line with a stack. Every tree renders in a 448px room, and each depth in a 384px room.
 *   The words are keys under `json-tree-view` in `locales/en/specimen/json-tree-view.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#json-tree-view/examples/index.ts";
import type * as JsonTreeView from "#json-tree-view/index.ts";
import { recipe } from "#json-tree-view/recipe.ts";

/**
 * Opening depths of the depth scene, in cell order.
 */
const DEPTHS = [1, 2, 3] as const;

/**
 * Hand-written scene for each opening depth, with the first cell's depth in the source.
 */
export const depth: Scene = {
  about: "json-tree-view.depth.about",
  draw: () => (
    <Matrix knob="defaultExpandedDepth" of={DEPTHS}>
      {(opened) => (
        <Room size="sm">
          <examples.depth.Depth defaultExpandedDepth={opened} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.depth,
  props: { defaultExpandedDepth: 1 },
  title: "json-tree-view.depth.title",
};

/**
 * Builds a hand-written scene for one example in a 448px room.
 *
 * @param name - The key of the scene's words under `json-tree-view`.
 * @param example - The example module.
 * @param Drawn - The example's component.
 * @returns The scene.
 */
function roomed(name: string, example: Scene["example"], Drawn: () => ReactElement): Scene {
  return {
    about: `json-tree-view.${name}.about`,
    draw: () => (
      <Room size="md">
        <Drawn />
      </Room>
    ),
    example,
    title: `json-tree-view.${name}.title`,
  };
}

export default specimen({
  about: "json-tree-view.about",
  id: "components/content/json-tree-view",
  imports: 'import { JsonTreeView } from "@stealthscale/component-content";',
  scenes: [
    ...scenesOf<Partial<JsonTreeView.RootProps>>(recipe, {
      axes: { size: { direction: "row" } },
      draw: (props) => (
        <Room size="md">
          <examples.response.Response {...props} />
        </Room>
      ),
      example: examples.response,
      namespace: "json-tree-view",
    }),
    roomed("types", examples.types, examples.types.Types),
    depth,
    roomed("quoted", examples.quoted, examples.quoted.Quoted),
    roomed("previews", examples.previews, examples.previews.Previews),
    roomed("links", examples.links, examples.links.Links),
    roomed("secrets", examples.secrets, examples.secrets.Secrets),
    roomed("log", examples.log, examples.log.Log),
  ],
  title: "json-tree-view.title",
});
