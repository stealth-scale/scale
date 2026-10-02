/**
 * Draws the index of the catalogue: every page under its group, as a card that leads to it.
 *
 * @remarks
 *   One component for three pages. The catalogue's own index lists everything, a section's index
 *   lists what that section holds, and a group's index lists its pages. They differ in the
 *   declarations they are handed and in what they are headed with, which is not enough to be three
 *   components.
 */

import { type ReactElement } from "react";

import { Page } from "@stealthscale/component-screen";
import { type RouteDeclaration } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";
import { GroupSection } from "#catalogue/index-section.tsx";
import { Trail } from "#catalogue/page-trail.tsx";
import {
  useGroupAbout,
  useGroupName,
  useSectionAbout,
  useSectionName,
} from "#catalogue/wording.ts";
import { useWords } from "#words.ts";

/**
 * Describes what the index takes.
 */
export interface IndexProps {
  /**
   * The id of the route the catalogue hangs under, which the trail is built from. No trail where
   * it is absent, which is what the catalogue's own index wants.
   */
  readonly catalogue?: string | undefined;

  /**
   * Every route compiled into the catalogue, whatever declared them. A declaration carrying no
   * entry is left out.
   */
  readonly declarations: readonly RouteDeclaration[];

  /**
   * The group this is the index of, which heads the page. Absent on a section's index and on the
   * catalogue's own.
   */
  readonly group?: string | undefined;

  /**
   * The section this is the index of, which heads the page. Absent on the catalogue's own.
   */
  readonly section?: string | undefined;
}

/**
 * Draws the index: a page headed for what it lists, with one section per group and a card per page
 * under it.
 *
 * @remarks
 *   The groups of every section are drawn as one run, because the index is a grid of cards under
 *   headings and a second level of heading over it would divide the grid without narrowing it. The
 *   rail is where a reader navigates by section.
 */
export function Index({ catalogue, declarations, group, section }: IndexProps): ReactElement {
  const { t } = useWords();
  const sectionName = useSectionName();
  const sectionAbout = useSectionAbout();
  const groupName = useGroupName();
  const groupAbout = useGroupAbout();
  const named =
    group === undefined
      ? section === undefined
        ? { about: t("index.about"), title: t("index.title") }
        : { about: sectionAbout(section), title: sectionName(section) }
      : { about: groupAbout(group), title: groupName(group) };

  return (
    <Page.Root>
      <Page.Header>
        {catalogue === undefined ? null : (
          <Trail
            catalogue={catalogue}
            {...(group === undefined ? {} : { section })}
            title={named.title}
          />
        )}
        <Page.Title>{named.title}</Page.Title>
        {named.about === "" ? null : <Page.Description>{named.about}</Page.Description>}
      </Page.Header>
      <Page.Body>
        {grouped(declarations)
          .flatMap((one) => one.groups)
          .map((one) => (
            <GroupSection group={one} headed={group === undefined} key={one.name} />
          ))}
      </Page.Body>
    </Page.Root>
  );
}
