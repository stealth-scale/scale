/**
 * Shows the stressed run: every ink and every motion, each inside a line of ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The run sits in a paragraph, because a stress is read against the words
 *   around it. The words are keys under `em` in the catalogue's namespace, kept beside this file
 *   in `locales/en/specimen/em.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Em } from "#em/em.ts";
import { recipe } from "#em/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * Draws the run in every ink.
 */
function Inks(): ReactElement {
  const { t } = useWords("em");

  return (
    <Matrix knob="tone" of={valuesOf(recipe, "tone")}>
      {(tone) => (
        <Text>
          {t("before")} <Em tone={tone}>{t("never")}</Em>
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
  const { t } = useWords("em");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Text>
          {t("before")} <Em motion={motion}>{t("never")}</Em>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Every ink.
 */
export const inks: Scene = { about: "em.inks.about", draw: Inks, title: "em.inks.title" };

/**
 * Every motion.
 */
export const motion: Scene = { about: "em.motion.about", draw: Motion, title: "em.motion.title" };

export default specimen({
  about: "em.about",
  group: "Typography",
  id: "typography/em",
  imports: 'import { Em, Text } from "@stealthscale/component-typography";',
  scenes: [inks, motion],
  title: "em.title",
});
