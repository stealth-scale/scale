# @stealthscale/component-screen

Lays out an application's screen: the shell around everything, the page inside it, the sections of a
page, the sidebar of destinations, the switcher at the head of a sidebar and the toolbar over a
table. Every component takes its styles from a recipe, so a theme restyles all six by extending the
recipes. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change is an axis of a recipe, so a caller sets it as a prop and writes no
style. A caller changes the element a component renders with `as`.

## Install

```bash
pnpm add @stealthscale/component-screen
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/provider-viewport`. An
application lists the preset under `./theme` among the presets its compiler installs.

## Folding

A component folds on its own width, not on the window's. It compares its element's width with the
width a breakpoint starts at and writes `data-narrow`, which the recipes select on. A page beside an
open sidebar folds on the width the sidebar leaves it, and a caller does not write a breakpoint or a
media query. Before the element is laid out, and where the browser does not report a size, the
viewport's width decides, so a phone never lays out wide first.

A row of actions folds by priority. Each action sets `priority`:

| `priority`  | On a wide row  | On a narrow row                                    |
| ----------- | -------------- | -------------------------------------------------- |
| `primary`   | Icon and label | Icon and label                                     |
| `secondary` | Icon and label | Icon, with the label hidden visually               |
| `tertiary`  | Icon and label | Removed from the document, listed in a folded menu |

A secondary action keeps its label for screen readers. A control needs an accessible name. A
tertiary action is removed from the document and from the tab order.

## AppShell

Lays out an application: bars across the top and the bottom, and a body between them with a panel on
either side of the main region.

```tsx
import { AppShell, Sidebar } from "@stealthscale/component-screen";

<AppShell.Root>
  <AppShell.Header sticky>
    <AppShell.Trigger aria-label="Navigation">…</AppShell.Trigger>
  </AppShell.Header>
  <AppShell.Body>
    <AppShell.Navbar collapse="icons" shortcut="b">
      <Sidebar.Root>…</Sidebar.Root>
    </AppShell.Navbar>
    <AppShell.Main>…</AppShell.Main>
    <AppShell.Aside aria-label="Invoice detail" folds="under">
      …
    </AppShell.Aside>
  </AppShell.Body>
  <AppShell.Footer>…</AppShell.Footer>
</AppShell.Root>;
```

| Axis      | Values                       | Default |
| --------- | ---------------------------- | ------- |
| `divided` | `true`, `false`              | `true`  |
| `scroll`  | `page`, `window`             | `page`  |
| `variant` | `floating`, `inset`, `plain` | `plain` |

- `divided` renders a hairline on the inner edge of each bar and each panel. A sidebar inside a
  panel sets its ground and no line.
- `scroll="page"` sets the shell to the window's height and scrolls the main region.
  `scroll="window"` scrolls the document, pins each `sticky` bar under the bars before it, and
  sticks the panels under the pinned bars. A pinned bar is filled with `bg.panel`.
- `variant="inset"` gives the main region the panel ground, a hairline and a shadow over a muted
  root. `variant="floating"` gives each panel's content the same instead.

The shell has no `palette` and no `effect` axis, because its parts are containers.

### Parts

| Part               | Element  | Landmark        |
| ------------------ | -------- | --------------- |
| `AppShell.Root`    | `div`    | none            |
| `AppShell.Header`  | `header` | `banner`        |
| `AppShell.Body`    | `div`    | none            |
| `AppShell.Navbar`  | `div`    | none            |
| `AppShell.Main`    | `main`   | `main`          |
| `AppShell.Aside`   | `aside`  | `complementary` |
| `AppShell.Footer`  | `footer` | `contentinfo`   |
| `AppShell.Trigger` | `button` | none            |

`AppShell.Navbar` has no landmark, because a sidebar inside it renders its own navigation landmarks.
Name `AppShell.Aside` with `aria-label` when an application renders more than one.

### Panels

`AppShell.Navbar` and `AppShell.Aside` are the same panel on the two sides.

