/**
 * Shows the grid: every count of columns, every fitted and filled measure, every gap, every flow,
 * the places in a row, the shares of a row, and every span an entry can take.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The columns axis mixes the counts with the two families of measure, so
 *   the three scenes drawing it each take their own family off the one list. A scene drawing the
 *   columns runs its cells down the page, because a grid is only readable at the width of a
 *   column and a row of them would fold every grid to a sliver. The entries are tiles, numbered
 *   where the count is what the scene shows. The words are keys under `grid` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/grid.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";
import { recipe } from "#grid/recipe.ts";

/**
 * Every value the columns axis offers: the counts, then the fitted and the filled measures.
 */
const COLUMNS = valuesOf(recipe, "columns");

/**
 * The counts alone, which name no measure.
 */
const COUNTS = COLUMNS.filter((columns) => !columns.includes("-"));

/**
 * The fitted measures alone.
 */
const FITTED = COLUMNS.filter((columns) => columns.startsWith("fit-"));

/**
 * The filled measures alone.
 */
const FILLED = COLUMNS.filter((columns) => columns.startsWith("fill-"));

/**
 * Numbers one to a count, for the entries of a grid whose count is what a scene shows.
 */
function numbered(count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => String(index + 1));
}

/**
 * Draws numbered entries.
 */
function Numbered({ count }: { readonly count: number }): ReactElement[] {
  return numbered(count).map((number) => (
    <Grid.Item key={number}>
      <Tile>{number}</Tile>
    </Grid.Item>
  ));
}

/**
 * Draws twelve entries at every count of columns.
 */
function Counts(): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={COUNTS}>
      {(columns) => (
        <Grid.Root columns={columns}>
          <Numbered count={12} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws six entries at every fitted measure.
 */
function Fitted(): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={FITTED}>
      {(columns) => (
        <Grid.Root columns={columns}>
          <Numbered count={6} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws six entries at every filled measure.
 */
function Filled(): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={FILLED}>
      {(columns) => (
        <Grid.Root columns={columns}>
          <Numbered count={6} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws six entries in three columns at every gap.
 */
function Gaps(): ReactElement {
  return (
    <Matrix knob="gap" of={valuesOf(recipe, "gap")}>
      {(gap) => (
        <Grid.Root columns="3" gap={gap}>
          <Numbered count={6} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the regions of a page in three columns, placed in every flow.
 *
 * @remarks
 *   The header spans two columns and the main region spans two, so a flow along the rows leaves
 *   a hole beside the header that the dense flow pulls the aside back into.
 */
function Flow(): ReactElement {
  const { t } = useWords("grid");

  return (
    <Matrix direction="column" knob="flow" of={valuesOf(recipe, "flow")}>
      {(flow) => (
        <Grid.Root columns="3" flow={flow}>
          <Grid.Item span="2">
            <Tile>{t("header")}</Tile>
          </Grid.Item>
          <Grid.Item span="2">
            <Tile>{t("main")}</Tile>
          </Grid.Item>
          <Grid.Item>
            <Tile>{t("aside")}</Tile>
          </Grid.Item>
          <Grid.Item>
            <Tile>{t("footer")}</Tile>
          </Grid.Item>
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a short entry beside a long one at every place in the row.
 *
 * @remarks
 *   Four columns rather than two, so the note wraps in its column on a wide page. In two columns
 *   it sat on one line up to a page of some two thousand pixels, and the four places in the row
 *   read the same. Each entry is drawn as a tile rather than holding one, because the alignment
 *   moves the entry, and a tile inside an entry stretched with it kept its own height.
 */
function Alignment(): ReactElement {
  const { t } = useWords("grid");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Grid.Root align={align} columns="4">
          <Grid.Item as={Tile}>{t("article")}</Grid.Item>
          <Grid.Item as={Tile}>{t("note")}</Grid.Item>
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws three regions in three columns, sharing the row every way.
 */
function Distribution(): ReactElement {
  const { t } = useWords("grid");

  return (
    <Matrix knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Grid.Root columns="3" justify={justify}>
          <Grid.Item>
            <Tile>{t("navigation")}</Tile>
          </Grid.Item>
          <Grid.Item>
            <Tile>{t("main")}</Tile>
          </Grid.Item>
          <Grid.Item>
            <Tile>{t("aside")}</Tile>
          </Grid.Item>
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a first entry at every span in a grid of twelve, with eleven single entries after it.
 */
function Spans(): ReactElement {
  const { t } = useWords("grid");

  return (
    <Matrix direction="column" knob="span" of={valuesOf(recipe, "span")}>
      {(span) => (
        <Grid.Root columns="12">
          <Grid.Item span={span}>
            <Tile>{t("article")}</Tile>
          </Grid.Item>
          <Numbered count={11} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Every count of columns.
 */
export const counts: Scene = {
  about: "grid.counts.about",
  draw: Counts,
  title: "grid.counts.title",
};

/**
 * Every fitted measure.
 */
export const fitted: Scene = {
  about: "grid.fitted.about",
  draw: Fitted,
  title: "grid.fitted.title",
};

/**
 * Every filled measure.
 */
export const filled: Scene = {
  about: "grid.filled.about",
  draw: Filled,
  title: "grid.filled.title",
};

/**
 * Every gap.
 */
export const gaps: Scene = {
  about: "grid.gaps.about",
  draw: Gaps,
  title: "grid.gaps.title",
};

/**
 * Every flow.
 */
export const flow: Scene = {
  about: "grid.flow.about",
  draw: Flow,
  title: "grid.flow.title",
};

/**
 * Every place in a row.
 */
export const alignment: Scene = {
  about: "grid.alignment.about",
  draw: Alignment,
  title: "grid.alignment.title",
};

/**
 * Every share of a row.
 */
export const distribution: Scene = {
  about: "grid.distribution.about",
  draw: Distribution,
  title: "grid.distribution.title",
};

/**
 * Every span.
 */
export const spans: Scene = {
  about: "grid.spans.about",
  draw: Spans,
  title: "grid.spans.title",
};

export default specimen({
  about: "grid.about",
  group: "Layout",
  id: "layout/grid",
  imports: 'import { Grid } from "@stealthscale/component-layout";',
  scenes: [counts, fitted, filled, gaps, flow, alignment, distribution, spans],
  title: "grid.title",
});
