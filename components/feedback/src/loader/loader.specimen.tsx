/**
 * Catalogue page for the loader.
 *
 * @remarks
 *   `scenesOf` generates the palette and scrim scenes from the recipe. Every scene renders a
 *   component from `examples/` and shows that file as its source. The value and button scenes
 *   render the loaded and the loading state next to each other, so the page shows that the box
 *   keeps its size. The words are keys under `loader` in the `specimen` namespace, stored in
 *   `locales/en/specimen/loader.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as covered from "#loader/examples/covered.example.tsx";
import * as matching from "#loader/examples/matching.example.tsx";
import * as placed from "#loader/examples/placements.example.tsx";
import * as saving from "#loader/examples/saving.example.tsx";
import * as valued from "#loader/examples/value.example.tsx";
import { type LoaderOverlayProps, type LoaderProps } from "#loader/index.ts";
import { recipe } from "#loader/recipe.ts";

/**
 * Hand-written scene for the spinner on either side of the text.
 */
export const placement: Scene = {
  about: "loader.placement.about",
  draw: placed.Placements,
  example: placed,
  title: "loader.placement.title",
};

/**
 * Hand-written scene for a loader over a value, loaded and loading.
 */
export const value: Scene = {
  about: "loader.value.about",
  draw: valued.Value,
  example: valued,
  title: "loader.value.title",
};

/**
 * Hand-written scene for a loader in a button, loaded and loading.
 */
export const button: Scene = {
  about: "loader.button.about",
  draw: saving.Saving,
  example: saving,
  title: "loader.button.title",
};

export default specimen({
  about: "loader.about",
  id: "components/feedback/loader",
  imports: 'import { Loader, LoaderOverlay } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<LoaderOverlayProps & LoaderProps>(recipe, {
      axes: {
        scrim: {
          draw: (props) => (
            <Room size="xs">
              <covered.Covered {...props} />
            </Room>
          ),
          example: covered,
        },
      },
      draw: (props) => <matching.Matching {...props} />,
      example: matching,
      namespace: "loader",
      order: ["palette", "scrim"],
    }),
    placement,
    value,
    button,
  ],
  title: "loader.title",
});
