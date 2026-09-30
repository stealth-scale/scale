/**
 * Renders a data table's `table` element: its caption, column widths, header rows, body and
 * footer.
 *
 * @remarks
 *   A sized table is as wide as its columns' sizes together, and declares each column's width. A
 *   windowed table states its number of rows in `aria-rowcount`, and its footer row the last row
 *   index. A table with levels is a `treegrid`, and runs the tab stop and the keys of its rows. A
 *   grid is a `grid`, and runs the tab stop, the keys, the copy and the editors of its cells.
 */

import { type ReactElement, type ReactNode } from "react";

import { Table } from "@stealthscale/component-collections";

import { Body, type BodyProps } from "#data-table/body.tsx";
import { Sheet } from "#data-table/bound.ts";
import { Footer } from "#data-table/footer.tsx";
import { Header, type HeaderProps } from "#data-table/header.tsx";
import { useIdPrefix, useTableState } from "#data-table/state.ts";
import { type GridWords, useGrid } from "#data-table/use-grid.tsx";
import { useLevels } from "#data-table/use-levels.ts";
import { Widths } from "#data-table/widths.tsx";

/**
 * Describes the props of the table element: the words and the glyph of its toggles, its caption,
 * its row count, its empty row, whether it is a grid and what its editors read, whether it is
 * sized, the windowing and the header rows' props.
 */
export interface ContentsProps extends HeaderProps, Pick<BodyProps, "empty" | "windowing"> {
  /**
   * Words and glyph of the toggles of a table with levels, which the body's rows read.
   */
  readonly branches: BodyProps["leveling"]["branches"];

  /**
   * Caption rendered under the table, which names it.
   */
  readonly caption: ReactNode;

  /**
   * Id of the caption, which the scroller's region points at.
   */
  readonly captionId: string;

  /**
   * Number of rows a windowed table states in `aria-rowcount`, or undefined for a table that is
   * not windowed.
   */
  readonly count: number | undefined;

  /**
   * Words, size and calls a grid's editors read.
   */
  readonly editing: GridWords;

  /**
   * Whether the table is a grid, whose cells take the keys. A table with levels is never one.
   */
  readonly grid: boolean;

  /**
   * Whether the table lays out its columns at their sizes.
   */
  readonly sized: boolean;
}

/**
 * Renders the `table` element with its parts.
 *
 * @param props - The toggles' words, the caption, the row count, the empty row, whether the table
 *   is a grid and what its editors read, whether it is sized, the windowing and the header rows'
 *   props.
 * @returns The `table` element.
 */
export function Contents({
  branches,
  caption,
  captionId,
  count,
  editing,
  empty,
  grid,
  sized,
  windowing,
  ...header
}: ContentsProps): ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();
  const { active, sheet } = useLevels(table, prefix);
  const gridding = useGrid(table, prefix, grid, editing);
  const wide: Record<string, string> = { "--table-size": `${String(table.getTotalSize())}px` };

  return (
    <Sheet
      {...(sized ? { "data-sized": "", style: wide } : {})}
      {...(count === undefined ? {} : { "aria-rowcount": count })}
      {...sheet}
      {...gridding.sheet}
    >
      {caption === undefined ? null : <Table.Caption id={captionId}>{caption}</Table.Caption>}
      <Widths sized={sized} />
      <Header {...header} />
      <Body
        empty={empty}
        grid={gridding.rendering}
        leveling={{ active, branches }}
        windowing={windowing}
      />
      <Footer rowIndex={count} />
    </Sheet>
  );
}
