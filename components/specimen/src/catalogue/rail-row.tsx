/**
 * Draws one row of the rail: a link to the page, resolved through the route map by id.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

import { type Listed } from "#catalogue/grouped.ts";
import { useWording } from "#catalogue/wording.ts";

/**
 * Draws the navigation list's link over the router's, so a row navigates without a reload and
 * carries `aria-current` on the page it names.
 */
const Destination = createLink(NavList.Link);

/**
 * Describes what one row takes.
 */
export interface RowProps {
  /**
   * The page the row leads to.
   */
  readonly page: Listed;
}

/**
 * Draws one row of the rail.
 *
 * @remarks
 *   A component of its own because the path is read with a hook, and a hook runs once per
 *   component rather than once per row of a loop. Draw it inside `NavList.Root`, which the rail
 *   does.
 */
export function Row({ page }: RowProps): ReactElement {
  const word = useWording(page.entry.namespace);

  return (
    <NavList.Item>
      <Destination to={useRouteHref(page.id)}>{word(page.entry.label)}</Destination>
    </NavList.Item>
  );
}
