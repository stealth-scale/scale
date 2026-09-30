# @stealthscale/component-tables

A data table in this package is a table of records over TanStack Table 9, rendered with the
collections table's parts and looks. An application's compiler reads the recipes from the preset
under `./theme`.

## Install

```bash
pnpm add @stealthscale/component-tables
```

The package peers on `react`, `react-dom`, `@stealthscale/hooks`, `@stealthscale/theme`,
`@stealthscale/provider-locale`, `@stealthscale/component-a11y` and
`@stealthscale/component-primitives`. It depends on `@tanstack/react-table` 9.2.4,
`@tanstack/react-virtual` 3.14.13 and the collections, data, forms, navigation, actions, disclosure
and feedback component packages.

| Export      | What it renders                                                         |
| ----------- | ----------------------------------------------------------------------- |
| `DataTable` | A table of records, the hook that creates its state, and column helpers |

## DataTable

`DataTable.useDataTable` creates a table from columns written with `DataTable.createColumnHelper`.
`DataTable.Root` provides the table to the parts, and `DataTable.Table` renders it.

```tsx
import { ArrowUpIcon } from "lucide-react";

import { DataTable } from "@stealthscale/component-tables";

const column = DataTable.createColumnHelper<Payout>();

const columns = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("amount", { header: "Amount", meta: { numeric: true } }),
]);

const table = DataTable.useDataTable({ columns, data, getRowId: (row) => row.id });

<DataTable.Root table={table}>
  <DataTable.Table
    caption="Payouts this quarter"
    sortIndicator={<ArrowUpIcon size="1em" />}
    variant="surface"
  />
</DataTable.Root>;
```

### The hook

`useDataTable` takes TanStack's table options without `features`. The kit registers all 17 stock
features of TanStack Table 9 with their row models, and every stock sort, filter and aggregation
function TanStack exports: 6, 22 and 11. A column's `sortFn`, `filterFn` and `aggregationFn` take a
stock function's name, such as `"greaterThan"` or `"sum"`. A stated option applies over the kit's
defaults:

| Option                   | Default                                        | Why                                                          |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| `sortDescFirst`          | `false`                                        | A column sorts ascending on its first press                  |
| `enableColumnResizing`   | `false`                                        | A resizable column's separator is a tab stop                 |
| `enableGrouping`         | `false`                                        | A column's menu offers grouping only where the caller asks   |
| `columnResizeMode`       | `"onChange"`                                   | A column resizes while the pointer drags                     |
| `columnResizeDirection`  | the `LocaleProvider`'s direction, else `"ltr"` | The drag, the resize keys and the row arrows follow the text |
| `autoResetCellSelection` | `false`                                        | A grid keeps its selection when an edit changes `data`       |
| page size                | `Infinity`                                     | A table shows every row until the caller states a page size  |

The hook renders the calling component again on every change of the table's state and returns a new
table each time. Pass that table to `DataTable.Root`. Every other option is TanStack's own:
controlled `state` with its handlers, `initialState`, `getRowId`, `getSubRows`,
`enableRowSelection`, `getRowCanExpand`, `enableRowPinning`, `keepPinnedRows`, `manualPagination`,
`rowCount` and the rest. A grouping stated in `state` or `initialState` groups the rows whatever
`enableGrouping` is. The package exports TanStack's `SortingState`, `PaginationState`,
`ColumnFiltersState`, `ExpandedState` and `GroupingState` for a caller that keeps the state.

### Parts

| Part            | Element | What it renders                                                               |
| --------------- | ------- | ----------------------------------------------------------------------------- |
| `Root`          | `div`   | A flex column that stacks the table and its controls, and provides the table  |
| `Table`         | `div`   | The collections table's scroller around the table, its header, body, footer   |
| `Search`        | `div`   | The forms `SearchInput` on TanStack's global filter                           |
| `ColumnFilter`  | `div`   | A filter button in a column's header and its panel                            |
| `ColumnMenu`    | `div`   | A menu button in a column's header with the sort, group, pin and hide actions |
| `ColumnManager` | `div`   | The columns a person can hide, in a list they reorder, and a reset button     |
| `Pagination`    | `nav`   | The navigation `Pagination` on TanStack's page state                          |
| `PageSize`      | `div`   | The forms `NativeSelect` of page sizes, after its label                       |

