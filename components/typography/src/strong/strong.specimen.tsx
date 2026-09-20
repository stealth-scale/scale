/**
 * Shows the important run: every weight in every ink, and every motion, each inside a line of
 * ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The run sits in a paragraph, because importance is read against the words
 *   around it. The words are keys under `strong` in the catalogue's namespace, kept beside this
 *   file in `locales/en/specimen/strong.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#strong/recipe.ts";
import { Strong } from "#strong/strong.ts";
import { Text } from "#text/text.ts";

/**
 * Draws the run at every weight in every ink.
 */
function Weights(): ReactElement {
  const { t } = useWords("strong");

  return (
    <Matrix
      across={{ knob: "weight", of: valuesOf(recipe, "weight") }}
      knob="tone"
      of={valuesOf(recipe, "tone")}
    >
      {(tone, weight) => (
        <Text>
          {t("before")}{" "}
          <Strong tone={tone} weight={weight}>
            {t("cannot")}
          </Strong>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the run entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("strong");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Text>
          {t("before")} <Strong motion={motion}>{t("cannot")}</Strong>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Every weight in every ink.
 */
export const weights: Scene = {
  about: "strong.weights.about",
  draw: Weights,
  title: "strong.weights.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "strong.motion.about",
  draw: Motion,
  title: "strong.motion.title",
};

export default specimen({
  about: "strong.about",
  group: "Typography",
  id: "typography/strong",
  scenes: [weights, motion],
  title: "strong.title",
});
