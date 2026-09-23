/**
 * Renders the control at the end of a row: a square button beside the row's link.
 *
 * @remarks
 *   The element is `button` with `type` defaulting to `button`. It is a sibling of the link,
 *   because a control nested in a link cannot take focus on its own, and it is positioned over the
 *   space the row reserves at its end. The end column sizes it, so it fits inside the row. Pass the
 *   icon as its child and name it with `aria-label`, including the row, such as `Rename Invoices`,
 *   because a screen reader has no other text to tie it to its row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the action `button` with the list's variants and `type` defaulting to `button`.
 */
export const Action = withContext("button", "action", { defaultProps: { type: "button" } });

/**
 * Describes the props of `Action`.
 */
export type ActionProps = ComponentProps<typeof Action>;
