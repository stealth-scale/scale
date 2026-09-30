/**
 * Renders the button of a name in the bar: the trigger of its menu, with the bar's pointer and
 * typeahead moves.
 *
 * @remarks
 *   `Menubar.Trigger` renders this as the element of an item of the bar's roving tab stop, which
 *   passes the tab index, the focus handler and its ref. A mouse moving onto the name while another
 *   menu is open opens this one. A press on the name of the open menu closes it. A letter moves
 *   focus to the next name that starts with it.
 */

import { type ComponentProps, type PointerEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useMenu } from "#menu/machine.ts";
import { useBar, useMenuValue } from "#menubar/bar.ts";

/**
 * Describes the props of the button: the props of a `button`, which the roving item passes.
 */
export type NameProps = ComponentProps<"button">;

/**
 * Renders the button with the menu's trigger props, the bar's moves and the caller's props merged.
 *
 * @param props - The words, the roving item's props and the props of a `button`.
 * @returns The `button` element.
 */
export function Name(props: NameProps): ReactElement {
  const { api } = useMenu();
  const { setValue, typeahead, value: open } = useBar();
  const value = useMenuValue();

  /**
   * Opens this menu in place of the one open when a mouse moves onto the name.
   */
  const moved = (event: PointerEvent<HTMLButtonElement>): void => {
    if (event.pointerType === "mouse" && open !== "" && open !== value) setValue(value);
  };

  /**
   * Closes this menu when its name is pressed while it is open.
   *
   * @remarks
   *   The machine reads a trigger with the `menuitem` role as a submenu's row, and its open state
   *   ignores a press on such a row, so the name closes its own menu.
   */
  const pressed = (): void => {
    if (open === value) setValue("");
  };

  return (
    <button
      {...mergeProps(
        api.getTriggerProps(),
        { onClick: pressed, onKeyDown: typeahead, onPointerMove: moved },
        props,
      )}
    />
  );
}
