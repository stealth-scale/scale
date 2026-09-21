/**
 * Shows the fieldset: every size, both orientations, every status on a group that is wrong, and
 * the states a page puts it in.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every group holds the same delivery form: a legend, a helper text, two
 *   fields and an error text. The words are keys under `fieldset` in the catalogue's namespace,
 *   kept beside this file in `locales/en/specimen/fieldset.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#fieldset/recipe.ts";

/**
 * The states a page puts a group in, beside the group as it is.
 */
const STATES = ["default", "disabled", "invalid"] as const;

/**
 * Draws the parts of the delivery group.
 */
function Delivery(): ReactElement {
  const { t } = useWords("fieldset");

  return (
    <>
      <Fieldset.Legend>{t("delivery")}</Fieldset.Legend>
      <Fieldset.HelperText>{t("helper")}</Fieldset.HelperText>
      <Field.Root>
        <Field.Label>{t("address")}</Field.Label>
        <Field.Control />
      </Field.Root>
      <Field.Root>
        <Field.Label>{t("city")}</Field.Label>
        <Field.Control />
      </Field.Root>
      <Fieldset.ErrorText>{t("none")}</Fieldset.ErrorText>
    </>
  );
}

/**
 * Draws the group at every size.
 */
function Sizes(): ReactElement {
  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Fieldset.Root size={size}>
          <Delivery />
        </Fieldset.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the group in both orientations.
 */
function Orientations(): ReactElement {
  return (
    <Matrix direction="column" knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => (
        <Fieldset.Root orientation={orientation}>
          <Delivery />
        </Fieldset.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a group that is wrong in every status.
 */
function Statuses(): ReactElement {
  return (
    <Matrix knob="status" of={valuesOf(recipe, "status")}>
      {(status) => (
        <Fieldset.Root invalid status={status}>
          <Delivery />
        </Fieldset.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the group in every state.
 */
function States(): ReactElement {
  return (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Fieldset.Root disabled={state === "disabled"} invalid={state === "invalid"}>
          <Delivery />
        </Fieldset.Root>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "fieldset.sizes.about",
  draw: Sizes,
  title: "fieldset.sizes.title",
};

/**
 * Both orientations.
 */
export const orientations: Scene = {
  about: "fieldset.orientations.about",
  draw: Orientations,
  title: "fieldset.orientations.title",
};

/**
 * Every status.
 */
export const statuses: Scene = {
  about: "fieldset.statuses.about",
  draw: Statuses,
  title: "fieldset.statuses.title",
};

/**
 * Every state.
 */
export const states: Scene = {
  about: "fieldset.states.about",
  draw: States,
  title: "fieldset.states.title",
};

export default specimen({
  about: "fieldset.about",
  group: "Forms",
  id: "forms/fieldset",
  imports: 'import { Field, Fieldset } from "@stealthscale/component-forms";',
  scenes: [sizes, orientations, statuses, states],
  title: "fieldset.title",
});
