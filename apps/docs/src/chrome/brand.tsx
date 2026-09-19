/**
 * Draws the brand in the bar, which leads to the catalogue's index.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

import { INDEX } from "#catalogue.ts";

/**
 * Draws the brand over the router's link, so it leads to the index without a reload.
 */
const Home = createLink(Link);

/**
 * Describes what the brand takes: what the bar's row hands a control, and nothing of its own.
 */
export type BrandProps = Omit<ComponentProps<typeof Home>, "children" | "to">;

/**
 * Draws the brand as a link in the bar's own ink.
 *
 * @remarks
 *   The link takes the ink of the bar rather than the link ink, because a bar with one blue word
 *   in it reads as a bar with one link in it. The name is set semibold at the small size, which is
 *   what marks it as the brand among the controls beside it without it reading as a heading of
 *   the bar. The toolbar's item draws this through `as`, so the
 *   row's tab stop lands on the link. The link says it is the current page on the index alone,
 *   because the router would otherwise match every page under the index as well.
 * @param props - The row's tab stop and everything else an anchor takes.
 * @returns The link.
 */
export function Brand(props: BrandProps): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Home
      activeOptions={{ exact: true }}
      inherit
      to={useRouteHref(INDEX)}
      variant="plain"
      {...props}
    >
      <Text as="span" size="sm" weight="semibold">
        {t("frame.brand")}
      </Text>
    </Home>
  );
}
