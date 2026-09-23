/**
 * Shows the application shell: every look, both ways of scrolling, and the hairlines beside none.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. A shell is the height of the window, so each cell is a screen and the cells run
 *   down the page, and every scene says it fills the window, so a device shows a shell at the
 *   window's edges.
 *   Every shell is drawn as an application rather than as a set of labelled boxes: a bar holding
 *   the navigation's trigger, a sidebar of destinations under a workspace and over an account, a
 *   block of invoices in the page, a panel of detail beside it and a bar under it. What each look
 *   does is to set those against one another, and a shell of five grey rectangles showed the
 *   rectangles moving and nothing about the application they stand for.
 *   The page, the panel beside it, the bar under it and the block of destinations are each drawn as
 *   a `div`, which the drawing below says why.
 *   The words are keys under `app-shell` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/app-shell.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import { recipe } from "#app-shell/recipe.ts";
import { Ledger } from "#ledger.fixtures.tsx";
import { Navbar } from "#navbar.fixtures.tsx";
import * as Page from "#page/index.ts";
import * as Toolbar from "#toolbar/index.ts";

/**
 * The look the one control in the shell's page takes, set through the button's own provider.
 */
const LOOK = { size: "sm", variant: "solid" } as const;

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
        <Toolbar.Root aria-label={t("navigation")} size="sm" variant="plain">
          <Toolbar.Start>
            <AppShell.Trigger>{t("navigation")}</AppShell.Trigger>
          </Toolbar.Start>
          <Toolbar.Center>
            <span>{t("april")}</span>
          </Toolbar.Center>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>
        <AppShell.Main as="div">
          <Page.Root size="sm">
            <Page.Header>
              <Page.Title as="h3">{t("april")}</Page.Title>
              <Page.Description>{t("everything")}</Page.Description>
              <Page.Actions>
                <ButtonPropsProvider value={LOOK}>
                  <Page.Action as={Button} priority="primary">
                    {t("export")}
                  </Page.Action>
                </ButtonPropsProvider>
              </Page.Actions>
            </Page.Header>
            <Page.Body>
              <Ledger />
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
        <AppShell.Aside as="div">
          <Page.Root gutter="sm" size="sm">
            <Page.Header>
              <Page.Title as="h3">{t("detail")}</Page.Title>
              <Page.Description>{t("raised")}</Page.Description>
            </Page.Header>
          </Page.Root>
        </AppShell.Aside>
      </AppShell.Body>
      <AppShell.Footer as="div">
        <Toolbar.Root aria-label={t("footer")} size="sm" variant="plain">
          <Toolbar.Start>
            <span>{t("footer")}</span>
          </Toolbar.Start>
        </Toolbar.Root>
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
