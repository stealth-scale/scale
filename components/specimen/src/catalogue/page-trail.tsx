/**
 * Draws the trail from the catalogue's index down to the page being read.
 *
 * @remarks
 *   A breadcrumb rather than the page's own single link back, because a page now sits three levels
 *   down and one link up says nothing about the two above it. Each crumb is an address that exists:
 *   the index, the section's index, the group's index, and the page itself.
 *   The levels are handed over rather than read off an identifier here, because the same trail
 *   heads a page, a section's own index and a group's own index, and each of the three names a
 *   different number of levels above it. A caller knows which it is drawing and this does not.
 *   The addresses are resolved through the route map rather than with a hook per crumb, because a
 *   page with no section draws fewer crumbs than one with a section and a hook cannot be called
 *   conditionally.
 *   Every crumb matches its route exactly. A crumb's address is a prefix of the page's, so the
 *   router would otherwise call each of them the current page and a screen reader would hear the
 *   whole trail announced as where the reader is.
 *   The trail is read a step below the page around it, because it says where the page is rather
 *   than what it is, and the title under it is what a reader came for. The step comes from the
 *   context row, which sets it for whatever it draws, rather than from a size stated here.
 *   The trail is drawn as `Page.Context`, the row of the header's grid above the title, rather than
 *   inside one. The header places its parts by named area and the breadcrumb's own root names
 *   none, so a trail written outside that part is placed in the first free cell instead, which
 *   widens the column the title sits beside and pushes the title across the page. Drawn through
 *   `as`, the two parts are one element: the landmark is the row, rather than a row holding a
 *   landmark, and the document carries no wrapper that means nothing to a reader.
 */

import { Fragment, type ReactElement } from "react";

import { Breadcrumb } from "@stealthscale/component-navigation";
import { Page } from "@stealthscale/component-screen";
import { createLink, routeHref, useRouteMap } from "@stealthscale/provider-router";

import { useGroupName, useSectionName } from "#catalogue/wording.ts";
import { useWords } from "#words.ts";

/**
 * Draws a crumb over the router's link, so the way back navigates without a reload.
 */
const Crumb = createLink(Breadcrumb.Link);

/**
 * The mark drawn between two crumbs, which the separator takes as its content.
 */
const MARK = "/";

/**
 * Describes what the trail takes.
 */
export interface TrailProps {
  /**
   * The id of the route the catalogue hangs under, which every address above the page is built
   * from.
   */
  readonly catalogue: string;

  /**
   * The group the page sits in, where one sits above it. A group's own index names none, because
   * the group is what the page is.
   */
  readonly group?: string | undefined;

  /**
   * The section the page sits in, where one sits above it.
   */
  readonly section?: string | undefined;

  /**
   * The words the page is headed with, which the last crumb carries.
   */
  readonly title: string;
}

/**
 * Describes one crumb: where it leads, and what it says.
 */
interface Step {
  /**
   * The words the crumb carries.
   */
  readonly says: string;

  /**
   * The address it leads to.
   */
  readonly to: string;
}

/**
 * Draws the trail, in the row above the page's title.
 *
 * @remarks
 *   Every crumb but the last is a link. The last names the page being read and leads nowhere, which
 *   is what `Breadcrumb.CurrentLink` draws and what tells a screen reader which one is current.
 */
export function Trail({ catalogue, group, section, title }: TrailProps): ReactElement {
  const { t } = useWords();
  const map = useRouteMap();
  const sectionName = useSectionName();
  const groupName = useGroupName();
  const steps: readonly Step[] = [
    { says: t("index.title"), to: routeHref(map, `${catalogue}.index`) },
    ...(section === undefined
      ? []
      : [{ says: sectionName(section), to: routeHref(map, `${catalogue}.${section}`) }]),
    ...(section === undefined || group === undefined
      ? []
      : [{ says: groupName(group), to: routeHref(map, `${catalogue}.${section}.${group}`) }]),
  ];

  return (
    <Page.Context as={Breadcrumb.Root}>
      <Breadcrumb.List>
        {steps.map((step) => (
          <Fragment key={step.to}>
            <Breadcrumb.Item>
              <Crumb activeOptions={{ exact: true }} to={step.to}>
                {step.says}
              </Crumb>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>{MARK}</Breadcrumb.Separator>
          </Fragment>
        ))}
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>{title}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Page.Context>
  );
}
