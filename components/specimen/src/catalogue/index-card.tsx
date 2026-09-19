/**
 * Draws one page of the index as a card: its title as the link, and its opening under it.
 */

import { type ReactElement } from "react";

import { Link } from "@stealthscale/component-navigation";
import { Card } from "@stealthscale/component-surfaces";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

import { type Listed } from "#catalogue/grouped.ts";

/**
 * Draws the library's link over the router's, so a card's title navigates without a reload.
 */
const Opening = createLink(Link);

/**
 * Describes what one card takes.
 */
export interface EntryCardProps {
  /**
   * The page the card leads to.
   */
  readonly page: Listed;
}

/**
 * Draws one page of the index.
 *
 * @remarks
 *   The title is the link rather than the whole card, so a screen reader lists the page by its
 *   name and the card's words stay plain text. The card is interactive, which draws the focus of
 *   the link on the whole card.
 */
export function EntryCard({ page }: EntryCardProps): ReactElement {
  const href = useRouteHref(page.id);

  return (
    <Card.Root interactive>
      <Card.Header>
        <Card.Title>
          <Opening to={href} variant="plain">
            {page.entry.label}
          </Opening>
        </Card.Title>
        {page.entry.about === undefined || page.entry.about === "" ? null : (
          <Card.Description>{page.entry.about}</Card.Description>
        )}
      </Card.Header>
    </Card.Root>
  );
}
