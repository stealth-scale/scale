/**
 * Renders one item of the bar: a trigger and the panel it opens, or a link.
 *
 * @remarks
 *   The element is an `li`. Its `value` names the item: the machine reports it while the item is
 *   open, and builds the IDs of its trigger and its panel from it. A disabled item's trigger takes
 *   no pointer or key input.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { ItemProvider, type ItemScope } from "#navigation-menu/scopes.ts";

/**
 * Renders the `li` with the navigation menu's item class.
 */
const Held = withContext("li", "item");

/**
 * Describes the props of an item: its value, whether it is disabled, and the props of an `li`.
 */
export interface ItemProps extends ItemScope, Omit<ComponentProps<typeof Held>, keyof ItemScope> {}

/**
 * Renders the item with the machine's item props, and provides the item to its parts.
 *
 * @param props - The value, the disabled state, the trigger and panel or the link, and the props of
 *   an `li`.
 * @returns The `li` element.
 */
export function Item({ disabled, value, ...props }: ItemProps): ReactElement {
  const api = useNavigationMenu();
  const item: ItemScope = { ...omitUndefined({ disabled }), value };

  return (
    <ItemProvider value={item}>
      <Held {...mergeProps(api.getItemProps(item), props)} />
    </ItemProvider>
  );
}