`DataTable.Table` takes the collections table's axes (`variant`, `size`, `rules`, `striped`,
`radius`, `palette`, `stickyHeader`, `stickyColumn`, `align`, `banded`, `interactive` and `layout`)
and passes them to its scroller. It also takes these props, each with English words by default:

| Prop                   | Default               | What it sets                                                                 |
| ---------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `caption`              | none                  | The caption under the table, which names the table and its region            |
| `columnActions`        | none                  | The controls a column's header renders beside its name, per column           |
| `empty`                | "No rows"             | The content of the full-width row a table without rows renders               |
| `sortIndicator`        | none                  | The glyph beside a sortable column's name, pointing up                       |
| `sortedAnnouncement`   | "Sorted by Amount, …" | The announcement of a sort, from the column's name and the direction         |
| `unsortedAnnouncement` | "Not sorted"          | The announcement of a table sorted by no column                              |
| `filteredAnnouncement` | "12 of 40 rows"       | The announcement of the rows that match the filters, from both counts        |
| `resizeLabel`          | "Resize Amount"       | The name of a column's resize separator                                      |
| `resizeValue`          | "150 pixels"          | A column's size in words, the separator's `aria-valuetext`                   |
| `expandIndicator`      | none                  | The glyph in a row's toggle, pointing to the inline end                      |
| `expandLabel`          | "Expand"              | The name of the toggle of a closed row                                       |
| `collapseLabel`        | "Collapse"            | The name of the toggle of an open row                                        |
| `loadingLabel`         | "Loading…"            | The words under an open row whose sub-rows have not arrived                  |
| `windowed`             | `false`               | Whether the body renders only the rows in or near the viewport               |
| `estimateSize`         | 40                    | The height in pixels a windowed table takes for a row before measuring       |
| `overscan`             | 8                     | The rows a windowed table renders beyond each end of the viewport            |
| `onEndReached`         | none                  | Runs when a windowed table's last row comes within the overscan              |
| `grid`                 | `false`               | Whether the table is a `grid` of cells a person selects and copies           |
| `onCellEdit`           | none                  | Receives each edit a person saves in a grid cell                             |
| `editLabel`            | "Edit Amount"         | The name of a cell's editor, from its column's name                          |
| `unsaved`              | none                  | Whether a grid cell has a change the caller has not saved, by row and column |
| `unsavedLabel`         | "Unsaved change"      | The words a cell with an unsaved change renders for assistive technology     |

### Column meta

A column states these fields in `meta`:

| Field       | What it sets                                                                       |
| ----------- | ---------------------------------------------------------------------------------- |
| `numeric`   | The cells and the header align to the end, the cells in tabular figures            |
| `rowHeader` | The cells render as row headers, the `th` a screen reader names each row by        |
| `label`     | The column's name in words, which the announcements and the controls read          |
| `filter`    | The filter `ColumnFilter` offers: `text`, `select` or `range`                      |
| `fit`       | The column is as narrow as its content while the table lays out columns by content |
| `detail`    | The detail row under an expanded row. `expandColumn` sets it                       |
| `selects`   | The column's cells select their rows, and each row states `aria-selected`          |
| `edit`      | How a grid edits the column's cells. A column without it is read-only              |

### Column helpers

| Helper         | Column id | What its cells render                                                       |
| -------------- | --------- | --------------------------------------------------------------------------- |
| `selectColumn` | `select`  | A checkbox per row, named by `label(record)`, and one in the header for all |
| `expandColumn` | `expand`  | A button per row that opens a detail row under it, named by `label(record)` |
| `pinColumn`    | `pin`     | A toggle per row that pins it to the top, or to the bottom with `position`  |

Each helper's column neither sorts, filters, hides, groups nor resizes. A grid's cell selection
leaves its cells out, and a table laid out by its content fits the column to its controls. In a
table with pinned or resizable columns the select column is 60 pixels wide, and the expand and pin
columns 72 pixels. A theme or density that widens the cells spreads the definition with a larger
`size`, `minSize` and `maxSize`. A pin toggle's row moves to another region on a press, and focus
moves with it to the toggle at its new place. The negative block margin of a detail button, a pin
toggle and a row's toggle keeps a row with a button as tall as a row of text. A box one line tall
centres each checkbox and keeps a row or a header with a checkbox as tall as one with text alone.

