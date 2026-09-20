/**
 * Draws the words that name the value.
 *
 * @remarks
 *   The element is `label`, and the machine points it at the input, so a screen reader names the
 *   field by these words. Where a caller draws no input, the words stand as a caption.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Worded = withContext("label", "label");

/**
 * Describes what the label takes.
 */
export type LabelProps = ComponentProps<typeof Worded>;

/**
 * Captions the value the clipboard copies.
 *
 * @param props - Everything a styled label takes.
 * @returns The words, pointed at the field.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useClipboard();

  return <Worded {...mergeProps(api.getLabelProps(), props)} />;
}
