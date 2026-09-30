/**
 * Announces a data table's changes of sort and of filters in the table's words, English unless
 * stated.
 */

import { type Direction } from "#data-table/columns.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";
import { type FilterWords, useFilterAnnouncement } from "#data-table/use-filter-announcement.ts";
import { useSortAnnouncement } from "#data-table/use-sort-announcement.ts";

/**
 * Describes the words of the table's announcements, each optional.
 */
export interface AnnouncementWords {
  /**
   * Returns the announcement of the rows that match the filters. "12 of 40 rows" unless stated.
   */
  readonly filtered?: FilterWords | undefined;

  /**
   * Returns the announcement of a sort. "Sorted by Amount, descending" unless stated.
   */
  readonly sorted?: ((column: string, direction: Direction) => string) | undefined;

  /**
   * Announcement of a table sorted by no column. "Not sorted" unless stated.
   */
  readonly unsorted?: string | undefined;
}

/**
 * Returns the English announcement of a sort.
 */
function sortedInEnglish(column: string, direction: Direction): string {
  return `Sorted by ${column}, ${direction}`;
}

/**
 * Returns the English announcement of the rows that match the filters.
 */
function filteredInEnglish(count: number, total: number): string {
  return `${String(count)} of ${String(total)} rows`;
}

/**
 * Announces the table's sort and filters politely after each change of them.
 *
 * @param table - The table whose changes are announced.
 * @param words - The table's words, English where a word is not stated.
 */
export function useAnnouncements(table: DataTableApi, words: AnnouncementWords): void {
  useSortAnnouncement(table, {
    sorted: words.sorted ?? sortedInEnglish,
    unsorted: words.unsorted ?? "Not sorted",
  });
  useFilterAnnouncement(table, words.filtered ?? filteredInEnglish);
}
