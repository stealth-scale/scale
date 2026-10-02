/**
 * Renders a group of rows.
 *
 * @remarks
 *   The machine sets `role="group"` and `aria-labelledby` to the group's label. The arrows move
 *   through every row of the menu in order, so a group is not a stop of its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's item group class.
 */
const Grouped = withContext("div", "itemGroup");

/**
 * Describes the props of a group: its value and the props of a `div`.
 */
export interface ItemGroupProps extends ComponentProps<typeof Grouped> {
  /**
   * Value the group and its label share.
   */
  readonly value: string;
}

/**
 * Renders the group with the machine's item group props merged over the caller's.
 *
 * @param props - The group's value and the props of a `div`.
 * @returns The `div` element.
 */
export function ItemGroup({ value, ...rest }: ItemGroupProps): ReactElement {
  const { api } = useMenu();

  return <Grouped {...mergeProps(api.getItemGroupProps({ id: value }), rest)} />;
}
