/**
 * Computes what a windowed data table renders: the lines of each region of its body, the lines the
 * window renders, the spacer rows that reserve the height of the lines out of view, and the number
 * of rows the table states.
 *
 * @remarks
 *   A line is one `tr` the window measures: a record's row, or the full-width row under an expanded
 *   record. A spacer's key starts with `spacer:`, which no line's key does. The spacers before a
 *   line are one row or two, so the line renders at the `:nth-of-type` position its index gives
 *   and keeps its stripe. The second spacer is 0 pixels tall.
 */

import { type RowData, type Row as TableRow } from "@tanstack/react-table";
import {
  defaultRangeExtractor,
  type VirtualItem,
  type Range as VirtualRange,
} from "@tanstack/react-virtual";

import { footedOf } from "#data-table/columns.ts";
import { type Features } from "#data-table/features.ts";
import { leveledOf } from "#data-table/levels.ts";
import { detailedOf, detailOf, lineKeyOf } from "#data-table/rows.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes one line of a windowed body: a record's row, or the full-width row under it.
 */
export interface Line {
  /**
   * Whether the line is the full-width row under its record: its detail, or the row that waits
   * for its sub-rows.
   */
  readonly detail: boolean;

  /**
   * Key of the line, unique among the body's rows.
   */
  readonly key: string;

  /**
   * The record's row.
   */
  readonly row: TableRow<Features, RowData>;
}

/**
 * Describes the lines of each region of a windowed body.
 */
export interface Lines {
  /**
   * Lines pinned to the bottom, which render in a row group that sticks to the viewport's end.
   */
  readonly bottom: readonly Line[];

  /**
   * Lines between the pinned regions, which the window renders.
   */
  readonly center: readonly Line[];

  /**
   * Lines pinned to the top, which render in a row group that sticks under the header.
   */
  readonly top: readonly Line[];
}

/**
 * Describes a line the window renders.
 */
export interface LineSlot {
  /**
   * The window's item for the line: its index, key, start, end and size.
   */
  readonly item: VirtualItem;

  /**
   * Kind of the row, a line.
   */
  readonly kind: "line";
}

/**
 * Describes a spacer row, which reserves the height of lines out of view.
 */
export interface SpacerSlot {
  /**
   * Key of the spacer, unique among the region's rows.
   */
  readonly key: string;

  /**
   * Kind of the row, a spacer.
   */
  readonly kind: "spacer";

  /**
   * Height of the spacer in pixels.
   */
  readonly size: number;
}

/**
 * Describes one row of the windowed region: a line the window renders, or a spacer.
 */
export type Slot = LineSlot | SpacerSlot;

/**
 * Describes where the windowed region starts: the header's height, and the region's offset from the
 * top of the viewport's content.
 */
export interface Placement {
  /**
   * Height of the header rows in pixels, under which the top region sticks.
   */
  readonly head: number;

  /**
   * Offset of the windowed region from the top of the viewport's content in pixels.
   */
  readonly margin: number;
}

/**
 * Placement of a region the window has not measured.
 */
export const UNPLACED: Placement = { head: 0, margin: 0 };

/**
 * Returns a region's lines: each row, followed by the row under it while it renders one.
 */
function linesOf(
  table: DataTableApi,
  rows: ReadonlyArray<TableRow<Features, RowData>>,
  detail: boolean,
): readonly Line[] {
  const leveled = leveledOf(table);

  return rows.flatMap((row) => {
    const record = { detail: false, key: lineKeyOf(row.id, false), row };

    return detailedOf(table, row, detail, leveled)
      ? [record, { detail: true, key: lineKeyOf(row.id, true), row }]
      : [record];
  });
}

/**
 * Returns the lines of each region of the body.
 *
 * @remarks
 *   A row renders the row under it while it is expanded and a visible column renders details, or
 *   while it waits for its sub-rows in a table with levels, as the plain body's rows do.
 * @param table - The table whose rows are read.
 * @returns The lines pinned to the top, the lines between and the lines pinned to the bottom.
 */
export function regionLinesOf(table: DataTableApi): Lines {
  const detail = detailOf(table) !== undefined;

  return {
    bottom: linesOf(table, table.getBottomRows(), detail),
    center: linesOf(table, table.getCenterRows(), detail),
    top: linesOf(table, table.getTopRows(), detail),
  };
}

/**
 * Returns the number of rows a windowed table states in `aria-rowcount`: the header rows, every
 * line or the empty row, and the footer row.
 *
 * @param table - The table whose header groups and footers are read.
 * @param lines - The lines of the body's regions.
 * @returns The number of rows.
 */
