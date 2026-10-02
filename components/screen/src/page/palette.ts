/**
 * Renders the panel the picker opens.
 *
 * @remarks
 *   The panel takes the picker's width, `--reference-width`, so the list lines up under the
 *   control that opened it. Render a menu's or a popover's content as it with `as`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's palette class.
 */
export const Palette = withContext("div", "palette");

/**
 * Describes the props of the panel: the props of a `div`.
 */
export type PaletteProps = ComponentProps<typeof Palette>;
