/**
 * Catalogue page for the tooltip.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the save example. The placement scene is
 *   hand-written, because the placement is the machine's `positioning` option and not an axis.
 *   Every tooltip renders closed and portals its content to the document body, so a shown tooltip
 *   renders over the page and a scene is as tall as its triggers. The words are keys under
 *   `tooltip` in `locales/en/specimen/tooltip.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

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
      {(side) => <examples.save.Save positioning={{ placement: side }} />}
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
      draw: (props) => <examples.save.Save {...props} />,
      example: examples.save,
      namespace: "tooltip",
    }),
    placement,
  ],
  title: "tooltip.title",
});
