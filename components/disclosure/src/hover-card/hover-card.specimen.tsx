/**
 * Catalogue page for the hover card.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes from the profile example. The placement, delay and
 *   disabled scenes are hand-written, because each sets a machine option and not an axis. The issue
 *   and reviewers scenes show a card of another kind and one card that several links share. Every
 *   card renders closed and portals its panel to the document body, so an opened card renders over
 *   the page and a scene is as tall as its links. A single link renders in a `Sample`, which keeps
 *   its pointer area at the width of its words. The words are keys under `hover-card` in
 *   `locales/en/specimen/hover-card.json`.
 */

import { Matrix, Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#hover-card/examples/index.ts";
import type * as HoverCard from "#hover-card/index.ts";
import { recipe } from "#hover-card/recipe.ts";

/**
 * Sides of the placement scene.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Open delays of the delay scene, in milliseconds.
 */
const DELAYS = [0, 300, 600] as const;

/**
 * Hand-written scene for the four placements.
 */
export const placement: Scene = {
  about: "hover-card.placement.about",
  draw: () => (
    <Matrix knob="placement" of={SIDES}>
      {(side) => <examples.profile.Profile positioning={{ placement: side }} />}
    </Matrix>
  ),
  example: examples.profile,
  props: { positioning: { placement: "top" } },
  title: "hover-card.placement.title",
};

/**
 * Hand-written scene for the time a pointer rests on the link before the card opens.
 */
export const delays: Scene = {
  about: "hover-card.delays.about",
  draw: () => (
    <Matrix knob="openDelay" of={DELAYS}>
      {(delay) => <examples.profile.Profile openDelay={delay} />}
    </Matrix>
  ),
  example: examples.profile,
  props: { openDelay: 0 },
  title: "hover-card.delays.title",
};

/**
 * Hand-written scene for a link whose card is turned off.
 */
export const disabled: Scene = {
  about: "hover-card.disabled.about",
  draw: () => (
    <Matrix knob="disabled" of={[true, false]}>
      {(off) => <examples.profile.Profile disabled={off} />}
    </Matrix>
  ),
  example: examples.profile,
  props: { disabled: true },
  title: "hover-card.disabled.title",
};

/**
 * Hand-written scene for a card that previews an issue.
 */
export const issue: Scene = {
  about: "hover-card.issue.about",
  draw: () => (
    <Sample>
      <examples.issue.Issue />
    </Sample>
  ),
  example: examples.issue,
  title: "hover-card.issue.title",
};

/**
 * Hand-written scene for one card that three links share.
 */
export const reviewers: Scene = {
  about: "hover-card.reviewers.about",
  draw: examples.reviewers.Reviewers,
  example: examples.reviewers,
  title: "hover-card.reviewers.title",
};

export default specimen({
  about: "hover-card.about",
  id: "components/disclosure/hover-card",
  imports: 'import { HoverCard } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<HoverCard.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <examples.profile.Profile {...props} />,
      example: examples.profile,
      namespace: "hover-card",
    }),
    placement,
    delays,
    disabled,
    issue,
    reviewers,
  ],
  title: "hover-card.title",
});
