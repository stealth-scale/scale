/**
 * Announces a change of a data table's sort to a screen reader.
 *
 * @remarks
 *   A screen reader does not read a header's `aria-sort` again while focus remains on its button,
 *   so the table announces the new sort politely. The first render announces nothing, because a
 *   reader who moves into the table hears the sort from the header. The sort names its first
 *   column, the one the rows follow first. A sort on a column the table no longer has is announced
 *   as no sort, because the rows do not follow it.
 */

import { useEffect, useRef } from "react";

import { type RowData } from "@tanstack/react-table";

import { useAnnounce } from "@stealthscale/hooks";

import { type Direction, labelOf } from "#data-table/columns.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes the words of the sort announcement.
 */
export interface SortWords {
  /**
   * Returns the announcement of a sort from the column's name and the direction.
   */
  readonly sorted: (column: string, direction: Direction) => string;

  /**
   * Announcement of a table sorted by no column.
   */
  readonly unsorted: string;
}

/**
 * Returns the announcement of the table's sort.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose sort is read.
 * @param words - The sentence for a sort and the sentence for no sort.
 * @returns The sentence to announce.
 */
export function sortMessageOf<Row extends RowData>(
  table: DataTableApi<Row>,
  words: SortWords,
): string {
  const [first] = table.state.sorting;
  const column = first === undefined ? undefined : table.getAllFlatColumnsById()[first.id];

  if (first === undefined || column === undefined) return words.unsorted;

  return words.sorted(labelOf(column), first.desc ? "descending" : "ascending");
}

/**
 * Announces the table's sort politely after each change of it.
 *
 * @param table - The table whose sort is announced.
 * @param words - The sentence for a sort and the sentence for no sort.
 */
export function useSortAnnouncement(table: DataTableApi, words: SortWords): void {
  const announce = useAnnounce();
  const { sorting } = table.state;
  const previous = useRef(sorting);
  const message = sortMessageOf(table, words);

  useEffect(() => {
    if (previous.current === sorting) return;

    previous.current = sorting;
    announce(message);
  }, [announce, message, sorting]);
}
