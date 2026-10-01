/**
 * Reads a menu's entries in a component: the routes the menu lists that the person may open.
 *
 * @remarks
 *   A route whose condition is false remains in the router's tree, so a menu evaluates each
 *   route's condition itself, against the stores the route's evaluator reads.
 */

import { useTranslation } from "@stealthscale/provider-i18n";
import { routeHref, useRouteMap } from "@stealthscale/provider-router";
import {
  evaluateWhen,
  hostContract,
  type MenuReference,
  type ResolvedRoute,
} from "@stealthscale/sdk-core";

import { conditionContextOf } from "#conditions/context.ts";
import { type HostStores } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Describes one entry of a menu.
 */
export interface NavigationEntry {
  /**
   * Address of the route, resolved through the route map.
   */
  readonly href: string;

  /**
   * The entry's text, translated.
   */
  readonly label: string;

  /**
   * Qualified id of the route.
   */
  readonly routeId: string;
}

/**
 * Returns true where a route's plugin is on and its condition is true.
 */
function isListed(
  route: ResolvedRoute,
  stores: Pick<HostStores, "availability" | "flags" | "session">,
): boolean {
  return (
    stores.availability.get()[route.plugin]?.on === true &&
    evaluateWhen(route.when, conditionContextOf(stores))
  );
}

/**
 * Returns the entries of a menu the person may open, sorted by rank and then by label, and renders
 * again when an entry is listed or left out.
 *
 * @remarks
 *   An entry without a rank follows the ranked ones. Labels compare in the person's language.
 * @param menu - The menu. The host's main menu where none is given.
 */
export function useNavigation(menu?: MenuReference): readonly NavigationEntry[] {
  const { product, stores } = useHost("useNavigation");
  const id = menu?.id ?? hostContract.menus.main.id;
  const { i18n, t } = useTranslation(product.plugins.map((plugin) => plugin.id));
  const map = useRouteMap();
  const routes = product.routes.flatMap((route) =>
    route.navigation?.menu === id ? [{ navigation: route.navigation, route }] : [],
  );
  const listed = useSelector([stores.availability, stores.flags, stores.session], () =>
    routes.map(({ route }) => (isListed(route, stores) ? "1" : "0")).join(""),
  );
  const collator = new Intl.Collator(i18n.language);

  return routes
    .filter((_entry, index) => listed[index] === "1")
    .map(({ navigation, route }) => ({
      href: routeHref(map, route.id),
      label: t(navigation.label, { ns: route.plugin }),
      order: navigation.order ?? Number.MAX_SAFE_INTEGER,
      routeId: route.id,
    }))
    .toSorted((one, other) => one.order - other.order || collator.compare(one.label, other.label))
    .map(({ href, label, routeId }) => ({ href, label, routeId }));
}
