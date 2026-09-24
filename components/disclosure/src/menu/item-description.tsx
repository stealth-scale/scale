/**
 * Renders a row's description, such as a plan, a role or a count.
 *
 * @remarks
 *   The recipe sets it on the caption role in `fg.subtle`. A screen reader reads it with the row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's item description class.
 */
const Described = withContext("span", "itemDescription");

/**
 * Describes the props of a row's description: the props of a `span`.
 */
export type ItemDescriptionProps = ComponentProps<typeof Described>;

/**
 * Renders the description, and throws when no menu is above it.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemDescription(props: ItemDescriptionProps): ReactElement {
  useMenu();

  return <Described {...props} />;
}
