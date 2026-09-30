/**
 * Renders a heatmap: a value for every pair of a row and a column, as a grid of cells colored from
 * their values, with the key under it.
 *
 * @remarks
 *   A heatmap shows where values gather across two sets of categories, such as the hours of each
 *   weekday; a reader finds a dark block faster than the largest number in a table, and reads the
 *   exact value in the readout or printed in the cell. A missing value renders as a cell without a
 *   fill and with a dashed edge, apart from the faintest value, which keeps a tint. A sparse grid
 *   renders a pair without a reading as an empty place, such as a day outside a calendar's window.
 *   The domain is the values' span unless `domain` pins it, as two heatmaps read against each other
 *   do. The grid is one tab stop; the arrows walk its cells and a screen reader reads each with its
 *   headings.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Chart from "#chart/index.ts";
import { type HeatShape, type HeatSize } from "#heat/grid.ts";
import {
  type HeatmapColors,
  heatmapDomain,
  type HeatmapDomain,
  type HeatmapScale,
  type Paint,
} from "#heat/scale.ts";
import { type HeatmapCell, type HeatmapHeading, keyOf, resolve } from "#heatmap/cells.ts";
import { HeatmapGrid } from "#heatmap/grid.tsx";

/**
 * Message the chart renders without a cell unless stated.
 */
const EMPTY = "No data";

/**
 * Words of a cell without a value unless stated.
 */
const MISSING = "No data";

/**
 * Name of the values unless stated.
 */
const VALUE = "Value";

/**
 * Colors of a diverging scale unless stated: orange under the midpoint and blue over it, a pair
 * that reads apart without red and green, which mean error and success.
 */
const DIVERGING: HeatmapColors = { negative: "orange", positive: "blue" };

/**
 * Describes the props of a heatmap: the readings and their axes, the scale, the words and the
 * figure's props.
 *
 * @remarks
 *   The figure's props leave out `color`, `columns` and `scale`, the style props, because the
 *   heatmap takes those names for its scale and its axis.
 * @typeParam Cell - A reading, as the caller passes it, which `onSelect` receives.
 */
export interface HeatmapProps<Cell extends HeatmapCell = HeatmapCell>
  extends
    Omit<Chart.RootProps, "chart" | "children" | "color" | "columns" | "onSelect" | "scale">,
    Pick<Chart.ChartOptions<Cell>, "locale"> {
  /**
   * Finding the heatmap shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Readings, one per pair of a row and a column, in any order.
   */
  readonly cells: readonly Cell[];

  /**
   * Color of a sequential scale. The theme's first series color unless stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Colors of a diverging scale. Orange under the midpoint and blue over it unless stated.
   */
  readonly colors?: HeatmapColors | undefined;

  /**
   * Columns in order. Each column the cells name, in the order they first name it, unless stated.
   */
  readonly columns?: readonly HeatmapHeading[] | undefined;

  /**
   * Words over the row headings, such as what the rows are.
   */
  readonly corner?: ReactNode;

  /**
   * Index in `cells` of the reading the readout shows when the heatmap first renders, until the
   * pointer or a key moves it.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Values the scale spans. The readings' span unless stated.
   */
  readonly domain?: HeatmapDomain | undefined;

  /**
   * Message the heatmap renders in the grid's place while it has no row or no column.
   */
  readonly empty?: ReactNode;

  /**
   * Headings of the groups of columns, such as a calendar's months, above the columns' headings. A
   * group spans the consecutive columns whose `group` is its key.
   */
  readonly groups?: readonly HeatmapHeading[] | undefined;

  /**
   * Accessible name of the grid, such as "Card authorisations per hour".
   */
  readonly label: string;

  /**
   * Value a diverging scale takes the panel at. 0 unless stated.
   */
  readonly midpoint?: number | undefined;

  /**
   * Words of a cell without a value, which a screen reader reads. "No data" unless stated.
   */
  readonly missingLabel?: string | undefined;

  /**
   * Called with the reading of the cell Enter, Space or a press selects. A pair without a reading
   * calls nothing.
   */
  readonly onSelect?: ((cell: Cell) => void) | undefined;

  /**
   * Rows in order. Each row the cells name, in the order they first name it, unless stated.
   */
  readonly rows?: readonly HeatmapHeading[] | undefined;

  /**
   * How the scale reads a value. `sequential` unless stated.
   */
  readonly scale?: HeatmapScale | undefined;

  /**
   * Shape of the cells: `block`, which widens to a printed value, or `square`, which prints none.
   * `block` unless stated.
   */
  readonly shape?: HeatShape | undefined;

  /**
   * Size of the cells. `md` unless stated.
   */
  readonly size?: HeatSize | undefined;

  /**
   * Whether a pair of a row and a column without a reading is an empty place, which the walk passes
   * over, in place of a missing value. `false` unless stated.
   */
  readonly sparse?: boolean | undefined;

  /**
   * Name of the values, in the readout and the key. "Value" unless stated.
   */
  readonly valueLabel?: ReactNode;

  /**
   * `Intl.NumberFormat` options the values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether each block cell prints its value.
   */
  readonly values?: boolean | undefined;
}

