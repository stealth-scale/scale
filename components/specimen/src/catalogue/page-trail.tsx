/**
 * Draws the way back from a page to the index, resolved through the route map by id.
 */

import { type ReactElement } from "react";

import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

/**
 * Draws the page's trail over the router's link, so the way back navigates without a reload.
 */
const Back = createLink(Page.Trail);

/**
 * Describes what the trail takes.
 */
export interface TrailProps {
  /**
   * The id of the route the trail leads to.
   */
  readonly to: string;
}

/**
 * Draws the way back, in the row above the page's title.
 *
 * @remarks
 *   A component of its own because the path is read with a hook, and a page placed under nothing
 *   draws no trail at all. Draw it inside `Page.Header` from the screen package, which the page
 *   does. The link matches its route exactly, because every page hangs under the index and the
 *   router would otherwise say the trail is the current page on each of them.
 */
export function Trail({ to }: TrailProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Page.Context>
      <Back activeOptions={{ exact: true }} to={useRouteHref(to)}>
        {t("page.back")}
      </Back>
    </Page.Context>
  );
}
