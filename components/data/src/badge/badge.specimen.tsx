/**
 * Shows the badge: every look at every size, every status in every look, and every corner at
 * every size on a count.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The words are keys under `badge` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/badge.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Badge } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Every size the recipe draws.
 */
const SIZES = valuesOf(recipe, "size");

/**
 * Draws a draft label in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("badge");

  return (
    <Matrix across={{ knob: "size", of: SIZES }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Badge size={size} variant={variant}>
          {t("draft")}
        </Badge>
      )}
    </Matrix>
  );
}

/**
 * Draws a live label in every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("badge");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Badge status={status} variant={variant}>
          {t("live")}
        </Badge>
      )}
    </Matrix>
  );
}

/**
 * Draws a count at every corner at every size.
 */
function Corners(): ReactElement {
  return (
    <Matrix across={{ knob: "size", of: SIZES }} knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius, size) => (
        <Badge radius={radius} size={size} status="error">
          12
        </Badge>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "badge.looks.about",
  draw: Looks,
  title: "badge.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "badge.statuses.about",
  draw: Statuses,
  title: "badge.statuses.title",
};

/**
 * Every corner at every size.
 */
export const corners: Scene = {
  about: "badge.corners.about",
  draw: Corners,
  title: "badge.corners.title",
};

export default specimen({
  about: "badge.about",
  group: "Data",
  id: "data/badge",
  scenes: [looks, statuses, corners],
  title: "badge.title",
});
