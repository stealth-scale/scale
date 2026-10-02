/**
 * Places a product's settings sections on the settings pages the settings menu lists: each on its
 * target page, else on the first listed page of its plugin.
 *
 * @remarks
 *   A page the menu lists is a page the host renders: its plugin is on and its condition is true.
 *   A section whose target page is not listed and whose plugin has no listed page renders nowhere,
 *   and the host reports it as unplaced.
 */

import {
  hostContract,
  type ResolvedSettingsPage,
  type ResolvedSettingsSection,
} from "@stealthscale/sdk-core";

/**
 * Rank of a section without an `order`, which follows every ranked section.
 */
const UNRANKED = Number.MAX_SAFE_INTEGER;

/**
 * Returns the id of the route the host compiles for a settings page: `host/settings/<page id>`.
 *
 * @param pageId - Qualified id of the settings page.
 */
export function pageRouteOf(pageId: string): string {
  return `${hostContract.routes.settings.id}/${pageId}`;
}

/**
 * Returns the id of the page a section renders on: its target where the menu lists it, else the
 * first listed page of its plugin, else undefined.
 *
 * @param section - A section, with its target page and its plugin.
 * @param listed - Ids of the routes the settings menu lists, in menu order.
 * @param pages - Every settings page.
 */
export function placedOn(
  section: ResolvedSettingsSection,
  listed: readonly string[],
  pages: readonly ResolvedSettingsPage[],
): string | undefined {
  if (listed.includes(pageRouteOf(section.target))) return section.target;

  return listed
    .map((routeId) => pages.find((page) => pageRouteOf(page.id) === routeId))
    .find((page) => page?.plugin === section.plugin)?.id;
}

/**
 * Returns the sections that render on a page, ranked by `order`, the unranked after the ranked in
 * install order.
 *
 * @param pageId - Qualified id of the page.
 * @param sections - The sections that render, in install order.
 * @param listed - Ids of the routes the settings menu lists, in menu order.
 * @param pages - Every settings page.
 */
export function sectionsOn(
  pageId: string,
  sections: readonly ResolvedSettingsSection[],
  listed: readonly string[],
  pages: readonly ResolvedSettingsPage[],
): readonly ResolvedSettingsSection[] {
  return sections
    .filter((section) => placedOn(section, listed, pages) === pageId)
    .toSorted((one, other) => (one.order ?? UNRANKED) - (other.order ?? UNRANKED));
}

/**
 * Returns the sections that render on no page.
 *
 * @param sections - The sections that render, in install order.
 * @param listed - Ids of the routes the settings menu lists, in menu order.
 * @param pages - Every settings page.
 */
export function unplacedOf(
  sections: readonly ResolvedSettingsSection[],
  listed: readonly string[],
  pages: readonly ResolvedSettingsPage[],
): readonly ResolvedSettingsSection[] {
  return sections.filter((section) => placedOn(section, listed, pages) === undefined);
}
