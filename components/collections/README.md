# @stealthscale/component-collections

Draws many of a thing: the lists, tables and grids that render a set of records.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component draws with `as`. A component with parts is published as a
namespace, `Table.Root`.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react` and `@stealthscale/theme`. List the preset under `./theme` among the
presets your compiler installs.

## Table

Draws a table of records.

```tsx
import { Table } from "@stealthscale/component-collections";

<Table.Scroller aria-labelledby="invoices" striped>
  <Table.Root>
    <Table.Caption id="invoices">Invoices this quarter</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader>Client</Table.ColumnHeader>
        <Table.ColumnHeader aria-sort="ascending" data-numeric>
          <Table.Sorter onClick={sortByTotal}>Total</Table.Sorter>
        </Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.RowHeader>Fathom</Table.RowHeader>
        <Table.Cell data-numeric>1,024.00</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Table.Scroller>;
```

| Axis           | Values                     | Default  |
| -------------- | -------------------------- | -------- |
| `variant`      | `line`, `outline`, `plain` | `line`   |
| `size`         | `sm`, `md`, `lg`           | `md`     |
| `align`        | `top`, `middle`, `bottom`  | `middle` |
| `layout`       | `auto`, `fixed`            | `auto`   |
| `radius`       | `l1`, `l2`, `l3`, `full`   | `l2`     |
| `striped`      | `true`                     | off      |
| `ruled`        | `true`                     | off      |
| `interactive`  | `true`                     | off      |
| `stickyHeader` | `true`                     | off      |
| `stickyColumn` | `true`                     | off      |

| Part           | Element    | What it draws                          |
| -------------- | ---------- | -------------------------------------- |
| `Scroller`     | `div`      | The box a wide table scrolls inside    |
| `Root`         | `table`    | The table                              |
| `ColumnGroup`  | `colgroup` | The declaration of the table's columns |
| `Column`       | `col`      | One column, for its width and its tint |
| `Caption`      | `caption`  | What the table is about                |
| `Header`       | `thead`    | The row of column names                |
| `Body`         | `tbody`    | The rows of figures                    |
| `Footer`       | `tfoot`    | Whatever the rows add up to            |
| `Row`          | `tr`       | One line of cells                      |
| `ColumnHeader` | `th`       | A column's name, with `scope="col"`    |
| `Sorter`       | `button`   | The control that sorts the column      |
| `RowHeader`    | `th`       | A row's name, with `scope="row"`       |
| `Cell`         | `td`       | One figure                             |

Name the scroller. Give the caption an `id` and point the scroller's `aria-labelledby` at it. The
scroller is reachable by a keyboard, and a focusable box with no name is announced as nothing.

Write a column's name in `ColumnHeader` and a row's in `RowHeader`. A screen reader reading across a
row then names each cell by its column and by its row.

Set `stickyHeader` and `stickyColumn` together for a cross-tab. The corner cell pins to both edges.

State `data-numeric` on a cell and its header for a column of figures. The cell sets itself in
tabular figures against its end, so the numbers line up at the decimal point.

Set `interactive` and put a real link in a cell for rows a reader presses. The row lights up under
the pointer and the keyboard alike.

`Table.Sorter` draws the control and reports the press. State `aria-sort` on the column header.
Sorting, filtering and pagination are the page's: drive these parts from a headless table library.

Declare the columns in `Table.ColumnGroup` for a table with `layout="fixed"`. A browser reads a
`col`'s width, background, border and visibility and ignores everything else, so tint and size a
column there and style it from its cells.

## Listbox

Draws a list of rows a person picks from, with the keys the ARIA pattern calls for. Composed as
`Listbox.Root` holding `Listbox.Content`.

```tsx
import { Listbox, useFilter, useListCollection } from "@stealthscale/component-collections";

const filter = useFilter();
const { collection, narrow } = useListCollection({
  filter: filter.contains,
  itemToString: (client) => client.name,
  itemToValue: (client) => client.id,
  rows: clients,
});

<Listbox.Root collection={collection} selectionMode="multiple">
  <Listbox.Label>Clients</Listbox.Label>
  <Listbox.Input onChange={(event) => narrow(event.target.value)} />
  <Listbox.Content>
    {collection.items.map((client) => (
      <Listbox.Item item={client} key={client.id}>
        <Listbox.ItemText item={client}>{client.name}</Listbox.ItemText>
        <Listbox.ItemIndicator item={client} />
      </Listbox.Item>
    ))}
  </Listbox.Content>
</Listbox.Root>;
```

| Axis        | Values                | Default |
| ----------- | --------------------- | ------- |
| `highlight` | `bar`, `fill`, `tint` | `tint`  |
| `radius`    | `l1`, `l2`, `l3`      | `l1`    |
| `size`      | `sm`, `md`, `lg`      | `md`    |
| `variant`   | `plain`, `surface`    | `plain` |

`highlight` marks the row the keys are on rather than the row that has focus, because a listbox
driven from a field never moves focus off the field. `tint` fills the row faintly, `fill` fills it
solidly, and `bar` draws a rule down its leading edge.

The machine writes every role, every identifier and every key. Arrow keys move the highlight, typing
jumps to a row, and `selectionMode` decides whether Enter and Space pick one row or many. Every part
is a `div`: a listbox is a grouping for a screen reader rather than a list of items, and `role` says
so on its own.

Rows go in through `collection`, which is what `useListCollection` answers. Nothing about narrowing
lives in the component.

## useListCollection and useFilter

Keeps the rows a list draws and narrows them to what has been typed.

```tsx
const filter = useFilter({ sensitivity: "base" });
const { collection, narrow } = useListCollection({
  filter: filter.contains,
  itemToString: (client) => client.name,
  itemToValue: (client) => client.id,
  rows: clients,
});
```

`useFilter` answers `contains`, `startsWith` and `endsWith`, each built on `Intl.Collator`, so
`Jose` matches `José` and `strasse` matches `Straße`. The default sensitivity ignores case and
accents, which is what a person typing into a search field expects.

`useListCollection` holds the rows and the text typed and answers what is left of them. Pass
`filter` to match on the words a reader sees, or write your own predicate to match on anything the
row holds. `narrow("")` restores every row.

## Licence

MIT. See [LICENSE](LICENSE).
