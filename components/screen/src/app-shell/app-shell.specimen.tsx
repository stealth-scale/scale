/**
 * Catalogue page for the app shell.
 *
 * @remarks
 *   `scenesOf` generates the looks, the scroll modes and the hairlines, each shell filling the
 *   device window. Every shell renders an application: a header with the navigation trigger, a
 *   sidebar in the navbar, a page of invoices in the main region, a detail panel in the aside and a
 *   footer. The scenes render inline in the catalogue's own `main`, so the staging renders the main
 *   region, the aside, the footer and the sidebar's block as `div`s: a document has one `main`, and
 *   seven shells would repeat every landmark name. The sources come from `SAMPLE` until the scenes
 *   render in their own documents. The words are keys under `app-shell` in
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
 * Size and look of the page's one action, set through the button's provider.
 */
const LOOK = { size: "sm", variant: "solid" } as const;

/**
 * Source shown for every generated scene.
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
 * Renders the parts of every shell: the header, the body with its three regions, and the footer.
 *
 * @remarks
 *   The main region, the aside and the footer render as `div`s, because a document has one `main`
 *   and the page renders seven shells inside the catalogue's own.
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
 * Renders the application inside a shell with the scene's props.
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
