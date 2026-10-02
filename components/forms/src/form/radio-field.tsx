/**
 * Renders a radio group bound to a string field of a form whose schema lists its choices.
 *
 * @remarks
 *   The group is the library's `RadioGroup` inside a `Field`, named by its own label, with the
 *   field's texts in `aria-describedby`. A person sees every choice at once, and the circles take
 *   no glyph. Each choice reads its words from the catalogue under
 *   `<id>.fields.<path>.options.<value>`, and its value where the catalogue has none. Nothing is
 *   chosen until a person chooses. The field counts as left once focus leaves the group, not as it
 *   moves between the choices, and its blur validators run then. The form's renderers render a
 *   string `enum` of up to five choices with it.
 */

import { type ReactElement } from "react";

import { choicesOf, useFieldAria, useProperty, useWords } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { Mark } from "#form/mark.tsx";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";
import * as RadioGroup from "#radio-group/index.ts";

/**
 * Describes what a radio field is given.
 */
export interface RadioFieldProps extends FieldProps {
  /**
   * The choices. The schema's `enum` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a radio group bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, and the choices.
 * @returns The field, with the group and its texts inside it.
 */
export function RadioField({ label, options, required }: RadioFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const aria = useFieldAria({ label, required });
  const { schema } = useProperty();
  const words = useWords();
  const { size } = useFormScope();
  const values = options ?? (schema === undefined ? [] : choicesOf(schema));
  const value = field.state.value;

  return (
    <Field.Root
      id={aria.control.id}
      invalid={aria.error !== undefined}
      required={aria.control["aria-required"]}
      {...(size === undefined ? {} : { size })}
    >
      <RadioGroup.Root
        name={aria.control.name}
        onBlur={(event) => {
          if (isLeaving(event)) field.handleBlur();
        }}
        onValueChange={({ value: chosen }) => {
          field.handleChange(chosen ?? "");
        }}
        value={value === undefined || value === "" ? null : value}
      >
        <RadioGroup.Label>
          {aria.label.text}
          <Mark />
        </RadioGroup.Label>
        {values.map((choice) => (
          <RadioGroup.Item key={choice} value={choice}>
            <RadioGroup.ItemControl />
            <RadioGroup.ItemText>{words.option(field.name, choice)}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
