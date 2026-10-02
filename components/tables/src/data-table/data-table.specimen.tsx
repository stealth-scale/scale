/**
 * Catalogue page for the data table.
 *
 * @remarks
 *   The recipe has no axis, so every scene is hand-written and renders at the page's width, the
 *   room a table takes. The page imports its examples through their barrel, and the sorting
 *   example directly, which the props reader follows to the kit's parts. The words are keys under
 *   `data-table` in `locales/en/specimen/data-table.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as examples from "#data-table/examples/index.ts";
import * as sorting from "#data-table/examples/sorting.example.tsx";

/**
 * Names each example module a scene renders.
 */
const {
  aggregates,
  claims,
  columns,
  details,
  endless,
  filters,
  grid,
  grouped,
  lazy,
  manager,
  menus,
  pages,
  pinned,
  pivot,
  search,
  selection,
  server,
  spanned,
  totals,
  tree,
  windowed,
} = examples;

/**
 * Hand-written scene for sorting from the column headers.
 */
export const sorted: Scene = {
  about: "data-table.sorting.about",
  draw: () => <sorting.Sorting />,
  example: sorting,
  title: "data-table.sorting.title",
};

/**
 * Hand-written scene for the search field over the table's rows.
 */
export const searched: Scene = {
  about: "data-table.search.about",
  draw: () => <search.Searching />,
  example: search,
  title: "data-table.search.title",
};

/**
 * Hand-written scene for the filters in the columns' headers.
 */
export const filtered: Scene = {
  about: "data-table.filters.about",
  draw: () => <filters.Filters />,
  example: filters,
  title: "data-table.filters.title",
};

/**
 * Hand-written scene for the menus in the columns' headers.
 */
export const menued: Scene = {
  about: "data-table.menus.about",
  draw: () => <menus.Menus />,
  example: menus,
  title: "data-table.menus.title",
};

/**
 * Hand-written scene for the column manager in a popover.
 */
export const managed: Scene = {
  about: "data-table.manager.about",
  draw: () => <manager.Manager />,
  example: manager,
  title: "data-table.manager.title",
};

/**
 * Hand-written scene for the pagination and the page size under the table.
 */
export const paged: Scene = {
  about: "data-table.pages.about",
  draw: () => <pages.Pages />,
  example: pages,
  title: "data-table.pages.title",
};

/**
 * Hand-written scene for a table a server sorts, searches and pages.
 */
export const served: Scene = {
  about: "data-table.server.about",
  draw: () => <server.Server />,
  example: server,
  title: "data-table.server.title",
};

/**
 * Hand-written scene for ten thousand rows of which the table renders those in view.
 */
export const windowedRows: Scene = {
  about: "data-table.windowed.about",
  draw: () => <windowed.Windowed />,
  example: windowed,
  title: "data-table.windowed.title",
};

/**
 * Hand-written scene for rows a windowed table loads as its last row comes into view.
 */
export const endlessRows: Scene = {
  about: "data-table.endless.about",
  draw: () => <endless.Endless />,
  example: endless,
  title: "data-table.endless.title",
};

/**
 * Hand-written scene for selecting rows with the select column.
 */
export const selected: Scene = {
  about: "data-table.selection.about",
  draw: () => <selection.Selection />,
  example: selection,
  title: "data-table.selection.title",
};

/**
 * Hand-written scene for detail rows under expanded rows.
 */
export const detailed: Scene = {
  about: "data-table.details.about",
  draw: () => <details.Details />,
  example: details,
  title: "data-table.details.title",
};

/**
 * Hand-written scene for sub-rows as rows with levels, a `treegrid` of cost centres.
 */
export const treeRows: Scene = {
  about: "data-table.tree.about",
  draw: () => <tree.Tree />,
  example: tree,
  title: "data-table.tree.title",
};

/**
 * Hand-written scene for rows grouped by a column's value, with the sums of each group.
 */
export const groupedRows: Scene = {
  about: "data-table.grouped.about",
  draw: () => <grouped.Grouped />,
  example: grouped,
  title: "data-table.grouped.title",
};

/**
 * Hand-written scene for folders whose items arrive after a delay the first time they open.
 */
export const lazyRows: Scene = {
  about: "data-table.lazy.about",
  draw: () => <lazy.Lazy />,
  example: lazy,
  title: "data-table.lazy.title",
};

/**
 * Hand-written scene for a footer row of totals.
 */
export const totalled: Scene = {
  about: "data-table.totals.about",
  draw: () => <totals.Totals />,
  example: totals,
  title: "data-table.totals.title",
};

/**
 * Hand-written scene for pinned columns and resizable columns, in a room narrower than the columns
 * together, so the figures scroll under the pinned select and account columns at every width.
 */
export const sized: Scene = {
  about: "data-table.columns.about",
  draw: () => (
    <Room size="lg">
      <columns.Columns />
    </Room>
  ),
  example: columns,
  title: "data-table.columns.title",
};

/**
 * Hand-written scene for rows pinned to the top with the pin column.
 */
export const pinnedRows: Scene = {
  about: "data-table.pinned.about",
  draw: () => <pinned.Pinned />,
  example: pinned,
  title: "data-table.pinned.title",
};

/**
 * Hand-written scene for a column whose equal adjacent values span their rows.
 */
export const spannedCells: Scene = {
  about: "data-table.spanned.about",
  draw: () => <spanned.Spanned />,
  example: spanned,
  title: "data-table.spanned.title",
};

/**
 * Hand-written scene for a pivot of orders by region and product per quarter, with its totals.
 */
export const pivoted: Scene = {
  about: "data-table.pivot.about",
  draw: () => <pivot.Pivot />,
  example: pivot,
  title: "data-table.pivot.title",
};

/**
 * Hand-written scene for a pivot whose aggregate a person picks from a select.
 */
export const aggregated: Scene = {
  about: "data-table.aggregates.about",
  draw: () => <aggregates.Aggregates />,
  example: aggregates,
  title: "data-table.aggregates.title",
};

/**
 * Hand-written scene for a grid of budget cells a person selects with the keys and the pointer and
 * copies into a spreadsheet.
 */
export const gridded: Scene = {
  about: "data-table.grid.about",
  draw: () => <grid.Grid />,
  example: grid,
  title: "data-table.grid.title",
};

/**
 * Hand-written scene for expense claims a person edits in place, with the unsaved changes marked
 * until they are saved or discarded.
 */
export const edited: Scene = {
  about: "data-table.claims.about",
  draw: () => <claims.Claims />,
  example: claims,
  title: "data-table.claims.title",
};

export default specimen({
  about: "data-table.about",
  id: "components/tables/data-table",
  imports: 'import { DataTable } from "@stealthscale/component-tables";',
  scenes: [
    sorted,
    searched,
    filtered,
    menued,
    managed,
    paged,
    served,
    windowedRows,
    endlessRows,
    selected,
    detailed,
    treeRows,
    groupedRows,
    lazyRows,
    totalled,
    sized,
    pinnedRows,
    spannedCells,
    pivoted,
    aggregated,
    gridded,
    edited,
  ],
  title: "data-table.title",
});
