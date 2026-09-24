/**
 * Renders a rule between groups of rows.
 *
 * @remarks
 *   The machine sets `role="separator"`. The arrows move from the row above it to the row below in
 *   one press.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's separator class.
 */
const Ruled = withContext("div", "separator");

/**
 * Describes the props of the separator: the props of a `div`.
 */
export type SeparatorProps = ComponentProps<typeof Ruled>;

/**
 * Renders the separator with the machine's separator props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Separator(props: SeparatorProps): ReactElement {
  const { api } = useMenu();

  return <Ruled {...mergeProps(api.getSeparatorProps(), props)} />;
}
