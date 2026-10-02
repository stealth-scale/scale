/**
 * Renders one action of a swipe row: the actions package's `Button`, as tall as the row.
 *
 * @remarks
 *   A press closes the row and moves focus to it, then runs the caller's `onClick`, so an action
 *   that removes the row leaves focus on the row until the caller moves it. The kit ships no words:
 *   name each action after its row, such as `Archive the message from Ada`, because a list of rows
 *   repeats the same visible label.
 */

import { type JSX, type MouseEvent, type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#swipe-actions/context.ts";
import { useSwipe } from "#swipe-actions/state.ts";

/**
 * Renders the actions `Button` with the recipe's action class.
 */
const Pressed: (props: ButtonProps) => JSX.Element = withContext(Button, "action");

/**
 * Describes the props of an action: the props of the actions `Button`.
 */
export type ActionProps = ButtonProps;

/**
 * Renders an action that closes its row before it runs `onClick`.
 *
 * @param props - The props of the actions `Button`.
 * @returns The `button` element.
 */
export function Action({ onClick, ...props }: ActionProps): ReactElement {
  const { dismiss } = useSwipe();

  /**
   * Closes the row, then runs the caller's `onClick`.
   */
  const pressed = (event: MouseEvent<HTMLButtonElement>): void => {
    dismiss();
    onClick?.(event);
  };

  return <Pressed onClick={pressed} {...props} />;
}
