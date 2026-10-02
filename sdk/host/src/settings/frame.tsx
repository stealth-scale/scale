/**
 * Renders the settings frame: the settings title, the settings menu, and the settings page the
 * router matched below the frame.
 *
 * @remarks
 *   The menu lists every page of the host's settings menu the person may open, as a row of links
 *   that wraps onto further lines where the band is narrow. Each link is the router's link, which
 *   opens its page without a reload and marks the current page with `aria-current="page"`. The
 *   frame reports the sections that render on no page.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, Outlet, useDeclaredRoute } from "@stealthscale/provider-router";
import { hostContract } from "@stealthscale/sdk-core";
import { useNavigation } from "@stealthscale/sdk-plugin";

import { useUnplacedReports } from "#settings/unplaced.ts";

/**
 * Renders the navigation package's link as the router's link.
 */
const MenuLink = createLink(Link);

/**
 * Renders the settings frame around the settings page the router matched.
 *
 * @returns The page, with its title, the settings menu and the matched page in its body.
 */
export function SettingsFrame(): ReactElement {
  const { t } = useTranslation("host");
  const entries = useNavigation(hostContract.menus.settings);
  const current = useDeclaredRoute()?.id;

  useUnplacedReports();

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title>{t("settings.title")}</Page.Title>
      </Page.Header>
      <Page.Nav aria-label={t("settings.menu")}>
        <Stack direction="row" gap="lg" wrap>
          {entries.map(({ href, label, routeId }) => (
            <MenuLink inherit={routeId !== current} key={routeId} to={href} variant="plain">
              {label}
            </MenuLink>
          ))}
        </Stack>
      </Page.Nav>
      <Page.Body>
        <Outlet />
      </Page.Body>
    </Page.Root>
  );
}
