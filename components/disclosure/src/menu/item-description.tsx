/**
 * Draws the line under a row's words: a plan, a role, a count, what tells two rows of one name
 * apart.
 *
 * @remarks
 *   Set in the caption's type and the subtle ink, a step under the words, so the words are read
 *   first. It is read out with the row, because it is part of what the row says.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the line at the size the root states.
 */
const Described = withContext("span", "itemDescription");

/**
 * Describes what the line takes.
 */
export type ItemDescriptionProps = ComponentProps<typeof Described>;

/**
 * Draws the line, checking a menu stands above it.
 *
 * @param props - Everything a styled span takes.
 * @returns The line, under the row's words.
 */
export function ItemDescription(props: ItemDescriptionProps): ReactElement {
  useMenu();

  return <Described {...props} />;
}
