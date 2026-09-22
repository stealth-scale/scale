/**
 * Shows the highlight: every look in every status, every corner at every inset, both effects and
 * every motion, each inside a line of ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The statuses are crossed with the looks and the insets with the corners,
 *   because those are the pairs a page sets together. The highlight sits in a paragraph, because a
 *   run picked out of the text is read against the text around it. The words are keys under `mark`
 *   in the catalogue's namespace, kept beside this file in `locales/en/specimen/mark.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Mark, type MarkProps } from "#mark/mark.ts";
import { recipe } from "#mark/recipe.ts";
import { Text } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "chassis",
  imports: 'import { Mark } from "@stealthscale/component-typography";',
  name: "Mark",
};

/**
 * Draws the highlight inside a line of ordinary words.
 */
function Found(props: MarkProps): ReactElement {
  const { t } = useWords("mark");

  return (
    <Text>
      {t("before")} <Mark {...props}>{t("chassis")}</Mark>
      {t("after")}
    </Text>
  );
}

export default specimen({
  about: "mark.about",
  id: "components/typography/mark",
  imports: 'import { Mark, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<MarkProps>(recipe, {
    axes: {
      radius: { across: "inset" },
      variant: { across: "status" },
    },
    draw: (props) => <Found {...props} />,
    namespace: "mark",
    order: ["variant", "radius", "effect", "motion"],
    sample: SAMPLE,
  }),
  title: "mark.title",
});
