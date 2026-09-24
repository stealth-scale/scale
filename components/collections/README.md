# @stealthscale/component-collections

React components that render a set of records, styled by the theme's recipes.

| Component                        | Renders                                                |
| -------------------------------- | ------------------------------------------------------ |
| `Table`                          | A table of records                                     |
| `Listbox`                        | A list of rows a person selects from                   |
| `StatusMatrix`                   | A grid of states, one row per item                     |
| `Transfer`                       | Two lists and the controls that move rows between them |
| `useListCollection`, `useFilter` | The rows of a list, filtered by typed text             |

Every value a theme can change is an axis of a component's recipe. Set it as a prop, and write no
style. Change the element a component renders with `as`. A component with parts is exported as a
namespace, such as `Table.Root`.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react` and `@stealthscale/theme`. List the preset under `./theme` among the
presets your compiler installs.

## Table

`Table` renders a table of records with the semantics of the HTML table. `Table.Simple` renders a
whole table from a list of columns and a list of rows.

```tsx
import { ArrowDownIcon } from "lucide-react";

import { Table } from "@stealthscale/component-collections";

<Table.Simple
  caption="Payouts raised this quarter"
  columns={[
    { key: "name", label: "Account", rowHeader: true },
    {
      key: "amount",
      label: (
        <>
          Amount <ArrowDownIcon aria-hidden size="1em" />
        </>
      ),
      numeric: true,
      sorted: "descending",
      sortLabel: "Sort by amount",
    },
  ]}
  onSort={sortBy}
  rows={accounts}
  rowToKey={(account) => account.id}
  total={(column) => totals[column.key]}
  variant="surface"
/>;
```

| Axis           | Values                                                            | Default  |
| -------------- | ----------------------------------------------------------------- | -------- |
| `variant`      | `surface`, `plain`                                                | `plain`  |
| `size`         | `sm`, `md`, `lg`                                                  | `md`     |
| `align`        | `start`, `center`, `end`                                          | `center` |
| `layout`       | `auto`, `fixed`                                                   | `auto`   |
| `radius`       | `l1`, `l2`, `l3`                                                  | `l2`     |
| `rules`        | `rows`, `all`, `none`                                             | `rows`   |
| `palette`      | `primary`, `secondary`, `accent`, `neutral` and the four statuses | none     |
| `striped`      | `true`                                                            | off      |
| `banded`       | `true`                                                            | off      |
| `interactive`  | `true`                                                            | off      |
| `stickyHeader` | `true`                                                            | off      |
| `stickyColumn` | `true`                                                            | off      |

| Part           | Element    | What it renders                                        |
| -------------- | ---------- | ------------------------------------------------------ |
| `Scroller`     | `div`      | The box a wide table scrolls inside, with the variants |
| `Root`         | `table`    | The table                                              |
| `ColumnGroup`  | `colgroup` | The column declarations                                |
| `Column`       | `col`      | One column's width                                     |
| `Caption`      | `caption`  | The table's name, under the table                      |
| `Header`       | `thead`    | The header rows                                        |
| `Body`         | `tbody`    | A group of body rows                                   |
| `Footer`       | `tfoot`    | The total row                                          |
| `Row`          | `tr`       | One row                                                |
| `ColumnHeader` | `th`       | A column's name                                        |
| `Sorter`       | `button`   | The button that sorts a column, inside its header      |
| `RowHeader`    | `th`       | A row's name                                           |
| `Cell`         | `td`       | One value                                              |
| `Simple`       | `div`      | A whole table composed from the parts                  |

- `Table.Simple` takes `caption`, `columns`, `rows`, `rowToKey`, `total`, `empty`, `groupBy`,
  `groupLabel` and `onSort`, beside every prop of the scroller.
- A column states `key`, `label`, `cell`, `numeric`, `rowHeader`, `width`, `sorted` and `sortLabel`.
  A column with `columns` in place of `key` spans the columns under it and adds a header row.
- The scroller receives the variants. A composed table sets them on `Table.Scroller`.
- While the table overflows, the scroller takes `role="region"` and `tabIndex={0}`, so a keyboard
  can scroll it. `Table.Simple` names the scroller from `caption`. A composed table gives
  `Table.Caption` an `id` and points the scroller's `aria-labelledby` at it.
- A column of figures states `data-numeric` on its cells and its header, and `Table.Simple` sets it
  from `numeric`. The cells align to their end in tabular figures.
- Sorting, filtering and pagination are the caller's. `Table.Sorter` reports the press, the column
  header states `aria-sort`, and the caller passes the sorted rows. The package does not include
  icons, so put the direction mark in the column's label.
- `interactive` fills a row under the pointer and while a link inside it has focus. Put a real link
  in a cell for a row a person opens.
- A row with `aria-selected="true"` fills with the palette's subtle fill. Forced colours fill it
  with `Highlight`.
- A sticky header needs a maximum height on the scroller. A sticky column needs a table wider than
  the scroller, so declare the column widths and set `layout="fixed"`. With both set, the corner
  cell sticks to both edges, above the header and the column.
- `variant="surface"` does not cast a shadow. After dark a shadow adds a rim inside the edge, and a
  stripe, a filled row or a sticky cell at the edge covers the rim.

## Listbox

`Listbox` renders a list of rows a person selects from, with the keyboard interaction of the ARIA
listbox pattern. `Listbox.Simple` renders a whole list from props.

```tsx
import { CheckIcon, XIcon } from "lucide-react";

