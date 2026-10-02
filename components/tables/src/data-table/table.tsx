/**
 * Renders a data table's table: the collections table's scroller around the table with its
 * caption, column widths, header rows, body and footer.
 *
 * @remarks
 *   The part takes the collections table's axes (`variant`, `size`, `rules`, `striped`, `radius`,
 *   `palette`, `stickyHeader` and the rest) and passes them to its scroller, which renders them.
 *   The caption names the table and the scroller's region. A table with pinned or resizable columns
 *   lays out every column at its size in a fixed layout as wide as the sizes together, inside a
 *   scroller as wide as the table and never wider than its room, and its `layout` is `fixed`
 *   whatever the caller states. A windowed table renders only the body rows in or near the viewport
 *   of a scroller the caller gives a height, lays its columns out the same way, sticks its header,
 *   and states `aria-rowcount` and every row's `aria-rowindex`. A table without rows renders one
 *   full-width row with `empty`, "No rows" unless stated. A change of the sort is announced
 *   politely in the words `sortedAnnouncement` and `unsortedAnnouncement` return, and a change of
 *   the filters in the words `filteredAnnouncement` returns, 500ms after the last change. A table
 *   that states `getSubRows` or groups its rows is a `treegrid`, whose rows open and close through
 *   toggles named `expandLabel` and `collapseLabel` with the `expandIndicator` glyph, and whose
 *   open rows wait for their sub-rows under the words `loadingLabel`. A `grid` table without levels
 *   is a `grid` over TanStack's cell selection: one cell has the tab stop, the arrow keys and the
 *   pointer select cells, and a copy while a cell has focus writes the selection as tab-separated
 *   text. A column that states `meta.edit` edits its cells in place, and `onCellEdit` receives each
 *   edit a person saves. A cell `unsaved` names marks its inline start and states `unsavedLabel`
 *   for assistive technology. The scroller of a grid or a table with levels takes no tab stop
 *   unless the caller states `focusable`, because its cells or its rows take focus and scroll into
 *   view.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { type AnnouncementWords, useAnnouncements } from "#data-table/announcements.ts";
import { Frame, type ScrollerProps } from "#data-table/bound.ts";
import { type ColumnActions, type Direction, sizedOf } from "#data-table/columns.ts";
import { Contents, type ContentsProps } from "#data-table/contents.tsx";
import { BRANCHES, leveledOf } from "#data-table/levels.ts";
import { useTableState } from "#data-table/state.ts";
import { type CellEditEvent } from "#data-table/use-grid.tsx";
import { useWindowed, type WindowedOptions } from "#data-table/use-windowed.ts";

/**
 * Describes the props of the table: its caption, its empty row, the glyphs of the sort and the
 * toggles, the words of the announcements, the separators and the toggles, the window, whether it
 * is a grid, and the scroller's props with the collections table's axes.
 */
export interface TableProps extends Omit<ScrollerProps, "children" | "grid" | "viewportRef"> {
  /**
   * Caption rendered under the table, and the accessible name of the table and its scroll region.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Accessible name of the toggle of an open row in a table with levels. "Collapse" unless stated.
   */
  readonly collapseLabel?: string | undefined;

  /**
   * Returns the controls a column's header renders beside its name from the column, such as
   * `DataTable.ColumnFilter` and `DataTable.ColumnMenu`.
   */
  readonly columnActions?: ColumnActions | undefined;

  /**
   * Returns the accessible name of a grid cell's editor from its column's name. "Edit Amount"
   * unless stated.
   */
  readonly editLabel?: ((column: string) => string) | undefined;

  /**
   * Content of the full-width row rendered while the table has no rows. "No rows" unless stated.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Height in pixels a windowed table takes for a body row before it measures the first one, whose
   * height it takes after. 40 unless stated.
   */
  readonly estimateSize?: number | undefined;

  /**
   * Glyph inside each toggle of a table with levels, pointing to the inline end, such as a
   * chevron. The recipe turns it a quarter while its row is open.
   */
  readonly expandIndicator?: ReactNode | undefined;

  /**
   * Accessible name of the toggle of a closed row in a table with levels. "Expand" unless stated.
   */
  readonly expandLabel?: string | undefined;

  /**
   * Returns the announcement of the rows that match the filters, from their count and the count of
   * every row. "12 of 40 rows" unless stated.
   */
  readonly filteredAnnouncement?: ((count: number, total: number) => string) | undefined;

  /**
   * Whether the table is a grid of cells a person selects, moves between with the arrow keys and
   * copies, as in a spreadsheet. A table with levels remains a `treegrid`.
   */
  readonly grid?: boolean | undefined;

  /**
   * Words of the row under an open row whose sub-rows have not arrived, in a table with levels.
   * "Loading…" unless stated.
   */
  readonly loadingLabel?: string | undefined;

  /**
   * Receives each edit a person saves in a grid cell of an editable column, whose text the caller
   * writes into `data`.
   */
  readonly onCellEdit?: ((edit: CellEditEvent) => void) | undefined;

  /**
   * Runs when a windowed table's last row comes within `overscan` rows of the viewport, once per
   * number of rows, so a caller loads the next rows.
   */
  readonly onEndReached?: (() => void) | undefined;

