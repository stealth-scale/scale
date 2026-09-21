/**
 * Renders the row holding the field and the trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the control slot, spaced by the variants the root published.
 */
const Rowed = withContext("div", "control");

/**
 * Accepts every prop the styled div takes.
 */
export type ControlProps = ComponentProps<typeof Rowed>;

/**
 * Renders the row, merging the caller's props over the machine's.
 *
 * @param props - Everything a styled div takes.
 * @returns The row, carrying the copied-state attribute the recipe styles from.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useClipboard();

  return <Rowed {...mergeProps(api.getControlProps(), props)} />;
}
