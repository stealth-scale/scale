/**
 * Renders a password input's field.
 *
 * @remarks
 *   The element is the input group's bare `input`, of type `password` while the value is hidden and
 *   `text` while it is shown, with `autocomplete` from the root (`current-password` unless stated)
 *   and spell checking and capitalisation off. Inside a field the input takes the field's control
 *   ID, which the field's label points at, and lists the field's texts in `aria-describedby`.
 *   Outside a field name it with `aria-label`.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { Field, type FieldProps } from "#input-group/field.ts";
import { usePasswordInput } from "#password-input/machine.ts";

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
  const api = usePasswordInput();
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
