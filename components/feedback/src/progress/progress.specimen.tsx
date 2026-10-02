/**
 * Catalogue page for the progress bar.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis from a labelled bar at 62%, each in a room at
 *   the `xs` measure, because a bar is as wide as its container. The palette scene crosses the
 *   looks, the shape scene uses the thickest track, and the effect scene uses the primary palette.
 *   Hand-written scenes render a value the machine does not know in both looks, a count in its own
 *   units, a bar without words named by `aria-label`, a migration against its plan's marker, and a
 *   test run split by outcome. The words are keys under `progress` in
 *   `locales/en/specimen/progress.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as imported from "#progress/examples/imported.example.tsx";
import * as outcomes from "#progress/examples/outcomes.example.tsx";
import * as plan from "#progress/examples/plan.example.tsx";
import * as playback from "#progress/examples/playback.example.tsx";
import * as preparing from "#progress/examples/preparing.example.tsx";
import * as reconciling from "#progress/examples/reconciling.example.tsx";
import { type RootProps } from "#progress/index.ts";
import { recipe } from "#progress/recipe.ts";

/**
 * Looks of the unknown-value scene.
 */
const LOOKS = ["outline", "subtle"] as const;

/**
 * Hand-written scene for a value the machine does not know, in both looks.
 */
export const unknown: Scene = {
  about: "progress.unknown.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => (
        <Room size="xs">
          <preparing.Preparing variant={variant} />
        </Room>
      )}
    </Matrix>
  ),
  example: preparing,
  props: { variant: "outline" },
  title: "progress.unknown.title",
};

/**
 * Hand-written scene for a count in its own units.
 */
export const units: Scene = {
  about: "progress.units.about",
  draw: () => (
    <Room size="xs">
      <imported.Imported />
    </Room>
  ),
  example: imported,
  title: "progress.units.title",
};

/**
 * Hand-written scene for a bar without words, named by `aria-label`.
 */
export const bare: Scene = {
  about: "progress.bare.about",
  draw: () => (
    <Room size="xs">
      <playback.Playback />
    </Room>
  ),
  example: playback,
  title: "progress.bare.title",
};

/**
 * Hand-written scene for a migration against the share its plan expects, marked on the track.
 */
export const planned: Scene = {
  about: "progress.plan.about",
  draw: () => (
    <Room size="xs">
      <plan.Plan />
    </Room>
  ),
  example: plan,
  title: "progress.plan.title",
};

/**
 * Hand-written scene for a test run split by outcome, each outcome a segment.
 */
export const split: Scene = {
  about: "progress.outcomes.about",
  draw: () => (
    <Room size="xs">
      <outcomes.Outcomes />
    </Room>
  ),
  example: outcomes,
  title: "progress.outcomes.title",
};

export default specimen({
  about: "progress.about",
  id: "components/feedback/progress",
  imports: 'import { Progress } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        effect: { with: { palette: "primary" } },
        palette: { across: "variant" },
        shape: { with: { size: "xl" } },
      },
      draw: (props) => (
        <Room size="xs">
          <reconciling.Reconciling {...props} />
        </Room>
      ),
      example: reconciling,
      namespace: "progress",
      order: ["size", "shape", "palette", "layout", "striped", "animated", "effect"],
    }),
    unknown,
    units,
    bare,
    planned,
    split,
  ],
  title: "progress.title",
});
