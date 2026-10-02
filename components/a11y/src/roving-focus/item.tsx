/**
 * Renders one item of a roving focus group.
 *
 * @remarks
 *   One item has `tabIndex` 0 and every other has -1, so the group is one stop in the tab order. A
 *   disabled item does not register, so the arrows step past it. It also refuses the stop when a
 *   pointer focuses it, because a stop on an unregistered item is unreachable by the arrows and
 *   removes the group from the tab order. The element is in state and not in a ref, so the
 *   registering effect runs again once the node exists. The group keys on the registration, so
 *   the item writes the DOM `id` only when the caller passes one, and a control rendered as an item
 *   keeps an id it needs, such as the one a menu trigger references. The item with the stop has
 *   `data-stop` and not `data-active`, because the theme styles `[data-active]` as a pressed
 *   control.
 */

import {
  type ComponentProps,
  type ReactElement,
  type Ref,
  use,
  useEffect,
  useId,
  useState,
} from "react";

import { useCallbackRef } from "@stealthscale/hooks";

import { withContext } from "#roving-focus/context.ts";
import { RovingFocusContext } from "#roving-focus/use-roving-focus.ts";

/**
 * Renders a `div` element with the item slot's classes.
 */
const Shell = withContext("div", "item");

/**
 * Describes the props of RovingFocus.Item: the item options and the props of a `div` element.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Shell>, "ref"> {
  /**
   * Whether the arrows step past the item.
   */
  disabled?: boolean | undefined;

  /**
   * Identifier the group registers the item under. The item generates one when the caller omits
   * it, and writes the DOM attribute only when the caller passes it.
   */
  id?: string | undefined;

  /**
   * Ref that receives the item's element.
   *
   * @remarks
   *   The type is `HTMLElement`, because the caller renders a control as the item. The tab stop is
   *   on this element, so a control nested inside an item adds a second stop. A toolbar passes
   *   `as={Button}` or `as="button"`.
   */
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Renders an item with `tabIndex` 0 while it has the tab stop and -1 otherwise.
 *
 * @throws {@link Error} When rendered outside a root.
 */
export function Item(props: ItemProps): ReactElement {
  const { disabled = false, id: named, ref: handed, ...rest } = props;
  const group = use(RovingFocusContext);

  if (group === undefined) {
    throw new Error("RovingFocus.Item must be rendered inside RovingFocus.Root.");
  }

  const generated = useId();
  const id = named ?? generated;
  const { activeId, onFocus, register } = group;
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  /**
   * Stores the node in state, so the registering effect runs, and forwards it to the caller's ref.
   */
  const attach = useCallbackRef((node: HTMLDivElement | null): void => {
    setElement(node);

    if (typeof handed === "function") handed(node);
    else if (handed !== null && handed !== undefined) handed.current = node;
  });

  /**
   * Moves the tab stop to this item when it receives focus, unless the item is disabled.
   */
  const claim = useCallbackRef((): void => {
    if (!disabled) onFocus(id);
  });

  useEffect((): (() => void) | undefined => {
    if (element === null || disabled) return undefined;

    return register({ element, id });
  }, [disabled, element, id, register]);

  return (
    <Shell
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-stop={activeId === id ? "" : undefined}
      id={named}
      onFocus={claim}
      ref={attach}
      tabIndex={!disabled && activeId === id ? 0 : -1}
      {...rest}
    />
  );
}