| Prop           | Values          | Default                                        |
| -------------- | --------------- | ---------------------------------------------- |
| `collapse`     | `hide`, `icons` | `hide`                                         |
| `folds`        | `over`, `under` | `over`                                         |
| `foldsBelow`   | a breakpoint    | `md` on the start side, `lg` on the end side   |
| `defaultOpen`  | `true`, `false` | `true`                                         |
| `open`         | `true`, `false` | uncontrolled                                   |
| `onOpenChange` | a function      | none                                           |
| `name`         | a string        | `navbar` on the start side, `aside` on the end |
| `shortcut`     | a key           | none                                           |

- `collapse` sets what closing the panel beside the page leaves: `hide` hides it, and `icons` leaves
  a rail of `sizes.rail`. Pass `iconic` to a sidebar inside the panel while it is closed.
- `folds` sets where the panel goes when the shell is narrower than `foldsBelow`: `over` lays it
  over the page behind a backdrop, and `under` drops it under the main region as a block that is
  always shown.
- `shortcut` toggles the panel with Control or Command held: `shortcut="b"` for ⌘B and Ctrl+B.
- A panel over the page starts closed, and closes again every time the shell narrows. An application
  that passes `open` controls the panel at every width.
- While a panel is over the page, the bars, the main region and the other panels are inert, focus
  moves into the panel, and Escape or a press on the backdrop closes it and returns focus to the
  control that opened it. The panel has no dialog role, because the inert page and the returned
  focus give a reader the same behaviour.

### Triggers and hooks

`AppShell.Trigger` finds its panel by the name passed as `panel`, `navbar` by default, and sets
`aria-controls`, `aria-expanded` and `data-state` from it. It renders `null` while its panel is
under the page, because that panel is always shown. Name the trigger for the panel, such as
`Navigation`, so a screen reader announces "Navigation, collapsed, button".

`useAppShellPanel(name)` reads a panel from an application's own code, for example to close the
navigation when a destination is pressed:

```tsx
const navbar = useAppShellPanel("navbar");

<Link href="/invoices" onClick={() => navbar?.setOpen(false)}>
  Invoices
</Link>;
```

`useNearestPanel()` reads the panel a part is inside, and `useOverlaid()` returns the panels that
are open over the page.

## Page

Lays out a page as a column of bands: a banner, a header, a navigation, a toolbar, a body with an
optional aside, and a footer.

```tsx
import { Page } from "@stealthscale/component-screen";

<Page.Root measure="wide">
  <Page.Header>
    <Page.Trail href="/invoices">Invoices</Page.Trail>
    <Page.Title>April invoices</Page.Title>
    <Page.Description>Everything raised this month.</Page.Description>
    <Page.Actions>
      <Page.Action as={Button} priority="primary">
        Export
      </Page.Action>
      <Page.Action as={Button} priority="tertiary">
        Archive
      </Page.Action>
    </Page.Actions>
  </Page.Header>
  <Page.Body>…</Page.Body>
</Page.Root>;
```

| Axis      | Values                   | Default |
| --------- | ------------------------ | ------- |
| `align`   | `center`, `start`        | `start` |
| `divided` | `true`, `false`          | `true`  |
| `gutter`  | `xs` to `4xl`            | `xl`    |
| `measure` | `full`, `narrow`, `wide` | `full`  |
| `size`    | `sm`, `md`, `lg`         | `md`    |

- Every band runs edge to edge, and its content starts at the gutter. The root sets the gutter and
  the measure as custom properties that every band reads.
- `size` sets the title one heading size larger than a section's title at the same size.
- The root has no landmark, because `AppShell.Main` is the `main` landmark. The header takes its
  name from `Page.Title`.
- `<Page.When when="narrow">` renders its children on a folded page only, and `when="wide"` on an
  unfolded page only.
- `Page.Picker` is the control a folded page shows in place of a row of links. Render it as a menu's
  trigger, `<Menu.Trigger as={Page.Picker}>`, and the menu's content as `Page.Palette`.
- `Page.Aside` is a complementary landmark beside the body from the `lg` breakpoint. Name it with
  `aria-label`. Below `lg` it stacks under the body, or leaves the page with `folds="hide"`.
  `sticky` keeps it in view under the shell's pinned bars.
- A section scrolled to by its id stops a gap under the shell's pinned bars.
- The page has no `palette` and no `effect` axis, because it is a layout.

## Section

Renders one part of a page under its own heading, with the actions that apply to it.

