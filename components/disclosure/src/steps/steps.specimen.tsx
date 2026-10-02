/**
 * Catalogue page for the steps.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes, sizes and title placements from the payout example,
 *   which starts on the second step, so every scene shows a completed, a current and a later step.
 *   The hand-written scenes show a vertical flow with descriptions, marks that turn into a check, a
 *   gated linear flow and a parcel's progress without triggers. Every flow renders in a room at its
 *   real width. The words are keys under `steps` in `locales/en/specimen/steps.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#steps/examples/index.ts";
import type * as Steps from "#steps/index.ts";
import { recipe } from "#steps/recipe.ts";

/**
 * Hand-written scene for a vertical flow with a line under each title.
 */
export const setup: Scene = {
  about: "steps.setup.about",
  draw: () => (
    <Room size="md">
      <examples.setup.Setup />
    </Room>
  ),
  example: examples.setup,
  title: "steps.setup.title",
};

/**
 * Hand-written scene for discs that show an icon until their step is done.
 */
export const marks: Scene = {
  about: "steps.marks.about",
  draw: () => (
    <Room size="md">
      <examples.marks.Marks />
    </Room>
  ),
  example: examples.marks,
  title: "steps.marks.title",
};

/**
 * Hand-written scene for a linear flow that refuses to leave a step until it is filled in.
 */
export const gated: Scene = {
  about: "steps.gated.about",
  draw: () => (
    <Room size="md">
      <examples.gated.Gated />
    </Room>
  ),
  example: examples.gated,
  title: "steps.gated.title",
};

/**
 * Hand-written scene for steps that show progress without triggers or content.
 */
export const parcel: Scene = {
  about: "steps.parcel.about",
  draw: () => (
    <Room size="md">
      <examples.parcel.Parcel />
    </Room>
  ),
  example: examples.parcel,
  title: "steps.parcel.title",
};

export default specimen({
  about: "steps.about",
  id: "components/disclosure/steps",
  imports: 'import { Steps } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Steps.RootProps>(recipe, {
      axes: {
        labelPlacement: { direction: "column" },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="md">
          <examples.payout.Payout {...props} />
        </Room>
      ),
      example: examples.payout,
      namespace: "steps",
      order: ["variant", "palette", "size", "labelPlacement"],
    }),
    setup,
    marks,
    gated,
    parcel,
  ],
  title: "steps.title",
});
