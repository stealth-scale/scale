/**
 * Renders the control that opens the actions a narrow row folds away.
 *
 * @remarks
 *   The control renders only while the row is narrow. Render a menu's trigger as it with `as`, with
 *   the tertiary actions in the menu. Name it after the row, such as `More invoice actions`,
 *   because `More` does not say what it opens.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";

/**
 * Renders the item with the recipe's folded class.
 */
export const Folded = withContext(Item, "folded");

/**
 * Describes the props of the folded control: the props of an item.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
