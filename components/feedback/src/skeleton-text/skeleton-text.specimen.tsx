/**
 * Shows the paragraph placeholder: one, three and six lines, and every motion.
 *
 * @remarks
 *   The motion is read off the skeleton's recipe, which the bars are drawn with. The count of
 *   lines is a prop rather than an axis, so three counts are written here. The cells run down the
 *   page, because the bars fill the width they are given. The words are keys under
 *   `skeleton-text` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/skeleton-text.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import { SkeletonText } from "#skeleton-text/skeleton-text.tsx";
import { recipe } from "#skeleton/recipe.ts";

/**
 * Three counts of lines: a heading's worth, a paragraph's, and a long one.
 */
const COUNTS = [1, 3, 6] as const;

/**
 * Draws the placeholder at each count of lines.
 */
function Lines(): ReactElement {
  return (
    <Matrix direction="column" knob="lines" of={COUNTS}>
      {(lines) => <SkeletonText lines={lines} />}
    </Matrix>
  );
}

/**
 * Draws the placeholder with every motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix direction="column" knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => <SkeletonText motion={motion} />}
    </Matrix>
  );
}

/**
 * Three counts of lines.
 */
export const lines: Scene = {
  about: "skeleton-text.lines.about",
  draw: Lines,
  title: "skeleton-text.lines.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "skeleton-text.motion.about",
  draw: Motion,
  title: "skeleton-text.motion.title",
};

export default specimen({
  about: "skeleton-text.about",
  group: "Feedback",
  id: "feedback/skeleton-text",
  imports: 'import { SkeletonText } from "@stealthscale/component-feedback";',
  scenes: [lines, motion],
  title: "skeleton-text.title",
});
