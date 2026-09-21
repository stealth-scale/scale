/**
 * Shows the page: every measure, every size, every gutter, both alignments, and the header ruled
 * off beside a page left whole.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every page holds the same header, a trail, a title, a description and
 *   three actions with the folded control, over a body. The title is drawn as an `h3`, under the
 *   scene's own `h2`, because the catalogue's page already holds the `h1`. The cells run down the
 *   page, because a page fills the width it is given. The words are keys under `page` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/page.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";
import { recipe } from "#page/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the header and the body every page holds.
 */
function Invoices(): ReactElement {
  const { t } = useWords("page");

  return (
    <>
      <Page.Header>
        <Page.Trail href="#home">{t("home")}</Page.Trail>
        <Page.Title as="h3">{t("april")}</Page.Title>
        <Page.Description>{t("everything")}</Page.Description>
        <Page.Actions>
          <Page.Action priority="primary">{t("export")}</Page.Action>
          <Page.Action priority="tertiary">{t("archive")}</Page.Action>
          <Page.Folded>{t("more")}</Page.Folded>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <Tile>{t("body")}</Tile>
      </Page.Body>
    </>
  );
}

/**
 * Draws the page at every measure.
 */
function Measures(): ReactElement {
  return (
    <Matrix direction="column" knob="measure" of={valuesOf(recipe, "measure")}>
      {(measure) => (
        <Page.Root measure={measure}>
          <Invoices />
        </Page.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the page at every size.
 */
function Sizes(): ReactElement {
  return (
    <Matrix direction="column" knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Page.Root size={size}>
          <Invoices />
        </Page.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the page at every gutter.
 */
function Gutters(): ReactElement {
  return (
    <Matrix direction="column" knob="gutter" of={valuesOf(recipe, "gutter")}>
      {(gutter) => (
        <Page.Root gutter={gutter}>
          <Invoices />
        </Page.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the page with its bands at both places.
 */
function Alignment(): ReactElement {
  return (
    <Matrix direction="column" knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Page.Root align={align} measure="narrow">
          <Invoices />
        </Page.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the page ruled and whole.
 */
function Divided(): ReactElement {
  return (
    <Matrix direction="column" knob="divided" of={EITHER}>
      {(divided) => (
        <Page.Root divided={divided}>
          <Invoices />
        </Page.Root>
      )}
    </Matrix>
  );
}

/**
 * Every measure.
 */
export const measures: Scene = {
  about: "page.measures.about",
  draw: Measures,
  title: "page.measures.title",
};

/**
 * Every size.
 */
export const sizes: Scene = { about: "page.sizes.about", draw: Sizes, title: "page.sizes.title" };

/**
 * Every gutter.
 */
export const gutters: Scene = {
  about: "page.gutters.about",
  draw: Gutters,
  title: "page.gutters.title",
};

/**
 * Both alignments.
 */
export const alignment: Scene = {
  about: "page.alignment.about",
  draw: Alignment,
  title: "page.alignment.title",
};

/**
 * Ruled beside whole.
 */
export const divided: Scene = {
  about: "page.divided.about",
  draw: Divided,
  title: "page.divided.title",
};

export default specimen({
  about: "page.about",
  group: "Screen",
  id: "screen/page",
  imports: 'import { Page } from "@stealthscale/component-screen";',
  scenes: [measures, sizes, gutters, alignment, divided],
  title: "page.title",
});
