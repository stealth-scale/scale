/**
 * Shows the important run: every weight in every ink, and every motion, each inside a line of
 * ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The weight is crossed with the ink rather than drawn on a scene of its own,
 *   because a weight is only readable against the ink it is set in. The run sits in a paragraph,
 *   because importance is read against the words around it. The words are keys under `strong` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/strong.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#strong/recipe.ts";
import { Strong, type StrongProps } from "#strong/strong.ts";
import { Text } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "cannot",
  imports: 'import { Strong } from "@stealthscale/component-typography";',
  name: "Strong",
};

/**
 * Draws the run inside a line of ordinary words.
 */
function Important(props: StrongProps): ReactElement {
  const { t } = useWords("strong");

  return (
    <Text>
      {t("before")} <Strong {...props}>{t("cannot")}</Strong>
      {t("after")}
    </Text>
  );
}

export default specimen({
  about: "strong.about",
  id: "components/typography/strong",
  imports: 'import { Strong, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<StrongProps>(recipe, {
    axes: { tone: { across: "weight" } },
    draw: (props) => <Important {...props} />,
    namespace: "strong",
    order: ["tone", "motion"],
    sample: SAMPLE,
  }),
  title: "strong.title",
});
