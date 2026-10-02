/**
 * Opens the first page of the settings menu at the settings route's own address.
 */

import { type ReactElement } from "react";

import { Navigate } from "@stealthscale/provider-router";
import { hostContract } from "@stealthscale/sdk-core";
import { type NavigationEntry, useNavigation } from "@stealthscale/sdk-plugin";

/**
 * Replaces the settings route's own address with the first page of the settings menu.
 *
 * @remarks
 *   The menu always lists the host's Plugins page: the host is always on, and the page's condition
 *   is the product's, which the settings route has already passed. The first entry sorts by rank,
 *   then by translated title, so the redirect runs in the page and not before the route loads, and
 *   a server renders the frame without a page.
 * @returns The router's redirect to the first page.
 */
export function SettingsIndex(): ReactElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the menu always lists the host's Plugins page under a settings route the person passed
  const first = useNavigation(hostContract.menus.settings)[0] as NavigationEntry;

  return <Navigate replace to={first.href} />;
}
