/**
 * Shows the skeleton: the placeholder over its content and the content arrived, every motion, and
 * every corner.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every placeholder wraps a tile, so it has a size to take. The words are
 *   keys under `skeleton` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/skeleton.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton } from "#skeleton/skeleton.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the placeholder over a profile, and the profile once loaded.
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
 * Draws the placeholder with every motion.
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
 * Draws the placeholder at every corner.
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
 * The placeholder beside the content arrived.
 */
export const loading: Scene = {
  about: "skeleton.loading.about",
  draw: Loading,
  title: "skeleton.loading.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "skeleton.motion.about",
  draw: Motion,
  title: "skeleton.motion.title",
};

/**
 * Every corner.
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
  scenes: [loading, motion, corners],
  title: "skeleton.title",
});
