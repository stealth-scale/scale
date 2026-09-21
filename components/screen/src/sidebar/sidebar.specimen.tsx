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
import { Icon, Span } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";
import { recipe } from "#sidebar/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The paths of the four marks, one per destination, each in a 24 unit box.
 */
const MARKS = {
  billing: "M3 6h18v12H3zM3 10h18",
  invoices: "M6 3h9l5 5v13H6zM14 3v6h6",
  overview: "m3 11 9-8 9 8v9h-6v-6H9v6H3z",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
} as const;

/**
 * Describes what a mark is told.
 */
interface MarkProps {
  /**
   * The destination the mark stands for.
   */
  readonly of: keyof typeof MARKS;
}

/**
 * Draws the mark of one destination.
 */
function Mark({ of }: MarkProps): ReactElement {
  return (
    <Icon viewBox="0 0 24 24">
      <path d={MARKS[of]} fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

/**
 * Describes what the bands are told.
 */
interface BandsProps {
  /**
   * Whether the column is collapsed to a rail, which the lists inside it are told too.
   */
  readonly iconic?: boolean;
}

/**
 * Draws the three bands every column holds.
 *
 * @remarks
 *   Every destination carries a mark, because a rail is made of them: a list collapsed with
 *   nothing but words drew empty squares. The words sit in a span, because a collapsed row takes
 *   every child but its mark out of sight and a bare text node is no child a selector reaches, so
 *   the words stayed and were cut at the square's edge. The lists are told what the column is
 *   told, because a list measures nothing and the sidebar's own rules reach its headings, its
 *   search and its actions alone.
 */
function Bands({ iconic = false }: BandsProps): ReactElement {
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
          <NavList.Root iconic={iconic}>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#overview">
                <Mark of="overview" />
                <Span>{t("overview")}</Span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#invoices">
                <Mark of="invoices" />
                <Span>{t("invoices")}</Span>
              </NavList.Link>
              <NavList.Badge>3</NavList.Badge>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
        <Sidebar.Separator />
        <Sidebar.Nav>
          <Sidebar.NavLabel>{t("account")}</Sidebar.NavLabel>
          <NavList.Root iconic={iconic}>
            <NavList.Item>
              <NavList.Link href="#profile">
                <Mark of="profile" />
                <Span>{t("profile")}</Span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#billing">
                <Mark of="billing" />
                <Span>{t("billing")}</Span>
              </NavList.Link>
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
          <Bands iconic={iconic} />
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
  imports: 'import { Sidebar } from "@stealthscale/component-screen";',
  scenes: [looks, iconic],
  title: "sidebar.title",
});
