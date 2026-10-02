/**
 * Builds the data lists the part specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { ItemLabel } from "#data-list/item-label.ts";
import { ItemValue } from "#data-list/item-value.ts";
import { Item } from "#data-list/item.ts";
import { Root, type RootProps } from "#data-list/root.ts";

/**
 * Renders a part inside a data list root that provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains the part.
 */
export function listed(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a complete data list of two pairs.
 *
 * @param props - The root's props.
 * @returns The list.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Item>
        <ItemLabel>Account</ItemLabel>
        <ItemValue>Bridge Ledger</ItemValue>
      </Item>
      <Item>
        <ItemLabel>Amount</ItemLabel>
        <ItemValue>£4,120.00</ItemValue>
      </Item>
    </Root>
  );
}