A row's box is checked while the row or every row under it is selected, and partly checked with
`indeterminateIndicator` while some rows under it are. A row with sub-rows opens them through its
toggle, so `expandColumn` renders no detail button on it.

### Sizes and pinned columns

A table with `enableColumnResizing` or a pinned column lays out every column at its TanStack `size`,
in a fixed layout as wide as the sizes together, inside a scroller as wide as the table and never
wider than its room. A column pinned with `columnPinning` sticks to the start or the end of the
scroll region, on the panel under its row's fill. The last column of a region rules its side next to
the scrolling columns.

A resizable column's header ends in a separator:

- A pointer drags it, and a double click restores the size the column states.
- ArrowLeft and ArrowRight narrow and widen the column by 16 pixels, mirrored under right-to-left.
- Home and End set the column's `minSize` and `maxSize`. End changes nothing on a column that states
  no maximum.
- Enter restores the size the column states.

### Pinned rows, spans and totals

- A row pinned with `rowPinning` renders at the top or the bottom of the body whatever the sort, the
  filters or the page. The last row of a region another region follows rules its end at the header
  rule's width, the detail row where that row is expanded.
- A column's `spanRows: true` merges adjacent cells of equal value into one cell that spans their
  rows, and `spanColumns` spans a cell across columns. The body renders the spans and skips the
  cells they cover. A cell whose span ends on the body's last row drops its rule before a footer, as
  the last row's cells do.
- A column's `footer` renders in a footer row. A total is TanStack's aggregation: the column states
  `aggregationFn: "sum"`, and its footer renders `column.getAggregationValue()`, which follows the
  filters. A row-header column without a footer renders an empty data cell in the footer row.

### Pivots

`DataTable.pivot` turns flat records into the columns, rows and row ids of a cross-tab, which
`useDataTable` takes:

```tsx
const table = DataTable.useDataTable(
  DataTable.pivot(orders, {
    column: "quarter",
    format: { currency: "EUR", style: "currency" },
    headers: { product: "Product", region: "Region" },
    rows: ["region", "product"],
    value: "value",
  }),
);

<DataTable.Root table={table}>
  <DataTable.Table align="start" caption="Order value by region and product, per quarter" />
</DataTable.Root>;
```

| Option         | Default    | What it sets                                                               |
| -------------- | ---------- | -------------------------------------------------------------------------- |
| `rows`         | required   | The fields whose values become the rows, the outermost first               |
| `column`       | required   | The field whose values become the columns, in the order they first appear  |
| `value`        | none       | The field the built-in aggregates measure. `count` reads none              |
| `aggregate`    | `"sum"`    | `"sum"`, `"average"`, `"min"`, `"max"`, `"count"` or a function of records |
| `format`       | none       | The `Intl.NumberFormat` options every figure is written with               |
| `headers`      | the field  | Each row dimension's header, by field                                      |
| `totals`       | `true`     | Whether the table renders a totals column and a footer row                 |
| `totalLabel`   | "Total"    | The totals column's header and the footer row's name                       |
| `missingLabel` | "No value" | The words assistive technology reads in a cell with nothing to measure     |

- A cell aggregates the records of its row path and its column value. Every total is aggregated from
  the records, never from the cells. An average's total is the average of its records, which differs
  from the mean of the cells beside it when the cells aggregate different numbers of records.
- A cell without records, or whose records contain no finite figure, is empty. Assistive technology
  reads `missingLabel` in it, so it never reads as zero.
- The rows follow each dimension's first-seen order, level by level, so the rows of a group are
  adjacent, and an outer dimension's cell spans them. Every dimension's cell is a row header.
  `align="start"` puts an outer name on the line of its group's first row.
- A figure renders through the data package's `Format.Number`, in the locale in scope.
- The column ids are the dimensions' fields, `quarter:Q1` for a value's column and `total` for the
  totals column. A row's id is its path in JSON.
- The columns neither sort, group, filter nor hide. Filter the records before the pivot, because a
  total counts every record. A dimension's value is the record's text, so translate the records
  before the pivot.

### Rows with levels

A table that states `getSubRows` or groups its rows by a column renders as a `treegrid`. Each record
row states its `aria-level`, its `aria-posinset` and `aria-setsize` among its siblings, and
`aria-expanded` while it opens rows under it.

