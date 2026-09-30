/**
 * Renders the input through which a form submits the picker's color.
 *
 * @remarks
 *   The input is visually hidden, `aria-hidden` and out of the tab order, and its value is the
 *   color in the format in force. A reset of its form restores the color the picker started with.
 *   Focus that reaches it, such as a press on a field's label, moves to the text input in the
 *   control, or to the trigger without one.
 */

import { type FocusEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useColorPicker } from "#color-picker/machine.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the hidden input with the machine's hidden input props.
 *
 * @returns The `input` element.
 */
export function HiddenInput(): ReactElement {
  const api = useColorPicker();
  const { ids } = useShared();
  const own = {
    "aria-hidden": true,
    onFocus: (event: FocusEvent<HTMLInputElement>): void => {
      const document = event.currentTarget.ownerDocument;
      const moved =
        document.querySelector<HTMLElement>(`[id="${ids.field}"]`) ??
        document.querySelector<HTMLElement>(`[id="${ids.trigger}"]`);

      moved?.focus();
    },
  };

  return <input {...mergeProps(api.getHiddenInputProps(), own)} />;
}
