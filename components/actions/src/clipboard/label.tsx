/**
 * Renders the text that identifies the value.
 *
 * @remarks
 *   The element is a `label` that the machine associates with the input, so a screen reader reads
 *   it when the field receives focus. Without an input, it renders as a caption.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `label` bound to the label slot.
 */
const Styled = withContext("label", "label");

/**
 * Props of `Clipboard.Label`: the props of the styled `label`.
 */
export type LabelProps = ComponentProps<typeof Styled>;

/**
 * Renders the label with the caller's props merged over the machine's.
 *
 * @param props - Props of the styled `label`.
 * @returns The label, whose `for` attribute points at the field.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useClipboard();

  return <Styled {...mergeProps(api.getLabelProps(), props)} />;
}
