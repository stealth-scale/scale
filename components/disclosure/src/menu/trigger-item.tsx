/**
 * Renders the row of a menu that opens a submenu.
 *
 * @remarks
 *   The row is a row of the parent menu, which highlights it and matches it in typeahead, and the
 *   trigger of the submenu, which opens on a hover or on the arrow key towards it. The parent's
 *   machine merges both sets of props, so the row reads the submenu's api and the parent's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `button` with the menu's trigger item class.
 */
const Pressed = withContext("button", "triggerItem");

/**
 * Describes the props of the trigger row: the props of a `button`.
 */
export type TriggerItemProps = ComponentProps<typeof Pressed>;

/**
 * Renders the row with the parent machine's trigger item props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 * @throws {@link Error} When the menu it is rendered in has no parent menu.
 */
export function TriggerItem(props: TriggerItemProps): ReactElement {
  const { api, parent } = useMenu();

  if (parent === undefined) {
    throw new Error("Menu.TriggerItem was drawn in a menu that opens from no other menu.");
  }

  return <Pressed {...mergeProps(parent.api.getTriggerItemProps(api), props)} />;
}
