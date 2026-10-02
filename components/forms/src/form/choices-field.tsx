/**
 * Renders a multi-choice field of a form: a group of checkboxes bound to a field whose value is the
 * strings a person picked.
 *
 * @remarks
 *   The group is the library's `Checkbox.Group` inside a `Field`, rendered as a `fieldset` named by
 *   the field's label, so its label reads as every other field's does. Each box takes the field's
 *   texts in `aria-describedby` and its invalid state, and none is required on its own: the
 *   schema's `minItems` asks for a count, which a box cannot report. The choices are the `enum` of
 *   the array's `items`, each reading its words from the catalogue under
 *   `<id>.fields.<path>.options.<value>`, and its value where the catalogue has none. The field's
 *   value lists the picked values in the order a person picked them. A checked box shows the
 *   field's glyph, else the form's, else its fill alone. The field counts as left once focus leaves
 *   the group, and its blur validators run then. The form's renderers render an array of `enum`
 *   strings with it, where the presentation names the array: a form leaves an array out of the
 *   fields it renders by default.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  choicesOf,
  isSchema,
  useFieldAria,
  useProperty,
  useWords,
} from "@stealthscale/provider-form";

import * as Checkbox from "#checkbox/index.ts";
import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { Mark } from "#form/mark.tsx";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";

/**
 * Describes what a multi-choice field is given.
 */
export interface ChoicesFieldProps extends FieldProps {
  /**
   * Glyph inside a checked box, in place of the form's.
   */
  readonly indicator?: ReactNode;

  /**
   * The choices. The `enum` of the array's `items` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a group of checkboxes bound to the multi-choice field in scope.
 *
 * @param props - The words of the label, whether a value is required, the glyph and the choices.
 * @returns The field, with the group of checkboxes and the field's texts.
 */
export function ChoicesField({
  indicator,
  label,
  options,
  required,
}: ChoicesFieldProps): ReactElement {
  const field = useBoundField<readonly string[] | undefined>();
  const aria = useFieldAria({ label, required });
  const { schema } = useProperty();
  const words = useWords();
  const { glyphs, size } = useFormScope();
  const items = schema?.["items"];
  const values = options ?? (isSchema(items) ? choicesOf(items) : []);
  const mark = indicator ?? glyphs.checkbox;

  return (
    <Field.Root
      id={aria.control.id}
      invalid={aria.error !== undefined}
      required={aria.control["aria-required"]}
      {...(size === undefined ? {} : { size })}
    >
      <Field.Label as="span" htmlFor={undefined}>
        {aria.label.text}
        <Mark />
      </Field.Label>
      <Checkbox.Group
        aria-labelledby={aria.label.props.id}
        as="fieldset"
        name={aria.control.name}
        onBlur={(event) => {
          if (isLeaving(event)) field.handleBlur();
        }}
        onValueChange={(picked) => {
          field.handleChange(picked);
        }}
        value={field.state.value ?? []}
      >
        {values.map((choice) => (
          <Checkbox.Root key={choice} required={false} value={choice}>
            <Checkbox.Control>
              {mark === undefined ? null : <Checkbox.Indicator>{mark}</Checkbox.Indicator>}
            </Checkbox.Control>
            <Checkbox.Label>{words.option(field.name, choice)}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
