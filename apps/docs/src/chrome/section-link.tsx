/**
 * Draws the link to the catalogue in the bar, marked while the reader is anywhere in it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

import { INDEX } from "#catalogue.ts";
import { quiet } from "#chrome/quiet.ts";

/**
 * Draws the button over the router's link, so it leads to the catalogue without a reload and says
 * it is the current page on the catalogue's index and on every page under it.
 */
const Section = createLink(Button);

/**
 * Describes what the link takes: what the bar's row hands a control, and nothing of its own.
 */
export type SectionLinkProps = Omit<ComponentProps<typeof Section>, "children" | "to">;

/**
 * Draws the link as a quiet button in the bar.
 *
 * @remarks
 *   The element is an anchor drawn in the ghost look, so it reads as a place to go rather than as
 *   an action, and the recipe fills it while it names the page being read. The toolbar's item
 *   draws this through `as`, so the row's tab stop lands on the anchor.
 * @param props - The row's tab stop and everything else an anchor takes.
 * @returns The anchor, in the button's look.
 */
export function SectionLink(props: SectionLinkProps): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Section as="a" className={quiet} size="sm" to={useRouteHref(INDEX)} variant="ghost" {...props}>
      {t("frame.components")}
    </Section>
  );
}
