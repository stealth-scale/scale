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
  Room,
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
 *   Each grid is drawn in a room. A matrix lays its cells out as flex children, which size a grid
 *   to its contents rather than to the cell, so every grid came out one column of thirty-six
 *   pixels and a count of three drew what a count of twelve drew. A measure that fits as many
 *   columns as it has room for has nothing to fit them into until the room is stated.
 *   The room is the widest the catalogue offers. A narrower one fits one column of every measure
 *   from the middle of the scale up, so half the values of the axis drew the same single column
 *   and the scene stopped being a scale.
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
        <Room size="4xl">
          <Grid.Root columns={columns}>
            <Numbered count={count} />
          </Grid.Root>
        </Room>
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
 * The rooms a wrapping grid is read across: enough for one column of the smallest measure, for
 * two, and for three.
 */
const ROOMS = ["xs", "2xl", "5xl"] as const;

/**
 * Draws one wrapping measure in three rooms, which is what makes the wrapping visible.
 *
 * @remarks
 *   One measure across three widths rather than every measure at one width. A measure is a column
 *   width, so what a measure decides is how many columns a given room holds, and reading that off
 *   needs the room to change rather than the measure. Drawn the other way round, the smallest
 *   measure held two columns of the card and every measure above it held one, so thirteen of the
 *   fourteen steps drew the same single column.
 *   The smallest measure is the one drawn, because it is the only one a catalogue card has room to
 *   wrap more than once.
 */
function Across({ columns }: { readonly columns: Columns }): ReactElement {
  return (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <Grid.Root columns={columns}>
            <Numbered count={6} />
          </Grid.Root>
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Draws a fitted grid wrapping as its room grows.
 */
function Fitted(): ReactElement {
  return <Across columns="fit-xs" />;
}

/**
 * Draws a filled grid wrapping as its room grows, its columns sharing what is left over.
 */
function Filled(): ReactElement {
  return <Across columns="fill-xs" />;
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
