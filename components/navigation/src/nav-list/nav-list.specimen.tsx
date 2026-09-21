/**
 * Shows the navigation list: both looks, every highlight at every size, every corner, a list
 * collapsed to a rail, and an action that appears with the pointer.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every list holds the same rows: an overview with a count, an open branch
 *   of settings holding two rows, and the overview marked as the page being read. The words are
 *   keys under `nav-list` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/nav-list.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as NavList from "#nav-list/index.ts";
import { recipe } from "#nav-list/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The path of a pencil, in a 24 unit box.
 */
const PENCIL = "m4 20 4-1 11-11-3-3L5 16zm10-14 3 3";

/**
 * Draws the rows every list holds.
 */
function Rows(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <>
      <NavList.Item>
        <NavList.Link aria-current="page" href="#overview">
          {t("overview")}
        </NavList.Link>
        <NavList.Badge>3</NavList.Badge>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#invoices">{t("invoices")}</NavList.Link>
        <NavList.Action>
          <Icon viewBox="0 0 24 24">
            <path d={PENCIL} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </NavList.Action>
      </NavList.Item>
      <NavList.Branch defaultOpen>
        <NavList.Trigger>
          {t("settings")}
          <NavList.Indicator>
            <Icon viewBox="0 0 24 24">
              <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </NavList.Indicator>
        </NavList.Trigger>
        <NavList.Content>
          <NavList.Item>
            <NavList.Link href="#team">{t("team")}</NavList.Link>
          </NavList.Item>
          <NavList.Item>
            <NavList.Link href="#billing">{t("billing")}</NavList.Link>
          </NavList.Item>
        </NavList.Content>
      </NavList.Branch>
    </>
  );
}

/**
 * Draws the rows as a list and as a dock.
 */
function Looks(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Matrix direction="column" knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <NavList.Root aria-label={t("main")} as="nav" variant={variant}>
          <Rows />
        </NavList.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the rows with every highlight at every size.
 */
function Highlights(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="highlight"
      of={valuesOf(recipe, "highlight")}
    >
      {(highlight, size) => (
        <NavList.Root aria-label={t("main")} as="nav" highlight={highlight} size={size}>
          <Rows />
        </NavList.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the rows at every corner.
 */
function Corners(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => (
        <NavList.Root aria-label={t("main")} as="nav" highlight="fill" radius={radius}>
          <Rows />
        </NavList.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the rows as they are and collapsed to a rail.
 */
function Iconic(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Matrix knob="iconic" of={EITHER}>
      {(iconic) => (
        <NavList.Root aria-label={t("main")} as="nav" iconic={iconic}>
          <Rows />
        </NavList.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the rows with the action always drawn and appearing with the pointer.
 */
function Reveal(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Matrix knob="reveal" of={valuesOf(recipe, "reveal")}>
      {(reveal) => (
        <NavList.Root aria-label={t("main")} as="nav" reveal={reveal}>
          <Rows />
        </NavList.Root>
      )}
    </Matrix>
  );
}

/**
 * Both looks.
 */
export const looks: Scene = {
  about: "nav-list.looks.about",
  draw: Looks,
  title: "nav-list.looks.title",
};

/**
 * Every highlight at every size.
 */
export const highlights: Scene = {
  about: "nav-list.highlights.about",
  draw: Highlights,
  title: "nav-list.highlights.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "nav-list.corners.about",
  draw: Corners,
  title: "nav-list.corners.title",
};

/**
 * The list beside the rail.
 */
export const iconic: Scene = {
  about: "nav-list.iconic.about",
  draw: Iconic,
  title: "nav-list.iconic.title",
};

/**
 * An action always drawn beside one that appears with the pointer.
 */
export const reveal: Scene = {
  about: "nav-list.reveal.about",
  draw: Reveal,
  title: "nav-list.reveal.title",
};

export default specimen({
  about: "nav-list.about",
  group: "Navigation",
  id: "navigation/nav-list",
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  scenes: [looks, highlights, corners, iconic, reveal],
  title: "nav-list.title",
});
