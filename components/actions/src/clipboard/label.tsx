/**
 * Renders the text identifying the value.
 *
 * @remarks
 *   The element is a `label` the machine associates with the input, so a screen reader announces
 *   this text when the field takes focus. A caller who renders no input is left with a plain
 *   caption.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the label slot, sized by the variants the root published.
 */
const Worded = withContext("label", "label");

/**
 * Accepts every prop the styled label takes.
 */
export type LabelProps = ComponentProps<typeof Worded>;

/**
 * Renders the label, merging the caller's props over the machine's.
 *
 * @param props - Everything a styled label takes.
 * @returns The label, pointing at the field through the machine's id.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useClipboard();

  return <Worded {...mergeProps(api.getLabelProps(), props)} />;
}
