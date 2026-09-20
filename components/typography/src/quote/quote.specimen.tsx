/**
 * Shows the inline quotation: both answers to the marks, every ink and every motion, each inside a
 * line of ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The words are keys under `quote` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/quote.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Quote } from "#quote/quote.ts";
import { recipe } from "#quote/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * Draws the quotation with the browser's marks and without.
 */
function Marks(): ReactElement {
  const { t } = useWords("quote");

  return (
    <Matrix knob="marks" of={valuesOf(recipe, "marks")}>
      {(marks) => (
        <Text>
          {t("before")} <Quote marks={marks}>{t("claim")}</Quote>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the quotation in every ink.
 */
function Inks(): ReactElement {
  const { t } = useWords("quote");

  return (
    <Matrix knob="tone" of={valuesOf(recipe, "tone")}>
      {(tone) => (
        <Text>
          {t("before")} <Quote tone={tone}>{t("claim")}</Quote>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the quotation entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("quote");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Text>
          {t("before")} <Quote motion={motion}>{t("claim")}</Quote>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Both answers to the marks.
 */
export const marks: Scene = {
  about: "quote.marks.about",
  draw: Marks,
  title: "quote.marks.title",
};

/**
 * Every ink.
 */
export const inks: Scene = { about: "quote.inks.about", draw: Inks, title: "quote.inks.title" };

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "quote.motion.about",
  draw: Motion,
  title: "quote.motion.title",
};

export default specimen({
  about: "quote.about",
  group: "Typography",
  id: "typography/quote",
  scenes: [marks, inks, motion],
  title: "quote.title",
});
