/**
 * Renders the keyboard shortcut at a row's end.
 *
 * @remarks
 *   The element is a `kbd`. The recipe places it at the row's end, two sizes smaller than the
 *   row's text, in `fg.muted`. A screen reader reads the keys with the row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `kbd` with the menu's item command class.
 */
const Struck = withContext("kbd", "itemCommand");

/**
 * Describes the props of a row's shortcut: the props of a `kbd`.
 */
export type ItemCommandProps = ComponentProps<typeof Struck>;

/**
 * Renders the shortcut, and throws when no menu is above it.
 *
 * @param props - The props of a `kbd`.
 * @returns The `kbd` element.
 */
export function ItemCommand(props: ItemCommandProps): ReactElement {
  useMenu();

  return <Struck {...props} />;
}
