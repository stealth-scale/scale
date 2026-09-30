/**
 * Catalogue page for the progress circle.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis from an upload at 62% with its figure in the
 *   ring. The `shape` scene uses the thickest ring, and the `palette` scene crosses the looks.
 *   Hand-written scenes render a value the machine does not know in both looks, a checklist
 *   counted in steps and a storage quota counted in gigabytes. The words are keys under
 *   `progress-circle` in `locales/en/specimen/progress-circle.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#progress-circle/examples/index.ts";
import type * as ProgressCircle from "#progress-circle/index.ts";
import { recipe } from "#progress-circle/recipe.ts";

/**
 * Looks of the unknown-value scene.
 */
const LOOKS = ["outline", "subtle"] as const;

/**
 * Hand-written scene for a value the machine does not know, in both looks.
 */
export const unknown: Scene = {
  about: "progress-circle.unknown.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <examples.syncing.Syncing variant={variant} />}
    </Matrix>
  ),
  example: examples.syncing,
  props: { variant: "outline" },
  title: "progress-circle.unknown.title",
};

/**
 * Hand-written scene for a checklist counted in steps.
 */
export const steps: Scene = {
  about: "progress-circle.counted.about",
  draw: () => <examples.checklist.Checklist />,
  example: examples.checklist,
  title: "progress-circle.counted.title",
};

/**
 * Hand-written scene for a storage quota in its own units.
 */
export const units: Scene = {
  about: "progress-circle.units.about",
  draw: () => <examples.quota.Quota />,
  example: examples.quota,
  title: "progress-circle.units.title",
};

export default specimen({
  about: "progress-circle.about",
  id: "components/feedback/progress-circle",
  imports: 'import { ProgressCircle } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<ProgressCircle.RootProps>(recipe, {
      axes: {
        palette: { across: "variant" },
        shape: { with: { size: "xl" } },
      },
      draw: (props) => <examples.upload.Upload {...props} />,
      example: examples.upload,
      namespace: "progress-circle",
      order: ["size", "shape", "palette", "layout"],
    }),
    unknown,
    steps,
    units,
  ],
  title: "progress-circle.title",
});
