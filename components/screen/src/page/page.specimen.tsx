/**
 * Shows the page: every measure, every size, every gutter, both alignments, the header ruled off
 * beside a page left whole, and the actions folded.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. Every page holds the same header, a trail, a title, a description and
 *   three actions with the folded control, over a body. The title is drawn as an `h3`, under the
 *   scene's own `h2`, because the catalogue's page already holds the `h1`. The cells run down the
 *   page, because a page fills the width it is given. The words are keys under `page` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/page.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";
import { recipe } from "#page/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Page.Header>",
    "  <Page.Title>Invoices</Page.Title>",
    "</Page.Header>",
    "<Page.Body>…</Page.Body>",
  ].join("\n"),
  imports: 'import { Page } from "@stealthscale/component-screen";',
  name: "Page.Root",
};

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
 * Draws the page in whatever the scene hands over.
 */
function Paged(props: Page.RootProps): ReactElement {
  return (
    <Page.Root {...props}>
      <Invoices />
    </Page.Root>
  );
}

/**
 * Draws the page held to the narrow measure, which is what an alignment moves it in.
 *
 * @remarks
 *   A page as wide as the room it is given sits at both places alike. The measure is what leaves
 *   room beside the bands for the alignment to move them in.
 */
function Narrow(props: Page.RootProps): ReactElement {
  return <Paged measure="narrow" {...props} />;
}

/**
 * Draws the page with a line of meta beside the title, which is what the fold moves.
 *
 * @remarks
 *   The fold is about where the meta goes: unfolded it shares the title's row, folded it takes a
 *   row of its own under it. A header with no meta in it reads the same either way, so this is the
 *   one drawing that carries some.
 */
function Metaed(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root {...props}>
      <Page.Header>
        <Page.Trail href="#home">{t("home")}</Page.Trail>
        <Page.Title as="h3">{t("april")}</Page.Title>
        <Page.Meta>{t("raised")}</Page.Meta>
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
    </Page.Root>
  );
}

export default specimen({
  about: "page.about",
  id: "components/screen/page",
  imports: 'import { Page } from "@stealthscale/component-screen";',
  scenes: scenesOf<Page.RootProps>(recipe, {
    axes: {
      align: { direction: "column", draw: (props) => <Narrow {...props} /> },
      divided: { direction: "column" },
      folded: { direction: "column", draw: (props) => <Metaed {...props} /> },
      gutter: { direction: "column" },
      measure: { direction: "column" },
      size: { direction: "column" },
    },
    draw: (props) => <Paged {...props} />,
    namespace: "page",
    order: ["measure", "size", "gutter", "align", "divided", "folded"],
    sample: SAMPLE,
  }),
  title: "page.title",
});
