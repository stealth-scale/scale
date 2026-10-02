/**
 * Renders a number input's field.
 *
 * @remarks
 *   The element is the input group's bare `input` in the `spinbutton` role, with the minimum, the
 *   maximum, the value and its formatted text as ARIA values. The arrow keys step the value, Shift
 *   with an arrow steps it tenfold, Home and End set the minimum and the maximum, and a character
 *   that makes no number is refused. Inside a field the input takes the field's control ID, which
 *   the field's label points at, and lists the field's texts in `aria-describedby`. Outside a field
 *   name it with `aria-label`.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { Field, type FieldProps } from "#input-group/field.ts";
import { useNumberInput } from "#number-input/machine.ts";

/**
 * Describes the props of the input: the props of the group's `input`.
 */
export type InputProps = FieldProps;

/**
 * Renders the input with the machine's props and the field's texts.
 *
 * @param props - Attributes of the `input` element, merged over the machine's.
 * @returns The `input` element.
 */
export function Input(props: InputProps): ReactElement {
  const api = useNumberInput();
  const field = useOptionalField();

  return (
    <Field
      {...mergeProps(
        api.getInputProps(),
        omitUndefined({ "aria-describedby": field ? describedBy(field.ids) : undefined }),
        props,
      )}
    />
  );
}
