/**
 * Shows the list: both looks, every marker, every gap, the alignments of a plain entry's mark, and
 * the motions.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. A marker that counts is drawn on an ordered list, so the numbers mean
 *   something. The words are keys under `list` in the catalogue's namespace, kept beside this
 *   file in `locales/en/specimen/list.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as List from "#list/index.ts";
import { recipe } from "#list/recipe.ts";

/**
 * The markers that count, which an ordered list draws.
 */
const COUNTING = new Set([
  "decimal",
  "leading-zero",
  "lower-roman",
  "upper-roman",
  "lower-alpha",
  "upper-alpha",
  "lower-greek",
]);

/**
 * Draws three groceries as plain entries.
 */
function Groceries(): ReactElement {
  const { t } = useWords("list");

  return (
    <>
      <List.Item>{t("milk")}</List.Item>
      <List.Item>{t("bread")}</List.Item>
      <List.Item>{t("butter")}</List.Item>
    </>
  );
}

/**
 * Draws the list with the browser's marker and as a plain list with its own mark.
 */
function Looks(): ReactElement {
  const { t } = useWords("list");

  return (
    <Matrix knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <List.Root variant={variant}>
          <List.Item>
            {variant === "plain" ? <List.Indicator>✓</List.Indicator> : null}
            {t("milk")}
          </List.Item>
          <List.Item>
            {variant === "plain" ? <List.Indicator>✓</List.Indicator> : null}
            {t("bread")}
          </List.Item>
          <List.Item>
            {variant === "plain" ? <List.Indicator>✗</List.Indicator> : null}
            {t("butter")}
          </List.Item>
        </List.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the groceries under every marker.
 */
function Markers(): ReactElement {
  return (
    <Matrix knob="marker" of={valuesOf(recipe, "marker")}>
      {(marker) => (
        <List.Root as={COUNTING.has(marker) ? "ol" : "ul"} marker={marker}>
          <Groceries />
        </List.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the groceries at every gap.
 */
function Gaps(): ReactElement {
  return (
    <Matrix knob="gap" of={valuesOf(recipe, "gap")}>
      {(gap) => (
        <List.Root gap={gap}>
          <Groceries />
        </List.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a plain entry running to more than one line, with its mark at every place.
 *
 * @remarks
 *   Each entry stands in a room at the smallest measure, which is what makes it run to a second
 *   line: given a cell of the catalogue it sat on one, and the three places read the same.
 */
function Alignment(): ReactElement {
  const { t } = useWords("list");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Room size="xs">
          <List.Root align={align} variant="plain">
            <List.Item>
              <List.Indicator>✓</List.Indicator>
              {t("note")}
            </List.Item>
          </List.Root>
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Draws the groceries entering with every motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <List.Root motion={motion}>
          <Groceries />
        </List.Root>
      )}
    </Matrix>
  );
}

/**
 * Both looks.
 */
export const looks: Scene = { about: "list.looks.about", draw: Looks, title: "list.looks.title" };

/**
 * Every marker.
 */
export const markers: Scene = {
  about: "list.markers.about",
  draw: Markers,
  title: "list.markers.title",
};

/**
 * Every gap.
 */
export const gaps: Scene = { about: "list.gaps.about", draw: Gaps, title: "list.gaps.title" };

/**
 * Every place for a plain entry's mark.
 */
export const alignment: Scene = {
  about: "list.alignment.about",
  draw: Alignment,
  title: "list.alignment.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "list.motion.about",
  draw: Motion,
  title: "list.motion.title",
};

export default specimen({
  about: "list.about",
  group: "Typography",
  id: "typography/list",
  scenes: [looks, markers, gaps, alignment, motion],
  title: "list.title",
});