```tsx
const table = DataTable.useDataTable({
  columns,
  data: budgets,
  getRowId: (budget) => budget.centre,
  getSubRows: (budget) => budget.teams,
});

<DataTable.Table
  caption="Budgets this quarter"
  expandIndicator={<ChevronRightIcon size="1em" />}
/>;
```

- The tree column is the first visible row-header column, else the first visible column with an
  accessor. Its cells indent `spacing.6` a level below the grouping and lead with the row's toggle,
  or with an empty box of the toggle's width on a row that opens nothing.
- A column in `grouping` groups the rows by its value. Each group is a row whose grouped cell
  renders the toggle, the value and the number of records in the group, "(12)". That cell is the
  group row's row header. An aggregated cell renders the column's `aggregatedCell`, which TanStack
  writes as a string unless the column states one, so a column that formats figures states
  `aggregatedCell` as it states `cell`. Every other cell of a group row is empty. TanStack moves the
  grouped columns to the start.
- A row that `getRowCanExpand` lets open before its sub-rows exist renders a row with the feedback
  `Loader` and `loadingLabel` under it while it is open without them. Load the sub-rows in
  `onExpandedChange`, pass them back in new `data`, and state `autoResetExpanded: false`, or
  TanStack closes every row when the data changes.
- A row renders its detail only while it has no sub-rows.
- Selecting a row selects the rows under it, which is TanStack's `enableSubRowSelection`.
- A windowed table keeps the row with the tab stop rendered while it scrolls out of view, and
  renders a row out of view before a key focuses it.

`DataTable.ColumnMenu` offers "Group by column" on a column that can group while the table states
`enableGrouping`, and "Ungroup" on a column that groups the rows.

### Grids

`grid` makes a table a `grid` of cells over TanStack's cell selection, as in a spreadsheet. A table
with levels ignores it and remains a `treegrid`.

```tsx
<DataTable.Table caption="Operating budget, by department and quarter" grid />
```

- One cell is in the tab order: TanStack's focused cell, the anchor of the last range, else the
  first cell of the first row. Tab moves focus out of the grid.
- The arrow keys move the focused cell, left and right swapped under right-to-left. Home and End go
  to the row's first and last cell, Control or Meta with Home or End to the grid's first and last
  cell, and Page Up and Page Down move ten rows.
- Shift with an arrow extends the range from the focused cell and scrolls the range's moving corner
  into view. Control or Meta with A selects every cell, and Escape collapses the range to the
  focused cell. With `enableCellRangeSelection: false`, Shift with an arrow moves the focused cell.
- A press selects a cell, a drag selects the cells it crosses, Shift with a press extends the range,
  and Control or Meta with a press adds a range. These are TanStack's handlers. A press starts no
  text selection.
- A copy while a cell of the grid has focus writes the selection as tab-separated text: a tab
  between values, a line break between rows and a blank line between ranges, from TanStack's raw
  values. A text value that opens with `=`, `+`, `-` or `@` takes a leading quote, so a spreadsheet
  does not run it as a formula. A value with a tab, a line break or a quote is quoted.
- A selected cell fills with the palette's subtle role, and a line in the palette's solid runs along
  each range's outer edges.

### Editing cells

A column of a grid that states `meta.edit` edits its cells in place. `onCellEdit` receives each
value a person saves, and the caller writes it into `data`:

```tsx
const columns = column.columns([
  column.accessor("id", { header: "Claim", meta: { rowHeader: true } }),
  column.accessor("description", {
    header: "Description",
    meta: {
      edit: { validate: (text) => (text.trim() === "" ? "Enter a description" : undefined) },
    },
  }),
]);

<DataTable.Table
  caption="Expense claims"
  grid
  onCellEdit={({ rowId, value }) => {
    setClaims((claims) =>
      claims.map((claim) => (claim.id === rowId ? { ...claim, description: value } : claim)),
    );
  }}
/>;
```

- Enter, F2 and a double click open the editor with the cell's value and the caret after it. A
  character opens it with the character in place of the value, and Backspace and Delete open it
  empty.
- Tab saves and moves to the next cell, Shift with Tab to the previous one, and Escape drops the
  edit. In the text field Enter saves and moves down. An arrow moves the caret in an editor that
  Enter, F2 or a double click opened, and saves and moves in one that a character, Backspace or
  Delete opened. Focus leaving the editor saves it.
- After a key saves or drops the edit, focus returns to the grid's focused cell. Focus a person
  moves to another element remains there.
