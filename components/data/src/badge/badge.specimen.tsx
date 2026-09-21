/**
 * Lays out the catalogue page for the badge.
 *
 * @remarks
 *   Each scene reads its axis values from the recipe, so a value added to the theme appears here
 *   without an edit to this file. The text comes from keys under `badge` in the catalogue
 *   namespace, held beside this file in `locales/en/specimen/badge.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Badge } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

/**
 * The variant values two of the scenes iterate over.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * The size values two of the scenes iterate over.
 */
const SIZES = valuesOf(recipe, "size");

/**
 * Renders a matrix of every look against every size.
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
 * Renders a matrix of every status against every look.
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
 * Renders a matrix of every corner against every size, on a numeric label.
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
 * The scene crossing the looks with the sizes.
 */
export const looks: Scene = {
  about: "badge.looks.about",
  draw: Looks,
  title: "badge.looks.title",
};

/**
 * The scene crossing the statuses with the looks.
 */
export const statuses: Scene = {
  about: "badge.statuses.about",
  draw: Statuses,
  title: "badge.statuses.title",
};

/**
 * The scene crossing the corners with the sizes.
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
  imports: 'import { Badge } from "@stealthscale/component-data";',
  scenes: [looks, statuses, corners],
  title: "badge.title",
});
