/**
 * Shows the group: both directions apart and attached, every gap, children that grow, the places
 * across the flow and the shares along it.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The children are buttons in the outline look, because a group is for
 *   controls and an attached group is only readable where its parts have edges to square. The
 *   words are keys under `group` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/group.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Group } from "#group/group.ts";
import { recipe } from "#group/recipe.ts";
import { Stack } from "#stack/stack.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws a choice of period in both directions, apart and attached.
 */
function Orientation(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix
      across={{ knob: "attached", of: EITHER }}
      knob="orientation"
      of={valuesOf(recipe, "orientation")}
    >
      {(orientation, attached) => (
        <Group attached={attached} orientation={orientation}>
          <Button variant="outline">{t("day")}</Button>
          <Button variant="outline">{t("week")}</Button>
          <Button variant="outline">{t("month")}</Button>
        </Group>
      )}
    </Matrix>
  );
}

/**
 * Draws a pair of controls at every gap.
 */
function Gaps(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix knob="gap" of={valuesOf(recipe, "gap")}>
      {(gap) => (
        <Group gap={gap}>
          <Button variant="outline">{t("save")}</Button>
          <Button variant="subtle">{t("discard")}</Button>
        </Group>
      )}
    </Matrix>
  );
}

/**
 * Draws three answers, each taking what it needs beside each taking a third.
 */
/**
 * Draws a row whose other children recede while a pointer rests on one.
 */
function Dim(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix direction="column" knob="dim" of={EITHER}>
      {(dim) => (
        <Group dim={dim}>
          <Button variant="outline">{t("yes")}</Button>
          <Button variant="outline">{t("no")}</Button>
          <Button variant="outline">{t("maybe")}</Button>
        </Group>
      )}
    </Matrix>
  );
}

function Grow(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix direction="column" knob="grow" of={EITHER}>
      {(grow) => (
        <Group grow={grow}>
          <Button variant="outline">{t("yes")}</Button>
          <Button variant="outline">{t("no")}</Button>
          <Button variant="outline">{t("maybe")}</Button>
        </Group>
      )}
    </Matrix>
  );
}

/**
 * Draws three sizes of control at every place across the flow.
 */
function Alignment(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Group align={align}>
          <Button size="sm" variant="outline">
            {t("day")}
          </Button>
          <Button variant="outline">{t("week")}</Button>
          <Button size="lg" variant="outline">
            {t("month")}
          </Button>
        </Group>
      )}
    </Matrix>
  );
}

/**
 * Draws a pair of controls sharing a column's width every way.
 *
 * @remarks
 *   A group is inline and takes the width of its controls, so the room it shares out is the room
 *   a column gives it when the column stretches its children.
 */
function Distribution(): ReactElement {
  const { t } = useWords("group");

  return (
    <Matrix direction="column" knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Stack>
          <Group justify={justify}>
            <Button variant="outline">{t("save")}</Button>
            <Button variant="subtle">{t("discard")}</Button>
          </Group>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Both directions, apart and attached.
 */
export const orientation: Scene = {
  about: "group.orientation.about",
  draw: Orientation,
  title: "group.orientation.title",
};

/**
 * Every gap.
 */
export const gaps: Scene = {
  about: "group.gaps.about",
  draw: Gaps,
  title: "group.gaps.title",
};

/**
 * Children that grow beside children that do not.
 */
export const grow: Scene = {
  about: "group.grow.about",
  draw: Grow,
  title: "group.grow.title",
};

/**
 * A row whose other children recede under a pointer.
 */
export const dim: Scene = {
  about: "group.dim.about",
  draw: Dim,
  title: "group.dim.title",
};

/**
 * Every place across the flow.
 */
export const alignment: Scene = {
  about: "group.alignment.about",
  draw: Alignment,
  title: "group.alignment.title",
};

/**
 * Every share of the room along the flow.
 */
export const distribution: Scene = {
  about: "group.distribution.about",
  draw: Distribution,
  title: "group.distribution.title",
};

export default specimen({
  about: "group.about",
  group: "Layout",
  id: "layout/group",
  imports: 'import { Group, Stack } from "@stealthscale/component-layout";',
  scenes: [orientation, gaps, grow, dim, alignment, distribution],
  title: "group.title",
});
