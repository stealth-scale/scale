/**
 * Renders the column of a row's text and description.
 *
 * @remarks
 *   The column grows to fill the row, so the text and the description truncate at one edge. A row
 *   with text alone renders `ItemText` without it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's item lines class.
 */
const Stacked = withContext("span", "itemLines");

/**
 * Describes the props of a row's lines: the props of a `span`.
 */
export type ItemLinesProps = ComponentProps<typeof Stacked>;

/**
 * Renders the column, and throws when no menu is above it.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemLines(props: ItemLinesProps): ReactElement {
  useMenu();

  return <Stacked {...props} />;
}
