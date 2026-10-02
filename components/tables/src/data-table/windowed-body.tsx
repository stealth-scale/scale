/**
 * Renders the body of a windowed data table: the rows pinned to the top and to the bottom in row
 * groups that stick, and the rows between them that are in or near the viewport.
 *
 * @remarks
 *   The rows between render in a `tbody` of their own, with an `aria-hidden` spacer row that
 *   reserves the height of the lines out of view above and below them, so the table keeps its
 *   native layout. The top group sticks under the header while the header sticks, and the bottom
 *   group sticks to the viewport's end, each on the panel. Every row states its `aria-rowindex`
 *   among every row of the table, header rows included, and its line's `data-key`, by which the
 *   window keeps the line that contains focus rendered in whichever group it moves to. In a table
 *   with levels, and in a grid, it also keeps the row with the tab stop, so Tab moves into the
 *   table, and it renders a row out of view before a keystroke focuses it. The last line of a
 *   region another region follows states `data-region-end`. While the table has no rows, the body
 *   renders one full-width row with the empty content.
 */

import { type ReactElement, type ReactNode } from "react";

import { Table } from "@stealthscale/component-collections";

import { Region, Row, Spacer } from "#data-table/bound.ts";
import { type Leveling } from "#data-table/levels.ts";
import { detailRowOf, type Marks, recordRowOf, type Shape, shapeOf } from "#data-table/rowed.tsx";
import { useIdPrefix, useTableState } from "#data-table/state.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";
import { useWindow, type WindowState } from "#data-table/use-window.ts";
import { type Line, lineAt, type Lines, type Slot, slotsOf } from "#data-table/windowed.ts";

/**
 * Describes how a table renders its body windowed: the estimate, the number of header rows, the
 * lines, the report of the end, the overscan, whether the header sticks and the viewport.
 */
export interface Windowing {
  /**
   * Height in pixels the window takes for a row before it measures the first one.
   */
  readonly estimateSize: number;

  /**
   * Number of header rows, which the body's row indexes follow.
   */
  readonly head: number;

  /**
   * Lines of each region of the body.
   */
  readonly lines: Lines;

  /**
   * Runs when the last row comes within the overscan of the viewport, once per number of rows.
   */
  readonly onEndReached: (() => void) | undefined;

  /**
   * Number of rows rendered beyond each end of the viewport.
   */
  readonly overscan: number;

  /**
   * Whether the header rows stick, which the top group sticks under.
   */
  readonly stuck: boolean;

  /**
   * The scroller's viewport, the element that scrolls.
   */
  readonly viewport: HTMLDivElement | null;
}

/**
 * Describes the props of a windowed body: the content of the row shown while there are no rows,
 * what the rows of a table with levels read, and the windowing.
 */
export interface WindowedBodyProps extends Windowing {
  /**
   * Content of the full-width row rendered while the table has no rows.
   */
  readonly empty: ReactNode;

  /**
   * Attributes and content a grid gives its cells, or undefined for a table that is not a grid.
   */
  readonly grid: Shape["grid"];

  /**
   * The row with the tab stop, and the words and the glyph of the toggles, which a table with
   * levels reads.
   */
  readonly leveling: Leveling;
}

/**
 * Describes what every row group renders with: the focus handlers, the body's shape and the table.
 */
interface Rendering {
  /**
   * Handlers of each row group that record the line that contains focus.
   */
  readonly focus: Pick<WindowState, "onBlur" | "onFocus">;

  /**
   * The body's shape: its detail, id prefix, selection and column count.
   */
  readonly shape: Shape;

  /**
   * The table the rows render with.
   */
  readonly table: DataTableApi;
}

/**
 * Describes a group of rows: its lines, the row index of its first line, whether another group
 * follows, and for a pinned group its region and its style.
 */
interface Group {
  /**
   * Whether another group follows, so the last line rules its end at the indicator width.
   */
  readonly ends: boolean;

  /**
   * Index of the group's first line among every row of the table, from 1.
   */
  readonly first: number;

  /**
   * Lines of the group.
   */
  readonly lines: readonly Line[];
}