```tsx
import { Section } from "@stealthscale/component-screen";

<Section.Root variant="surface">
  <Section.Header>
    <Section.Title>Payment methods</Section.Title>
    <Section.Description>Cards this account can be charged on.</Section.Description>
    <Section.Actions>
      <Section.Action as={Button} priority="secondary">
        Add a card
      </Section.Action>
    </Section.Actions>
  </Section.Header>
  <Section.Body>…</Section.Body>
</Section.Root>;
```

| Axis        | Values             | Default |
| ----------- | ------------------ | ------- |
| `annotated` | `true`             | none    |
| `size`      | `sm`, `md`, `lg`   | `md`    |
| `variant`   | `plain`, `surface` | `plain` |

- The element is `section`, named by `Section.Title`, so it is a region landmark with the title as
  its name.
- A section without `size` takes the page's size, so one `size` on `Page.Root` sets every section in
  it.
- A plain section after another renders a hairline above itself with a gap on either side.
- `annotated` lays out the header and the body as two columns on a wide section, the layout of a
  settings page.
- The section has no `palette` and no `effect` axis, because it is a layout.

## Sidebar

Lays out an application's navigation as a column: a fixed header, scrolling content with nav blocks,
and a fixed footer.

```tsx
import { NavList } from "@stealthscale/component-navigation";
import { Sidebar } from "@stealthscale/component-screen";

<Sidebar.Root variant="subtle">
  <Sidebar.Header>…</Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Search>
      <SearchInput aria-label="Search" />
    </Sidebar.Search>
    <Sidebar.Nav>
      <Sidebar.NavLabel>Workspace</Sidebar.NavLabel>
      <NavList.Root>…</NavList.Root>
    </Sidebar.Nav>
    <Sidebar.Separator />
    <Sidebar.Nav>
      <Sidebar.NavLabel>Projects</Sidebar.NavLabel>
      <Sidebar.NavAction aria-label="Add project">
        <PlusIcon />
      </Sidebar.NavAction>
      <NavList.Root>…</NavList.Root>
    </Sidebar.Nav>
  </Sidebar.Content>
  <Sidebar.Footer>…</Sidebar.Footer>
</Sidebar.Root>;
```

| Axis      | Values                                  | Default |
| --------- | --------------------------------------- | ------- |
| `size`    | `sm`, `md`, `lg`                        | `md`    |
| `variant` | `outline`, `plain`, `subtle`, `surface` | `plain` |

- `subtle` is a muted ground without an edge, for a sidebar inside a shell panel, where the shell
  renders the hairline.
- The content scrolls and the root does not, so the header and the footer remain visible.
- Each `Sidebar.Nav` is a `nav` landmark named by its `Sidebar.NavLabel` through `aria-labelledby`.
  A block without a label takes `aria-label`, and a caller's `aria-label` replaces the label's name.
- `Sidebar.NavHeading` renders a heading over one list inside a block. Pass it an `id`, and pass the
  same identifier to the list's `aria-labelledby`.
- `Sidebar.NavAction` is a 24px ghost square in the navigation list's end column, with the rows' end
  inset. Pass the icon as its child and name it with `aria-label`.
- `Sidebar.Empty` renders the message a search shows when nothing matches. Name what was searched:
  `No pages match`.
- `iconic` collapses the sidebar to a rail of icons. The app shell sets the width, so the caller
  passes `iconic` while the shell's panel is closed to icons, and passes `iconic` to each
  `NavList.Root` too. The labels, the headings and the words in the header and footer are hidden
  visually and kept for screen readers. The search, the empty message and the block controls are
  removed.
- The sidebar has no `palette` and no `effect` axis. Its looks are neutral grounds, and the
  navigation list offers its own palette and effect for the current row.

## Switcher

Renders the control that shows the current workspace, project or environment and opens a menu of the
others. `Switcher.Root` is the disclosure package's `Menu.Root`, so the roles, the keyboard and the
positioning are the menu's. The panel and its rows are the menu's parts.

