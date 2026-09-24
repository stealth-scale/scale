/**
 * Renders a group of rows under one label.
 *
 * @remarks
 *   The element is a `div` with `role="group"`, labelled by its group label, so a screen reader
 *   announces the group as the highlight enters it. The identifier is the caller's, because the
 *   label takes the same one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `div` with the listbox's item group class.
 */
const Gathered = withContext("div", "itemGroup");

/**
 * Describes the props of a group: its identifier and the props of a `div`.
 */
export interface ItemGroupProps extends Omit<ComponentProps<typeof Gathered>, "id"> {
  /**
   * Identifier the group and its label share.
   */
  readonly id: string;
}

/**
 * Renders a group with the machine's item group props.
 *
 * @param props - The identifier, and the attributes and children of the `div` element.
 * @returns The `div` element with `role="group"`.
 */
export function ItemGroup({ id, ...rest }: ItemGroupProps): ReactElement {
  const api = useListbox();

  return <Gathered {...mergeProps(api.getItemGroupProps({ id }), rest)} />;
}
