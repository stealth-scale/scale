/**
 * Renders a phone input's field.
 *
 * @remarks
 *   The element is the input group's bare `input`, of type `tel`, with the `tel` keyboard and
 *   `autocomplete="tel"`, so a browser offers the person's number and a phone shows its dial pad.
 *   Every edit keeps the digits and a leading `+` and is formatted as it arrives, with the caret
 *   after the digits it followed. Backspace or Delete on a formatting character removes the digit
 *   beyond it too. Spell checking is off. Inside a field the input takes the field's control ID,
 *   which the field's label points at, and lists the field's texts in `aria-describedby`. Outside a
 *   field name it with `aria-label`.
 */

import { type ChangeEvent, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { inputTypeOf, useCaret } from "#caret.ts";
import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { Field, type FieldProps } from "#input-group/field.ts";
import { edited } from "#phone-input/editing.ts";
import { usePhoning } from "#phone-input/state.ts";

/**
 * Describes the props of the input: the props of the group's `input`, without the value, which the
 * root stores.
 */
export type InputProps = Omit<FieldProps, "defaultValue" | "type" | "value">;

/**
 * Renders the input with the formatted number, the states and the field's texts.
 *
 * @param props - Attributes of the `input` element. A stated one overrides the root's.
 * @returns The `input` element.
 */
export function Input({ onChange, ...props }: InputProps): ReactElement {
  const phoning = usePhoning();
  const field = useOptionalField();
  const place = useCaret();

  return (
    <Field
      autoComplete="tel"
      inputMode="tel"
      spellCheck={false}
      {...omitUndefined({
        "aria-describedby": field ? describedBy(field.ids) : undefined,
        "aria-invalid": phoning.invalid === true ? true : undefined,
        disabled: phoning.disabled,
        id: field?.ids.control,
        readOnly: phoning.readOnly,
        required: phoning.required,
      })}
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const next = edited({
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a tel input always reports its selection
          caret: input.selectionStart as number,
          country: phoning.country,
          inputType: inputTypeOf(event.nativeEvent),
          previous: phoning.text,
          typed: input.value,
        });

        place(input, next.caret);
        phoning.edit(next.formatted);
        onChange?.(event);
      }}
      type="tel"
      value={phoning.text}
    />
  );
}
