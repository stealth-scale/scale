/**
 * Renders a row's text.
 *
 * @remarks
 *   The text reads the row's state from the item provider, so it takes no value of its own. It
 *   grows to fill the row and truncates with an ellipsis.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu, useMenuItem } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's item text class.
 */
const Worded = withContext("span", "itemText");

/**
 * Describes the props of a row's text: the props of a `span`.
 */
export type ItemTextProps = ComponentProps<typeof Worded>;

/**
 * Renders the text with the machine's item text props merged over the caller's.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const { api } = useMenu();
  const item = useMenuItem();

  return <Worded {...mergeProps(api.getItemTextProps(item), props)} />;
}
