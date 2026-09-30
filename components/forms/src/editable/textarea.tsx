/**
 * Renders an editable's multi-line field.
 *
 * @remarks
 *   The element is a `textarea` in place of `Editable.Input`, for a value of several lines. Enter
 *   adds a line, Control and Enter (Command and Enter on Apple systems) save the value, and Escape
 *   restores the value from before editing. It is named and described the same way as the input.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";
import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";

/**
 * Renders the `textarea` with the editable's input class.
 */
const Lines = withContext("textarea", "input");

/**
 * Describes the props of the textarea: the props of a `textarea`.
 */
export type TextareaProps = ComponentProps<typeof Lines>;

/**
 * Renders the textarea with the machine's input props and the field's texts.
 *
 * @param props - Attributes of the `textarea` element, merged over the machine's.
 * @returns The `textarea` element.
 */
export function Textarea(props: TextareaProps): ReactElement {
  const api = useEditable();
  const field = useOptionalField();
  const { "aria-label": _name, size: _size, ...machine } = api.getInputProps();

  return (
    <Lines
      {...mergeProps(
        machine,
        omitUndefined({ "aria-describedby": field ? describedBy(field.ids) : undefined }),
        props,
      )}
    />
  );
}