import { Listbox, useFilter, useListCollection } from "@stealthscale/component-collections";

const filter = useFilter();
const { collection, narrow } = useListCollection({
  filter: filter.contains,
  itemToString: (client) => client.name,
  itemToValue: (client) => client.id,
  rows: clients,
});

<Listbox.Simple
  collection={collection}
  description={(client) => client.terms}
  empty="No client matches."
  label="Clients"
  mark={<CheckIcon size="100%" />}
  narrowing={{
    clearIndicator: <XIcon size="100%" />,
    clearLabel: "Clear the filter",
    onNarrow: narrow,
    placeholder: "Filter clients",
  }}
  variant="surface"
/>;
```

| Axis          | Values                                                            | Default    |
| ------------- | ----------------------------------------------------------------- | ---------- |
| `variant`     | `surface`, `plain`                                                | `plain`    |
| `size`        | `sm`, `md`, `lg`                                                  | `md`       |
| `selected`    | `none`, `plain`, `solid`, `subtle`                                | `subtle`   |
| `highlight`   | `bar`, `fill`, `tint`                                             | `tint`     |
| `palette`     | `primary`, `secondary`, `accent`, `neutral` and the four statuses | none       |
| `effect`      | `glow`                                                            | none       |
| `radius`      | `l1`, `l2`, `l3`                                                  | `l1`       |
| `orientation` | `vertical`, `horizontal`                                          | `vertical` |
| `columns`     | `1` to `12`                                                       | none       |

| Part              | Element  | What it renders                                       |
| ----------------- | -------- | ----------------------------------------------------- |
| `Root`            | `div`    | The root, and the machine its parts share             |
| `Label`           | `span`   | The list's label                                      |
| `Frame`           | `div`    | The box around the field, the rows and the empty text |
| `Input`           | `input`  | The filter field and its clear control                |
| `SelectAll`       | `button` | The row that selects every row                        |
| `Content`         | `div`    | The list, with `role="listbox"`                       |
| `Item`            | `div`    | One row, with `role="option"`                         |
| `ItemCheckbox`    | `span`   | The checkbox at a row's start                         |
| `ItemLines`       | `span`   | The column of a row's text and description            |
| `ItemText`        | `span`   | A row's text                                          |
| `ItemDescription` | `span`   | A row's description                                   |
| `ItemIndicator`   | `span`   | The mark at a selected row's end                      |
| `ItemGroup`       | `div`    | A group of rows, with `role="group"`                  |
| `ItemGroupLabel`  | `span`   | A group's label                                       |
| `Empty`           | `span`   | The text of an empty list                             |
| `ValueText`       | `span`   | The selected rows' text                               |
| `Window`          | `div`    | The rows of a long list near the viewport             |
| `Row`             | `div`    | A ready-made row composed from the item parts         |
| `Simple`          | `div`    | A whole list composed from the parts                  |

- `Listbox.Simple` takes `label`, `narrowing`, `selectAll`, `description`, `icon`, `groupBy`,
  `groupLabel`, `empty`, `summary` and `tall`, beside every prop of the root.
- The machine sets every role, identifier and key. The arrow keys move the highlight, typing moves
  it to a matching row, and `selectionMode` is `single`, `multiple` or `extended`.
- Focus stays on the list or on the filter field, and `highlight` marks the highlighted row.
  `selected` sets the fill of a selected row.
- The root states `boxed` and the marks once. A boxed list renders a checkbox at every row's start
  and defaults `selected` to `none`. Otherwise a selected row renders its mark at its end.
- A row centres its checkbox, icon and mark on its height, and takes the inset scale at both ends.
- Filtering is the caller's: the field reports the text, and the caller passes the collection
  `useListCollection` returns.
- `tall` sets the list's height in rows and renders only the rows near the viewport, so a list of
  ten thousand rows renders about twenty.
- The package does not include icons. Pass the marks and the clear icon.

## StatusMatrix

`StatusMatrix` renders the state of one set of items against another, with a mark at every crossing,
a column with each row's worst state, and a legend. It is built from the table's parts.

```tsx
import { CheckIcon, CircleDashedIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { StatusMatrix } from "@stealthscale/component-collections";

<StatusMatrix
  caption="Service health by region"
  cells={[
    { column: "EU", row: "checkout-api", state: "fine" },
    { column: "US", row: "checkout-api", state: "down" },
  ]}
  columns={[
    { id: "EU", label: "EU" },
    { id: "US", label: "US" },
  ]}
  corner="Service"
  legend="States"
  rollup="Worst"
  rows={[{ group: "Payments", id: "checkout-api", label: "checkout-api" }]}
  states={{
    down: { label: "Down", mark: <XIcon />, tone: "error" },
    fine: { label: "Healthy", mark: <CheckIcon />, tone: "success" },
    slow: { label: "Degraded", mark: <TriangleAlertIcon />, tone: "warning" },
  }}
  unmeasured={{ label: "Not measured", mark: <CircleDashedIcon />, tone: "neutral" }}
  variant="surface"
/>;
```

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

- The scroller takes the table's axes, such as `variant`, `rules` and `radius`. `size` sets both the
  table and the marks.
- `cells` is sparse. A pair without a cell renders `unmeasured`, and the later of two cells for one
  pair applies.
- `rollup` adds a last column with each row's worst state. From worst to best the rank is error,
  warning, a gap, info, success and neutral, so a row with an unmeasured crossing never rolls up to
  a pass.
- A state's `tone` sets its palette. A state without `mark` renders a filled dot, so give two states
  with one tone a mark each.
- Rows with `group` render one `tbody` per group under a `scope="rowgroup"` heading. The matrix
  renders groups only when every row has one.
- The crosshair fills the row and the column under the pointer with `bg.subtle`.
- Without `onSelectCell` the matrix has no tab stop. With it every crossing is a button, a gap
  included. Pass `cellLabel` to name each button by its row and column.
- `legend` names the list of states under the grid, with `unmeasured` last.
- The package does not include icons. Pass each state's mark.

## Transfer

`Transfer` renders two lists and the controls that move checked rows between them. Each side is a
boxed listbox with multiple selection.

```tsx
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Transfer } from "@stealthscale/component-collections";

