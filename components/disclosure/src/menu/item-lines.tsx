/**
 * Stacks a row's words over a line about them.
 *
 * @remarks
 *   A column that fills the room the mark and the keys leave, so the words and the description
 *   under them are cut at the same edge. A row with words alone needs none of this and writes
 *   `ItemText` on its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the column at the size the root states.
 */
const Stacked = withContext("span", "itemLines");

/**
 * Describes what the column takes.
 */
export type ItemLinesProps = ComponentProps<typeof Stacked>;

/**
 * Draws the column, checking a menu stands above it.
 *
 * @param props - Everything a styled span takes.
 * @returns The column, holding the words and the line under them.
 */
export function ItemLines(props: ItemLinesProps): ReactElement {
  useMenu();

  return <Stacked {...props} />;
}
