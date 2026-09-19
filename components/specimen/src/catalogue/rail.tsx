/**
 * Lists every route compiled into the catalogue that carries an entry, as one block of
 * destinations with a branch per group.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { Sidebar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type RouteDeclaration, useDeclaredRoute } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";
import { Branch } from "#catalogue/rail-branch.tsx";

/**
 * Describes what the rail takes.
 */
export interface RailProps {
  /**
   * Every route compiled into the catalogue, whatever declared them.
   *
   * @remarks
   *   Declarations rather than the index, so a page an application wrote is listed beside a page
   *   the plugin found. The rail reads each one's entry and leaves out whatever carries none.
   */
  readonly declarations: readonly RouteDeclaration[];
}

/**
 * Draws one block of destinations named for the catalogue, holding a branch per group with the
 * pages under it, the branch holding the page being read open.
 *
 * @remarks
 *   The block is a sidebar's, so draw it inside `Sidebar.Root` from the screen package, beside
 *   whatever else the application's sidebar holds. One landmark rather than one per group, so a
 *   reader jumping by landmark hears the catalogue once, and it is named for a screen reader alone,
 *   because a heading over a list of every component names what the reader can already see. The
 *   list is keyed by the group of the page
 *   being read, so a navigation that lands in another group opens that branch and closes the rest,
 *   while a branch a reader opened by hand stays open until they move on. The row of the page
 *   being read is tinted a step off the sidebar's ground and set semibold, which the list's own
 *   default draws, so it reads as the row a reader is on without a mark of its own.
 */
export function Rail({ declarations }: RailProps): ReactElement {
  const { t } = useTranslation("specimen");
  const groups = grouped(declarations);
  const current = useDeclaredRoute()?.id;
  const opened = groups.find((group) => group.pages.some((page) => page.id === current))?.name;

  return (
    <Sidebar.Nav aria-label={t("rail.label")}>
      <NavList.Root key={opened ?? ""} size="md">
        {groups.map((group) => (
          <Branch group={group} holdsCurrent={group.name === opened} key={group.name} />
        ))}
      </NavList.Root>
    </Sidebar.Nav>
  );
}
