/**
 * Shows the group: both directions apart and attached, every gap, children that grow, the places
 * across the flow and the shares along it.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to the theme reaches the page
 *   without this file changing. Whether the children touch is crossed with the direction rather
 *   than drawn on a scene of its own, because attaching is what one direction does to the corners
 *   between neighbours and the pair reads as one grid. The children are buttons in the outline
 *   look, because a group is for controls and an attached group is only readable where its parts
 *   have edges to square. The words are keys under `group` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/group.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Group, type GroupProps } from "#group/group.ts";
import { recipe } from "#group/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: ["<Button>Day</Button>", "<Button>Week</Button>", "<Button>Month</Button>"].join("\n"),
  imports: 'import { Group } from "@stealthscale/component-layout";',
  name: "Group",
};

/**
 * Draws a choice of period, which is the set an attached group reads best as.
 */
function Periods(props: GroupProps): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button variant="outline">{t("day")}</Button>
      <Button variant="outline">{t("week")}</Button>
      <Button variant="outline">{t("month")}</Button>
    </Group>
  );
}

/**
 * Draws a pair of controls, the one a reader is expected to press drawn ahead of the other.
 */
function Pair(props: GroupProps): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button variant="outline">{t("save")}</Button>
      <Button variant="subtle">{t("discard")}</Button>
    </Group>
  );
}

/**
 * Draws three answers of one question, which are the peers a reader picks between.
 */
function Answers(props: GroupProps): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button variant="outline">{t("yes")}</Button>
      <Button variant="outline">{t("no")}</Button>
      <Button variant="outline">{t("maybe")}</Button>
    </Group>
  );
}

/**
 * Draws three controls of different heights, which is what a place across the flow moves.
 */
function Sizes(props: GroupProps): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button size="sm" variant="outline">
        {t("day")}
      </Button>
      <Button variant="outline">{t("week")}</Button>
      <Button size="lg" variant="outline">
        {t("month")}
      </Button>
    </Group>
  );
}

/**
 * Draws a pair of controls sharing a measure's width.
 *
 * @remarks
 *   A group shares out room it has been given. Stating a distribution takes the width of whatever
 *   holds the group, so what holds it has to have a width of its own: drawn against the scene's
 *   own box, every share drew two controls side by side and nothing else. The room is the
 *   catalogue's, which is a measure a reader can see both ends of.
 */
function Stretched(props: GroupProps): ReactElement {
  return (
    <Room size="xs">
      <Pair {...props} />
    </Room>
  );
}

/**
 * Draws three answers sharing a measure's width, which is what children growing need.
 */
function Shared(props: GroupProps): ReactElement {
  return (
    <Room size="xs">
      <Answers {...props} />
    </Room>
  );
}

export default specimen({
  about: "group.about",
  id: "components/layout/group",
  imports: 'import { Group, Stack } from "@stealthscale/component-layout";',
  scenes: scenesOf<GroupProps>(recipe, {
    axes: {
      align: { draw: (props) => <Sizes {...props} /> },
      dim: { direction: "column", draw: (props) => <Answers {...props} /> },
      gap: { draw: (props) => <Pair {...props} /> },
      grow: { direction: "column", draw: (props) => <Shared {...props} /> },
      justify: { direction: "column", draw: (props) => <Stretched {...props} /> },
      orientation: { across: "attached" },
    },
    draw: (props) => <Periods {...props} />,
    namespace: "group",
    order: ["orientation", "gap", "grow", "dim", "align", "justify"],
    sample: SAMPLE,
  }),
  title: "group.title",
});
