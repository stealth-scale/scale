/**
 * Renders one row of the panel.
 *
 * @remarks
 *   The element is a `div` with `role="option"`. It takes the collection item it renders, so the
 *   machine sets its identifier, its selected state and its highlight. A row has no tab stop,
 *   because focus stays on the panel. A disabled item of the collection keeps its place, and the
 *   arrow keys step past it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { type SelectItem, useSelect } from "#select/machine.ts";

/**
 * Renders the `div` with the select's item class.
 */
const Offered = withContext("div", "item");

/**
 * Describes the props of a row: its collection item and the props of a `div`.
 */
export interface ItemProps extends ComponentProps<typeof Offered> {
  /**
   * Collection item the row renders.
   */
  readonly item: SelectItem;
}

/**
 * Renders a row with the machine's item props.
 *
 * @param props - The collection item, and the attributes and children of the `div` element.
 * @returns The `div` element with `role="option"`.
 */
export function Item({ item, ...rest }: ItemProps): ReactElement {
  const api = useSelect();

  return <Offered {...mergeProps(api.getItemProps({ item }), rest)} />;
}
