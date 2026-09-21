/**
 * Renders one member of a roving focus group.
 *
 * @remarks
 *   Exactly one item carries `tabIndex` 0 and every other carries -1, which is what reduces the
 *   whole group to a single stop in the tab order. A disabled item never registers, so the arrows
 *   step past it, and it also refuses the stop when a pointer focuses it, since an item that took
 *   the stop without registering would leave the stop pointing at an item the arrows cannot find
 *   and the group unreachable by Tab. The element is tracked in state rather than in a ref because
 *   the registering effect has to run again once the node exists, and writing a ref schedules
 *   nothing. The group keys on the registration, so the DOM `id` attribute is written only when
 *   the caller supplies one, which leaves a control rendered as an item free to keep the id it
 *   already needs, such as the one a menu trigger points at. The item holding the stop is marked
 *   `data-stop` and not `data-active`, because the theme reads `[data-active]` as a pressed
 *   control and a button rendered as an item would then render filled.
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
 * The styled element carrying the recipe's item slot.
 */
const Shell = withContext("div", "item");

/**
 * Props of a group item, plus everything the styled element accepts.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Shell>, "ref"> {
  /**
   * Whether the arrows step past the item.
   */
  disabled?: boolean | undefined;

  /**
   * The identifier the group registers the item under. One is generated when the caller omits it,
   * and the DOM attribute is written only when the caller supplies it.
   */
  id?: string | undefined;

  /**
   * The ref to receive the item's element.
   *
   * @remarks
   *   Typed to `HTMLElement` rather than to a div, because the caller renders their own control as
   *   the item. The tab stop is placed on this element, so a control nested inside an item instead
   *   of rendered as one introduces a second stop and breaks the single-stop guarantee. A toolbar
   *   passes `as="button"`.
   */
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Takes the tab stop while it is the active item and stays out of the tab order otherwise.
 *
 * @throws {@link Error} When rendered outside a root.
 */
export function Item(props: ItemProps): ReactElement {
  const { disabled = false, id: named, ref: handed, ...rest } = props;
  const group = use(RovingFocusContext);

  if (group === undefined) {
    throw new Error("RovingFocus.Item is drawn inside RovingFocus.Root and nowhere else.");
  }

  const generated = useId();
  const id = named ?? generated;
  const { activeId, onFocus, register } = group;
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  /**
   * Stores the node in state so the registering effect can run, then forwards it to the caller's
   * ref.
   */
  const attach = useCallbackRef((node: HTMLDivElement | null): void => {
    setElement(node);

    if (typeof handed === "function") handed(node);
    else if (handed !== null && handed !== undefined) handed.current = node;
  });

  /**
   * Moves the tab stop to this item when focus reaches it, unless the item is disabled.
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
