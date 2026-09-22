/**
 * Lists every route compiled into the catalogue that carries an entry, as one block of
 * destinations with a branch per group, narrowed to the pages a query names.
 */

import { Fragment, type ReactElement, useId } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { Sidebar } from "@stealthscale/component-screen";
import { type RouteDeclaration, useDeclaredRoute } from "@stealthscale/provider-router";

import { grouped, type Section } from "#catalogue/grouped.ts";
import { Branch } from "#catalogue/rail-branch.tsx";
import { useSectionName, useWordings } from "#catalogue/wording.ts";
import { useWords } from "#words.ts";

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

  /**
   * The words a reader typed into the rail's search. Every page is listed where it is absent or
   * blank.
   */
  readonly query?: string | undefined;
}

/**
 * Returns the query as it is matched: trimmed and in lower case, or empty where nothing was typed.
 */
function wanted(query: string | undefined): string {
  return (query ?? "").trim().toLocaleLowerCase();
}

/**
 * Returns the groups holding a page whose words contain the query, each narrowed to those pages.
 *
 * @remarks
 *   Every group and every page is returned where the query is empty. The words are the ones the
 *   rail writes, resolved through each page's namespace, so a reader who reads the rail in another
 *   language filters on the words they can see.
 */
function matching(
  sections: readonly Section[],
  query: string,
  word: (namespace: string | undefined, key: string) => string,
): readonly Section[] {
  if (query === "") return sections;

  return sections
    .map((section) => ({
      groups: section.groups
        .map((group) => ({
          name: group.name,
          pages: group.pages.filter((page) =>
            word(page.entry.namespace, page.entry.label).toLocaleLowerCase().includes(query),
          ),
        }))
        .filter((group) => group.pages.length > 0),
      name: section.name,
    }))
    .filter((section) => section.groups.length > 0);
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
 *   list is keyed by the group of the page being read and by the query, so a navigation that lands
 *   in another group opens that branch and closes the rest, and a query opens every branch it
 *   leaves standing. A branch a reader opened by hand stays open until either moves on. The row of
 *   the page being read is tinted a step off the sidebar's ground and set semibold, which the
 *   list's own default draws, so it reads as the row a reader is on without a mark of its own. A
 *   query no page matches leaves the sidebar's empty line in place of the list.
 *   A section is a heading over a list rather than a branch that opens, because every page under it
 *   is one a reader reaches and a disclosure that is always open is a click that says nothing. The
 *   heading names its own list through `aria-labelledby`, so the relationship is one a screen
 *   reader reports rather than one the eye infers from what sits above what.
 */
export function Rail({ declarations, query }: RailProps): ReactElement {
  const { t } = useWords();
  const word = useWordings();
  const sectionName = useSectionName();
  const headings = useId();
  const typed = wanted(query);
  const sections = matching(grouped(declarations), typed, word);
  const current = useDeclaredRoute()?.id;
  const opened = sections
    .flatMap((section) => section.groups.map((group) => ({ group, section })))
    .find(({ group }) => group.pages.some((page) => page.id === current));
  const key = `${opened?.section.name ?? ""}/${opened?.group.name ?? ""}/${typed}`;

  if (sections.length === 0) {
    return (
      <Sidebar.Nav aria-label={t("rail.label")}>
        <Sidebar.Empty>{t("rail.empty")}</Sidebar.Empty>
      </Sidebar.Nav>
    );
  }

  return (
    <Sidebar.Nav aria-label={t("rail.label")}>
      {sections.map((section) => {
        const headed = section.name === "" ? undefined : `${headings}-${section.name}`;

        return (
          <Fragment key={section.name}>
            {headed === undefined ? null : (
              <Sidebar.NavHeading id={headed}>{sectionName(section.name)}</Sidebar.NavHeading>
            )}
            <NavList.Root
              {...(headed === undefined ? {} : { "aria-labelledby": headed })}
              key={key}
              size="md"
            >
              {section.groups.map((group) => (
                <Branch
                  group={group}
                  holdsCurrent={typed !== "" || group.name === opened?.group.name}
                  key={group.name}
                />
              ))}
            </NavList.Root>
          </Fragment>
        );
      })}
    </Sidebar.Nav>
  );
}
