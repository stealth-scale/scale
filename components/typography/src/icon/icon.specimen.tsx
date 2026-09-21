/**
 * Shows the icon: every size, every ink, every motion, and a pointing mark mirrored.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The artwork is two paths drawn here, an arrow and a star, in a 24 unit
 *   box. Every icon is labelled, because the page shows the artwork and a screen reader should
 *   hear what it is. The words are keys under `icon` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/icon.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Icon } from "#icon/icon.ts";
import { recipe } from "#icon/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The path of an arrow pointing right, in a 24 unit box.
 */
const ARROW = "M5 12h14m-6-6 6 6-6 6";

/**
 * The path of a five-pointed star, in a 24 unit box.
 */
const STAR = "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z";

/**
 * Draws the star at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("icon");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Icon aria-hidden={false} aria-label={t("star")} size={size} viewBox="0 0 24 24">
          <path d={STAR} />
        </Icon>
      )}
    </Matrix>
  );
}

/**
 * Draws the star in every ink.
 */
function Inks(): ReactElement {
  const { t } = useWords("icon");

  return (
    <Matrix knob="tone" of={valuesOf(recipe, "tone")}>
      {(tone) => (
        <Icon aria-hidden={false} aria-label={t("star")} size="lg" tone={tone} viewBox="0 0 24 24">
          <path d={STAR} />
        </Icon>
      )}
    </Matrix>
  );
}

/**
 * Draws the star with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("icon");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Icon
          aria-hidden={false}
          aria-label={t("star")}
          motion={motion}
          size="lg"
          viewBox="0 0 24 24"
        >
          <path d={STAR} />
        </Icon>
      )}
    </Matrix>
  );
}

/**
 * Draws the arrow as it is and mirrored.
 */
function Mirrored(): ReactElement {
  const { t } = useWords("icon");

  return (
    <Matrix knob="mirrored" of={EITHER}>
      {(mirrored) => (
        <Icon
          aria-hidden={false}
          aria-label={t("arrow")}
          mirrored={mirrored}
          size="lg"
          viewBox="0 0 24 24"
        >
          <path d={ARROW} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = { about: "icon.sizes.about", draw: Sizes, title: "icon.sizes.title" };

/**
 * Every ink.
 */
export const inks: Scene = { about: "icon.inks.about", draw: Inks, title: "icon.inks.title" };

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "icon.motion.about",
  draw: Motion,
  title: "icon.motion.title",
};

/**
 * A pointing mark, as it is and mirrored.
 */
export const mirrored: Scene = {
  about: "icon.mirrored.about",
  draw: Mirrored,
  title: "icon.mirrored.title",
};

export default specimen({
  about: "icon.about",
  group: "Typography",
  id: "typography/icon",
  imports: 'import { Icon } from "@stealthscale/component-typography";',
  scenes: [sizes, inks, motion, mirrored],
  title: "icon.title",
});
