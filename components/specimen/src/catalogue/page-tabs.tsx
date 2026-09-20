/**
 * Draws the strip under a page's head that switches between its examples and what its parts
 * accept.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Tabs } from "@stealthscale/component-disclosure";
import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { BANDS } from "#catalogue/bands.ts";

/**
 * Describes what the strip takes.
 */
export interface PageTabsProps {
  /**
   * How many parts the page's components have, or nothing until they have been read.
   */
  readonly parts?: number | undefined;

  /**
   * How many scenes the page draws.
   */
  readonly scenes: number;
}

/**
 * Draws the count beside a tab's words, as a badge.
 */
function counted(count: number | undefined): null | ReactElement {
  if (count === undefined) return null;

  return (
    <Badge size="sm" variant="subtle">
      {count}
    </Badge>
  );
}

/**
 * Draws the two tabs inside the page's navigation.
 *
 * @remarks
 *   Draw it inside `Tabs.Root`, which holds which band is open, and the two panels beside it.
 *   The band stays put as the page scrolls, because it is the one way from a scene halfway down a
 *   page to what that component accepts, and a reader who has to scroll back up to reach it reads
 *   the page as two pages.
 *   The strip draws the line under itself and the band draws none, so the head and the body are
 *   parted once. `Page.Tabs` exists to turn the strip's own line off and cannot: the line is
 *   written by the strip's `line` variant and the slot's rule is a base, which the compiler layers
 *   under every variant. Turning the band's line off is the rule that wins.
 *   The indicator is drawn, which is what marks the tab in force. Without it the strip's `line`
 *   variant marks the chosen tab by ink alone, and the ink alone is not enough to read at a glance.
 *   The counts are badges, which is how a count is drawn everywhere else on the page. The props tab
 *   counts nothing until the parts have been read.
 * @param props - How many scenes the page draws and how many parts it has.
 * @returns The navigation, holding the strip.
 */
export function PageTabs({ parts, scenes }: PageTabsProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Page.Nav aria-label={t("tabs.label")} sticky>
      <Page.Tabs as={Tabs.List}>
        <Tabs.Indicator />
        <Tabs.Trigger value={BANDS.examples}>
          {t("tabs.examples")}
          {counted(scenes)}
        </Tabs.Trigger>
        <Tabs.Trigger value={BANDS.props}>
          {t("tabs.props")}
          {counted(parts)}
        </Tabs.Trigger>
      </Page.Tabs>
    </Page.Nav>
  );
}
