/**
 * Catalogue page for the status.
 *
 * @remarks
 *   `scenesOf` generates the size and effect scenes from the recipe. The palette scene is
 *   hand-written, so each palette renders with the word of a state a caller maps to it. Every
 *   scene renders a component from `examples/` and shows that file as its source. The words are
 *   keys under `status` in the `specimen` namespace, stored in `locales/en/specimen/status.json`.
 */

import { type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as live from "#status/examples/live.example.tsx";
import * as paletted from "#status/examples/palettes.example.tsx";
import * as sentenced from "#status/examples/sentence.example.tsx";
import { type RootProps } from "#status/index.ts";
import { recipe } from "#status/recipe.ts";

/**
 * Hand-written scene for the `palette` axis, one state word per palette.
 */
export const palette: Scene = {
  about: "status.palette.about",
  axes: ["palette"],
  draw: paletted.Palettes,
  example: paletted,
  title: "status.palette.title",
};

/**
 * Hand-written scene for a status inside running text.
 */
export const sentence: Scene = {
  about: "status.sentence.about",
  draw: sentenced.Sentence,
  example: sentenced,
  title: "status.sentence.title",
};

export default specimen({
  about: "status.about",
  id: "components/data/status",
  imports: 'import { Status } from "@stealthscale/component-data";',
  scenes: [
    palette,
    ...scenesOf<RootProps>(recipe, {
      axes: {
        effect: { with: { palette: "success" } },
        size: { with: { palette: "success" } },
      },
      draw: (props) => <live.Live {...props} />,
      example: live,
      namespace: "status",
      order: ["size", "effect"],
      skip: {
        palette: "rendered by the palette scene, which pairs each palette with a state word",
      },
    }),
    sentence,
  ],
  title: "status.title",
});
