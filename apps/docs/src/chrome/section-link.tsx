/**
 * Renders the bar's link to the catalogue, which a narrow bar moves into its menu.
 */

import { type ReactElement } from "react";

import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useLinkProps, useRouteHref } from "@stealthscale/provider-router";
import { useCatalogueMark } from "@stealthscale/specimen";

import { CATALOGUE, INDEX } from "#catalogue.ts";

/**
 * Renders the link to the catalogue's index as a toolbar link in the neutral ghost look.
 *
 * @remarks
 *   The router's link props supply the target and a press handler that navigates without a reload.
 *   The handler leaves a press with a modifier key to the browser, so the link opens in a new tab.
 *   The link is marked current on every catalogue page. A narrow bar renders it as a row of the
 *   bar's menu, and the row calls the same handler.
 * @returns The `a` element, or nothing while the bar lists the link in its menu.
 */
export function SectionLink(): null | ReactElement {
  const { t } = useTranslation("docs");
  const { href = "", onClick } = useLinkProps({ to: useRouteHref(INDEX) });

  return (
    <Toolbar.Link
      current={useCatalogueMark(CATALOGUE) === "page"}
      href={href}
      onClick={onClick}
      palette="neutral"
    >
      {t("frame.catalogue")}
    </Toolbar.Link>
  );
}
