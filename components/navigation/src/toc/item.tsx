/**
 * Draws one row of the list, for one heading.
 *
 * @remarks
 *   A row names its heading with `item`, which is the one thing the machine cannot work out for
 *   itself. Everything else is the machine's: the depth the row is indented by, and whether the
 *   heading is on screen, which the recipe reads to mark the row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { type TocItem, useToc } from "#toc/machine.ts";

/**
 * Draws the row at the size the root states.
 */
const Rowed = withContext("li", "item");

/**
 * Describes what a row takes.
 */
export interface ItemProps extends ComponentProps<typeof Rowed> {
  /**
   * The heading the row names: its id in the document, and how deep it sits.
   */
  readonly item: TocItem;
}

/**
 * Draws the row that holds the link to one heading.
 *
 * @param props - The heading it names, and everything a styled list item takes.
 * @returns The row, carrying its depth and whether its heading is on screen.
 */
export function Item({ item, ...rest }: ItemProps): ReactElement {
  const api = useToc();

  return <Rowed {...mergeProps(api.getItemProps({ item }), rest)} />;
}
