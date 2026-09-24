/**
 * Catalogue page for the popover.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the filters example. The placement scene is
 *   hand-written, because the placement is the machine's `positioning` option and not an axis.
 *   Every popover renders closed and portals its panel to the document body, so an opened panel
 *   renders over the page and a scene is as tall as its triggers. The words are keys under
 *   `popover` in `locales/en/specimen/popover.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#popover/examples/index.ts";
import type * as Popover from "#popover/index.ts";
import { recipe } from "#popover/recipe.ts";

/**
 * Sides of the placement scene.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Hand-written scene for the four placements.
 */
export const placement: Scene = {
  about: "popover.placement.about",
  draw: () => (
    <Matrix knob="placement" of={SIDES}>
      {(side) => <examples.filters.Filters positioning={{ placement: side }} />}
    </Matrix>
  ),
  example: examples.filters,
  props: { positioning: { placement: "top" } },
  title: "popover.placement.title",
};

export default specimen({
  about: "popover.about",
  id: "components/disclosure/popover",
  imports: 'import { Popover } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Popover.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <examples.filters.Filters {...props} />,
      example: examples.filters,
      namespace: "popover",
    }),
    placement,
  ],
  title: "popover.title",
});
