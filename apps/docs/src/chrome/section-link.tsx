/**
 * Renders the toolbar link to the catalogue, marked as current on every catalogue page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, useRouteHref } from "@stealthscale/provider-router";
import { useCatalogueMark } from "@stealthscale/specimen";

import { CATALOGUE, INDEX } from "#catalogue.ts";

/**
 * Renders the button over the router's link, so it navigates without a reload and takes
 * `aria-current`.
 */
const Section = createLink(Button);

/**
 * Describes the props of `SectionLink`: the props the toolbar row passes to a control.
 */
export type SectionLinkProps = Omit<ComponentProps<typeof Section>, "children" | "to">;

/**
 * Renders the link as a small ghost button in the toolbar.
 *
 * @remarks
 *   The element is an anchor in the ghost look, so it reads as navigation rather than an action,
 *   and the recipe fills it while it has `aria-current`. The toolbar item renders it through `as`,
 *   so the row's tab stop lands on the anchor. The catalogue decides whether the current route is
 *   inside it, because it declares the route ids, and returns the value `aria-current` takes.
 * @param props - The row's tab stop and the anchor's props.
 * @returns The anchor, styled as a button.
 */
export function SectionLink(props: SectionLinkProps): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Section
      aria-current={useCatalogueMark(CATALOGUE)}
      as="a"
      palette="neutral"
      size="sm"
      to={useRouteHref(INDEX)}
      variant="ghost"
      {...props}
    >
      {t("frame.catalogue")}
    </Section>
  );
}
