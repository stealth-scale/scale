/**
 * Renders the navigation `Pagination` on a data table's pages.
 *
 * @remarks
 *   The part is the navigation pagination's root, a `nav` named "Pagination" unless stated, on
 *   TanStack's page state. Its count is the table's row count after the filters, or `rowCount`
 *   when a server pages the rows. Its page is the table's page index plus one, and its page size
 *   the table's. A press on a page or a trigger sets the table's page index. A table that shows
 *   every row counts one page. The caller composes the navigation pagination's triggers, pages and
 *   page text inside it. TanStack returns the table to its first page after a change of the rows,
 *   the filters or the sort.
 */

import { type ReactElement } from "react";

import { Pagination } from "@stealthscale/component-navigation";

import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of the pagination: the navigation pagination root's props without the
 * count, the page and the page size, which the table's state supplies.
 */
export type PaginationProps = Omit<
  Pagination.RootProps,
  | "count"
  | "defaultPage"
  | "defaultPageSize"
  | "onPageChange"
  | "onPageSizeChange"
  | "page"
  | "pageSize"
>;

/**
 * Renders the pagination on the table's page state, which the kit exports as
 * `DataTable.Pagination`.
 *
 * @param props - The navigation pagination root's props, its triggers, pages and page text
 *   included.
 * @returns The `nav` element.
 */
export function TablePagination(props: PaginationProps): ReactElement {
  const table = useTableState();
  const { pageIndex, pageSize } = table.state.pagination;
  const count = table.getRowCount();

  return (
    <Pagination.Root
      {...props}
      count={count}
      onPageChange={({ page }) => {
        table.setPageIndex(page - 1);
      }}
      page={pageIndex + 1}
      pageSize={Number.isFinite(pageSize) ? pageSize : Math.max(count, 1)}
    />
  );
}
