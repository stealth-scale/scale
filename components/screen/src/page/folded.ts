/**
 * Renders the control that opens the actions a folded page removes from the header.
 *
 * @remarks
 *   The control renders only on a folded page. Put a menu behind it with the tertiary actions, so a
 *   narrow page offers them in one press. Name it after the page, such as `More invoice actions`,
 *   because `More` does not say what it opens.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `button` with the recipe's folded class.
 */
export const Folded = withContext("button", "folded", { defaultProps: { type: "button" } });

/**
 * Describes the props of the folded control: the props of a `button`.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
