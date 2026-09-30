/**
 * Renders the row of an item, a node without children.
 *
 * @remarks
 *   The row has the `treeitem` role with the item's level, place, selected and disabled states. A
 *   press selects the item. An item with an `href` renders an `a`, which follows its link on a
 *   press and on Enter. The machine's `aria-current` on a selected item is dropped, because
 *   `aria-selected` already reports the selection.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#tree-view/context.ts";
import { useTreeView } from "#tree-view/machine.ts";
import { rowed } from "#tree-view/rows.ts";
import { useNode } from "#tree-view/state.ts";

/**
 * Renders the `div` with the tree view's item class.
 */
const Itemed = withContext("div", "item");

/**
 * Describes the props of an item's row: the address it opens and the props of a `div`.
 */
export interface ItemProps extends ComponentProps<typeof Itemed> {
  /**
   * Address the item opens. The row renders an `a` while it is set.
   */
  readonly href?: string | undefined;
}

/**
 * Renders an item's row with the machine's props and the tree semantics merged over the caller's.
 *
 * @param props - The address and the props of a `div`.
 * @returns The `div` element, or an `a` with an address.
 */
export function Item(props: ItemProps): ReactElement {
  const { api, checkable } = useTreeView();
  const node = useNode();
  const item: ItemProps = { ...api.getItemProps(node), "aria-current": undefined };

  return (
    <Itemed
      {...mergeProps(item, rowed(api, node, checkable), props)}
      {...omitUndefined({ as: props.href === undefined ? undefined : "a" })}
    />
  );
}
