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

import { Matrix, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";
import { type Status, STATUSES } from "@stealthscale/theme/authoring";

import { Badge, type BadgeProps } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

/**
 * The path each status leads its badge with, in a 24 unit box.
 *
 * @remarks
 *   Written out rather than taken from an icon set. The package ships none and depends on none, and
 *   what the scene needs is one mark per status rather than a set.
 */
const MARKS: Readonly<Record<Status, string>> = {
  error: "M12 8v5M12 16v.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  info: "M12 16v-5M12 8v.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  success: "M8 12.5l2.5 2.5L16 9.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  warning: "M12 9v4M12 16v.5M12 3.5 2.5 20h19z",
};

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

/**
 * Draws one badge per status, each led by the mark of its own.
 *
 * @remarks
 *   A mark is the second thing a status is told by, after the colour. A reader who cannot tell the
 *   four hues apart reads nothing from a row of four badges that differ by hue alone, and a badge
 *   is short enough that its words often repeat the colour rather than replacing it.
 */
function Marked(): ReactElement {
  const { t } = useWords("badge");

  return (
    <Matrix knob="status" of={STATUSES}>
      {(status) => (
        <Badge status={status}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={MARKS[status]} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t(status)}
        </Badge>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for a badge carrying a mark.
 */
export const marked: Scene = {
  about: "badge.marked.about",
  draw: Marked,
  source: [
    'import { Badge } from "@stealthscale/component-data";',
    "",
    '<Badge status="success">',
    '  <svg viewBox="0 0 24 24">…</svg>',
    "  Paid",
    "</Badge>",
  ].join("\n"),
  title: "badge.marked.title",
};

export default specimen({
  about: "badge.about",
  id: "components/data/badge",
  imports: 'import { Badge } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<BadgeProps>(recipe, {
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
    marked,
  ],
  title: "badge.title",
});
