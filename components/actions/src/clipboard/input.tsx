/**
 * Renders the field showing the value about to be copied.
 *
 * @remarks
 *   The `input` is read-only rather than disabled, so it keeps focus and selection. That is the
 *   fallback path when the browser refuses clipboard access. The machine selects the whole value
 *   on focus and reports a copy made by hand from the field as a copy.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the input slot inside the control row.
 */
const Fielded = withContext("input", "input");

/**
 * Accepts every prop the styled input takes.
 */
export type InputProps = ComponentProps<typeof Fielded>;

/**
 * Renders the field, merging the caller's props over the machine's.
 *
 * @param props - Everything a styled input takes.
 * @returns The field, holding the machine's value and refusing edits.
 */
export function Input(props: InputProps): ReactElement {
  const api = useClipboard();

  return <Fielded {...mergeProps(api.getInputProps(), props)} />;
}
