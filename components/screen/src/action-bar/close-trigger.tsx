/**
 * Renders the control in the bar that asks to close it, which clears the selection.
 *
 * @remarks
 *   The control is the actions `IconButton`, ghost by default and at the toolbar's size, rendered
 *   as one of the toolbar's items, so it takes part in the arrow keys. It requires an accessible
 *   name, because it shows a glyph and no text, and its glyph is the caller's. A handler that calls
 *   `preventDefault` keeps the bar open.
 */

import { type ReactElement } from "react";

import { IconButton, type IconButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#action-bar/context.ts";
import { useActionBar } from "#action-bar/state.ts";
import { Item, type ItemProps } from "#toolbar/item.tsx";

/**
 * Renders the icon button with the action bar's close trigger class, ghost unless the caller sets a
 * variant.
 */
const Drawn: (props: IconButtonProps) => ReactElement = withContext(IconButton, "closeTrigger", {
  defaultProps: { variant: "ghost" },
});

/**
 * Describes the props of the close trigger: the props of the icon button, as a toolbar item.
 */
export type CloseTriggerProps = Omit<ItemProps<typeof Drawn>, "as">;

/**
 * Renders the close trigger, which asks the root to close after the caller's handler.
 *
 * @param props - The accessible name, the glyph and the props of the icon button.
 * @returns The toolbar item.
 */
export function CloseTrigger({ onClick, ...props }: CloseTriggerProps): ReactElement {
  const { close } = useActionBar();
  /**
   * Runs the caller's handler, then asks the root to close unless the handler prevented it.
   *
   * @param event - The press.
   */
  const pressed: NonNullable<CloseTriggerProps["onClick"]> = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) close();
  };

  return <Item as={Drawn} {...props} onClick={pressed} />;
}
