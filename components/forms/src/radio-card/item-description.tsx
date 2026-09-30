/**
 * Renders the words under a card's title.
 *
 * @remarks
 *   The element is a `span` that reports itself to the card, and the card's input lists it in
 *   `aria-describedby`, so a screen reader reads it after the radio's name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#radio-card/context.ts";
import { useDescribing } from "#radio-card/state.ts";

/**
 * Renders the `span` with the radio card's item description class.
 */
const Described = withContext("span", "itemDescription");

/**
 * Describes the props of the description: the props of a `span`.
 */
export type ItemDescriptionProps = ComponentProps<typeof Described>;

/**
 * Renders the description with the card's disabled and checked states.
 *
 * @param props - Attributes and children of the `span` element.
 * @returns The `span` element the card's input is described by.
 */
export function ItemDescription({ id, ...rest }: ItemDescriptionProps): ReactElement {
  const describing = useDescribing(id);

  return <Described {...rest} {...describing} />;
}
