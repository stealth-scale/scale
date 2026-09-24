/**
 * Catalogue page for the tooltip.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the save example. The placement scene is
 *   hand-written, because the placement is the machine's `positioning` option and not an axis.
 *   Every tooltip renders open through a controlled `open` and the kit's `STAGED` positioning,
 *   inside a `Floated` box that pads itself around the content, so the content shows in a still
 *   image at any scroll position. The box, `open` and `STAGED` never appear in the example. The
 *   words are keys under `tooltip` in `locales/en/specimen/tooltip.json`.
 */

import { Floated, Matrix, type Scene, scenesOf, specimen, STAGED } from "@stealthscale/specimen";

import * as examples from "#tooltip/examples/index.ts";
import type * as Tooltip from "#tooltip/index.ts";
import { recipe } from "#tooltip/recipe.ts";

/**
 * Sides of the placement scene.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Hand-written scene for the four placements.
 */
export const placement: Scene = {
  about: "tooltip.placement.about",
  draw: () => (
    <Matrix knob="placement" of={SIDES}>
      {(side) => (
        <Floated>
          <examples.save.Save open positioning={{ ...STAGED, placement: side }} />
        </Floated>
      )}
    </Matrix>
  ),
  example: examples.save,
  props: { positioning: { placement: "top" } },
  title: "tooltip.placement.title",
};

export default specimen({
  about: "tooltip.about",
  id: "components/disclosure/tooltip",
  imports: 'import { Tooltip } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Tooltip.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => (
        <Floated>
          <examples.save.Save {...props} open positioning={STAGED} />
        </Floated>
      ),
      example: examples.save,
      namespace: "tooltip",
    }),
    placement,
  ],
  title: "tooltip.title",
});
