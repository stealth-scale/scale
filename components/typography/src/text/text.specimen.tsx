/**
 * Shows the paragraph: every size, every ink at every weight, the alignments, a line cut short, the
 * motions and the mask.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The weight is crossed with the ink, because a weight is only readable against
 *   the ink it is set in. Each axis carries the words it reads best against: a sentence where the
 *   axis turns the size, the ink or the motion, and a passage of several lines where it turns the
 *   alignment, the cut or the mask, because none of those three shows itself on one line. A scene
 *   whose paragraph needs a measure runs its cells down the page. The words are keys under `text`
 *   in the catalogue's namespace, kept beside this file in `locales/en/specimen/text.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#text/recipe.ts";
import { Text, type TextProps } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "The deployment finished at 14:02.",
  imports: 'import { Text } from "@stealthscale/component-typography";',
  name: "Text",
};

/**
 * Draws a sentence, which is what a size, an ink or a motion is read against.
 */
function Sentence(props: TextProps): ReactElement {
  const { t } = useWords("text");

  return <Text {...props}>{t("reminder")}</Text>;
}

/**
 * Draws a short note, which is what a weight is read against beside its ink.
 */
function Note(props: TextProps): ReactElement {
  const { t } = useWords("text");

  return <Text {...props}>{t("note")}</Text>;
}

/**
 * Draws a passage of several lines, which is what an alignment, a cut or a mask needs to show.
 */
function Passage(props: TextProps): ReactElement {
  const { t } = useWords("text");

  return <Text {...props}>{t("passage")}</Text>;
}

/**
 * Draws a summary, which is what a motion is read against.
 */
function Summary(props: TextProps): ReactElement {
  const { t } = useWords("text");

  return <Text {...props}>{t("summary")}</Text>;
}

export default specimen({
  about: "text.about",
  id: "components/typography/text",
  imports: 'import { Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<TextProps>(recipe, {
    axes: {
      align: { direction: "column", draw: (props) => <Passage {...props} /> },
      mask: { direction: "column", draw: (props) => <Passage {...props} /> },
      motion: { draw: (props) => <Summary {...props} /> },
      tone: { across: "weight", draw: (props) => <Note {...props} /> },
      truncate: { direction: "column", draw: (props) => <Passage {...props} /> },
    },
    draw: (props) => <Sentence {...props} />,
    namespace: "text",
    order: ["size", "tone", "align", "truncate", "motion", "mask"],
    sample: SAMPLE,
  }),
  title: "text.title",
});
