/**
 * Draws one item of the group, which holds the tab stop when the arrows reach it.
 *
 * @remarks
 *   Exactly one item is reachable by Tab and every other is at minus one, which is what makes the
 *   whole group one stop in the tab order. A disabled item registers with nothing, so the arrows
 *   pass over it, and it does not claim the stop when a pointer focuses it: an item that claimed
 *   the stop without registering would leave the stop pointing at nothing and take the group out
 *   of the tab order. The element is kept in state rather than in a ref, because the effect that
 *   registers it has to run again once the element is there, and a ref changing starts no effect.
 *   The group tracks an item by its registration, so the element carries an id only where a caller
 *   names one. A control drawn as an item keeps whatever id it writes for itself, such as the id a
 *   menu's control is pointed at.
 *   The item holding the stop is stamped `data-stop` rather than `data-active`, because the theme
 *   reads `[data-active]` as a control being pressed and a control drawn as an item would be filled
 *   for holding the stop.
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
 * Draws the element an item is laid out on.
 */
const Shell = withContext("div", "item");

/**
 * Describes what an item takes beside everything a styled element takes.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Shell>, "ref"> {
  /**
   * Whether the arrows pass over the item.
   */
  disabled?: boolean | undefined;

  /**
   * The id the item answers to, which the group generates where a caller states none. The element
   * carries it only where a caller states it.
   */
  id?: string | undefined;

  /**
   * Where a caller wants the element.
   *
   * @remarks
   *   Typed to any element rather than to a div, because the item is what a caller draws their
   *   control as. The tab stop sits on this element, so a control drawn inside an item rather than
   *   as one carries a second stop and the group's promise of one stop per group is broken. A
   *   toolbar writes `as="button"`.
   */
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Takes the tab stop when the arrows reach it, and leaves the tab order otherwise.
 *
 * @throws {@link Error} When it is drawn outside a group.
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
   * Keeps the element the item registers, and hands it to whatever asked for it.
   */
  const attach = useCallbackRef((node: HTMLDivElement | null): void => {
    setElement(node);

    if (typeof handed === "function") handed(node);
    else if (handed !== null && handed !== undefined) handed.current = node;
  });

  /**
   * Reports focus reaching the item, which moves the tab stop to it.
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
