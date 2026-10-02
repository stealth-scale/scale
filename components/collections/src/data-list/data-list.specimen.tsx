/**
 * Catalogue page for the data list.
 *
 * @remarks
 *   `scenesOf` generates the orientation, variant, size and divided scenes from the recipe, each
 *   rendering the payout example in a room as wide as an aside. Two hand-written scenes render
 *   values that are components and a note beside a label. The words are keys under `data-list` in
 *   `locales/en/specimen/data-list.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as noted from "#data-list/examples/noted.example.tsx";
import * as paid from "#data-list/examples/payout.example.tsx";
import * as ran from "#data-list/examples/run.example.tsx";
import { type RootProps } from "#data-list/index.ts";
import { recipe } from "#data-list/recipe.ts";

/**
 * Hand-written scene for values that are components.
 */
export const components: Scene = {
  about: "data-list.components.about",
  draw: () => (
    <Room size="sm">
      <ran.Run />
    </Room>
  ),
  example: ran,
  title: "data-list.components.title",
};

/**
 * Hand-written scene for a note beside a label.
 */
export const notes: Scene = {
  about: "data-list.notes.about",
  draw: () => (
    <Room size="xs">
      <noted.Noted />
    </Room>
  ),
  example: noted,
  title: "data-list.notes.title",
};

export default specimen({
  about: "data-list.about",
  id: "components/collections/data-list",
  imports: 'import { DataList } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <paid.Payout {...props} />
        </Room>
      ),
      example: paid,
      namespace: "data-list",
      order: ["orientation", "variant", "size", "divided"],
    }),
    components,
    notes,
  ],
  title: "data-list.title",
});
