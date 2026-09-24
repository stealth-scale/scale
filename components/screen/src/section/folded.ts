/**
 * Renders the control that opens the actions a narrow section folds away.
 *
 * @remarks
 *   The control renders only while the section is narrow. Put a menu behind it with the tertiary
 *   actions. Name it after the section, such as `More billing actions`, because `More` does not
 *   say what it opens.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `button` with the recipe's folded class.
 */
export const Folded = withContext("button", "folded", { defaultProps: { type: "button" } });

/**
 * Describes the props of the folded control: the props of a `button`.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
