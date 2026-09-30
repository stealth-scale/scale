# @stealthscale/component-collections

React components that render a set of records, styled by the theme's recipes.

| Component                        | Renders                                                |
| -------------------------------- | ------------------------------------------------------ |
| `Table`                          | A table of records                                     |
| `Listbox`                        | A list of rows a person selects from                   |
| `StatusMatrix`                   | A grid of states, one row per item                     |
| `Transfer`                       | Two lists and the controls that move rows between them |
| `DataList`                       | Pairs of a label and a value                           |
| `Timeline`                       | Entries in the order they happened, along a rail       |
| `TreeView`, `TreeCollection`     | Nested rows that open and close, walked by the keys    |
| `Sortable`                       | Rows a person drags into another order                 |
| `useListCollection`, `useFilter` | The rows of a list, filtered by typed text             |

Every value a theme can change is an axis of a component's recipe. Set it as a prop, and write no
style. Change the element a component renders with `as`. A component with parts is exported as a
namespace, such as `Table.Root`.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react`, `react-dom`, `@stealthscale/hooks`, `@stealthscale/theme` and
`@stealthscale/component-primitives`. It depends on dnd-kit 0.5.0 (`@dnd-kit/abstract`,
`@dnd-kit/dom`, `@dnd-kit/helpers` and `@dnd-kit/react`), pinned exactly, for `Sortable`, and on
`@stealthscale/component-actions` for its handle. List the preset under `./theme` among the presets
your compiler installs. Add the primitives package's preset, which styles the scroll areas of the
table, the listbox and the board, and the actions package's preset, which styles the handle.

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

| Part           | Element    | What it renders                                       |
| -------------- | ---------- | ----------------------------------------------------- |
| `Scroller`     | `div`      | The box around the table's scroll area, with variants |
| `Root`         | `table`    | The table                                             |
| `ColumnGroup`  | `colgroup` | The column declarations                               |
| `Column`       | `col`      | One column's width                                    |
| `Caption`      | `caption`  | The table's name, under the table                     |
| `Header`       | `thead`    | The header rows                                       |
| `Body`         | `tbody`    | A group of body rows                                  |
| `Footer`       | `tfoot`    | The total row                                         |
| `Row`          | `tr`       | One row                                               |
| `ColumnHeader` | `th`       | A column's name                                       |
| `Sorter`       | `button`   | The button that sorts a column, inside its header     |
| `RowHeader`    | `th`       | A row's name                                          |
| `Cell`         | `td`       | One value                                             |
| `Simple`       | `div`      | A whole table composed from the parts                 |

- `Table.Simple` takes `caption`, `columns`, `rows`, `rowToKey`, `total`, `empty`, `groupBy`,
  `groupLabel` and `onSort`, beside every prop of the scroller.
- A column states `key`, `label`, `cell`, `numeric`, `rowHeader`, `width`, `sorted` and `sortLabel`.
  A column with `columns` in place of `key` spans the columns under it and adds a header row.
- The scroller receives the variants. A composed table sets them on `Table.Scroller`.
- The table scrolls in both axes in the primitives package's scroll area inside the scroller, under
  the theme's thin bars. While the table overflows, the area's viewport is a `region` in the tab
  order, so a keyboard can scroll it, and the scroller draws the focus ring. `Table.Simple` names
  the region from `caption`. A composed table gives `Table.Caption` an `id` and passes
  `aria-labelledby` to `Table.Scroller`, which sets it on the viewport.
- `focusable={false}` on `Table.Scroller` keeps the viewport out of the tab order, for a table whose
  cells take focus, such as a grid with one roving tab stop. Focus on a cell scrolls the cell into
  view.
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
  cell sticks to both edges, above the header and the column. Both stick to the scroll area's
  viewport.
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
| `Content`         | `div`    | The scroll area whose viewport is the `listbox`       |
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
- Under forced colors a selected row fills with `Highlight` in every `selected` look but `none`. Its
  text, description, checkbox and highlight line read `HighlightText`. A list with `selected="none"`
  shows the state in its checkboxes.
- The rows scroll in the primitives package's scroll area, with the theme's thin bar. Its viewport
  is the `listbox`, so the element that has focus is the element that scrolls, and the machine
  scrolls a row the keys highlight into view by the least distance. The focus ring is inside the
  list's edge. `Content` takes no `as`, and its props go to the `listbox`.
- The root states `boxed` and the marks once. A boxed list renders a checkbox at every row's start
  and defaults `selected` to `none`. Otherwise a selected row renders its mark at its end.
- A row centres its checkbox, icon and mark on its height, and takes the inset scale at both ends.
- Filtering is the caller's: the field reports the text, and the caller passes the collection
  `useListCollection` returns.
- `Listbox.Input autoHighlight` highlights the first row of each filtered collection while the field
  has text, so Enter chooses the best match. The command palette sets it.
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

## DataList

`DataList` renders pairs of a label and a value as a description list: the details beside a record,
a summary panel or a settled form.

```tsx
import { DataList } from "@stealthscale/component-collections";
import { Badge } from "@stealthscale/component-data";

