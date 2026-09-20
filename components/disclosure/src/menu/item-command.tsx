/**
 * Draws the keystroke that runs a row without the menu, at the row's end.
 *
 * @remarks
 *   A `kbd` rather than a span, because the words are keys a reader presses. It is pushed to the
 *   row's end and set in the muted ink a step under the row's words, so the words are read first
 *   and the keys are found where every menu puts them. It says nothing a screen reader needs
 *   beyond the keys themselves, which are read as part of the row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the keys at the size the root states.
 */
const Struck = withContext("kbd", "itemCommand");

/**
 * Describes what the keys take.
 */
export type ItemCommandProps = ComponentProps<typeof Struck>;

/**
 * Draws the keys that run the row, checking a menu stands above them.
 *
 * @param props - Everything a styled kbd takes.
 * @returns The keys, at the row's end.
 */
export function ItemCommand(props: ItemCommandProps): ReactElement {
  useMenu();

  return <Struck {...props} />;
}
