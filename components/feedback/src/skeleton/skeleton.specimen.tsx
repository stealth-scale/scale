/**
 * Catalogues the skeleton across its variants, one scene per axis.
 *
 * @remarks
 *   Each scene enumerates its axis from the recipe, so a value added to the theme appears on the
 *   page without an edit here. Every placeholder wraps a tile, because a skeleton takes the box of
 *   its content and an empty one would collapse. The copy is keyed under `skeleton` in the
 *   catalogue namespace and stored beside this file at `locales/en/specimen/skeleton.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton } from "#skeleton/skeleton.ts";

/**
 * Both values of a boolean axis, which no recipe enumerates for a caller.
 */
const EITHER = [false, true] as const;

/**
 * Renders a profile tile once behind the placeholder and once revealed.
 */
function Loading(): ReactElement {
  const { t } = useWords("skeleton");

  return (
    <Matrix knob="loading" of={EITHER}>
      {(loading) => (
        <Skeleton loading={loading}>
          <Tile>{t("profile")}</Tile>
        </Skeleton>
      )}
    </Matrix>
  );
}

/**
 * Renders a profile tile once per motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("skeleton");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Skeleton motion={motion}>
          <Tile>{t("profile")}</Tile>
        </Skeleton>
      )}
    </Matrix>
  );
}

/**
 * Renders a profile tile once per radius step.
 */
function Corners(): ReactElement {
  const { t } = useWords("skeleton");

  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => (
        <Skeleton radius={radius}>
          <Tile>{t("profile")}</Tile>
        </Skeleton>
      )}
    </Matrix>
  );
}

/**
 * The scene comparing the loading and loaded states.
 */
export const loading: Scene = {
  about: "skeleton.loading.about",
  draw: Loading,
  title: "skeleton.loading.title",
};

/**
 * The scene stepping through the motions.
 */
export const motion: Scene = {
  about: "skeleton.motion.about",
  draw: Motion,
  title: "skeleton.motion.title",
};

/**
 * The scene stepping through the radius scale.
 */
export const corners: Scene = {
  about: "skeleton.corners.about",
  draw: Corners,
  title: "skeleton.corners.title",
};

export default specimen({
  about: "skeleton.about",
  group: "Feedback",
  id: "feedback/skeleton",
  imports: 'import { Skeleton } from "@stealthscale/component-feedback";',
  scenes: [loading, motion, corners],
  title: "skeleton.title",
});
