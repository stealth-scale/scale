/**
 * Catalogue page for the toggle tip.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the definition example. The placement scene is
 *   hand-written, because the placement is the machine's `positioning` option and not an axis. The
 *   terms and fees scenes show a note with a link and notes beside the names of a data list. Every
 *   toggle tip renders closed and portals its note to the document body, so an opened note renders
 *   over the page and a scene is as tall as its triggers. The words are keys under `toggle-tip` in
 *   `locales/en/specimen/toggle-tip.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#toggle-tip/examples/index.ts";
import type * as ToggleTip from "#toggle-tip/index.ts";
import { recipe } from "#toggle-tip/recipe.ts";

/**
 * Sides of the placement scene.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Hand-written scene for the four placements.
 */
export const placement: Scene = {
  about: "toggle-tip.placement.about",
  draw: () => (
    <Matrix knob="placement" of={SIDES}>
      {(side) => <examples.definition.Definition positioning={{ placement: side }} />}
    </Matrix>
  ),
  example: examples.definition,
  props: { positioning: { placement: "top" } },
  title: "toggle-tip.placement.title",
};

/**
 * Hand-written scene for a note that contains a link.
 */
export const terms: Scene = {
  about: "toggle-tip.terms.about",
  draw: examples.terms.Terms,
  example: examples.terms,
  title: "toggle-tip.terms.title",
};

/**
 * Hand-written scene for notes beside the names of a data list.
 */
export const fees: Scene = {
  about: "toggle-tip.fees.about",
  draw: examples.fees.Fees,
  example: examples.fees,
  title: "toggle-tip.fees.title",
};

export default specimen({
  about: "toggle-tip.about",
  id: "components/disclosure/toggle-tip",
  imports: 'import { ToggleTip } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<ToggleTip.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <examples.definition.Definition {...props} />,
      example: examples.definition,
      namespace: "toggle-tip",
    }),
    placement,
    terms,
    fees,
  ],
  title: "toggle-tip.title",
});
