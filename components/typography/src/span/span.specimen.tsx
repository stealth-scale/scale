/**
 * Shows the run: every ink at every weight, a path cut short, and every motion, each inside a line
 * of ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The words are keys under `span` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/span.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#span/recipe.ts";
import { Span } from "#span/span.ts";
import { Text } from "#text/text.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws a figure in every ink at every weight.
 */
function Inks(): ReactElement {
  const { t } = useWords("span");

  return (
    <Matrix
      across={{ knob: "weight", of: valuesOf(recipe, "weight") }}
      knob="tone"
      of={valuesOf(recipe, "tone")}
    >
      {(tone, weight) => (
        <Text>
          {t("before")}{" "}
          <Span tone={tone} weight={weight}>
            {t("total")}
          </Span>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws a path cut to the line beside one left whole.
 */
function Truncate(): ReactElement {
  const { t } = useWords("span");

  return (
    <Matrix knob="truncate" of={EITHER}>
      {(truncate) => (
        <Text>
          <Span truncate={truncate}>{t("path")}</Span>
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the run entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("span");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Text>
          {t("before")} <Span motion={motion}>{t("total")}</Span>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Every ink at every weight.
 */
export const inks: Scene = { about: "span.inks.about", draw: Inks, title: "span.inks.title" };

/**
 * A run cut short beside one left whole.
 */
export const truncate: Scene = {
  about: "span.truncate.about",
  draw: Truncate,
  title: "span.truncate.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "span.motion.about",
  draw: Motion,
  title: "span.motion.title",
};

export default specimen({
  about: "span.about",
  group: "Typography",
  id: "typography/span",
  scenes: [inks, truncate, motion],
  title: "span.title",
});
