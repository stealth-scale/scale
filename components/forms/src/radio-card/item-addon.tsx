/**
 * Renders the row under a card's divider, for a price or a note about the option.
 *
 * @remarks
 *   The element is a `span` that reports itself to the card, and the card's input lists it in
 *   `aria-describedby` after the description. It spans the card's width and takes the card's edge
 *   color for its divider.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#radio-card/context.ts";
import { useDescribing } from "#radio-card/state.ts";

/**
 * Renders the `span` with the radio card's item addon class.
 */
const Added = withContext("span", "itemAddon");

/**
 * Describes the props of the addon: the props of a `span`.
 */
export type ItemAddonProps = ComponentProps<typeof Added>;

/**
 * Renders the addon with the card's disabled and checked states.
 *
 * @param props - Attributes and children of the `span` element.
 * @returns The `span` element the card's input is described by.
 */
export function ItemAddon({ id, ...rest }: ItemAddonProps): ReactElement {
  const describing = useDescribing(id);

  return <Added {...rest} {...describing} />;
}