- Saving runs `validate(text, record)`. A reason keeps the editor open, with the reason under the
  cell, or above it in a body's last row, as the control's description. A valid text that differs
  from the cell's value goes to `onCellEdit` as `{ columnId, record, rowId, value }`. The value is
  text, which the caller parses.
- The editor covers the cell at the cell's size, with its text where the cell's text starts. Its
  control is a forms `Input` at the table's size unless the column states `editor`.
- In a grid with an editable column, every cell of another column states `aria-readonly`. The
  editor's control is named by `editLabel`: "Edit Description".
- `unsaved(rowId, columnId)` marks each cell whose change the caller has not saved: a bar in the
  warning palette's solid at the cell's inline start, and `unsavedLabel` after the cell's content
  for assistive technology.

`meta.edit.editor` renders another control from `DataTable.EditorProps`: the draft in `value`,
`setValue`, `commit`, `cancel`, the `id` that takes focus when the editor opens, `aria-label`,
`aria-invalid`, `aria-describedby` and the table's `size`.

```tsx
column.accessor("category", {
  header: "Category",
  meta: {
    edit: {
      editor: (props) => (
        <NativeSelect.Root size={props.size}>
          <NativeSelect.Field
            aria-label={props["aria-label"]}
            id={props.id}
            onChange={(event) => {
              props.commit(event.currentTarget.value);
            }}
            value={props.value}
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      ),
    },
  },
});
```

- A control that knows its value when a person picks it passes the value to `commit`.
- A control that handles Enter, Tab or Escape itself cancels the key's default, and the editor
  leaves the key to it.
- Focus that moves into a popup a control inside the editor names in `aria-controls` keeps the
  editor open.
- The editor renders the control as a component, so the control may call hooks.

The `DataTable` namespace exports the `CellEdit`, `EditorProps` and `CellEditEvent` types.

### Search and column filters

`DataTable.Search` filters the rows by any value through TanStack's global filter. It takes the
forms `SearchInput`'s props, so Escape clears it, and its name through `aria-label`. The table
announces the count of matching rows 500ms after the last change of the search or a filter.

`columnActions` returns the controls a column's header renders beside its name. They follow the
name, and precede it in a numeric column. A header over two or more columns renders none.

```tsx
<DataTable.Table
  caption="Recent transfers"
  columnActions={(column) => (
    <DataTable.ColumnFilter
      checkIndicator={<CheckIcon />}
      column={column}
      indicator={<ListFilterIcon size="1em" />}
    />
  )}
/>
```

`DataTable.ColumnFilter` renders a button for a column that states `meta.filter`. The button opens a
popover at size `sm` under the header's start, or its end in a numeric column. The panel is
`sizes.60` wide and named by its title, "Filter Amount", with the filter at size `sm` and a Clear
button at its end:

| `meta.filter` | Fields                                        | Filter value                 | `filterFn`                              |
| ------------- | --------------------------------------------- | ---------------------------- | --------------------------------------- |
| `text`        | A field the values contain                    | A string                     | `includesString`, TanStack's for text   |
| `select`      | A box per value, its count of rows at its end | The values checked           | `"arrHas"`, which the column states     |
| `range`       | A minimum and a maximum, extremes as hints    | Two figures, open when empty | `inNumberRange`, TanStack's for figures |

The values and the extremes come from TanStack's faceting: the rows the other filters and the search
leave. A checked value no row has any more remains in the list with a count of zero. While the
column filters, the button renders the button's on state and is named "Filter Amount, active".

### Column menus and the column manager

`DataTable.ColumnMenu` in `columnActions` renders a menu button named "Options for Amount". The menu
opens under the header's start, or its end in a numeric column, and lists only the actions that
change the column:

- The sort directions the column is not sorted in, and Clear sort while it is sorted.
- Group by column while the column can group, and Ungroup while it groups the rows.
- The regions the column is not pinned to, and Unpin while it is pinned.
- Hide column, while another column a person can hide is visible.

`actionIndicators` gives each action's row a leading glyph, by the action: `ascending`,
`descending`, `unsorted`, `grouped`, `ungrouped`, `start`, `end`, `unpinned` and `hide`. A hide
applies after the menu closes, and focus moves to the menu button of the column that takes the
hidden column's place.

