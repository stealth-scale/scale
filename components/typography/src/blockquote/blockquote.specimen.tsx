/**
 * Shows the block quotation: every look in every status, every size, the places in a width, and
 * the motions.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The status is crossed with the look, because a status points the palette and a
 *   look decides how much of the palette is drawn. Every quotation carries the icon, the content
 *   and the caption, so each scene shows the whole figure. The words are keys under `blockquote` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/blockquote.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as Blockquote from "#blockquote/index.ts";
import { recipe } from "#blockquote/recipe.ts";

/**
 * The path of a pair of quotation marks, in a 24 unit box.
 */
const MARKS = "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Blockquote.Content>Perfection is reached…</Blockquote.Content>",
    "<Blockquote.Caption>Antoine de Saint-Exupéry</Blockquote.Caption>",
  ].join("\n"),
  imports: 'import { Blockquote } from "@stealthscale/component-typography";',
  name: "Blockquote.Root",
};

/**
 * Draws the quotation's icon, content and caption, which every scene shows whole.
 */
function Figure(): ReactElement {
  const { t } = useWords("blockquote");

  return (
    <>
      <Blockquote.Icon size="lg" viewBox="0 0 24 24">
        <path d={MARKS} />
      </Blockquote.Icon>
      <Blockquote.Content>{t("quotation")}</Blockquote.Content>
      <Blockquote.Caption>{t("author")}</Blockquote.Caption>
    </>
  );
}

/**
 * Draws the whole figure in whatever the scene hands over.
 */
function Quoted(props: Blockquote.RootProps): ReactElement {
  return (
    <Blockquote.Root {...props}>
      <Figure />
    </Blockquote.Root>
  );
}

export default specimen({
  about: "blockquote.about",
  id: "components/typography/blockquote",
  imports: 'import { Blockquote } from "@stealthscale/component-typography";',
  scenes: scenesOf<Blockquote.RootProps>(recipe, {
    axes: {
      justify: { direction: "column" },
      variant: { across: "status" },
    },
    draw: (props) => <Quoted {...props} />,
    namespace: "blockquote",
    order: ["variant", "size", "justify", "motion"],
    sample: SAMPLE,
  }),
  title: "blockquote.title",
});
