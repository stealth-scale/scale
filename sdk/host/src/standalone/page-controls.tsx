/**
 * Renders the development panel's page control: a picker of every route the router can open, each
 * at its sample.
 */

import { type ReactElement } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { routeHref, useRouter, useRouterState } from "@stealthscale/provider-router";
import { useResolvedProduct } from "@stealthscale/sdk-plugin";

import { useStandalone } from "#standalone/context.ts";
import { Picker } from "#standalone/picker.tsx";

/**
 * Renders a picker of the routes in the router's map that a sample or an empty path fills, each
 * named by its qualified id, which opens the route a person picks.
 *
 * @remarks
 *   The picker shows the address the page is at, and lists it first where no route's sample leads
 *   there, such as a page a link opened with other parameters.
 * @returns The field.
 */
export function PageControls(): ReactElement {
  const { glyphs, routes } = useStandalone();
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { t } = useTranslation("host");
  const declared = useResolvedProduct().routes.filter(
    ({ id, path, sample }) => routes.has(id) && (sample !== undefined || !path.includes("$")),
  );
  const choices = declared.map(({ id, sample }) => ({
    label: id,
    value: routeHref(routes, { id }, sample),
  }));
  const listed = choices.some(({ value }) => value === pathname)
    ? choices
    : [{ label: pathname, value: pathname }, ...choices];

  return (
    <Picker
      choices={listed}
      indicator={glyphs.select?.indicator}
      label={t("standalone.panel.page.route")}
      onValueChange={(to) => {
        void router.navigate({ to });
      }}
      value={pathname}
    />
  );
}
