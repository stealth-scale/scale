/**
 * Shows the application shell: every look, both ways of scrolling, and the hairlines beside none.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every shell holds the same parts: a header with the navigation's trigger,
 *   a navbar holding a sidebar, the page, an aside, and a footer. A shell is the height of the
 *   window, so each cell is a screen and the cells run down the page. The words are keys under
 *   `app-shell` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/app-shell.json`.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import { recipe } from "#app-shell/recipe.ts";
import * as Sidebar from "#sidebar/index.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the parts every shell holds.
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
              <Sidebar.Nav aria-label={t("navigation")}>
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
        <AppShell.Main>
          <Tile>{t("page")}</Tile>
        </AppShell.Main>
        <AppShell.Aside aria-label={t("detail")}>
          <Tile>{t("detail")}</Tile>
        </AppShell.Aside>
      </AppShell.Body>
      <AppShell.Footer>
        <Tile>{t("footer")}</Tile>
      </AppShell.Footer>
    </>
  );
}

/**
 * Draws the shell in every look.
 */
function Looks(): ReactElement {
  return (
    <Matrix direction="column" knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <AppShell.Root variant={variant}>
          <Application />
        </AppShell.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the shell scrolling each way.
 */
function Scroll(): ReactElement {
  return (
    <Matrix direction="column" knob="scroll" of={valuesOf(recipe, "scroll")}>
      {(scroll) => (
        <AppShell.Root scroll={scroll}>
          <Application />
        </AppShell.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the shell with its hairlines and without.
 */
function Divided(): ReactElement {
  return (
    <Matrix direction="column" knob="divided" of={EITHER}>
      {(divided) => (
        <AppShell.Root divided={divided}>
          <Application />
        </AppShell.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look.
 */
export const looks: Scene = {
  about: "app-shell.looks.about",
  draw: Looks,
  title: "app-shell.looks.title",
};

/**
 * Both ways of scrolling.
 */
export const scroll: Scene = {
  about: "app-shell.scroll.about",
  draw: Scroll,
  title: "app-shell.scroll.title",
};

/**
 * Hairlines beside none.
 */
export const divided: Scene = {
  about: "app-shell.divided.about",
  draw: Divided,
  title: "app-shell.divided.title",
};

export default specimen({
  about: "app-shell.about",
  group: "Screen",
  id: "screen/app-shell",
  scenes: [looks, scroll, divided],
  title: "app-shell.title",
});