<DataList.Root divided orientation="horizontal" size="sm">
  <DataList.Item>
    <DataList.ItemLabel>Account</DataList.ItemLabel>
    <DataList.ItemValue>Bridge Ledger</DataList.ItemValue>
  </DataList.Item>
  <DataList.Item>
    <DataList.ItemLabel>State</DataList.ItemLabel>
    <DataList.ItemValue>
      <Badge palette="success">Settled</Badge>
    </DataList.ItemValue>
  </DataList.Item>
</DataList.Root>;
```

| Axis          | Values                   | Default    |
| ------------- | ------------------------ | ---------- |
| `orientation` | `vertical`, `horizontal` | `vertical` |
| `size`        | `sm`, `md`, `lg`         | `md`       |
| `variant`     | `subtle`, `bold`         | `subtle`   |
| `divided`     | `true`                   | off        |

| Part        | Element | What it renders                     |
| ----------- | ------- | ----------------------------------- |
| `Root`      | `dl`    | The list, with the variants         |
| `Item`      | `div`   | One pair                            |
| `ItemLabel` | `dt`    | The label, a row of words and marks |
| `ItemValue` | `dd`    | The value, words or components      |

- `vertical` sets each label above its value. `horizontal` lays the pairs on two columns, so every
  value starts at the same position: the widest label's width, capped at 40% of the list.
- `size` sets the text one size smaller than the list, 12.6, 14.2 and 16px, and the gaps with it: 8,
  12 and 16px between the pairs, and 12, 16 and 24px between the columns.
- `subtle` mutes the label, so the value reads first. `bold` sets the label in the label weight and
  mutes the value.
- `divided` renders a hairline between the pairs, as far from each pair as the gap between them.
- A value wraps at any character, so a long identifier never widens the list. A label and a value
  are rows with a gap, so a control or a mark beside the words is centred on their line.
- The list has no `palette` and no `effect` axis, because it has no color and no box of its own.

## Timeline

`Timeline` renders entries in the order they happened, such as a history, an order's shipping or an
activity feed. It is an ordered list, and each entry places an indicator on a rail beside its words.

```tsx
import { Timeline } from "@stealthscale/component-collections";

<Timeline.Root>
  <Timeline.Item>
    <Timeline.Connector>
      <Timeline.Indicator>1</Timeline.Indicator>
    </Timeline.Connector>
    <Timeline.Content>
      <Timeline.Title>Offer raised</Timeline.Title>
      <Timeline.Description>Tuesday</Timeline.Description>
    </Timeline.Content>
  </Timeline.Item>
</Timeline.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`, `xl`                                             | `md`      |
| `variant` | `solid`, `subtle`, `outline`, `plain`                              | `solid`   |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |
| `rail`    | `start`, `center`, `end`                                           | `start`   |
| `ongoing` | `true`                                                             | off       |

| Part          | Element | What it renders                                           |
| ------------- | ------- | --------------------------------------------------------- |
| `Root`        | `ol`    | The list, a grid of three columns                         |
| `Item`        | `li`    | One entry, a row across the three columns                 |
| `Connector`   | `div`   | The rail's cell, which contains the indicator             |
| `Indicator`   | `span`  | A number, an icon or an empty circle, hidden from readers |
| `Content`     | `div`   | The words on one side of the rail                         |
| `Title`       | `div`   | The headline, a row that wraps                            |
| `Description` | `div`   | The supporting text, in the muted ink                     |

- A `Content` written before the `Connector` goes on the side before the rail and aligns to it. One
  written after goes on the side after the rail.
- Each entry is a row of the root's grid, so the words before the rail line up down the list at the
  widest entry's width. `start` sizes them to their words, `center` gives both sides an equal share,
  and `end` puts the rail at the end.
- The indicator is 16, 20, 24 and 32px from `sm` to `xl`. A one-line title is as tall as the
  indicator and centred on it, and the words are 8, 12, 12 and 16px from it.
- `solid` fills the indicator in the palette's solid, `subtle` tints it, `outline` rings it and
  `plain` leaves the panel's ground. Every look is opaque and ringed in `bg.panel`, so the rail
  never runs through an indicator.
- The rail stops at the last indicator. `ongoing` draws it past, for a run that has not finished.
- The indicator is `aria-hidden`, because the list's order numbers the entries and an icon repeats
  the title. State what an entry means in its words.
- The timeline has no `effect` axis, because its indicators are marks in a list rather than a box a
  reader acts on.

## TreeView

`TreeView` renders nested rows that open and close, such as a file tree, a documentation index or a
set of permissions. The tree reads a `TreeCollection`, and `TreeView.Nodes` calls a function that
renders each node's row from the node and its state.

```tsx
import { TreeCollection, TreeView } from "@stealthscale/component-collections";

