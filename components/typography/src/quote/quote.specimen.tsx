/**
 * Shows the inline quotation: both answers to the marks, every ink and every motion, each inside a
 * line of ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The quotation sits in a paragraph, because a quoted run is read against the
 *   words around it. The words are keys under `quote` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/quote.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Quote, type QuoteProps } from "#quote/quote.ts";
import { recipe } from "#quote/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "a measured claim",
  imports: 'import { Quote } from "@stealthscale/component-typography";',
  name: "Quote",
};

/**
 * Draws the quotation inside a line of ordinary words.
 */
function Quoted(props: QuoteProps): ReactElement {
  const { t } = useWords("quote");

  return (
    <Text>
      {t("before")} <Quote {...props}>{t("claim")}</Quote>
      {t("after")}
    </Text>
  );
}

export default specimen({
  about: "quote.about",
  id: "components/typography/quote",
  imports: 'import { Quote, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<QuoteProps>(recipe, {
    draw: (props) => <Quoted {...props} />,
    namespace: "quote",
    order: ["marks", "tone", "motion"],
    sample: SAMPLE,
  }),
  title: "quote.title",
});
