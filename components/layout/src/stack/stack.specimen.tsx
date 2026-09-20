/**
 * Shows the stack: every direction, every gap, the places across the flow, the shares along it,
 * and a row that wraps beside one that does not.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The children are tiles, because a stack draws nothing of its own and bare
 *   words would show the gaps but not the boxes between them. The words are keys under `stack` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/stack.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";
import { recipe } from "#stack/recipe.ts";
import { Stack } from "#stack/stack.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The keys of the seven days, which fill a row past its cell.
 */
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

/**
 * Draws three steps of a flow in every direction.
 */
function Directions(): ReactElement {
  const { t } = useWords("stack");

  return (
    <Matrix knob="direction" of={valuesOf(recipe, "direction")}>
      {(direction) => (
        <Stack direction={direction}>
          <Tile>{t("draft")}</Tile>
          <Tile>{t("review")}</Tile>
          <Tile>{t("publish")}</Tile>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Draws three fields of a form at every gap.
 */
function Gaps(): ReactElement {
  const { t } = useWords("stack");

  return (
    <Matrix knob="gap" of={valuesOf(recipe, "gap")}>
      {(gap) => (
        <Stack gap={gap}>
          <Tile>{t("name")}</Tile>
          <Tile>{t("email")}</Tile>
          <Tile>{t("message")}</Tile>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Draws three words of different lengths at every place across the flow.
 */
function Alignment(): ReactElement {
  const { t } = useWords("stack");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Stack align={align}>
          <Tile>{t("sun")}</Tile>
          <Tile>{t("sunrise")}</Tile>
          <Tile>{t("saturday")}</Tile>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Draws three controls of a wizard in a row, sharing the room every way.
 */
function Distribution(): ReactElement {
  const { t } = useWords("stack");

  return (
    <Matrix direction="column" knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Stack direction="row" justify={justify}>
          <Tile>{t("skip")}</Tile>
          <Tile>{t("review")}</Tile>
          <Tile>{t("next")}</Tile>
        </Stack>
      )}
    </Matrix>
  );
}

/**
 * Draws the seven days in a row that wraps and in one that does not.
 *
 * @remarks
 *   Each row sits in the first cell of a grid of four columns, so it has a quarter of the card to
 *   fill and the seven days pass its end. Given the whole card, the days sat on one line either
 *   way. The rows are stacked, so the one that does not wrap runs into empty room rather than
 *   over the other.
 */
function Wrap(): ReactElement {
  const { t } = useWords("stack");

  return (
    <Matrix direction="column" knob="wrap" of={EITHER}>
      {(wrap) => (
        <Grid.Root columns="4">
          <Grid.Item>
            <Stack direction="row" wrap={wrap}>
              {DAYS.map((day) => (
                <Tile key={day}>{t(day)}</Tile>
              ))}
            </Stack>
          </Grid.Item>
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Every direction.
 */
export const directions: Scene = {
  about: "stack.directions.about",
  draw: Directions,
  title: "stack.directions.title",
};

/**
 * Every gap.
 */
export const gaps: Scene = {
  about: "stack.gaps.about",
  draw: Gaps,
  title: "stack.gaps.title",
};

/**
 * Every place across the flow.
 */
export const alignment: Scene = {
  about: "stack.alignment.about",
  draw: Alignment,
  title: "stack.alignment.title",
};

/**
 * Every share of the room along the flow.
 */
export const distribution: Scene = {
  about: "stack.distribution.about",
  draw: Distribution,
  title: "stack.distribution.title",
};

/**
 * A row that wraps beside one that does not.
 */
export const wrap: Scene = {
  about: "stack.wrap.about",
  draw: Wrap,
  title: "stack.wrap.title",
};

export default specimen({
  about: "stack.about",
  group: "Layout",
  id: "layout/stack",
  scenes: [directions, gaps, alignment, distribution, wrap],
  title: "stack.title",
});
