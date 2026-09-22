/**
 * Shows the stressed run: every ink and every motion, each inside a line of ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The run sits in a paragraph, because a stress is read against the words around
 *   it. The words are keys under `em` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/em.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Em, type EmProps } from "#em/em.ts";
import { recipe } from "#em/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "never",
  imports: 'import { Em } from "@stealthscale/component-typography";',
  name: "Em",
};

/**
 * Draws the run inside a line of ordinary words.
 */
function Stressed(props: EmProps): ReactElement {
  const { t } = useWords("em");

  return (
    <Text>
      {t("before")} <Em {...props}>{t("never")}</Em>
      {t("after")}
    </Text>
  );
}

export default specimen({
  about: "em.about",
  id: "components/typography/em",
  imports: 'import { Em, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<EmProps>(recipe, {
    draw: (props) => <Stressed {...props} />,
    namespace: "em",
    order: ["tone", "motion"],
    sample: SAMPLE,
  }),
  title: "em.title",
});
