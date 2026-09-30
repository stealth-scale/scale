/**
 * Renders the controls of a turn, such as copy, retry or edit.
 *
 * @remarks
 *   The caller renders the buttons inside and names each one. With the root's `reveal="hover"`, the
 *   row is transparent until a pointer is over the turn or focus is inside it. The buttons are in
 *   the tab order in either state, so a keyboard operates every control.
 */

import { type ComponentProps } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the actions' `div`.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes the props of `Actions`.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
