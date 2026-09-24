/**
 * Catalogue page for the popover.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the filters example. The placement scene is
 *   hand-written, because the placement is the machine's `positioning` option and not an axis.
 *   Every popover renders open through a controlled `open` and the kit's `STAGED` positioning,
 *   with `autoFocus` off so the open panels do not move focus, inside a `Floated` box that pads
 *   itself around the panel. The box, `open`, `STAGED` and `autoFocus` never appear in the example.
 *   The words are keys under `popover` in `locales/en/specimen/popover.json`.
 */

import { Floated, Matrix, type Scene, scenesOf, specimen, STAGED } from "@stealthscale/specimen";

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
      {(side) => (
        <Floated>
          <examples.filters.Filters
            autoFocus={false}
            open
            positioning={{ ...STAGED, placement: side }}
          />
        </Floated>
      )}
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
      draw: (props) => (
        <Floated>
          <examples.filters.Filters {...props} autoFocus={false} open positioning={STAGED} />
        </Floated>
      ),
      example: examples.filters,
      namespace: "popover",
    }),
    placement,
  ],
  title: "popover.title",
});
