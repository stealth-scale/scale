/**
 * Catalogue page for the skeleton text.
 *
 * @remarks
 *   Both scenes are hand-written, because the recipe has no axes. The line scene varies the
 *   `lines` prop, and the motion scene varies the skeleton recipe's `motion` axis, which the bars
 *   take. Each scene renders the example from `examples/` once per value and shows it as its
 *   source with the first value. The cells run in one column, because the bars fill the width they
 *   get. The words are keys under `skeleton-text` in `locales/en/specimen/skeleton-text.json`.
 */

import { Matrix, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import * as paragraph from "#skeleton-text/examples/paragraph.example.tsx";
import { recipe } from "#skeleton/recipe.ts";

/**
 * Line counts of the line scene.
 */
const COUNTS = [1, 3, 6] as const;

/**
 * Hand-written scene for one, three and six lines.
 */
export const lines: Scene = {
  about: "skeleton-text.lines.about",
  draw: () => (
    <Matrix direction="column" knob="lines" of={COUNTS}>
      {(count) => <paragraph.Paragraph lines={count} />}
    </Matrix>
  ),
  example: paragraph,
  props: { lines: 1 },
  title: "skeleton-text.lines.title",
};

/**
 * Hand-written scene for every motion of the skeleton recipe.
 */
export const motion: Scene = {
  about: "skeleton-text.motion.about",
  draw: () => (
    <Matrix direction="column" knob="motion" of={valuesOf(recipe, "motion")}>
      {(value) => <paragraph.Paragraph motion={value} />}
    </Matrix>
  ),
  example: paragraph,
  props: { motion: "none" },
  title: "skeleton-text.motion.title",
};

export default specimen({
  about: "skeleton-text.about",
  id: "components/feedback/skeleton-text",
  imports: 'import { SkeletonText } from "@stealthscale/component-feedback";',
  scenes: [lines, motion],
  title: "skeleton-text.title",
});
