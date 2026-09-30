/**
 * Lists every route compiled into the catalogue that has an entry, as one sidebar block per
 * section with a branch per group.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { Sidebar } from "@stealthscale/component-screen";
import { type RouteDeclaration, useDeclaredRoute } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";
import { Branch } from "#catalogue/rail-branch.tsx";
import { useSectionName } from "#catalogue/wording.ts";
import { useWords } from "#words.ts";

/**
 * Describes the props of `Rail`.
 */
export interface RailProps {
  /**
   * Every route compiled into the catalogue, whatever declared them.
   *
   * @remarks
   *   The rail lists a page an application wrote beside a page the plugin found, and leaves out a
   *   declaration without an entry.
   */
  readonly declarations: readonly RouteDeclaration[];
}

/**
 * Renders one nav block per section and the message shown while a search matches no page.
 *
 * @remarks
 *   Render the rail inside `Sidebar.Content`. The sidebar's size sets the rows' size, and a
 *   `Sidebar.Search` in the sidebar's header filters the rows. A block is labelled with its
 *   section's name, and a block of pages without a section is named `Catalogue` for screen readers.
 *   The branch that contains the current page opens. Each list is keyed by the section and the
 *   group of the current page, so a navigation into another group opens that branch and closes the
 *   others.
 * @returns The blocks and the empty message.
 */
export function Rail({ declarations }: RailProps): ReactElement {
  const { t } = useWords();
  const sectionName = useSectionName();
  const sections = grouped(declarations);
  const current = useDeclaredRoute()?.id;
  const opened = sections
    .flatMap((section) => section.groups.map((group) => ({ group, section })))
    .find(({ group }) => group.pages.some((page) => page.id === current));
  const key = `${opened?.section.name ?? ""}/${opened?.group.name ?? ""}`;

  return (
    <>
      {sections.map((section) => (
        <Sidebar.Nav
          {...(section.name === "" ? { "aria-label": t("rail.label") } : {})}
          key={section.name}
        >
          {section.name === "" ? null : (
            <Sidebar.NavLabel>{sectionName(section.name)}</Sidebar.NavLabel>
          )}
          <NavList.Root key={key}>
            {section.groups.map((group) => (
              <Branch group={group} holdsCurrent={group === opened?.group} key={group.name} />
            ))}
          </NavList.Root>
        </Sidebar.Nav>
      ))}
      <Sidebar.Empty>{t("rail.empty")}</Sidebar.Empty>
    </>
  );
}
