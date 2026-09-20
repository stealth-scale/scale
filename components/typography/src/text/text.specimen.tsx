/**
 * Shows the paragraph: every size, every ink at every weight, the alignments, a line cut short, the
 * motions and the mask.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. A scene whose paragraph needs a measure runs its cells down the page. The
 *   words are keys under `text` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/text.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#text/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws a sentence at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => <Text size={size}>{t("reminder")}</Text>}
    </Matrix>
  );
}

/**
 * Draws a sentence in every ink at every weight.
 */
function Inks(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix
      across={{ knob: "weight", of: valuesOf(recipe, "weight") }}
      knob="tone"
      of={valuesOf(recipe, "tone")}
    >
      {(tone, weight) => (
        <Text tone={tone} weight={weight}>
          {t("note")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws a paragraph at every alignment.
 */
function Alignment(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix direction="column" knob="align" of={valuesOf(recipe, "align")}>
      {(align) => <Text align={align}>{t("passage")}</Text>}
    </Matrix>
  );
}

/**
 * Draws a paragraph cut to one line beside one left to wrap.
 */
function Truncate(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix direction="column" knob="truncate" of={EITHER}>
      {(truncate) => <Text truncate={truncate}>{t("passage")}</Text>}
    </Matrix>
  );
}

/**
 * Draws a sentence entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => <Text motion={motion}>{t("summary")}</Text>}
    </Matrix>
  );
}

/**
 * Draws a paragraph faded out at its foot.
 */
function Mask(): ReactElement {
  const { t } = useWords("text");

  return (
    <Matrix direction="column" knob="mask" of={valuesOf(recipe, "mask")}>
      {(mask) => <Text mask={mask}>{t("passage")}</Text>}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = { about: "text.sizes.about", draw: Sizes, title: "text.sizes.title" };

/**
 * Every ink at every weight.
 */
export const inks: Scene = { about: "text.inks.about", draw: Inks, title: "text.inks.title" };

/**
 * Every alignment.
 */
export const alignment: Scene = {
  about: "text.alignment.about",
  draw: Alignment,
  title: "text.alignment.title",
};

/**
 * A line cut short beside one left to wrap.
 */
export const truncate: Scene = {
  about: "text.truncate.about",
  draw: Truncate,
  title: "text.truncate.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "text.motion.about",
  draw: Motion,
  title: "text.motion.title",
};

/**
 * The mask.
 */
export const mask: Scene = { about: "text.mask.about", draw: Mask, title: "text.mask.title" };

export default specimen({
  about: "text.about",
  group: "Typography",
  id: "typography/text",
  scenes: [sizes, inks, alignment, truncate, motion, mask],
  title: "text.title",
});
