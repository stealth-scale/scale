/**
 * Draws the row the field and the trigger sit in.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the row at the gap the root states.
 */
const Rowed = withContext("div", "control");

/**
 * Describes what the control takes.
 */
export type ControlProps = ComponentProps<typeof Rowed>;

/**
 * Lays the field and the trigger side by side.
 *
 * @param props - Everything a styled div takes.
 * @returns The row, carrying the copied state the recipe reads.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useClipboard();

  return <Rowed {...mergeProps(api.getControlProps(), props)} />;
}
