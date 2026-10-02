/**
 * Renders the words under a checkbox card's title.
 *
 * @remarks
 *   The element is a `span` that reports itself to the card, and the card's input lists it in
 *   `aria-describedby`, so a screen reader reads it after the checkbox's name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#checkbox-card/context.ts";
import { useDescribing } from "#checkbox-card/state.ts";

/**
 * Renders the `span` with the checkbox card's description class.
 */
const Described = withContext("span", "description");

/**
 * Describes the props of the description: the props of a `span`.
 */
export type DescriptionProps = ComponentProps<typeof Described>;

/**
 * Renders the description with the card's disabled and checked states.
 *
 * @param props - Attributes and children of the `span` element.
 * @returns The `span` element the card's input is described by.
 */
export function Description({ id, ...rest }: DescriptionProps): ReactElement {
  const describing = useDescribing(id);

  return <Described {...rest} {...describing} />;
}
