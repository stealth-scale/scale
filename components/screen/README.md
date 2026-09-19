# @stealthscale/component-screen

Lays an application out on whatever screen it is opened on: the shell around everything, the page
inside it, the sidebar of destinations, the toolbar over a table and the section a page is built
from. Every component binds a recipe and draws nothing of its own, so a theme restyles all of them
by extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-screen
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/provider-viewport`. An
application lists the preset under `./theme` among the presets its compiler installs.

## Folding

A component here folds on its own width and never on the window's. It measures the element it draws
and compares that against the width a breakpoint starts at. A page beside an open sidebar therefore
folds on the room the sidebar left it while the window is still wide, and a caller writes no
breakpoint and no media query.

The measurement is written to the element as `data-narrow`, which the recipes select on. Before the
element has been laid out, and where the browser reports no size, the answer comes from the viewport
instead. A phone never lays out wide first.

A row of actions folds by priority rather than by measurement. Each action states how much it
matters. The row's rules decide the rest:

| `priority`  | On a wide row | On a narrow row                              |
| ----------- | ------------- | -------------------------------------------- |
| `primary`   | Mark and name | Mark and name                                |
| `secondary` | Mark and name | Mark, with the name kept for a screen reader |
| `tertiary`  | Mark and name | Out of the document, into the folded control |

A secondary action keeps its name rather than dropping it. A control with no accessible name is one
no screen reader can announce. A tertiary action leaves the document rather than being hidden, which
takes it out of the tab order with everything else a reader cannot see.

## AppShell

Lays an application out: bars across the top and the bottom, and a body between them holding a panel
down either side of the page. Composed as `AppShell.Root`.

```tsx
import { AppShell, Sidebar } from "@stealthscale/component-screen";

<AppShell.Root>
  <AppShell.Header sticky>
    <AppShell.Trigger>Navigation</AppShell.Trigger>
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
  <AppShell.Footer />
</AppShell.Root>;
```

| Axis      | Values                       | Default |
| --------- | ---------------------------- | ------- |
| `divided` | `true`, `false`              | `true`  |
| `scroll`  | `page`, `window`             | `page`  |
| `variant` | `floating`, `inset`, `plain` | `plain` |

`divided` draws a hairline on the inner edge of each bar and each panel. The lines are the shell's,
so a sidebar inside a panel draws its ground and no line of its own.

`scroll` decides what moves under the bars. `page` makes the shell the height of the window and
scrolls the page inside it, which is how an application reads. `window` lets the document grow, pins
every bar that asks to stick under the ones before it, and sticks the panels under all of them. A
bar that sticks takes the page's surface as its fill, because the page scrolls under it.

`variant` decides how the page and the panels are set against the ground behind them. `inset` raises
the page as a card on a muted ground. `floating` raises the contents of each panel as a card
instead.

### Panels

`AppShell.Navbar` and `AppShell.Aside` are the same panel on the two sides. Each says how it closes
and where it goes when the shell runs out of room for it.

| Prop          | Values          | Default                                        |
| ------------- | --------------- | ---------------------------------------------- |
| `collapse`    | `hide`, `icons` | `hide`                                         |
| `folds`       | `over`, `under` | `over`                                         |
| `foldsBelow`  | a breakpoint    | `md` on the start side, `lg` on the end        |
| `defaultOpen` | `true`, `false` | `true`                                         |
| `name`        | any string      | `navbar` on the start side, `aside` on the end |
| `shortcut`    | a key           | none                                           |

`collapse` decides what closing the panel beside the page leaves. `hide` leaves nothing. `icons`
leaves a rail wide enough for the marks inside it.

`folds` decides where the panel goes once the shell is too narrow to hold it beside the page. `over`
lays it over the page behind a backdrop. `under` drops it under the page as a block that is always
shown.

`shortcut` opens and closes the panel from anywhere with the platform's modifier held. Write
`shortcut="b"` for ⌘B and Ctrl+B.

A panel over the page starts closed whatever it was beside the page, and starts closed again every
time the shell narrows anew. An application opened on a phone should not open with its navigation
across the page. An application that states `open` decides instead, at every width.

While a panel is over the page, the bars, the page and the other panels go inert, the reader is put
in the panel, and Escape and the backdrop put it away and give focus back to the control that opened
it. The panel claims no dialog role, because what a reader needs is what inert already gives them:
nothing behind it to reach, a key to leave by, and the control they pressed still under the cursor
when they come back.

`AppShell.Navbar` claims no landmark. What it holds says what it is. A sidebar's blocks of
destinations each name their own navigation, so a reader hears `Workspace` and `Account` rather than
one nameless region around them. `AppShell.Aside` is an `aside`, which carries `complementary`. Name
it with `aria-label` where an application draws more than one.

### Reaching a panel from anywhere

`AppShell.Trigger` points at a panel by name. It states `aria-controls`, `aria-expanded` and
`data-state`, so a mark inside it turns with the panel. A trigger pointing at a panel that has
dropped under the page leaves the document, because there is then nothing to open.

An application reads the same panel from its own code with `useAppShellPanel(name)`. This is how a
navigation closes when a destination is pressed:

```tsx
const navbar = useAppShellPanel("navbar");

