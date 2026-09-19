/**
 * Shows the multi-line box: every look at every size, every status in every look, every grip, and
 * a box that grows beside one that does not.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every box is named with `aria-label`. The words are keys under `textarea`
 *   in the catalogue's namespace, kept beside this file in `locales/en/specimen/textarea.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#textarea/recipe.ts";
import { Textarea } from "#textarea/textarea.tsx";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Every look the recipe draws.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Draws the box in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("textarea");

  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => <Textarea aria-label={t("notes")} size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws the box in every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("textarea");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => <Textarea aria-label={t("notes")} status={status} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws the box with every grip.
 */
function Grip(): ReactElement {
  const { t } = useWords("textarea");

  return (
    <Matrix knob="grip" of={valuesOf(recipe, "grip")}>
      {(grip) => <Textarea aria-label={t("notes")} grip={grip} />}
    </Matrix>
  );
}

/**
 * Draws four lines in a box of three rows, and in one that grows to hold them.
 */
function Grows(): ReactElement {
  const { t } = useWords("textarea");

  return (
    <Matrix knob="grows" of={EITHER}>
      {(grows) => <Textarea aria-label={t("notes")} defaultValue={t("written")} grows={grows} />}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "textarea.looks.about",
  draw: Looks,
  title: "textarea.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "textarea.statuses.about",
  draw: Statuses,
  title: "textarea.statuses.title",
};

/**
 * Every grip.
 */
export const grip: Scene = {
  about: "textarea.grip.about",
  draw: Grip,
  title: "textarea.grip.title",
};

/**
 * A box that grows beside one that does not.
 */
export const grows: Scene = {
  about: "textarea.grows.about",
  draw: Grows,
  title: "textarea.grows.title",
};

export default specimen({
  about: "textarea.about",
  group: "Forms",
  id: "forms/textarea",
  scenes: [looks, statuses, grip, grows],
  title: "textarea.title",
});