const files = new TreeCollection<File>({
  nodeToString: (node) => node.name,
  nodeToValue: (node) => node.id,
  rootNode,
});

<TreeView.Root collection={files} defaultExpandedValue={["src"]}>
  <TreeView.Label>Files</TreeView.Label>
  <TreeView.Tree>
    <TreeView.Nodes
      render={({ node, nodeState }: TreeView.NodeDetails<File>) =>
        nodeState.isBranch ? (
          <TreeView.BranchControl>
            <TreeView.BranchIndicator>
              <ChevronRightIcon />
            </TreeView.BranchIndicator>
            <TreeView.BranchText>{node.name}</TreeView.BranchText>
          </TreeView.BranchControl>
        ) : (
          <TreeView.Item>
            <TreeView.ItemText>{node.name}</TreeView.ItemText>
          </TreeView.Item>
        )
      }
    />
  </TreeView.Tree>
</TreeView.Root>;
```

| Axis       | Values                                                             | Default   |
| ---------- | ------------------------------------------------------------------ | --------- |
| `size`     | `sm`, `md`, `lg`                                                   | `md`      |
| `selected` | `subtle`, `solid`, `plain`                                         | `subtle`  |
| `palette`  | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | inherited |
| `effect`   | `glow`                                                             | none      |

| Part                | Element      | What it renders                                            |
| ------------------- | ------------ | ---------------------------------------------------------- |
| `Root`              | `div`        | The label and the tree, which starts the machine           |
| `Label`             | `div`        | The words that name the tree                               |
| `Tree`              | `div`        | The element with the `tree` role, which handles the keys   |
| `Nodes`             | none         | Every node, with a group around an open branch's children  |
| `BranchControl`     | `div`        | A branch's row, with the `treeitem` role                   |
| `BranchTrigger`     | `span`       | The part of a branch's row that opens it without selecting |
| `BranchIndicator`   | `span`       | The mark that turns a quarter as the branch opens          |
| `BranchText`        | `span`       | A branch's text                                            |
| `BranchIndentGuide` | `div`        | The line down an open branch's children                    |
| `Item`              | `div` or `a` | An item's row, with the `treeitem` role                    |
| `ItemText`          | `span`       | An item's text                                             |
| `ItemIndicator`     | `span`       | The mark at the end of a selected item's row               |
| `NodeCheckbox`      | `span`       | The box that shows a node's check                          |
| `NodeRenameInput`   | `input`      | The field that replaces a row's text while it is renamed   |

- The focusable row has the tree semantics: the `treeitem` role, `aria-level`, `aria-posinset`,
  `aria-setsize`, and `aria-expanded`, `aria-selected`, `aria-disabled` and `aria-busy` where they
  apply. A screen reader announces them on the row that has focus.
- The tree takes its name from `TreeView.Label` while the label is mounted. Without one, pass
  `aria-label` to `TreeView.Tree`.
- The arrows move focus, ArrowRight opens a branch and moves into it, ArrowLeft closes a branch or
  moves to its parent, Home and End move to the ends, `*` opens the siblings of the focused branch,
  and a typed letter moves to the next row that starts with it. Enter and Space select.
- A focused row shows its ring while the last input was a key. It sets `data-focus-visible`, which
  the ring's condition matches in every browser. Firefox keeps `:focus-visible` off a focus that a
  script moves after a press.
- Rows measure 24, 32 and 40px from `sm` to `lg`. Each level indents one mark and one gap, so a
  child's indicator is under its parent's icon. An item reserves the column of a branch's indicator,
  so the texts of one level start at one x.
- `subtle` fills a selected row with the palette's subtle role, which measures 1.2:1 against a card,
  and sets its text in medium weight. `solid` fills it with the palette's solid color, and `plain`
  sets the medium weight alone. Under forced colors a selected row fills with `Highlight`.
- `selectionMode="multiple"` lets Ctrl or Cmd with a press add a row, and Shift with a press or an
  arrow extend the selection.
- `checkable` puts `aria-checked` on every row, and Space toggles the check in place of selecting. A
  branch is checked while every node under it is, and partly checked while some are.
  `TreeView.NodeCheckbox` shows the check and toggles it under a pointer.
- An `Item` with an `href` renders an `a`, which follows its address on a press and on Enter.
- A branch whose node declares `childrenCount` loads its children through `loadChildren` when it
  first opens, and reports `aria-busy` meanwhile. Keep the collection `onLoadChildrenComplete`
  returns.
- With `canRename`, F2 opens `TreeView.NodeRenameInput` on the focused row. Enter keeps the new name
  and Escape cancels. Replace the node in your collection in `onRenameComplete`.
- `expandOnClick={false}` makes a press on a row select it alone, and `TreeView.BranchTrigger` opens
  it. A collapsed branch renders no group, so its rows are not in the document.
- `TreeCollection` is the engine's own class. Its `filter`, `replace`, `remove`, `insertAfter` and
  `insertBefore` return a new collection, which you pass to the root in place of the old one.

## Sortable

`Sortable` renders rows a person drags into another order, in one list or in the lists of a board.
It is built on dnd-kit, and a person drags each row by its handle, with the pointer or the keys.

```tsx
import { GripVerticalIcon } from "lucide-react";

