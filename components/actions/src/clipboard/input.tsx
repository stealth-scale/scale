/**
 * Draws the field that shows the value.
 *
 * @remarks
 *   The element is `input`, read-only rather than disabled. It can still be focused and selected,
 *   which is what a person falls back on where the browser refuses the copy. The machine selects
 *   the whole value on focus and counts a copy made from the field as one it reports.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the field the recipe places in the row.
 */
const Fielded = withContext("input", "input");

/**
 * Describes what the input takes.
 */
export type InputProps = ComponentProps<typeof Fielded>;

/**
 * Shows the value a person is about to copy.
 *
 * @param props - Everything a styled input takes.
 * @returns The field, holding the value read-only.
 */
export function Input(props: InputProps): ReactElement {
  const api = useClipboard();

  return <Fielded {...mergeProps(api.getInputProps(), props)} />;
}
