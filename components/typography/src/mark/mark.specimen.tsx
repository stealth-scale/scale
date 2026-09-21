/**
 * Shows the highlight: every look in every status, every corner at every inset, both effects and
 * every motion, each inside a line of ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The statuses are crossed with the looks and the corners with the insets,
 *   because those are the pairs a page sets together. The words are keys under `mark` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/mark.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Mark } from "#mark/mark.ts";
import { recipe } from "#mark/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * Draws the highlight in every look in every status.
 */
function Looks(): ReactElement {
  const { t } = useWords("mark");

  return (
    <Matrix
      across={{ knob: "status", of: valuesOf(recipe, "status") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, status) => (
        <Text>
          {t("before")}{" "}
          <Mark status={status} variant={variant}>
            {t("chassis")}
          </Mark>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the highlight at every corner at every inset.
 */
function Corners(): ReactElement {
  const { t } = useWords("mark");

  return (
    <Matrix
      across={{ knob: "inset", of: valuesOf(recipe, "inset") }}
      knob="radius"
      of={valuesOf(recipe, "radius")}
    >
      {(radius, inset) => (
        <Text>
          {t("before")}{" "}
          <Mark inset={inset} radius={radius}>
            {t("chassis")}
          </Mark>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the highlight with each effect.
 */
function Effects(): ReactElement {
  const { t } = useWords("mark");

  return (
    <Matrix knob="effect" of={valuesOf(recipe, "effect")}>
      {(effect) => (
        <Text>
          {t("before")} <Mark effect={effect}>{t("chassis")}</Mark>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the highlight entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("mark");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Text>
          {t("before")} <Mark motion={motion}>{t("chassis")}</Mark>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Every look in every status.
 */
export const looks: Scene = { about: "mark.looks.about", draw: Looks, title: "mark.looks.title" };

/**
 * Every corner at every inset.
 */
export const corners: Scene = {
  about: "mark.corners.about",
  draw: Corners,
  title: "mark.corners.title",
};

/**
 * Both effects.
 */
export const effects: Scene = {
  about: "mark.effects.about",
  draw: Effects,
  title: "mark.effects.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "mark.motion.about",
  draw: Motion,
  title: "mark.motion.title",
};

export default specimen({
  about: "mark.about",
  group: "Typography",
  id: "typography/mark",
  imports: 'import { Mark, Text } from "@stealthscale/component-typography";',
  scenes: [looks, corners, effects, motion],
  title: "mark.title",
});
