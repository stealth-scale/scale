/**
 * Announces how many rows match a data table's filters after a change of them.
 *
 * @remarks
 *   A filter changes the rows out of the reader's view: the field keeps focus while the rows under
 *   it change. The table announces the count politely 500ms after the last change of the global
 *   filter or a column's filter, the pace TanStack's faceted filter example debounces its fields
 *   at, so a person typing hears one count. The first render announces nothing.
 */

import { useEffect, useRef } from "react";

import { type RowData } from "@tanstack/react-table";

import { useAnnounce } from "@stealthscale/hooks";

import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Milliseconds the table waits after the last change of its filters before it announces.
 */
export const DELAY = 500;

/**
 * Returns the announcement of the rows that match from their count and the count of every row.
 */
export type FilterWords = (count: number, total: number) => string;

/**
 * Returns the announcement of the rows that match the table's filters.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose rows are counted.
 * @param words - The sentence for a count of the total.
 * @returns The sentence to announce.
 */
export function filterMessageOf<Row extends RowData>(
  table: DataTableApi<Row>,
  words: FilterWords,
): string {
  return words(table.getFilteredRowModel().rows.length, table.getCoreRowModel().rows.length);
}

/**
 * Announces the count of matching rows politely after each change of the table's filters.
 *
 * @param table - The table whose filters are watched.
 * @param words - The sentence for a count of the total.
 */
export function useFilterAnnouncement(table: DataTableApi, words: FilterWords): void {
  const announce = useAnnounce();
  const { columnFilters } = table.state;
  const globalFilter: unknown = table.state.globalFilter;
  const message = filterMessageOf(table, words);
  const latest = useRef(message);
  const previous = useRef({ columnFilters, globalFilter });

  useEffect(() => {
    latest.current = message;
  }, [message]);

  useEffect((): (() => void) => {
    const before = previous.current;
    const changed = before.columnFilters !== columnFilters || before.globalFilter !== globalFilter;

    previous.current = { columnFilters, globalFilter };

    const timer = changed
      ? setTimeout(() => {
          announce(latest.current);
        }, DELAY)
      : undefined;

    return (): void => {
      clearTimeout(timer);
    };
  }, [announce, columnFilters, globalFilter]);
}
