/**
 * Shows the run: every ink at every weight, a path cut short, and every motion, each inside a line
 * of ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The weight is crossed with the ink, because a weight is only readable against
 *   the ink it is set in. The words are keys under `span` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/span.json`.
 */

import { type ReactElement } from "react";

import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#span/recipe.ts";
import { Span, type SpanProps } from "#span/span.ts";
import { Text } from "#text/text.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "1,024.00",
  imports: 'import { Span } from "@stealthscale/component-typography";',
  name: "Span",
};

/**
 * Draws a figure inside a line of ordinary words.
 */
function Figure(props: SpanProps): ReactElement {
  const { t } = useWords("span");

  return (
    <Text>
      {t("before")} <Span {...props}>{t("total")}</Span>
      {t("after")}
    </Text>
  );
}

/**
 * Draws a path, cut to the line or left whole.
 *
 * @remarks
 *   The path stands in a room at the smallest measure, because a run cut short and one left whole
 *   read the same until the width runs out, and a cell of the catalogue gave the path more than it
 *   needed.
 */
function Path(props: SpanProps): ReactElement {
  const { t } = useWords("span");

  return (
    <Room size="xs">
      <Text>
        <Span {...props}>{t("path")}</Span>
      </Text>
    </Room>
  );
}

export default specimen({
  about: "span.about",
  id: "components/typography/span",
  imports: 'import { Span, Text } from "@stealthscale/component-typography";',
  scenes: scenesOf<SpanProps>(recipe, {
    axes: {
      tone: { across: "weight" },
      truncate: { draw: (props) => <Path {...props} /> },
    },
    draw: (props) => <Figure {...props} />,
    namespace: "span",
    order: ["tone", "truncate", "motion"],
    sample: SAMPLE,
  }),
  title: "span.title",
});