`DataTable.ColumnManager` lists the columns a person can hide in the collections `Sortable`, in its
plain look. A row's box shows or hides its column, and the last visible column's box is disabled. A
person moves a column by its handle, with a pointer or with Space and the arrow keys, and each move
is announced. Reset, at the manager's end, restores the table's initial order and visibility. The
caller places the manager, such as in a disclosure `Popover`. The manager writes `columnOrder` and
`columnVisibility`.

### Pages

A table pages its rows once the caller states a page size in `initialState.pagination`.
`DataTable.Pagination` is the navigation `Pagination` root on TanStack's page state: the caller
composes its triggers, pages and page text inside it. A table that shows every row counts one page.
TanStack returns the table to its first page after a change of the filters or the sort.

`DataTable.PageSize` sets the page size from `sizes`, one of which is the table's page size. With
`label` it renders the words in a `label` before the select. Without `label`, the label of a `Field`
around the part is the select's accessible name.

```tsx
<DataTable.PageSize label="Rows per page" sizes={[10, 20, 50]} />
<DataTable.Pagination>
  <Pagination.PrevTrigger label="Previous page">
    <ChevronLeftIcon />
  </Pagination.PrevTrigger>
  <Pagination.Items />
  <Pagination.NextTrigger label="Next page">
    <ChevronRightIcon />
  </Pagination.NextTrigger>
</DataTable.Pagination>
```

A server that sorts, filters and pages the rows takes `manualSorting`, `manualFiltering` and
`manualPagination`, controlled `state` for the sort, the search and the page, and `rowCount` from
the server, from which the pagination counts the pages. Pass `aria-busy` to `DataTable.Table` while
a page loads.

### Accessibility

- A sortable column's name is a `button` inside its `th`. The `th` states `aria-sort` only while its
  column is sorted, the rule of the WAI-ARIA sortable table example. The table announces each change
  of the sort politely. It announces nothing on the first render.
- The sort glyph is hidden from assistive technology. The recipe turns it half a circle for a
  descending sort. On a column that is not sorted the glyph shows faintly while the pointer is over
  the button or the button has keyboard focus. In a column of figures the glyph comes before the
  name, so the name ends where the figures end.
- A header over two or more columns takes `scope="colgroup"`. A column outside every group renders
  one header cell across every header row.
- A resize separator is an `hr` in the tab order, the `separator` role of the WAI-ARIA window
  splitter pattern, named "Resize" and the column's name, with the size in pixels as its value. A
  header with a separator or column actions is named by the element that contains its name through
  `aria-labelledby`, so the separator's value and the actions' names are not part of the header's
  name.
- Each checkbox, detail button and pin toggle is named by its row. A detail button states
  `aria-expanded`, and `aria-controls` while its detail is open. A pin toggle states `aria-pressed`.
- Each filter and menu button is named by its column. A filter is a popover, because a menu contains
  no fields.
- A windowed table states the count of every row in `aria-rowcount` and each rendered row's place in
  `aria-rowindex`, the rule of the WAI-ARIA grid and table properties for a table with only some of
  its rows in the document. Its spacer rows are hidden from assistive technology.
- In a `treegrid` one record row is in the tab order: the row last focused, else the first. With a
  row focused, ArrowDown and ArrowUp move between the rows, Home and End go to the first and the
  last, ArrowRight opens a closed row and then moves into it, ArrowLeft closes an open row and then
  moves to its parent, and Enter and Space open and close it. The arrows swap under right-to-left. A
  focused row rings its edge inside. Controls in the cells keep their own tab stops.
- A row's toggle is out of the tab order, because the row takes its keys. A press opens or closes
  the row and focuses it. The table states `aria-multiselectable` while a column selects rows.
- In a `grid` one cell is in the tab order, and each cell a person can select states
  `aria-selected`. The table states `aria-multiselectable` unless both of TanStack's range options
  are off. The cell with keyboard focus rings its edge inside.
- The scroller of a `grid` or a `treegrid` takes no tab stop, because its cells or its rows take
  focus and scroll into view. `focusable={true}` gives it one.
- The caption is the accessible name of the table, and of the scroller's region while the table
  overflows.
- Under forced colours a selected row fills with `Highlight`, and its cells' text and rules take
  `HighlightText`, pinned cells included. A selected grid cell fills the same way, and its line
  takes `HighlightText`. An open editor takes the forced colours of a field, and an unsaved cell's
  bar takes `CanvasText`. An active filter's button fills with `Highlight`.

## Licence

MIT