```tsx
import { Menu } from "@stealthscale/component-disclosure";
import { Switcher } from "@stealthscale/component-screen";

<Switcher.Root>
  <Switcher.Trigger label="Workspace">
    <Switcher.Mark>A</Switcher.Mark>
    <Switcher.Label>
      <Switcher.Name>Acme</Switcher.Name>
      <Switcher.Detail>Pro plan</Switcher.Detail>
    </Switcher.Label>
    <Switcher.Indicator>
      <ChevronsUpDownIcon />
    </Switcher.Indicator>
  </Switcher.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.OptionItem checked type="radio" value="acme" onCheckedChange={…}>
        <Menu.ItemIndicator>
          <CheckIcon />
        </Menu.ItemIndicator>
        <Menu.ItemMark>A</Menu.ItemMark>
        <Menu.ItemLines>
          <Menu.ItemText>Acme</Menu.ItemText>
          <Menu.ItemDescription>Pro plan</Menu.ItemDescription>
        </Menu.ItemLines>
      </Menu.OptionItem>
      <Menu.Separator />
      <Menu.Item value="new">New workspace</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Switcher.Root>;
```

| Axis        | Values                       | Default   |
| ----------- | ---------------------------- | --------- |
| `placement` | `sidebar`, `toolbar`         | `sidebar` |
| `size`      | `sm`, `md`, `lg`             | `md`      |
| `variant`   | `outline`, `plain`, `subtle` | `plain`   |

- `Switcher.Trigger` renders its `label` as visually hidden text before the name, so a screen reader
  announces `Workspace Acme`, and the visible name stays in the accessible name.
- `Switcher.Root` passes its `size` to the menu, so the rows render at the control's size, and
  passes the menu's own props, `palette` among them, to `Menu.Root`.
- `placement="sidebar"` fills the column and opens a menu as wide as the control, through the
  machine's `positioning.sameWidth`. A caller's `positioning` applies over it.
- `placement="toolbar"` is as wide as its words and hides the detail. Its menu is at least
  `sizes.44` wide and grows to its widest row. Render the trigger through `Toolbar.Item`, so it is
  one of the row's arrow-key stops:

```tsx
<Switcher.Root placement="toolbar">
  <Toolbar.Item as={Switcher.Trigger} label="Environment">
    <Switcher.Label>
      <Switcher.Name>Production</Switcher.Name>
    </Switcher.Label>
  </Toolbar.Item>
  <Menu.Positioner>…</Menu.Positioner>
</Switcher.Root>
```

- The switcher has no `palette` and no `effect` axis. The control is neutral, and the menu takes its
  own `palette`.
- Render the positioner in a `Portal` when the switcher is inside an element that clips, such as an
  app shell panel, so the menu renders over the page.

## Toolbar

Renders a row of controls over a table or a list: a band at each end, a band in the middle, and a
search that covers a narrow row.

```tsx
import { Toolbar } from "@stealthscale/component-screen";

<Toolbar.Root aria-label="Invoices">
  <Toolbar.Start>
    <Toolbar.Action as={Button}>Filter</Toolbar.Action>
    <Toolbar.Separator />
    <Toolbar.Action as={Button} priority="tertiary">
      Columns
    </Toolbar.Action>
  </Toolbar.Start>
  <Toolbar.End>
    <Toolbar.Folded aria-label="More" as={Menu.Trigger} />
  </Toolbar.End>
  <Toolbar.Search opened={searching}>
    <SearchInput aria-label="Search invoices" />
  </Toolbar.Search>
</Toolbar.Root>;
```

| Axis      | Values                        | Default |
| --------- | ----------------------------- | ------- |
| `radius`  | `l1`, `l2`, `l3`              | `l2`    |
| `size`    | `sm`, `md`, `lg`              | `md`    |
| `variant` | `outline`, `plain`, `surface` | `plain` |

- The row has `role="toolbar"`, and the arrow keys move focus between its controls, so the row is
  one tab stop. Name it with `aria-label`.
- `Toolbar.Item` renders a link when it has an `href` and a button otherwise, and both stay in the
  arrow-key group. Pass `as` to render another component as the item: `as={Button}` or
  `as={Switcher.Trigger}`.
- The row measures its own width and writes `data-narrow` below `sm`, which folds each
  `Toolbar.Action` by its priority and shows `Toolbar.Folded`.
- `Toolbar.Search` covers the row while `opened`. Opening it moves focus into the field, and closing
  it returns focus to the control that opened it.
- The toolbar has no `palette` and no `effect` axis, because it is a layout for controls that have
  their own.