<Link href="/invoices" onClick={() => navbar?.setOpen(false)}>
  Invoices
</Link>;
```

A part inside a panel reads its own panel with `useNearestPanel()`. Anything behind a sheet reads
what stands over the page with `useOverlaid()`.

## Page

Lays a page out: a banner, a header with everything that names the page, a navigation, a body and a
footer. Composed as `Page.Root`.

```tsx
import { Page } from "@stealthscale/component-screen";

<Page.Root measure="wide">
  <Page.Header>
    <Page.Trail>…</Page.Trail>
    <Page.Title>April invoices</Page.Title>
    <Page.Description>Everything raised this month.</Page.Description>
    <Page.Actions>
      <Page.Action priority="primary">Export</Page.Action>
      <Page.Action priority="tertiary">Archive</Page.Action>
      <Page.Folded>More</Page.Folded>
    </Page.Actions>
  </Page.Header>
  <Page.Body>…</Page.Body>
</Page.Root>;
```

| Axis      | Values                   | Default |
| --------- | ------------------------ | ------- |
| `align`   | `center`, `start`        | `start` |
| `divided` | `true`, `false`          | `true`  |
| `gutter`  | `sm`, `md`, `lg`         | `md`    |
| `measure` | `full`, `narrow`, `wide` | `full`  |
| `size`    | `sm`, `md`, `lg`         | `md`    |

Every band runs edge to edge, so a band that sticks draws its fill and its hairline across the whole
width, and what each band holds starts at the gutter. The gutter and the measure are properties the
root states and every band reads, so one value moves all of them. `size` sets the title one heading
step above a section's at the same size, so the outline the headings draw keeps its levels.

The root carries no landmark. `AppShell.Main` draws `main`, and a page that claimed one as well
would give a reader two to choose between on the same screen. The header names itself from
`Page.Title`, so a caller writes no identifier.

Write `<Page.When width="narrow">` around what a folded page shows, and `width="wide"` around what
it drops. `Page.Picker` is the control a folded page offers in place of a strip of tabs. Draw it as
a disclosure's trigger, `<Menu.Trigger as={Page.Picker} />`, which gives it `aria-expanded` and
`aria-controls` against the list the disclosure draws.

`Page.Aside` stands beside the body: an activity trail, a panel of metadata, a list of the headings
on the page. Draw it after the body and name it, because it is a complementary landmark. From the
`lg` breakpoint up the page becomes a grid, every band across and the body beside the aside, which
is as wide as what it holds. Below that the aside stacks under the body, or leaves the page with
`folds="hide"`, for a rail a phone has no room for. Set `sticky` to keep it in view under the
shell's pinned bars while the body scrolls past.

```tsx
<Page.Root>
  <Page.Header>…</Page.Header>
  <Page.Body>…</Page.Body>
  <Page.Aside aria-label="On this page" folds="hide" sticky>
    <Toc.Root items={items}>…</Toc.Root>
  </Page.Aside>
</Page.Root>
```

A section scrolled to by its id stops a gap under the shell's pinned bars, so a title reached from a
table of contents is read rather than covered.

## Section

Draws one block of a page under its own heading, with the controls that act on that block. Composed
as `Section.Root`.

```tsx
import { Section } from "@stealthscale/component-screen";

<Section.Root variant="surface">
  <Section.Header>
    <Section.Title>Payment methods</Section.Title>
    <Section.Description>Cards this account can be charged on.</Section.Description>
    <Section.Actions>
      <Section.Action priority="secondary">Add a card</Section.Action>
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

The element is `section` and it names itself from `Section.Title`, so a reader jumping by landmark
hears the heading rather than an unnamed region. A section states no size of its own takes the
page's, so one value on `Page.Root` sets every section under it. A plain section after another draws
one hairline above itself with a large gap on either side.

`annotated` lays the heading and the body out as two columns on a wide screen, which is how a
settings page reads. The heading column explains what the block is. The body column holds the
controls that change it.

## Sidebar

Gathers what a person moves around an application by. Three bands: a fixed head, blocks of
destinations that scroll between them, and a fixed foot. Composed as `Sidebar.Root`.

