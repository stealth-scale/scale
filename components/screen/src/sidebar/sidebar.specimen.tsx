/**
 * Shows the sidebar: every look at every size, and the column collapsed to a rail.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every column holds the same three bands: a head naming the workspace, a
 *   search and two blocks of destinations, and a foot naming who is signed in. The words are keys
 *   under `sidebar` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/sidebar.json`.
 */

import { type ReactElement } from "react";

import { SearchInput } from "@stealthscale/component-forms";
import { NavList } from "@stealthscale/component-navigation";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";
import { recipe } from "#sidebar/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the three bands every column holds.
 */
function Bands(): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <>
      <Sidebar.Header>{t("acme")}</Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Search>
          <SearchInput aria-label={t("search")} size="sm" />
        </Sidebar.Search>
        <Sidebar.Nav>
          <Sidebar.NavLabel>{t("workspace")}</Sidebar.NavLabel>
          <Sidebar.NavAction>{t("add")}</Sidebar.NavAction>
          <NavList.Root>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#overview">
                {t("overview")}
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#invoices">{t("invoices")}</NavList.Link>
              <NavList.Badge>3</NavList.Badge>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
        <Sidebar.Separator />
        <Sidebar.Nav>
          <Sidebar.NavLabel>{t("account")}</Sidebar.NavLabel>
          <NavList.Root>
            <NavList.Item>
              <NavList.Link href="#profile">{t("profile")}</NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#billing">{t("billing")}</NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>{t("signedIn")}</Sidebar.Footer>
    </>
  );
}

/**
 * Draws the column in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Sidebar.Root size={size} variant={variant}>
          <Bands />
        </Sidebar.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the column as it is and collapsed to a rail.
 */
function Iconic(): ReactElement {
  return (
    <Matrix knob="iconic" of={EITHER}>
      {(iconic) => (
        <Sidebar.Root iconic={iconic} variant="outline">
          <Bands />
        </Sidebar.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "sidebar.looks.about",
  draw: Looks,
  title: "sidebar.looks.title",
};

/**
 * The column beside the rail.
 */
export const iconic: Scene = {
  about: "sidebar.iconic.about",
  draw: Iconic,
  title: "sidebar.iconic.title",
};

export default specimen({
  about: "sidebar.about",
  group: "Screen",
  id: "screen/sidebar",
  scenes: [looks, iconic],
  title: "sidebar.title",
});
