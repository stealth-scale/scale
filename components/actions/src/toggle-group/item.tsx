/**
 * Renders one item of a toggle group.
 *
 * @remarks
 *   The element is the package's `Button`, so every look, size and palette of the button applies,
 *   and an item that is on takes the button's pressed look. The machine writes `aria-pressed` on a
 *   multiple-select item and `aria-checked` on a single-select one. The item writes `data-pressed`
 *   on an item that is on in either mode, which the pressed look reads. Name an item that shows an
 *   icon alone with `aria-label`, and square it with `shape="square"`. The machine moves focus
 *   between items with `preventScroll`, so an item scrolls itself into view when it takes focus,
 *   and the arrow keys reveal an item past the edge of a scrolling row.
 */

import { type FocusEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "#button/button.ts";
import { type ItemOptions, splitItemProps, useToggleGroup } from "#toggle-group/machine.ts";

/**
 * Describes the props of an item: its value, whether it is disabled, and the props of the button.
 *
 * @remarks
 *   The button's own `value` is left out, so `value` names the item.
 */
export interface ItemProps extends ItemOptions, Omit<ButtonProps, keyof ItemOptions> {}

/**
 * Scrolls the item that took focus into view by the least distance.
 */
function revealed(event: FocusEvent<HTMLElement>): void {
  event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
}

/**
 * Renders the item as a button with the machine's item props.
 *
 * @param props - The item's options and the props of the button.
 * @returns The `button` element.
 */
export function Item(props: ItemProps): ReactElement {
  const api = useToggleGroup();
  const [options, rest] = splitItemProps(props);
  const { pressed } = api.getItemState(options);

  return (
    <Button
      {...mergeProps(api.getItemProps(options), { onFocus: revealed }, rest)}
      data-pressed={pressed ? "" : undefined}
    />
  );
}
