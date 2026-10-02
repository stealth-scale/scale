/**
 * Renders one item of the accordion and runs the collapsible machine that animates its content.
 *
 * @remarks
 *   The element is a `div`. The accordion machine decides whether the item is open, and the item
 *   passes that decision to a collapsible machine as `open`. The collapsible machine measures the
 *   content, writes its height for the animation, and keeps it rendered until the closing animation
 *   ends. It takes the content's ID from the accordion machine, so the trigger's `aria-controls`
 *   and the measured element are one element.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#accordion/context.ts";
import { type ItemOptions, splitItemProps, useAccordion } from "#accordion/machine.ts";
import { ItemProvider } from "#accordion/state.ts";
import { useCollapsibleMachine } from "#collapsible/machine.ts";

/**
 * Renders the `div` with the accordion's item class.
 */
const Held = withContext("div", "item");

/**
 * Describes the props of an item: its value, whether it is disabled and the props of a `div`.
 */
export interface ItemProps extends ComponentProps<typeof Held>, ItemOptions {}

/**
 * Renders the item with the machine's item props and provides its state to the parts inside it.
 *
 * @remarks
 *   `disabled` on an item adds to the root's. The machine reads an item's `false` over the root's
 *   `true`, so the item passes the machine `disabled` only when it is `true`, and a disabled root
 *   disables every item.
 * @param props - The item's value, the disabled flag and the props of a `div`.
 * @returns The `div` element.
 */
export function Item(props: ItemProps): ReactElement {
  const [stated, rest] = splitItemProps(props);
  const options: ItemOptions = stated.disabled === true ? stated : { value: stated.value };
  const { api, contentId } = useAccordion();
  const collapsible = useCollapsibleMachine({
    ids: { content: contentId(options.value) },
    open: api.getItemState(options).expanded,
  });

  return (
    <ItemProvider value={{ collapsible, options }}>
      <Held {...mergeProps(api.getItemProps(options), rest)} />
    </ItemProvider>
  );
}
