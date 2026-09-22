/**
 * Shows the grid: every count of columns, every fitted and filled measure, every gap, every flow,
 * the places in a row, the shares of a row, and every span an entry can take.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to the theme reaches the page
 *   without this file changing. The columns are the exception: the axis mixes the counts with two
 *   families of measure, and one scene turning all of them would read as a list rather than as
 *   three arguments, so three scenes state the axis themselves and each takes its own family off
 *   the one list. Each names the axis it draws, so the check that asks what a page covers still
 *   finds the columns drawn.
 *   A scene drawing the columns runs its cells down the page, because a grid is only readable at
 *   the width of a column and a row of them would fold every grid to a sliver. The entries are
 *   tiles, numbered where the count is what the scene shows. The span is the entry's axis rather
 *   than the root's, so its scene turns the span on the first entry of a grid of twelve. The words
 *   are keys under `grid` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/grid.json`.
 */

import { type ReactElement } from "react";

import {
  Matrix,
  type Scene,
  scenesOf,
  specimen,
  Tile,
  useWords,
  valuesOf,
} from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";
import { recipe } from "#grid/recipe.ts";

/**
 * One value of the columns axis, which the three families are each a run of.
 */
type Columns = NonNullable<Grid.RootProps["columns"]>;

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
 * The call site the scenes of the root's axes are generated from.
 */
const SAMPLE = {
  children: ["<Grid.Item>", "  <p>1</p>", "</Grid.Item>"].join("\n"),
  imports: 'import { Grid } from "@stealthscale/component-layout";',
  name: "Grid.Root",
};

/**
 * The call site the span's scene is generated from, which is the entry rather than the root.
 */
const ENTRY = {
  children: "<p>Article</p>",
  imports: 'import { Grid } from "@stealthscale/component-layout";',
  name: "Grid.Item",
};

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
 * Draws six numbered entries in whatever grid the scene hands over.
 */
function Entries(props: Grid.RootProps): ReactElement {
  return (
    <Grid.Root {...props}>
      <Numbered count={6} />
    </Grid.Root>
  );
}

/**
 * Draws one family of the columns axis, one captioned grid per value down the page.
 *
 * @remarks
 *   The matrix rather than a grid of grids, so each cell carries the value it was drawn for the way
 *   every generated scene captions its own.
 */
function Columned({
  count,
  of,
}: {
  readonly count: number;
  readonly of: readonly Columns[];
}): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={of}>
      {(columns) => (
        <Grid.Root columns={columns}>
          <Numbered count={count} />
        </Grid.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the regions of a page in three columns.
 *
 * @remarks
 *   The header spans two columns and the main region spans two, so a flow along the rows leaves a
 *   hole beside the header that the dense flow pulls the aside back into.
 */
function Regions(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="3" {...props}>
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
  );
}

/**
 * Draws a short entry beside a long one.
 *
 * @remarks
 *   Four columns rather than two, so the note wraps in its column on a wide page. In two columns it
 *   sat on one line up to a page of some two thousand pixels, and the four places in the row read
 *   the same. Each entry is drawn as a tile rather than holding one, because the alignment moves
 *   the entry, and a tile inside an entry stretched with it kept its own height.
 */
function Lengths(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="4" {...props}>
      <Grid.Item as={Tile}>{t("article")}</Grid.Item>
      <Grid.Item as={Tile}>{t("note")}</Grid.Item>
    </Grid.Root>
  );
}

/**
 * Draws three regions in three columns, which is what a share of the row moves.
 */
function Shared(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="3" {...props}>
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
  );
}

/**
 * Draws a first entry at whatever span the scene hands over, with eleven single entries after it.
 */
function Spanned(props: Grid.ItemProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="12">
      <Grid.Item {...props}>
        <Tile>{t("article")}</Tile>
      </Grid.Item>
      <Numbered count={11} />
    </Grid.Root>
  );
}

/**
 * Draws twelve entries at every count of columns.
 */
function Counts(): ReactElement {
  return <Columned count={12} of={COUNTS} />;
}

/**
 * Draws six entries at every fitted measure.
 */
function Fitted(): ReactElement {
  return <Columned count={6} of={FITTED} />;
}

/**
 * Draws six entries at every filled measure.
 */
function Filled(): ReactElement {
  return <Columned count={6} of={FILLED} />;
}

/**
 * Every count of columns.
 */
export const counts: Scene = {
  about: "grid.counts.about",
  axes: ["columns"],
  draw: Counts,
  title: "grid.counts.title",
};

/**
 * Every fitted measure.
 */
export const fitted: Scene = {
  about: "grid.fitted.about",
  axes: ["columns"],
  draw: Fitted,
  title: "grid.fitted.title",
};

/**
 * Every filled measure.
 */
export const filled: Scene = {
  about: "grid.filled.about",
  axes: ["columns"],
  draw: Filled,
  title: "grid.filled.title",
};

export default specimen({
  about: "grid.about",
  id: "components/layout/grid",
  imports: 'import { Grid } from "@stealthscale/component-layout";',
  scenes: [
    counts,
    fitted,
    filled,
    ...scenesOf<Grid.RootProps>(recipe, {
      axes: {
        flow: { direction: "column", draw: (props) => <Regions {...props} /> },
        gap: { draw: (props) => <Entries columns="3" {...props} /> },
        justify: { draw: (props) => <Shared {...props} /> },
        span: {
          direction: "column",
          draw: (props) => <Spanned {...props} />,
          sample: ENTRY,
        },
      },
      draw: (props) => <Lengths {...props} />,
      namespace: "grid",
      order: ["gap", "flow", "align", "justify", "span"],
      sample: SAMPLE,
      skip: { columns: "drawn by the three scenes above, one per family of measure" },
    }),
  ],
  title: "grid.title",
});
