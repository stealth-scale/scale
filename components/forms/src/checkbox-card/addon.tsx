/**
 * Renders the row under a checkbox card's divider, for a price or a note about the option.
 *
 * @remarks
 *   The element is a `span` that reports itself to the card, and the card's input lists it in
 *   `aria-describedby` after the description. It spans the card's width and takes the card's edge
 *   color for its divider.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#checkbox-card/context.ts";
import { useDescribing } from "#checkbox-card/state.ts";

/**
 * Renders the `span` with the checkbox card's addon class.
 */
const Added = withContext("span", "addon");

/**
 * Describes the props of the addon: the props of a `span`.
 */
export type AddonProps = ComponentProps<typeof Added>;

/**
 * Renders the addon with the card's disabled and checked states.
 *
 * @param props - Attributes and children of the `span` element.
 * @returns The `span` element the card's input is described by.
 */
export function Addon({ id, ...rest }: AddonProps): ReactElement {
  const describing = useDescribing(id);

  return <Added {...rest} {...describing} />;
}