```tsx
import { Sidebar } from "@stealthscale/component-screen";
import { NavList } from "@stealthscale/component-navigation";

<Sidebar.Root variant="outline">
  <Sidebar.Header>Acme</Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Nav>
      <Sidebar.NavLabel>Workspace</Sidebar.NavLabel>
      <NavList.Root>…</NavList.Root>
    </Sidebar.Nav>
    <Sidebar.Separator />
    <Sidebar.Nav>
      <Sidebar.NavLabel>Account</Sidebar.NavLabel>
      <Sidebar.NavAction>Add a project</Sidebar.NavAction>
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

`subtle` is the muted ground and no line, for a sidebar inside a shell panel. The shell draws the
hairline between the panel and the page.

The content scrolls rather than the column, so a switcher at the head and an account at the foot
stay where a reader left them however long the list of destinations grows.

Each `Sidebar.Nav` is a `nav` that names itself from its own `Sidebar.NavLabel`, so a reader jumping
by landmark hears `Workspace` and `Account` rather than two unnamed navigations. A block that draws
no heading states `aria-label` instead.

`iconic` collapses the sidebar to a rail of marks. It is a prop the shell passes rather than
something the sidebar measures, because the shell decides how wide the sidebar is and a sidebar that
measured itself would disagree with the shell for one frame every time it moved. Every heading and
the search leave the rail, and the destinations keep their words out of sight so a screen reader
still names each one.

## Switcher

Draws the control at the head of a sidebar that names what is being worked in and opens the rest.
Composed as `Switcher.Root`, which draws nothing itself and carries the variants.

```tsx
import { Switcher } from "@stealthscale/component-screen";

<Switcher.Root>
  <Switcher.Trigger label="Workspace">
    <Switcher.Mark>A</Switcher.Mark>
    <Switcher.Content>
      <Switcher.Name>Acme</Switcher.Name>
      <Switcher.Detail>Pro plan</Switcher.Detail>
    </Switcher.Content>
    <Switcher.Indicator />
  </Switcher.Trigger>
</Switcher.Root>;
```

| Axis        | Values                       | Default   |
| ----------- | ---------------------------- | --------- |
| `placement` | `sidebar`, `toolbar`         | `sidebar` |
| `size`      | `sm`, `md`, `lg`             | `md`      |
| `variant`   | `outline`, `plain`, `subtle` | `plain`   |

The root carries the variants without drawing anything. A disclosure places the list outside the
trigger, and the list still has to read the variants. `Switcher.Trigger` states a `label`. A screen
reader reads that before the name, so `Workspace Acme` says what pressing the control changes.

`placement` says where the control sits. At the head of a sidebar it is a row the width of the
column. In a toolbar it takes the width of its words and drops the detail, and the trigger is drawn
through `Toolbar.Item` so it takes the row's tab stop:

```tsx
<Switcher.Root placement="toolbar">
  <Toolbar.Item as={Switcher.Trigger} label="Theme">
    <Switcher.Label>
      <Switcher.Name>Graphite</Switcher.Name>
    </Switcher.Label>
  </Toolbar.Item>
  <Menu.Positioner>…</Menu.Positioner>
</Switcher.Root>
```

## Toolbar

Draws a row of controls over a table or a list: a band at each end, a band in the middle, and a
search that covers the row on a screen too narrow to hold both. Composed as `Toolbar.Root`.

```tsx
import { Toolbar } from "@stealthscale/component-screen";

<Toolbar.Root aria-label="Invoices">
  <Toolbar.Start>
    <Toolbar.Item>Filter</Toolbar.Item>
    <Toolbar.Separator />
    <Toolbar.Item priority="tertiary">Columns</Toolbar.Item>
  </Toolbar.Start>
  <Toolbar.End>
    <Toolbar.Folded>More</Toolbar.Folded>
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

The row carries `role="toolbar"` and moves focus with the arrow keys, so the whole row is one stop
in the tab order rather than one stop per control. Name it with `aria-label`. `Toolbar.Item` picks
its own element from whether it was given an `href`, so a link in the row is a link and a control is
a button, and both stay in the roving focus group. Give it `as` to draw another component as the
item, with the stop on the element that component renders: `as={Button}` for the library's button,
`as={Switcher.Trigger}` for a switcher's control. The item takes that component's props beside its
own.

The row measures its own width and writes `data-narrow` below the small breakpoint, which is what
folds a `Toolbar.Action` by its priority and shows `Toolbar.Folded`. A row beside an open sidebar
folds on its own room, and a consumer writes no breakpoint.

`Toolbar.Search` is laid over the row while `opened`. Opening it puts the reader in the field and
closing it puts them back on the control they pressed, because the control is under the field while
the field is open.
