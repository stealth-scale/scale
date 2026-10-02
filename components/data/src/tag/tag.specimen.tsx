/**
 * Catalogue page for the tag.
 *
 * @remarks
 *   `scenesOf` generates the palette, size, radius and effect scenes from the recipe, so a new
 *   variant value gets a scene without an edit to this file. Every scene renders a component from
 *   `examples/` and shows that file as its source. The generated scenes write the props of their
 *   first cell into the example's `{...props}` spread. The words are keys under `tag` in the
 *   `specimen` namespace, stored in `locales/en/specimen/tag.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as filtered from "#tag/examples/filters.example.tsx";
import * as marked from "#tag/examples/marks.example.tsx";
import * as overflowing from "#tag/examples/overflow.example.tsx";
import * as removable from "#tag/examples/removable.example.tsx";
import * as sized from "#tag/examples/sizes.example.tsx";
import { type RootProps } from "#tag/index.ts";
import { recipe } from "#tag/recipe.ts";

/**
 * Hand-written scene for start and end marks.
 */
export const marks: Scene = {
  about: "tag.marks.about",
  draw: marked.Marks,
  example: marked,
  title: "tag.marks.title",
};

/**
 * Hand-written scene for a row of removable filters.
 */
export const filters: Scene = {
  about: "tag.filters.about",
  draw: filtered.Filters,
  example: filtered,
  title: "tag.filters.title",
};

/**
 * Hand-written scene for a label that overflows an `xs` room.
 */
export const overflow: Scene = {
  about: "tag.overflow.about",
  draw: () => (
    <Room size="xs">
      <overflowing.Overflow />
    </Room>
  ),
  example: overflowing,
  title: "tag.overflow.title",
};

export default specimen({
  about: "tag.about",
  id: "components/data/tag",
  imports: 'import { Tag } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        effect: { with: { palette: "primary" } },
        palette: { across: "variant" },
        size: {
          direction: "column",
          draw: (props) => <sized.Sizes {...props} />,
          example: sized,
        },
      },
      draw: (props) => <removable.Removable {...props} />,
      example: removable,
      namespace: "tag",
      order: ["palette", "size", "radius", "effect"],
    }),
    marks,
    filters,
    overflow,
  ],
  title: "tag.title",
});
