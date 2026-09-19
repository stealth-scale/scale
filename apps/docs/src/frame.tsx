/**
 * Draws the frame every page is drawn in: a bar across the top, the rail down the side, and the
 * page in the room left over.
 */

import { type ReactElement } from "react";

import { SkipNav } from "@stealthscale/component-a11y";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type LayoutProps } from "@stealthscale/provider-router";
import { Rail } from "@stealthscale/specimen";

import { COMPILED } from "#catalogue.ts";
import { Bar } from "#chrome/bar.tsx";

/**
 * Draws the shell around whichever page the router matched.
 *
 * @remarks
 *   The navigation folds over the page below the middle breakpoint, and the control in the bar
 *   opens it there. The sidebar is drawn as a surface, because a panel over the page is
 *   transparent until something inside it draws a ground. The main region is the place the skip
 *   link jumps to, so a keyboard passes the bar and the rail in one press.
 * @param props - The page the router matched.
 * @returns The shell, holding it.
 */
export function Frame({ children }: LayoutProps): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <AppShell.Root>
      <SkipNav.Link>{t("frame.skip")}</SkipNav.Link>
      <AppShell.Header sticky>
        <Bar />
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar folds="over" foldsBelow="md">
          <Sidebar.Root variant="surface">
            <Sidebar.Content>
              <Rail declarations={COMPILED} />
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
