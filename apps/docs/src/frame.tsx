/**
 * Renders the layout every catalogue page is rendered in: a bar at the top, the rail at the side
 * and the page in the remaining space.
 */

import { type ReactElement, useState } from "react";

import { SkipNav } from "@stealthscale/component-a11y";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type LayoutProps, useRouteContext } from "@stealthscale/provider-router";
import { Rail, RailSearch } from "@stealthscale/specimen";
import { css } from "@stealthscale/theme";

import { type CatalogueContext, COMPILED } from "#catalogue.ts";
import { Bar } from "#chrome/bar.tsx";

/**
 * The padding of the bar: the medium gap above and below, and the large gap at the sides.
 *
 * @remarks
 *   The shell's header sets no padding, so the application sets it. The large gap at the sides
 *   matches the start of the rail's own inset.
 */
const barred = css({ paddingBlock: "gap.md", paddingInline: "gap.lg" });

/**
 * Renders the shell around the page the router matched.
 *
 * @remarks
 *   Below the middle breakpoint the navigation opens over the page, from the control in the bar.
 *   The sidebar uses the subtle look without a border. The search field filters the rail, and its
 *   value is state in this component, which the field and the rail both read. The main region is
 *   the skip link's target, so one key press moves focus past the bar and the rail. The rail lists
 *   the declarations in the router context, which the router's route map was built from, so every
 *   link it renders resolves.
 * @param props - The page the router matched.
 * @returns The shell around the page.
 */
export function Frame({ children }: LayoutProps): ReactElement {
  const { t } = useTranslation("docs");
  const [query, setQuery] = useState("");
  const context: CatalogueContext = useRouteContext({ strict: false });

  return (
    <AppShell.Root>
      <SkipNav.Link>{t("frame.skip")}</SkipNav.Link>
      <AppShell.Header className={barred} sticky>
        <Bar />
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar folds="over" foldsBelow="md">
          <Sidebar.Root variant="subtle">
            <Sidebar.Header>
              <RailSearch onValueChange={setQuery} value={query} />
            </Sidebar.Header>
            <Sidebar.Content>
              <Rail declarations={context.declarations ?? COMPILED} query={query} />
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main id={SkipNav.SKIP_NAV_TARGET} tabIndex={-1}>
          {children}
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