export function rowCountOf(table: DataTableApi, lines: Lines): number {
  const body = lines.top.length + lines.center.length + lines.bottom.length;

  return table.getHeaderGroups().length + Math.max(body, 1) + (footedOf(table) ? 1 : 0);
}

/**
 * Returns the line at an index the window renders.
 *
 * @param lines - The windowed region's lines.
 * @param index - The line's index, below the number of lines.
 * @returns The line whose place in the region the index gives.
 */
export function lineAt(lines: readonly Line[], index: number): Line {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the window reads indexes below the line count
  return lines[index] as Line;
}

/**
 * Returns the key of the line that contains an element, from the line's `data-key`.
 *
 * @param target - The element, such as a control that takes focus.
 * @returns The line's key, or undefined for an element outside every line.
 */
export function focusedKeyOf(target: Element): string | undefined {
  return target.closest<HTMLElement>("[data-key]")?.dataset["key"];
}

/**
 * Returns the window's range extractor, which lists the lines in view and the overscan, and the
 * lines to keep while they are out of that range, such as the line that contains focus.
 *
 * @param kept - Indexes of the lines to keep. -1 keeps none.
 * @returns The function that lists the indexes to render in order, each once.
 */
export function keeping(kept: readonly number[]): (range: VirtualRange) => number[] {
  return (range) => {
    const indexes = defaultRangeExtractor(range);
    const missing = [...new Set(kept)].filter((index) => index >= 0 && !indexes.includes(index));

    if (missing.length === 0) return indexes;

    return [...indexes, ...missing].toSorted((one, other) => one - other);
  };
}

/**
 * Returns whether the last line is within the overscan of the viewport.
 *
 * @param range - Indexes of the lines in view, or `null` before the window measures the viewport.
 * @param overscan - Number of lines the window renders beyond each end of the viewport.
 * @param count - Number of lines.
 * @returns `true` while the window renders the last line as part of its range.
 */
export function endedOf(
  range: null | Pick<VirtualRange, "endIndex">,
  overscan: number,
  count: number,
): boolean {
  return range !== null && range.endIndex + overscan >= count - 1;
}

/**
 * Adds the spacers that fill a gap before a line: one spacer as tall as the gap, and a second 0
 * pixels tall when the line would otherwise take the other `:nth-of-type` parity than its index.
 */
function spaced(slots: Slot[], size: number, index: number): void {
  slots.push({ key: `spacer:${String(slots.length)}`, kind: "spacer", size });

  if ((index - slots.length) % 2 !== 0) {
    slots.push({ key: `spacer:${String(slots.length)}`, kind: "spacer", size: 0 });
  }
}

/**
 * Returns the rows of the windowed region in order: the rendered lines, and a spacer for each gap
 * before, between and after them.
 *
 * @param items - The lines the window renders, in index order.
 * @param margin - Offset of the region from the top of the viewport's content, which each line's
 *   start includes.
 * @param total - Height of every line together.
 * @returns The lines and the spacers.
 */
export function slotsOf(
  items: readonly VirtualItem[],
  margin: number,
  total: number,
): readonly Slot[] {
  const slots: Slot[] = [];
  let end = 0;

  for (const item of items) {
    const start = item.start - margin;

    if (start > end) spaced(slots, start - end, item.index);

    slots.push({ item, kind: "line" });
    end = item.end - margin;
  }

  if (total > end) slots.push({ key: "spacer:end", kind: "spacer", size: total - end });

  return slots;
}

/**
 * Returns the table a row group renders in.
 *
 * @param body - A `tbody` of the table.
 * @returns The `table` element.
 */
export function sheetOf(body: HTMLTableSectionElement): HTMLTableElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a row group renders inside its table
  return body.parentElement as HTMLTableElement;
}

/**
 * Returns where the windowed region starts, measured from the layout.
 *
 * @param body - The windowed region's `tbody`.
 * @param viewport - The scroller's viewport.
 * @returns The header's height and the region's offset in the viewport's content.
 */
export function placementOf(body: HTMLTableSectionElement, viewport: HTMLElement): Placement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a data table renders its header before its body
  const header = sheetOf(body).tHead as HTMLTableSectionElement;
  const top = body.getBoundingClientRect().top - viewport.getBoundingClientRect().top;

  return { head: header.getBoundingClientRect().height, margin: top + viewport.scrollTop };
}

/**
 * Returns the placement to keep in state: the current one while a new measure equals it, so an
 * equal measure renders nothing again.
 *
 * @param current - The placement in state.
 * @param measured - The placement just measured.
 * @returns `current` while both are equal, and `measured` otherwise.
 */
export function replaced(current: Placement, measured: Placement): Placement {
  return current.head === measured.head && current.margin === measured.margin ? current : measured;
}
