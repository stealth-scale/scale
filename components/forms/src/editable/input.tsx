/**
 * Renders an editable's single-line field.
 *
 * @remarks
 *   The element is an `input` that shows while the editable is being edited. Enter saves the value
 *   and Escape restores the value from before editing. The machine's `aria-label` is left out, so
 *   `Editable.Label` or the label of a field around the editable names the input. Outside both,
 *   name it with `aria-label`. Inside a field the input lists the field's texts in
 *   `aria-describedby`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";
import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";

/**
 * Renders the `input` with the editable's input class.
 */
const Field = withContext("input", "input");

/**
 * Describes the props of the input: the props of an `input`.
 */
export type InputProps = ComponentProps<typeof Field>;

/**
 * Renders the input with the machine's props and the field's texts.
 *
 * @param props - Attributes of the `input` element, merged over the machine's.
 * @returns The `input` element.
 */
export function Input(props: InputProps): ReactElement {
  const api = useEditable();
  const field = useOptionalField();
  const { "aria-label": _name, ...machine } = api.getInputProps();

  return (
    <Field
      {...mergeProps(
        machine,
        omitUndefined({ "aria-describedby": field ? describedBy(field.ids) : undefined }),
        props,
      )}
    />
  );
}
