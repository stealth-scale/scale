/**
 * Catalogue page for the badge.
 *
 * @remarks
 *   `scenesOf` generates the look, palette, corner and effect scenes. The look and corner scenes
 *   cross the size axis, and the palette scene crosses the look axis. The marks scene is
 *   hand-written, because an icon is a child and not a recipe axis. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `badge` in `locales/en/specimen/badge.json`.
 */

import { type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as count from "#badge/examples/count.example.tsx";
import * as draft from "#badge/examples/draft.example.tsx";
import * as marks from "#badge/examples/marks.example.tsx";
import { recipe } from "#badge/recipe.ts";

/**
 * Hand-written scene for badges that lead with an icon.
 */
export const marked: Scene = {
  about: "badge.marks.about",
  draw: marks.Marks,
  example: marks,
  title: "badge.marks.title",
};

export default specimen({
  about: "badge.about",
  id: "components/data/badge",
  imports: 'import { Badge } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<Parameters<typeof draft.Draft>[0]>(recipe, {
      axes: {
        palette: { across: "variant" },
        radius: {
          across: "size",
          draw: (props) => <count.Count {...props} />,
          example: count,
          with: { palette: "error" },
        },
        variant: { across: "size" },
      },
      draw: (props) => <draft.Draft {...props} />,
      example: draft,
      namespace: "badge",
      order: ["variant", "palette", "radius", "effect"],
    }),
    marked,
  ],
  title: "badge.title",
});
