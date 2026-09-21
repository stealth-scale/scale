/**
 * Shows the link: both looks, and a link in its own ink beside one inheriting the line's, each
 * inside a line of ordinary words.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The link sits in a paragraph, because a link is found against the words
 *   around it. The words are keys under `link` in the catalogue's namespace, kept beside this file
 *   in `locales/en/specimen/link.json`.
 */

import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Link } from "#link/link.ts";
import { recipe } from "#link/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the link in both looks.
 */
function Looks(): ReactElement {
  const { t } = useWords("link");

  return (
    <Matrix knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <Text>
          {t("before")}{" "}
          <Link href="#terms" variant={variant}>
            {t("terms")}
          </Link>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Draws the link in its own ink and in the line's.
 */
function Inherit(): ReactElement {
  const { t } = useWords("link");

  return (
    <Matrix knob="inherit" of={EITHER}>
      {(inherit) => (
        <Text tone="muted">
          {t("before")}{" "}
          <Link href="#terms" inherit={inherit}>
            {t("terms")}
          </Link>
          {t("after")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Both looks.
 */
export const looks: Scene = { about: "link.looks.about", draw: Looks, title: "link.looks.title" };

/**
 * Own ink beside the line's.
 */
export const inherit: Scene = {
  about: "link.inherit.about",
  draw: Inherit,
  title: "link.inherit.title",
};

export default specimen({
  about: "link.about",
  group: "Navigation",
  id: "navigation/link",
  imports: 'import { Link } from "@stealthscale/component-navigation";',
  scenes: [looks, inherit],
  title: "link.title",
});