/**
 * Describes the props the grid is built from.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
type GridProps<Cell extends HeatmapCell> = Pick<
  HeatmapProps<Cell>,
  | "cells"
  | "color"
  | "colors"
  | "columns"
  | "corner"
  | "defaultIndex"
  | "domain"
  | "groups"
  | "label"
  | "midpoint"
  | "missingLabel"
  | "onSelect"
  | "rows"
  | "scale"
  | "shape"
  | "size"
  | "sparse"
  | "valueLabel"
  | "valueOptions"
  | "values"
>;

/**
 * Splits a heatmap's props into the props the grid is built from and the rest, which the chart's
 * state and the figure read.
 */
function split<Cell extends HeatmapCell>(
  props: HeatmapProps<Cell>,
): [GridProps<Cell>, Omit<HeatmapProps<Cell>, keyof GridProps<Cell>>] {
  const {
    cells,
    color,
    colors,
    columns,
    corner,
    defaultIndex,
    domain,
    groups,
    label,
    midpoint,
    missingLabel,
    onSelect,
    rows,
    scale,
    shape,
    size,
    sparse,
    valueLabel,
    valueOptions,
    values,
    ...rest
  } = props;
  const axes = { cells, columns, corner, defaultIndex, groups, label, onSelect, rows };
  const scaled = { color, colors, domain, midpoint, scale, shape, size, sparse };

  return [{ ...axes, ...scaled, missingLabel, valueLabel, valueOptions, values }, rest];
}

/**
 * Returns the scale the cells are colored from.
 */
function paintOf<Cell extends HeatmapCell>(props: GridProps<Cell>): Paint {
  const { cells, color = "series.1", colors = DIVERGING, domain, midpoint = 0 } = props;

  return {
    color,
    colors,
    domain: domain ?? heatmapDomain(cells),
    midpoint,
    scale: props.scale ?? "sequential",
  };
}

/**
 * Returns the key of the reading at `defaultIndex`, if there is one.
 *
 * @remarks
 *   The walk shows no cell for a key no cell has, such as a reading whose row is not on the axes.
 */
function initialOf<Cell extends HeatmapCell>(props: GridProps<Cell>): string | undefined {
  const at = props.defaultIndex === undefined ? undefined : props.cells[props.defaultIndex];

  return at === undefined ? undefined : keyOf(at.row, at.column);
}

/**
 * Renders the figure around the grid, the key and the caption, or the empty state while there is no
 * row or no column.
 *
 * @param props - The readings and their axes, the scale, the words and the figure's props.
 */
export function Heatmap<Cell extends HeatmapCell>(props: HeatmapProps<Cell>): ReactElement {
  const [grid, rest] = split(props);
  const { caption, empty = EMPTY, locale, ratio = "wide", ...root } = rest;
  const resolved = resolve(grid.cells, grid);
  const chart = Chart.useChart({ data: [...resolved.byKey.values()], locale, series: [] });
  const words = {
    corner: grid.corner,
    label: grid.label,
    missing: grid.missingLabel ?? MISSING,
    value: grid.valueLabel ?? VALUE,
  };

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      {resolved.byKey.size === 0 ? null : (
        <HeatmapGrid
          initial={initialOf(grid)}
          locale={chart.locale}
          onSelect={grid.onSelect}
          paint={paintOf(grid)}
          printed={grid.values === true && grid.shape !== "square"}
          resolved={resolved}
          shape={grid.shape}
          size={grid.size}
          sparse={grid.sparse === true}
          words={words}
          write={chart.formatNumber(grid.valueOptions)}
        />
      )}
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
