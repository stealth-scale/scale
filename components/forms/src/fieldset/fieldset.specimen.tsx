/**
 * Shows the fieldset: every size, both orientations, every status on a group that is wrong, and
 * the states a page puts it in.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because out of reach and wrong are two
 *   props a page sets on the root and the recipe declares no axis for either.
 *   Every group holds the same delivery form: a legend, a helper text, two fields and an error
 *   text. The status scene is drawn wrong, because a status is what the error text is painted from.
 *   The words are keys under `fieldset` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/fieldset.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#fieldset/recipe.ts";

/**
 * The states a page puts a group in, beside the group as it is.
 */
const STATES = ["default", "disabled", "invalid"] as const;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Fieldset.Legend>Delivery</Fieldset.Legend>",
    "<Fieldset.HelperText>We deliver on weekdays.</Fieldset.HelperText>",
    "<Field.Root>…</Field.Root>",
  ].join("\n"),
  imports: 'import { Fieldset } from "@stealthscale/component-forms";',
  name: "Fieldset.Root",
};

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
 * Draws the delivery group in whatever the scene hands over.
 */
function Grouped(props: Fieldset.RootProps): ReactElement {
  return (
    <Fieldset.Root {...props}>
      <Delivery />
    </Fieldset.Root>
  );
}

/**
 * Draws a group that is wrong, which is what a status is read against.
 */
function Wrong(props: Fieldset.RootProps): ReactElement {
  return <Grouped invalid {...props} />;
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
 * The hand-written scene for the states a page puts a group in.
 */
export const states: Scene = {
  about: "fieldset.states.about",
  draw: States,
  source: written(SAMPLE, { disabled: true }),
  title: "fieldset.states.title",
};

export default specimen({
  about: "fieldset.about",
  id: "components/forms/fieldset",
  imports: 'import { Field, Fieldset } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Fieldset.RootProps>(recipe, {
      axes: {
        orientation: { direction: "column" },
        status: { draw: (props) => <Wrong {...props} /> },
      },
      draw: (props) => <Grouped {...props} />,
      namespace: "fieldset",
      order: ["size", "orientation", "status"],
      sample: SAMPLE,
    }),
    states,
  ],
  title: "fieldset.title",
});
