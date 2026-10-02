/**
 * Renders a heatmap's table: the headings of its column groups and its columns over a row per row
 * heading, with a cell per pair of a row and a column.
 *
 * @remarks
 *   The table is the grid the walk moves through. The headings of the cell the readout shows light
 *   up. The corner over the row headings is a heading only with words, so a grid without them has
 *   no empty heading. A sparse grid renders a pair without a reading as an empty cell outside the
 *   walk. A hidden heading renders its words for a screen reader alone.
 */

import { type ReactElement, type ReactNode } from "react";

import { separatorOf } from "#chart/separator.ts";
import { Cell } from "#heat/cell.tsx";
import { ColumnHeading, Corner, Grid, GridCell, Hidden, litOf, RowHeading } from "#heat/grid.ts";
import { Group } from "#heat/group.tsx";
import { fillOf, type Paint } from "#heat/scale.ts";
import { type Walk } from "#heat/walk.ts";
import {
  type HeatmapCell,
  type HeatmapHeading,
  leadOf,
  type Place,
  type Resolved,
  textOf,
} from "#heatmap/cells.ts";

/**
 * Describes the words of a heatmap's grid.
 */
export interface GridWords {
  /**
   * Words over the row headings, if any.
   */
  readonly corner: ReactNode;

  /**
   * Accessible name of the grid.
   */
  readonly label: string;

  /**
   * Words of a cell without a value.
   */
  readonly missing: string;

  /**
   * Name of the values, in the readout and the key.
   */
  readonly value: ReactNode;
}

/**
 * Describes the props of a heatmap's table.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
export interface HeatmapTableProps<Cell extends HeatmapCell> {
  /**
   * Locale the chart writes in.
   */
  readonly locale: string;

  /**
   * Scale and colors of the cells.
   */
  readonly paint: Paint;

  /**
   * Whether each cell prints its value.
   */
  readonly printed: boolean;

  /**
   * Headings and places.
   */
  readonly resolved: Resolved<Cell>;

  /**
   * Place the readout shows, if any.
   */
  readonly shown: Place<Cell> | undefined;

  /**
   * Whether a pair without a reading is an empty place outside the walk.
   */
  readonly sparse: boolean;

  /**
   * Tab stop, handlers and cell props of the walk.
   */
  readonly walk: Walk;

  /**
   * Words of the grid.
   */
  readonly words: GridWords;

  /**
   * Writes a value in the chart's locale.
   */
  readonly write: (value: unknown) => string;
}

/**
 * Returns a heading's words, inside the words a screen reader reads alone for a hidden heading.
 */
function wordsOf(heading: HeatmapHeading): ReactNode {
  return heading.hidden === true ? <Hidden>{heading.label}</Hidden> : heading.label;
}

/**
 * Returns the row of the column groups' headings, or nothing without groups.
 */
function groupsOf(resolved: Resolved): null | ReactElement {
  if (resolved.runs.length === 0) return null;

  return (
    <tr>
      <Corner />
      {resolved.runs.map(({ heading, key, span }) =>
        heading === undefined ? (
          <Corner colSpan={span} key={key} />
        ) : (
          <Group hidden={heading.hidden === true} key={key} label={heading.label} span={span} />
        ),
      )}
    </tr>
  );
}

/**
 * Returns the table's head: the groups' row, then the corner and a heading per column, the shown
 * place's column lit.
 */
function headOf<Cell extends HeatmapCell>(props: HeatmapTableProps<Cell>): ReactElement {
  const { resolved, shown, words } = props;

  return (
    <thead>
      {groupsOf(resolved)}
      <tr>
        {words.corner === undefined ? <Corner /> : <ColumnHeading>{words.corner}</ColumnHeading>}
        {resolved.columns.map((column) => (
          <ColumnHeading key={column.key} {...litOf(shown?.column === column.key)}>
            {wordsOf(column)}
          </ColumnHeading>
        ))}
      </tr>
    </thead>
  );
}

/**
 * Returns a place's cell: an empty cell for a pair without a reading in a sparse grid, else the
 * cell with its fill, its words and the walk's props.
 */
function placeOf<Cell extends HeatmapCell>(
  place: Place<Cell>,
  props: HeatmapTableProps<Cell>,
  separator: string,
): ReactElement {
  if (props.sparse && place.reading === undefined) return <GridCell key={place.key} />;

  return (
    <Cell
      fill={place.value === null ? undefined : fillOf(place.value, props.paint)}
      key={place.key}
      lead={leadOf(place, separator)}
      printed={props.printed}
      text={textOf(place, props.write, props.words.missing)}
      walked={props.walk.cellOf(place.key)}
    />
  );
}

/**
 * Renders the table with the grid role, its head and a row per row heading, the shown place's row
 * lit.
 *
 * @param props - The headings and places, the scale, the words and the walk.
 */
export function HeatmapTable<Cell extends HeatmapCell>(
  props: HeatmapTableProps<Cell>,
): ReactElement {
  const separator = separatorOf(props.locale);

  return (
    <Grid aria-label={props.words.label} {...props.walk.handlers}>
      {headOf(props)}
      <tbody>
        {props.resolved.lines.map(({ heading, places }) => (
          <tr key={heading.key}>
            <RowHeading {...litOf(props.shown?.row === heading.key)}>{wordsOf(heading)}</RowHeading>
            {places.map((place) => placeOf(place, props, separator))}
          </tr>
        ))}
      </tbody>
    </Grid>
  );
}