import { Sortable } from "@stealthscale/component-collections";

<Sortable.Root
  canMove={(card, from, to) => from !== "todo" || to !== "done"}
  items={columns}
  onItemMove={save}
  onItemsChange={setColumns}
>
  <Sortable.Board>
    {lists.map((list) => (
      <Sortable.List key={list.id} label={list.title} limit={list.limit} value={list.id}>
        <Sortable.Items>
          {columns[list.id].map((card, index) => (
            <Sortable.Item index={index} key={card.id} label={card.title} value={card.id}>
              <Sortable.Handle>
                <GripVerticalIcon />
              </Sortable.Handle>
              <Sortable.ItemContent>{card.title}</Sortable.ItemContent>
            </Sortable.Item>
          ))}
        </Sortable.Items>
        <Sortable.Empty>No cards yet.</Sortable.Empty>
      </Sortable.List>
    ))}
  </Sortable.Board>
</Sortable.Root>;
```

The recipe has no axes.

| Part          | Element  | What it renders                                                   |
| ------------- | -------- | ----------------------------------------------------------------- |
| `Root`        | `div`    | dnd-kit's provider around the lists, with the hidden instructions |
| `Board`       | `div`    | A board's lists in a row that scrolls sideways                    |
| `List`        | `div`    | One list of a board, a drop target as a whole                     |
| `Items`       | `ul`     | A list's rows                                                     |
| `Item`        | `li`     | One row                                                           |
| `Handle`      | `button` | The actions `Button` a drag starts from                           |
| `ItemContent` | `div`    | A row's words and marks, which take the rest of the row           |
| `Empty`       | `div`    | A list's message while it has no row, outside the `ul`            |

- The root is controlled. `items` is an array for one list, or a record of a board's lists keyed by
  their ids. `onItemsChange` reports the items to render after a drop, a move into another list
  during a drag, a cancel and a move without a drag. `onItemMove` reports each finished move once,
  from the place the item left to the place it took.
- An item's id is unique across the lists and differs from every list's id, because dnd-kit keeps
  one registry of drop targets.
- A list's `limit` refuses an item from another list while the list has that many items.
  `canMove(item, from, to)` refuses a move from the list the item was picked up from. A refusing
  list sets `data-refuses` while the dragged item is over it, and the recipe dashes its edge in the
  error ink. A drop on it puts the item back.
- A handle is named `Move <row>` by default, with the role description `sortable` and the
  instructions as its description. Space or Enter lifts the row, the arrow keys move it, Space or
  Enter drops it, and Escape puts it back. A mouse drags the row from its handle at once, and a
  finger after 250ms.
- The kit announces a pick-up, each place a drag passes, a refusal and a drop in dnd-kit's live
  region. `liftedLabel`, `movedLabel`, `droppedLabel` and `cancelledLabel` write a sentence from the
  item, its position, its list's count and, on a board, the list's name. `fullLabel` and
  `refusedLabel` write a refusal. `handleLabel`, `roleDescription` and `instructions` set the
  handle's words. Each word defaults to English.
- `Sortable.useMove()` inside the root, or a render function among its children, returns
  `move(id, { index, list })`, which moves an item without a drag. The move follows the drag's rules
  and reports as a drop does. It is announced, and it returns whether the list took the item. A row
  menu with "Move up" and "Move down" gives a person who cannot drag the same result (WCAG 2.5.7).
- A `disabled` row renders an inert box of the handle's size in place of its handle, and dnd-kit
  neither lifts it nor drops another row on it.
- The dragged row is dnd-kit's element in the top layer with the large shadow, and the place it will
  take is a dashed slot.
- A board's lists are 15 to 20rem wide and share the board's width. The board scrolls sideways in
  the primitives package's scroll area once the lists are wider.
- The package does not include icons. Pass the handle's glyph.

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
