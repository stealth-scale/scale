/**
 * Renders the layout of every catalogue page: the bar at the top, the rail at the side and the
 * page in the remaining space.
 */

import { type ReactElement } from "react";

import { SkipNav } from "@stealthscale/component-a11y";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type LayoutProps, useRouteContext } from "@stealthscale/provider-router";
import { Rail, RailSearch } from "@stealthscale/specimen";

import { type CatalogueContext, COMPILED } from "#catalogue.ts";
import { Bar } from "#chrome/bar.tsx";

/**
 * Renders the shell around the page the router matched.
 *
 * @remarks
 *   Below the middle breakpoint the navigation opens over the page from the control in the bar.
 *   The sidebar is small and uses the subtle look. The search in its header filters the rail, and
 *   ⌘K and Ctrl+K move focus to it. The main region is the skip link's target, so one key press
 *   moves focus past the bar and the rail. The rail lists the declarations in the router context,
 *   which the router's route map was built from, so every link it renders resolves.
 * @param props - The page the router matched.
 * @returns The shell around the page.
 */
export function Frame({ children }: LayoutProps): ReactElement {
  const { t } = useTranslation("docs");
  const context: CatalogueContext = useRouteContext({ strict: false });

  return (
    <AppShell.Root>
      <SkipNav.Link>{t("frame.skip")}</SkipNav.Link>
      <AppShell.Header sticky>
        <Bar />
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar folds="over" foldsBelow="md">
          <Sidebar.Root size="sm" variant="subtle">
            <Sidebar.Header>
              <RailSearch />
            </Sidebar.Header>
            <Sidebar.Content>
              <Rail declarations={context.declarations ?? COMPILED} />
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
