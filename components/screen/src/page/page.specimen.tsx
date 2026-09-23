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

import { Ellipsis } from "lucide-react";

import { Button, ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";
import { type Scale } from "@stealthscale/theme/authoring";

import { Ledger } from "#ledger.fixtures.tsx";
import * as Page from "#page/index.ts";
import { recipe } from "#page/recipe.ts";

/**
 * Writes the look the controls in a header take, at the step the page is read at.
 *
 * @remarks
 *   A control written as `Page.Action as={Button}` is typed as the slot rather than as the button,
 *   so the button's own axes are set through its props provider rather than as props on the slot.
 *   The step is threaded down from the scene, because the controls are the one part of the header
 *   that would otherwise stand at one size through the whole size axis.
 * @param size - The step the page is read at.
 * @param leading - Whether this is the one control the page leads with.
 */
function looked(size: Scale, leading: boolean): { size: Scale; variant: "solid" | "subtle" } {
  return { size, variant: leading ? "solid" : "subtle" };
}

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
function Invoices({ size = "md" }: { readonly size?: Scale | undefined }): ReactElement {
  const { t } = useWords("page");

  return (
    <>
      <Page.Header>
        <Page.Trail href="#home">{t("home")}</Page.Trail>
        <Page.Title as="h3">{t("april")}</Page.Title>
        <Page.Description>{t("everything")}</Page.Description>
        <Page.Actions>
          <ButtonPropsProvider value={looked(size, true)}>
            <Page.Action as={Button} priority="primary">
              {t("export")}
            </Page.Action>
          </ButtonPropsProvider>
          <ButtonPropsProvider value={looked(size, false)}>
            <Page.Action as={Button} priority="tertiary">
              {t("archive")}
            </Page.Action>
            <Page.Folded aria-label={t("more")} as={IconButton}>
              <Ellipsis />
            </Page.Folded>
          </ButtonPropsProvider>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <Ledger />
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
      <Invoices {...(props.size === undefined ? {} : { size: props.size })} />
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
function Metaed({ size = "md", ...rest }: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root size={size} {...rest}>
      <Page.Header>
        <Page.Trail href="#home">{t("home")}</Page.Trail>
        <Page.Title as="h3">{t("april")}</Page.Title>
        <Page.Meta>{t("raised")}</Page.Meta>
        <Page.Description>{t("everything")}</Page.Description>
        <Page.Actions>
          <ButtonPropsProvider value={looked(size, true)}>
            <Page.Action as={Button} priority="primary">
              {t("export")}
            </Page.Action>
          </ButtonPropsProvider>
          <ButtonPropsProvider value={looked(size, false)}>
            <Page.Action as={Button} priority="tertiary">
              {t("archive")}
            </Page.Action>
            <Page.Folded aria-label={t("more")} as={IconButton}>
              <Ellipsis />
            </Page.Folded>
          </ButtonPropsProvider>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <Ledger />
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
