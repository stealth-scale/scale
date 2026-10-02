/**
 * Renders the row that holds the field and the trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `div` bound to the control slot.
 */
const Styled = withContext("div", "control");

/**
 * Props of `Clipboard.Control`: the props of the styled `div`.
 */
export type ControlProps = ComponentProps<typeof Styled>;

/**
 * Renders the row with the caller's props merged over the machine's.
 *
 * @param props - Props of the styled `div`.
 * @returns The row, with the `data-copied` attribute the machine sets after a copy.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useClipboard();

  return <Styled {...mergeProps(api.getControlProps(), props)} />;
}
