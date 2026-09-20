/**
 * Draws the frame every page is drawn in: a bar across the top, the rail down the side, and the
 * page in the room left over.
 */

import { type ReactElement, useState } from "react";

import { SkipNav } from "@stealthscale/component-a11y";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type LayoutProps } from "@stealthscale/provider-router";
import { Rail, RailSearch } from "@stealthscale/specimen";
import { css } from "@stealthscale/theme";

import { COMPILED } from "#catalogue.ts";
import { Bar } from "#chrome/bar.tsx";

/**
 * The room the bar keeps round what it holds.
 *
 * @remarks
 *   The shell's bar is a bare container, so the inset is this application's. One gap above and
 *   below, and a larger one at the sides, which is where the rail's own inset starts.
 */
const barred = css({ paddingBlock: "gap.md", paddingInline: "gap.lg" });

/**
 * Draws the shell around whichever page the router matched.
 *
 * @remarks
 *   The navigation folds over the page below the middle breakpoint, and the control in the bar
 *   opens it there. The sidebar is drawn on the muted ground and draws no line of its own, because
 *   the shell parts it from the page. The search at its head narrows the rail to the pages whose
 *   words a reader types, and the words are this frame's state, so the rail and the field read
 *   one value. The main region is the place the skip link jumps to, so a keyboard passes the bar
 *   and the rail in one press.
 * @param props - The page the router matched.
 * @returns The shell, holding it.
 */
export function Frame({ children }: LayoutProps): ReactElement {
  const { t } = useTranslation("docs");
  const [query, setQuery] = useState("");

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
              <Rail declarations={COMPILED} query={query} />
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
