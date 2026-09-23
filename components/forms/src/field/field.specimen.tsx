/**
 * Shows the field: every size, both orientations, every status on a field that is wrong, the states
 * a page puts it in, a label carrying a badge, and two fields sharing a line.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The states scene is written by hand, because required, disabled, read only
 *   and wrong are four props a page sets on the root and the recipe declares no axis for any of
 *   them. The badge scene and the pair scene are written by hand for the same reason: both show a
 *   field composed with something the field does not own.
 *   Every field carries the same parts: a label with the required mark, the control, the helper
 *   text, the counter and the error text. Every field the recipe's own axes turn is drawn required,
 *   so the mark has something to draw, and the status scene is drawn wrong, because a status is
 *   what the error text and the mark are painted from. The message leads with the mark of its
 *   status, because a status told in colour alone is a status a reader who cannot tell the four
 *   hues apart never reads.
 *   The words are keys under `field` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/field.json`.
 */

import { type ComponentType, type ReactElement } from "react";

import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Grid } from "@stealthscale/component-layout";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";
import { type Status } from "@stealthscale/theme/authoring";

import * as Field from "#field/index.ts";
import { recipe } from "#field/recipe.ts";

/**
 * The states a page puts a field in, beside the field as it is.
 */
const STATES = ["default", "required", "disabled", "readOnly", "invalid"] as const;

/**
 * The mark each status leads its message with, so the four are told apart without reading colour.
 */
const MARKS: Readonly<Record<Status, ComponentType>> = {
  error: CircleAlert,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
};

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
 * Draws every part of an email field, its message led by the mark of the status the scene states.
 */
function Parts({
  placeholder,
  status,
}: {
  readonly placeholder?: string | undefined;
  readonly status?: Status | undefined;
}): ReactElement {
  const { t } = useWords("field");
  const Mark = MARKS[status ?? "error"];

  return (
    <>
      <Field.Label>
        {t("email")}
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Control placeholder={placeholder} type="email" />
      {status === undefined ? <Field.HelperText>{t("helper")}</Field.HelperText> : null}
      <Field.Counter>{t("used")}</Field.Counter>
      <Field.ErrorText>
        <Mark />
        {status === undefined ? t("unknown") : t(`reported.${status}`)}
      </Field.ErrorText>
    </>
  );
}

/**
 * Draws a required field, so the mark beside the label has something to draw.
 *
 * @remarks
 *   A floating label is raised by the control holding something, which the browser reports through
 *   `:placeholder-shown`, and a control with no placeholder at all never matches it. The space is
 *   what a caller writes where they have nothing to suggest: a placeholder with words in it would
 *   be read under the label that had floated up out of its way.
 */
function Required(props: Field.RootProps): ReactElement {
  return (
    <Field.Root required {...props}>
      <Parts {...(props.orientation === "floating" ? { placeholder: " " } : {})} />
    </Field.Root>
  );
}

/**
 * Draws a field reporting the status the scene states, marked wrong only where that status is a
 * fault.
 *
 * @remarks
 *   The three statuses that are not faults are drawn on a field that is not wrong. Marked wrong
 *   they carried the browser's own invalid ring, which is red, over whatever the status had painted
 *   the edge, and told a screen reader the entry was invalid while the message said it was fine.
 */
function Wrong(props: Field.RootProps): ReactElement {
  return (
    <Field.Root required {...(props.status === "error" ? { invalid: true } : {})} {...props}>
      <Parts status={props.status} />
    </Field.Root>
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
 * Draws a field whose label carries a badge rather than the required mark.
 *
 * @remarks
 *   The label is an inline row with a gap of its own, so anything a page puts after the words sits
 *   beside them. A field nobody has to fill in says so where the required mark would have been.
 */
function Optional(): ReactElement {
  const { t } = useWords("field");

  return (
    <Field.Root>
      <Field.Label>
        {t("email")}
        <Badge size="sm">{t("badge")}</Badge>
      </Field.Label>
      <Field.Control type="email" />
      <Field.HelperText>{t("helper")}</Field.HelperText>
    </Field.Root>
  );
}

/**
 * Draws two fields sharing a line, which is what a field filling its column is for.
 *
 * @remarks
 *   A grid rather than a row of two, because a field states no width of its own and two fields in a
 *   row would each shrink to the words they hold. The grid gives each of them a column and the
 *   field fills it.
 */
function Paired(): ReactElement {
  const { t } = useWords("field");

  return (
    <Grid.Root columns="2">
      <Grid.Item>
        <Field.Root required>
          <Field.Label>
            {t("given")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Field.Control autoComplete="given-name" />
        </Field.Root>
      </Grid.Item>
      <Grid.Item>
        <Field.Root required>
          <Field.Label>
            {t("family")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Field.Control autoComplete="family-name" />
        </Field.Root>
      </Grid.Item>
    </Grid.Root>
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

/**
 * The hand-written scene for a label that carries a badge.
 */
export const optional: Scene = {
  about: "field.optional.about",
  draw: Optional,
  source: [
    'import { Badge } from "@stealthscale/component-data";',
    'import { Field } from "@stealthscale/component-forms";',
    "",
    "<Field.Root>",
    "  <Field.Label>",
    "    Email",
    '    <Badge size="sm">optional</Badge>',
    "  </Field.Label>",
    '  <Field.Control type="email" />',
    "  <Field.HelperText>We only write about invoices.</Field.HelperText>",
    "</Field.Root>",
  ].join("\n"),
  title: "field.optional.title",
};

/**
 * The hand-written scene for two fields sharing a line.
 */
export const paired: Scene = {
  about: "field.paired.about",
  draw: Paired,
  source: [
    'import { Field } from "@stealthscale/component-forms";',
    'import { Grid } from "@stealthscale/component-layout";',
    "",
    '<Grid.Root columns="2">',
    "  <Grid.Item>",
    "    <Field.Root required>",
    "      <Field.Label>",
    "        Given name",
    "        <Field.RequiredIndicator />",
    "      </Field.Label>",
    '      <Field.Control autoComplete="given-name" />',
    "    </Field.Root>",
    "  </Grid.Item>",
    "</Grid.Root>",
  ].join("\n"),
  title: "field.paired.title",
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
    optional,
    paired,
  ],
  title: "field.title",
});
