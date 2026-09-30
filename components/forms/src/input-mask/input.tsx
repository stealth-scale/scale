/**
 * Renders an input mask's field.
 *
 * @remarks
 *   The element is the input group's bare `input`. Every edit is masked as it happens: a character
 *   a token refuses is dropped, the pattern's characters are written between the typed ones, and
 *   the caret keeps its place among the typed characters. A paste or an autofill is masked the same
 *   way. The input sets `inputMode` to `numeric` when the pattern reads digits alone, and to
 *   `decimal` when a number mask has a fraction. Spell checking is off. Inside a field the input
 *   takes the field's control ID, which the field's label points at, and lists the field's texts in
 *   `aria-describedby`. Outside a field name it with `aria-label`.
 */

import { type ChangeEvent, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { inputTypeOf, useCaret } from "#caret.ts";
import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { Field, type FieldProps } from "#input-group/field.ts";
import { edited } from "#input-mask/editing.ts";
import { useMasking } from "#input-mask/state.ts";

/**
 * Describes the props of the input: the props of the group's `input`, without the value, which the
 * root stores.
 */
export type InputProps = Omit<FieldProps, "defaultValue" | "value">;

/**
 * Renders the input with the masked value, the states and the field's texts.
 *
 * @param props - Attributes of the `input` element. A stated one overrides the root's.
 * @returns The `input` element.
 */
export function Input({ onChange, ...props }: InputProps): ReactElement {
  const masking = useMasking();
  const field = useOptionalField();
  const place = useCaret();

  return (
    <Field
      spellCheck={false}
      {...omitUndefined({
        "aria-describedby": field ? describedBy(field.ids) : undefined,
        "aria-invalid": masking.invalid === true ? true : undefined,
        disabled: masking.disabled,
        id: field?.ids.control,
        inputMode: masking.masker.keyboard,
        name: masking.name,
        readOnly: masking.readOnly,
        required: masking.required,
      })}
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const next = edited(masking.masker.engine, {
          caret: input.selectionStart ?? input.value.length,
          inputType: inputTypeOf(event.nativeEvent),
          previous: masking.value,
          typed: input.value,
        });

        place(input, next.caret);
        masking.set(next.value);
        onChange?.(event);
      }}
      value={masking.value}
    />
  );
}
