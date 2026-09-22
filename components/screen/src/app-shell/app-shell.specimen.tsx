/**
 * Shows the application shell: every look, both ways of scrolling, and the hairlines beside none.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. Every shell holds the same parts: a header with the navigation's trigger,
 *   a navbar holding a sidebar, the page, an aside, and a footer. A shell is the height of the
 *   window, so each cell is a screen and the cells run down the page, and every scene says it
 *   fills the window, so a device shows a shell at the window's edges. The words are keys under
 *   `app-shell` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/app-shell.json`.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import { recipe } from "#app-shell/recipe.ts";
import * as Sidebar from "#sidebar/index.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<AppShell.Header>…</AppShell.Header>",
    "<AppShell.Body>",
    "  <AppShell.Main>…</AppShell.Main>",
    "</AppShell.Body>",
  ].join("\n"),
  imports: 'import { AppShell } from "@stealthscale/component-screen";',
  name: "AppShell.Root",
};

/**
 * Draws the parts every shell holds.
 *
 * @remarks
 *   The page, the panel beside it, the bar under it and the block of destinations are each drawn
 *   as a `div`. A document holds one `main`, and this page draws eight shells, so eight of them
 *   cannot be `main` whatever they are named. The rest follow for the same reason: a panel beside
 *   a page that is not the page is a complementary region attached to nothing.
 */
function Application(): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <>
      <AppShell.Header>
        <AppShell.Trigger>{t("navigation")}</AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar>
          <Sidebar.Root variant="subtle">
            <Sidebar.Header>{t("acme")}</Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Nav as="div">
                <NavList.Root>
                  <NavList.Item>
                    <NavList.Link aria-current="page" href="#overview">
                      {t("overview")}
                    </NavList.Link>
                  </NavList.Item>
                  <NavList.Item>
                    <NavList.Link href="#invoices">{t("invoices")}</NavList.Link>
                  </NavList.Item>
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main as="div">
          <Tile>{t("page")}</Tile>
        </AppShell.Main>
        <AppShell.Aside as="div">
          <Tile>{t("detail")}</Tile>
        </AppShell.Aside>
      </AppShell.Body>
      <AppShell.Footer as="div">
        <Tile>{t("footer")}</Tile>
      </AppShell.Footer>
    </>
  );
}

/**
 * Draws the whole application inside whatever the scene hands over.
 */
function Shell(props: AppShell.RootProps): ReactElement {
  return (
    <AppShell.Root {...props}>
      <Application />
    </AppShell.Root>
  );
}

export default specimen({
  about: "app-shell.about",
  id: "components/screen/app-shell",
  imports: 'import { AppShell, Sidebar } from "@stealthscale/component-screen";',
  scenes: scenesOf<AppShell.RootProps>(recipe, {
    axes: {
      divided: { direction: "column" },
      scroll: { direction: "column" },
      variant: { direction: "column" },
    },
    draw: (props) => <Shell {...props} />,
    namespace: "app-shell",
    order: ["variant", "scroll", "divided"],
    sample: SAMPLE,
    viewport: true,
  }),
  title: "app-shell.title",
});