<Transfer
  giveBackLabel="Move the checked rows back"
  giveBackMark={<ChevronLeftIcon size="100%" />}
  itemToString={(client) => client.name}
  itemToValue={(client) => client.id}
  mark={<CheckIcon size="100%" />}
  nothing="No clients here"
  offeredTitle="Available"
  onValueChange={setChosen}
  rows={clients}
  takeLabel="Move the checked rows across"
  takeMark={<ChevronRightIcon size="100%" />}
  takenTitle="Chosen"
  value={chosen}
/>;
```

| Axis      | Values                                                            | Default |
| --------- | ----------------------------------------------------------------- | ------- |
| `size`    | `sm`, `md`, `lg`                                                  | `md`    |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | none    |

- `value` and `onValueChange` control the set of moved rows, and `defaultValue` sets it once. The
  checked rows on each side are the transfer's own state.
- A control is disabled while no row on its side is checked. A move clears the checked rows of the
  side it moves them from.
- Both sides take an equal share of the width, and the height of the taller side with a floor of
  every row's height, so the layout does not move as rows cross.
- `description` adds a second line to each row. `palette` sets the palette of both lists.
- `takeLabel` and `giveBackLabel` name the controls, because their content is a mark without text.
- The package does not include icons. Pass the marks.

## useListCollection and useFilter

`useListCollection` keeps a list's rows and narrows them to the typed text. `useFilter` returns the
functions that match a row's text.

```tsx
const filter = useFilter({ sensitivity: "base" });
const { collection, narrow } = useListCollection({
  filter: filter.contains,
  itemToString: (client) => client.name,
  itemToValue: (client) => client.id,
  rows: clients,
});
```

- `useFilter` returns `contains`, `startsWith` and `endsWith`, each built on `Intl.Collator`, so
  `Jose` matches `José` and `strasse` matches `Straße`. The default sensitivity ignores case and
  accents.
- `useListCollection` returns the collection of matching rows and `narrow`, which sets the text.
  `narrow("")` restores every row.
- Pass `filter` to match on the text a reader sees, or pass a predicate of your own to match on any
  field of the row.

## Licence

MIT. See [LICENSE](LICENSE).
