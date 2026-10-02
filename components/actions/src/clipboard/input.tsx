/**
 * Renders the field that shows the value to copy.
 *
 * @remarks
 *   The `input` is read-only and enabled, so it keeps focus and text selection. A person copies by
 *   hand from the field when the browser denies clipboard access. The machine selects the whole
 *   value on focus and reports a manual copy from the field as a copy.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `input` bound to the input slot.
 */
const Styled = withContext("input", "input");

/**
 * Props of `Clipboard.Input`: the props of the styled `input`.
 */
export type InputProps = ComponentProps<typeof Styled>;

/**
 * Renders the field with the caller's props merged over the machine's.
 *
 * @param props - Props of the styled `input`.
 * @returns The read-only field that holds the machine's value.
 */
export function Input(props: InputProps): ReactElement {
  const api = useClipboard();

  return <Styled {...mergeProps(api.getInputProps(), props)} />;
}
