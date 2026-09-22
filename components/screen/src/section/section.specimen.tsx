/**
 * Shows the section: both looks at every size, and the heading beside the body as an annotation.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The size is crossed with the look, because the pair reads as a grid rather than
 *   as two lists, and the annotation runs down the page, because the heading beside the body takes
 *   the whole width to show.
 *   Every section holds the same block: a title, a description, one action and a body. The title is
 *   drawn as an `h3`, under the scene's own `h2`. The words are keys under `section` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/section.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";
import { recipe } from "#section/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Section.Header>",
    "  <Section.Title>Payment methods</Section.Title>",
    "</Section.Header>",
    "<Section.Body>…</Section.Body>",
  ].join("\n"),
  imports: 'import { Section } from "@stealthscale/component-screen";',
  name: "Section.Root",
};

/**
 * Draws the block every section holds.
 */
function Payment(): ReactElement {
  const { t } = useWords("section");

  return (
    <>
      <Section.Header>
        <Section.Title as="h3">{t("payment")}</Section.Title>
        <Section.Description>{t("cards")}</Section.Description>
        <Section.Actions>
          <Section.Action priority="secondary">{t("add")}</Section.Action>
        </Section.Actions>
      </Section.Header>
      <Section.Body>
        <Tile>{t("content")}</Tile>
      </Section.Body>
    </>
  );
}

/**
 * Draws the section in whatever the scene hands over.
 */
function Held(props: Section.RootProps): ReactElement {
  return (
    <Section.Root {...props}>
      <Payment />
    </Section.Root>
  );
}

/**
 * Draws the section on a surface, which is what the annotation is read against.
 *
 * @remarks
 *   The plain look draws no box, so a heading moved beside the body has no edge to sit against and
 *   the two columns read as one block of text.
 */
function Raised(props: Section.RootProps): ReactElement {
  return <Held variant="surface" {...props} />;
}

export default specimen({
  about: "section.about",
  id: "components/screen/section",
  imports: 'import { Section } from "@stealthscale/component-screen";',
  scenes: scenesOf<Section.RootProps>(recipe, {
    axes: {
      annotated: { direction: "column", draw: (props) => <Raised {...props} /> },
      variant: { across: "size" },
    },
    draw: (props) => <Held {...props} />,
    namespace: "section",
    order: ["variant", "annotated"],
    sample: SAMPLE,
  }),
  title: "section.title",
});
