/**
 * Draws the mark at the start of a row: an initial, an icon or an avatar in a tinted square.
 *
 * @remarks
 *   A square rather than the bare icon a row may also lead with, because an initial or an avatar
 *   wants a box to sit in and a list of them reads as a list only when every box is the same size.
 *   It is hidden from a screen reader, because the words of the row say what it stands for.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the square at the size the root states.
 */
const Marked = withContext("span", "itemMark", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what the mark takes.
 */
export type ItemMarkProps = ComponentProps<typeof Marked>;

/**
 * Draws the mark, checking a menu stands above it.
 *
 * @param props - Everything a styled span takes.
 * @returns The square, at the row's start.
 */
export function ItemMark(props: ItemMarkProps): ReactElement {
  useMenu();

  return <Marked {...props} />;
}
