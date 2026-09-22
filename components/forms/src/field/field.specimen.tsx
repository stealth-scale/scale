/**
 * Shows the field: every size, both orientations, every status on a field that is wrong, and the
 * states a page puts it in.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because required, disabled, read only
 *   and wrong are four props a page sets on the root and the recipe declares no axis for any of
 *   them.
 *   Every field carries the same parts: a label with the required mark, the control, the helper
 *   text, the counter and the error text. Every field the recipe's own axes turn is drawn required,
 *   so the mark has something to draw, and the status scene is drawn wrong, because a status is
 *   what the error text and the mark are painted from. The words are keys under `field` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/field.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import { recipe } from "#field/recipe.ts";

/**
 * The states a page puts a field in, beside the field as it is.
 */
const STATES = ["default", "required", "disabled", "readOnly", "invalid"] as const;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Field.Label>Email</Field.Label>",
    '<Field.Control type="email" />',
    "<Field.HelperText>We only write about invoices.</Field.HelperText>",
  ].join("\n"),
  imports: 'import { Field } from "@stealthscale/component-forms";',
  name: "Field.Root",
};

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
 * Draws a required field, so the mark beside the label has something to draw.
 */
function Required(props: Field.RootProps): ReactElement {
  return (
    <Field.Root required {...props}>
      <Parts />
    </Field.Root>
  );
}

/**
 * Draws a field that is wrong, which is what a status is read against.
 */
function Wrong(props: Field.RootProps): ReactElement {
  return <Required invalid {...props} />;
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
 * The hand-written scene for the states a page puts a field in.
 */
export const states: Scene = {
  about: "field.states.about",
  draw: States,
  source: written(SAMPLE, { invalid: true, required: true }),
  title: "field.states.title",
};

export default specimen({
  about: "field.about",
  id: "components/forms/field",
  imports: 'import { Field } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Field.RootProps>(recipe, {
      axes: {
        orientation: { direction: "column" },
        status: { draw: (props) => <Wrong {...props} /> },
      },
      draw: (props) => <Required {...props} />,
      namespace: "field",
      order: ["size", "orientation", "status"],
      sample: SAMPLE,
    }),
    states,
  ],
  title: "field.title",
});
