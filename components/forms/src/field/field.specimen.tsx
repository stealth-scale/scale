/**
 * Shows the field: every size, both orientations, every status on a field that is wrong, and the
 * states a page puts it in.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every field carries the same parts: a label with the required mark, the
 *   control, the helper text, the counter and the error text. The words are keys under `field` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/field.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import { recipe } from "#field/recipe.ts";

/**
 * The states a page puts a field in, beside the field as it is.
 */
const STATES = ["default", "required", "disabled", "readOnly", "invalid"] as const;

/**
 * Draws every part of an email field.
 */
function Parts(): ReactElement {
  const { t } = useWords("field");

  return (
    <>
      <Field.Label>
        {t("email")}
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Control type="email" />
      <Field.HelperText>{t("helper")}</Field.HelperText>
      <Field.Counter>{t("used")}</Field.Counter>
      <Field.ErrorText>{t("unknown")}</Field.ErrorText>
    </>
  );
}

/**
 * Draws the field at every size.
 */
function Sizes(): ReactElement {
  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Field.Root required size={size}>
          <Parts />
        </Field.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the field in both orientations.
 */
function Orientations(): ReactElement {
  return (
    <Matrix direction="column" knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => (
        <Field.Root orientation={orientation} required>
          <Parts />
        </Field.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a field that is wrong in every status.
 */
function Statuses(): ReactElement {
  return (
    <Matrix knob="status" of={valuesOf(recipe, "status")}>
      {(status) => (
        <Field.Root invalid required status={status}>
          <Parts />
        </Field.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the field in every state.
 */
function States(): ReactElement {
  return (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Field.Root
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          readOnly={state === "readOnly"}
          required={state === "required" || state === "invalid"}
        >
          <Parts />
        </Field.Root>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "field.sizes.about",
  draw: Sizes,
  title: "field.sizes.title",
};

/**
 * Both orientations.
 */
export const orientations: Scene = {
  about: "field.orientations.about",
  draw: Orientations,
  title: "field.orientations.title",
};

/**
 * Every status.
 */
export const statuses: Scene = {
  about: "field.statuses.about",
  draw: Statuses,
  title: "field.statuses.title",
};

/**
 * Every state.
 */
export const states: Scene = {
  about: "field.states.about",
  draw: States,
  title: "field.states.title",
};

export default specimen({
  about: "field.about",
  group: "Forms",
  id: "forms/field",
  imports: 'import { Field } from "@stealthscale/component-forms";',
  scenes: [sizes, orientations, statuses, states],
  title: "field.title",
});
