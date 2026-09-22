/**
 * Lays out the catalogue page for the badge.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The size is crossed with the look and with the corner, and the look with the
 *   status, because each pair reads as a grid rather than as two lists.
 *   Each axis carries the label it reads best against: a word where the axis turns the look or the
 *   status, and a count where it turns the corner, because a corner on a round count is what the
 *   axis is reached for. The text comes from keys under `badge` in the catalogue namespace, held
 *   beside this file in `locales/en/specimen/badge.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Badge, type BadgeProps } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Draft",
  imports: 'import { Badge } from "@stealthscale/component-data";',
  name: "Badge",
};

/**
 * Draws the state a record is in, which is what a look and a size are read against.
 */
function State(props: BadgeProps): ReactElement {
  const { t } = useWords("badge");

  return <Badge {...props}>{t("draft")}</Badge>;
}

/**
 * Draws a state a status is worth painting, which is what a status is read against.
 */
function Live(props: BadgeProps): ReactElement {
  const { t } = useWords("badge");

  return <Badge {...props}>{t("live")}</Badge>;
}

/**
 * Draws a count, which is the label a corner is reached for.
 */
function Count(props: BadgeProps): ReactElement {
  return (
    <Badge status="error" {...props}>
      12
    </Badge>
  );
}

export default specimen({
  about: "badge.about",
  id: "components/data/badge",
  imports: 'import { Badge } from "@stealthscale/component-data";',
  scenes: scenesOf<BadgeProps>(recipe, {
    axes: {
      radius: { across: "size", draw: (props) => <Count {...props} /> },
      status: { across: "variant", draw: (props) => <Live {...props} /> },
      variant: { across: "size" },
    },
    draw: (props) => <State {...props} />,
    namespace: "badge",
    order: ["variant", "status", "radius"],
    sample: SAMPLE,
  }),
  title: "badge.title",
});
