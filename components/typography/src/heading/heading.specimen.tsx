/**
 * Shows the heading: every size, every ink, both effects, the motions and a line cut short.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every heading here is drawn as an `h3`, under the scene's own `h2`, so the
 *   page's outline stays in order whatever size a heading takes. The words are keys under
 *   `heading` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/heading.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Heading } from "#heading/heading.ts";
import { recipe } from "#heading/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws a title at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Heading as="h3" size={size}>
          {t("quarterly")}
        </Heading>
      )}
    </Matrix>
  );
}

/**
 * Draws a title in every ink.
 */
function Inks(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix knob="tone" of={valuesOf(recipe, "tone")}>
      {(tone) => (
        <Heading as="h3" tone={tone}>
          {t("settings")}
        </Heading>
      )}
    </Matrix>
  );
}

/**
 * Draws a title with each effect.
 */
function Effects(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix knob="effect" of={valuesOf(recipe, "effect")}>
      {(effect) => (
        <Heading as="h3" effect={effect} size="2xl">
          {t("welcome")}
        </Heading>
      )}
    </Matrix>
  );
}

/**
 * Draws a title entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Heading as="h3" motion={motion}>
          {t("release")}
        </Heading>
      )}
    </Matrix>
  );
}

/**
 * Draws a long title cut to one line beside one left to wrap.
 *
 * @remarks
 *   Each title stands in a room at the large measure, because the two read the same until the
 *   width runs out, and a cell of the catalogue gave a title of eighty characters the whole page.
 */
/**
 * The three steps the display role reaches, which are the loudest three of the size axis.
 */
const DISPLAYED = ["2xl", "3xl", "4xl"] as const;

/**
 * Draws the title in the display role at the three sizes the role reaches.
 */
function Display(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix direction="column" knob="size" of={DISPLAYED}>
      {(size) => (
        <Heading as="h3" display size={size}>
          {t("welcome")}
        </Heading>
      )}
    </Matrix>
  );
}

function Truncate(): ReactElement {
  const { t } = useWords("heading");

  return (
    <Matrix direction="column" knob="truncate" of={EITHER}>
      {(truncate) => (
        <Room size="lg">
          <Heading as="h3" truncate={truncate}>
            {t("winding")}
          </Heading>
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "heading.sizes.about",
  draw: Sizes,
  title: "heading.sizes.title",
};

/**
 * The display role at the three sizes it reaches.
 */
export const display: Scene = {
  about: "heading.display.about",
  draw: Display,
  title: "heading.display.title",
};

/**
 * Every ink.
 */
export const inks: Scene = {
  about: "heading.inks.about",
  draw: Inks,
  title: "heading.inks.title",
};

/**
 * Both effects.
 */
export const effects: Scene = {
  about: "heading.effects.about",
  draw: Effects,
  title: "heading.effects.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "heading.motion.about",
  draw: Motion,
  title: "heading.motion.title",
};

/**
 * A line cut short beside one left to wrap.
 */
export const truncate: Scene = {
  about: "heading.truncate.about",
  draw: Truncate,
  title: "heading.truncate.title",
};

export default specimen({
  about: "heading.about",
  group: "Typography",
  id: "typography/heading",
  scenes: [sizes, display, inks, effects, motion, truncate],
  title: "heading.title",
});
