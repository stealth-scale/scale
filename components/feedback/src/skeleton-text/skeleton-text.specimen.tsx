/**
 * Catalogues the placeholder paragraph at three line counts and under every motion.
 *
 * @remarks
 *   Both scenes are written by hand. This component's own recipe declares no axis, so there is
 *   nothing to generate a scene from, and its specification still asks what the page covers, so an
 *   axis added to it fails that check until this page draws it.
 *   The motion values are enumerated from the skeleton recipe the bars are bound to, which is where
 *   that axis lives. The line count is a prop rather than a variant, so the three counts are
 *   written out here. The cells are stacked in a column because
 *   the bars take the full width they are given. The scene titles are keyed under `skeleton-text`
 *   in the catalogue namespace and stored beside this file at
 *   `locales/en/specimen/skeleton-text.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import { SkeletonText } from "#skeleton-text/skeleton-text.tsx";
import { recipe } from "#skeleton/recipe.ts";

/**
 * The three line counts the scene steps through: a single line, a short paragraph, a long one.
 */
const COUNTS = [1, 3, 6] as const;

/**
 * Renders the placeholder once per line count.
 */
function Lines(): ReactElement {
  return (
    <Matrix direction="column" knob="lines" of={COUNTS}>
      {(lines) => <SkeletonText lines={lines} />}
    </Matrix>
  );
}

/**
 * Renders the placeholder once per motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix direction="column" knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => <SkeletonText motion={motion} />}
    </Matrix>
  );
}

/**
 * The scene stepping through the three line counts.
 */
export const lines: Scene = {
  about: "skeleton-text.lines.about",
  draw: Lines,
  title: "skeleton-text.lines.title",
};

/**
 * The scene stepping through the motions.
 */
export const motion: Scene = {
  about: "skeleton-text.motion.about",
  draw: Motion,
  title: "skeleton-text.motion.title",
};

export default specimen({
  about: "skeleton-text.about",
  id: "components/feedback/skeleton-text",
  imports: 'import { SkeletonText } from "@stealthscale/component-feedback";',
  scenes: [lines, motion],
  title: "skeleton-text.title",
});