  /**
   * Number of rows a windowed table renders beyond each end of the viewport. 8 unless stated.
   */
  readonly overscan?: number | undefined;

  /**
   * Returns the accessible name of a column's resize separator. "Resize Amount" unless stated.
   */
  readonly resizeLabel?: ((column: string) => string) | undefined;

  /**
   * Returns a column's size in words. "150 pixels" unless stated.
   */
  readonly resizeValue?: ((size: number) => string) | undefined;

  /**
   * Returns the announcement of a sort from the column's name and the direction. "Sorted by
   * Amount, descending" unless stated.
   */
  readonly sortedAnnouncement?: ((column: string, direction: Direction) => string) | undefined;

  /**
   * Glyph beside a sortable column's name, pointing up. The recipe turns it for a descending sort.
   */
  readonly sortIndicator?: ReactNode | undefined;

  /**
   * Returns whether a grid cell has a change the caller has not saved, from its row's and its
   * column's ids. The cell marks its inline start and states the change for assistive technology.
   */
  readonly unsaved?: ((rowId: string, columnId: string) => boolean) | undefined;

  /**
   * Words of an unsaved change, which a cell with one renders for assistive technology. "Unsaved
   * change" unless stated.
   */
  readonly unsavedLabel?: string | undefined;

  /**
   * Announcement of a table sorted by no column. "Not sorted" unless stated.
   */
  readonly unsortedAnnouncement?: string | undefined;

  /**
   * Whether the table renders only the body rows in or near the viewport, for thousands of rows.
   * The caller gives the scroller a height, such as `style={{ maxBlockSize: "24rem" }}`.
   */
  readonly windowed?: boolean | undefined;
}

/**
 * Describes a table's props split by the part that takes them.
 */
interface Split {
  /**
   * Words of the announcements of a sort and of the filters.
   */
  readonly announcements: AnnouncementWords;

  /**
   * Props of the `table` element and the parts inside it.
   */
  readonly contents: Pick<
    ContentsProps,
    | "branches"
    | "caption"
    | "columnActions"
    | "editing"
    | "empty"
    | "grid"
    | "resizeLabel"
    | "resizeValue"
    | "sortIndicator"
  >;

  /**
   * Props of the scroller, with the collections table's axes.
   */
  readonly scroller: Omit<ScrollerProps, "children" | "grid" | "viewportRef">;

  /**
   * Options of the window, which a table that is not windowed ignores.
   */
  readonly windowOptions: WindowedOptions;
}

/**
 * Splits a table's props by the part that takes them, with the English words and the defaults
 * where the caller states none.
 */
function splitOf({
  caption,
  collapseLabel = BRANCHES.collapseLabel,
  columnActions,
  editLabel = (column) => `Edit ${column}`,
  empty = "No rows",
  estimateSize,
  expandIndicator,
  expandLabel = BRANCHES.expandLabel,
  filteredAnnouncement,
  grid = false,
  loadingLabel = BRANCHES.loadingLabel,
  onCellEdit,
  onEndReached,
  overscan,
  resizeLabel,
  resizeValue,
  sortedAnnouncement,
  sortIndicator,
  unsaved,
  unsavedLabel = "Unsaved change",
  unsortedAnnouncement,
  windowed = false,
  ...scroller
}: TableProps): Split {
  const size = scroller.size ?? "md";

  return {
    announcements: {
      filtered: filteredAnnouncement,
      sorted: sortedAnnouncement,
      unsorted: unsortedAnnouncement,
    },
    contents: {
      branches: { collapseLabel, expandLabel, indicator: expandIndicator, loadingLabel },
      caption,
      columnActions,
      editing: { editLabel, onCellEdit, size, unsaved, unsavedLabel },
      empty,
      grid,
      resizeLabel,
      resizeValue,
      sortIndicator,
    },
    scroller,
    windowOptions: {
      estimateSize,
      onEndReached,
      overscan,
      stickyHeader: scroller.stickyHeader,
      windowed,
    },
  };
}

/**
 * Renders the scroller with the table inside it.
 *
 * @param props - The caption, the empty row, the glyphs, the words, the window, whether the table
 *   is a grid, and the scroller's props.
 * @returns The scroller element.
 */
export function Table(props: TableProps): ReactElement {
  const id = useId();
  const table = useTableState();
  const { announcements, contents, scroller, windowOptions } = splitOf(props);
  const { windowed } = windowOptions;
  const sized = windowed || sizedOf(table);
  const framing = useWindowed(table, windowOptions);
  const leveled = leveledOf(table);
  const grid = contents.grid && !leveled;

  useAnnouncements(table, announcements);

  return (
    <Frame
      aria-labelledby={contents.caption === undefined ? undefined : id}
      {...(grid || leveled ? { focusable: false } : {})}
      {...framing.scroller}
      {...scroller}
      {...(sized ? { "data-sized": "", layout: "fixed" } : {})}
    >
      <Contents
        {...contents}
        captionId={id}
        count={framing.count}
        grid={grid}
        indexed={windowed}
        sized={sized}
        windowing={framing.windowing}
      />
    </Frame>
  );
}
