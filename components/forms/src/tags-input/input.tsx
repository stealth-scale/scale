/**
 * Renders the input a person types the next tag into.
 *
 * @remarks
 *   The element is an `input` with no edge of its own, because the control around it renders the
 *   field. Enter or the delimiter adds the typed text as a tag. At the start of the input,
 *   Backspace and ArrowLeft highlight the last tag, the arrow keys move the highlight, Backspace
 *   and Delete remove the highlighted tag, and Escape returns to the input. The root's
 *   `placeholder` shows while there are no tags. Inside a field the input takes the field's control
 *   ID, which the field's label points at, and lists the field's texts in `aria-describedby`. The
 *   machine disables the input of a read-only tags input. This input is read-only instead: it takes
 *   focus and cancels the keys that would change the tags, which the machine then ignores.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";
import { useShared } from "#tags-input/state.ts";

/**
 * Renders the `input` with the tags input's input class.
 */
const Typed = withContext("input", "input");

/**
 * Keys with which the machine highlights, adds or removes a tag from the input.
 */
const CHANGING = new Set(["ArrowLeft", "Backspace", "Delete", "Enter"]);

/**
 * Cancels a key that would change the tags, before the machine's handler reads it.
 *
 * @remarks
 *   `mergeProps` calls the handler of a later argument first, so the input merges this after the
 *   machine's props.
 */
function refused(event: KeyboardEvent<HTMLInputElement>): void {
  if (CHANGING.has(event.key)) event.preventDefault();
}

/**
 * Describes the props of the input: the props of an `input`.
 */
export type InputProps = ComponentProps<typeof Typed>;

/**
 * Renders the input with the machine's props, the field's texts and the read-only state.
 *
 * @param props - Attributes of the `input` element, merged over the machine's.
 * @returns The `input` element.
 */
export function Input(props: InputProps): ReactElement {
  const api = useTagsInput();
  const field = useOptionalField();
  const { disabled, readOnly } = useShared();

  return (
    <Typed
      {...mergeProps(
        api.getInputProps(),
        readOnly ? { disabled, onKeyDown: refused, readOnly } : {},
        omitUndefined({ "aria-describedby": field ? describedBy(field.ids) : undefined }),
        props,
      )}
    />
  );
}