/**
 * Describes a group of pinned rows: a group, its region and the custom properties of its `tbody`.
 */
interface Pinned extends Group {
  /**
   * Region the group is pinned to.
   */
  readonly region: "bottom" | "top";

  /**
   * Custom properties of the `tbody`.
   */
  readonly style: Readonly<Record<string, string>>;
}

/**
 * Returns one line's `tr`: a record's row, or the detail row under it.
 */
function lined(rendering: Rendering, line: Line, marks: Marks): ReactElement {
  return line.detail
    ? detailRowOf(line.row, rendering.shape, marks)
    : recordRowOf(rendering.table, line.row, rendering.shape, marks);
}

/**
 * Returns the marks a group's line takes: its row index, its key, and the region end on the
 * group's last line while another group follows.
 */
function marksOf(group: Group, at: number): Marks {
  const last = group.ends && at === group.lines.length - 1;

  return {
    "aria-rowindex": group.first + at,
    "data-key": lineAt(group.lines, at).key,
    ...(last ? { "data-region-end": "" } : {}),
  };
}

/**
 * Returns a group of pinned rows in a `tbody` of its own, or `null` for a group without rows.
 */
function pinned(rendering: Rendering, group: Pinned): null | ReactElement {
  const { lines, region, style } = group;

  if (lines.length === 0) return null;

  return (
    <Region data-pinned={region} style={style} {...rendering.focus}>
      {lines.map((line, at) =>
        lined(rendering, line, {
          ...marksOf(group, at),
          ...(line.detail ? {} : { "data-pinned": region }),
        }),
      )}
    </Region>
  );
}

/**
 * Returns one row of the windowed group: a spacer, or a line with its index and the window's
 * measuring ref.
 */
function slotted(
  rendering: Rendering,
  group: Group,
  measure: (node: HTMLTableRowElement | null) => void,
  slot: Slot,
): ReactElement {
  if (slot.kind === "spacer") {
    const size: Record<string, string> = { "--spacer-size": `${String(slot.size)}px` };

    return (
      <Spacer aria-hidden key={slot.key} style={size}>
        <td aria-hidden colSpan={rendering.shape.width} />
      </Spacer>
    );
  }

  const { index } = slot.item;

  return lined(rendering, lineAt(group.lines, index), {
    ...marksOf(group, index),
    "data-index": index,
    ref: measure,
  });
}

/**
 * Renders the pinned groups and the `tbody` of the rows in or near the viewport, or the empty row.
 *
 * @param props - The empty row's content, a grid's rendering, the leveling and the windowing.
 * @returns The row groups.
 */
export function WindowedBody({
  empty,
  grid,
  head,
  leveling,
  lines,
  stuck,
  ...options
}: WindowedBodyProps): ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();
  const shape = shapeOf(table, prefix, leveling, grid);
  const { body, items, measure, onBlur, onFocus, placement, total } = useWindow({
    ...options,
    kept: leveling.active ?? grid?.tabbedRow,
    lines: lines.center,
    rows: table.getCenterRows().length,
  });
  const rendering = { focus: { onBlur, onFocus }, shape, table };
  const { bottom, center, top } = lines;
  const middle = { ends: bottom.length > 0, first: head + top.length + 1, lines: center };

  if (top.length + center.length + bottom.length === 0) {
    return (
      <Table.Body>
        <Row aria-rowindex={head + 1}>
          <Table.Cell colSpan={rendering.shape.width}>{empty}</Table.Cell>
        </Row>
      </Table.Body>
    );
  }

  return (
    <>
      {pinned(rendering, {
        ends: center.length + bottom.length > 0,
        first: head + 1,
        lines: top,
        region: "top",
        style: { "--table-head-size": `${String(stuck ? placement.head : 0)}px` },
      })}
      <Table.Body {...rendering.focus} ref={body}>
        {slotsOf(items, placement.margin, total).map((slot) =>
          slotted(rendering, middle, measure, slot),
        )}
      </Table.Body>
      {pinned(rendering, {
        ends: false,
        first: middle.first + center.length,
        lines: bottom,
        region: "bottom",
        style: {},
      })}
    </>
  );
}
