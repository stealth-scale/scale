# @stealthscale/component-screen

Lays out an application's screen: the shell around everything, the page inside it, the sections of a
page, the sidebar of destinations, the switcher at the head of a sidebar, the toolbar over a table,
the action bar over a selection, the splitter between panels a person resizes and the floating panel
a person moves over the page. Every component takes its styles from a recipe, so a theme restyles
all nine by extending the recipes. The preset under `./theme` registers the recipes with an
application's compiler.

Every value a theme can change is an axis of a recipe, so a caller sets it as a prop and writes no
style. A caller changes the element a component renders with `as`.

## Install

```bash
pnpm add @stealthscale/component-screen
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks`,
`@stealthscale/provider-viewport` and the component packages it renders: `a11y`, `actions`, `data`,
`disclosure`, `forms`, `layout`, `modals`, `navigation`, `primitives` and `typography`. An
application lists the preset under `./theme` among the presets its compiler installs.

## Folding

A component folds on its own width, not on the window's. It compares its element's width with the
width a breakpoint starts at and writes `data-narrow`, which the recipes select on. A page beside an
open sidebar folds on the width the sidebar leaves it, and a caller does not write a breakpoint or a
media query. Before the element is laid out, and where the browser does not report a size, the
viewport's width decides, so a phone never lays out wide first.

`Toolbar.Action`, `Page.Action` and `Section.Action` fold by priority. An action states `priority`,
or the action's props imply one:

| Props                        | Priority    | On a narrow row                         |
| ---------------------------- | ----------- | --------------------------------------- |
| `primary`, no `icon`         | `primary`   | Unchanged                               |
| `icon`                       | `secondary` | Icon alone, the label hidden visually   |
| neither `primary` nor `icon` | `tertiary`  | Removed from the row, a row in its menu |

- A secondary action keeps its label for screen readers.
- A tertiary action leaves the row and the tab order. The row renders a menu with one row per folded
  action.
- `more` names the menu's trigger, `More actions` by default. `moreIcon` replaces the trigger's
  words with a mark.
- A folded link keeps its `href` in its menu row. A menu row calls the action's `onClick`.
- A control that opens its own overlay cannot run from a menu row. Give it an icon or `primary`.
- An action writes `data-narrow` on itself from its own row. An action in a wide row inside a narrow
  component keeps its words, such as the toolbar in an action bar, which is fixed to the window and
  wider than the page around it in the document.

## ActionBar

Renders a bar fixed to the bottom of the window with the actions for what a person has selected. The
bar contains a toolbar, so its actions have one tab stop, the arrow keys and folding.

```tsx
import { ActionBar, Toolbar } from "@stealthscale/component-screen";

<ActionBar.Root onOpenChange={() => setSelected([])} open={selected.length > 0}>
  <ActionBar.Positioner>
    <ActionBar.Content>
      <Toolbar.Root aria-label="Actions for the selected invoices" size="sm">
        <Toolbar.Start>
          <ActionBar.CloseTrigger aria-label="Clear selection">
            <XIcon />
          </ActionBar.CloseTrigger>
          <Text size="sm">{selected.length} selected</Text>
        </Toolbar.Start>
        <Toolbar.End>
          <Toolbar.Action icon={<DownloadIcon />}>Download</Toolbar.Action>
          <Toolbar.Action icon={<ReceiptIcon />} primary priority="primary">
            Mark as paid
          </Toolbar.Action>
        </Toolbar.End>
      </Toolbar.Root>
    </ActionBar.Content>
  </ActionBar.Positioner>
</ActionBar.Root>;
```

| Axis        | Values                                 | Default  |
| ----------- | -------------------------------------- | -------- |
| `placement` | `bottom-start`, `bottom`, `bottom-end` | `bottom` |

- The caller keeps the selection. `open` is true while anything is selected. `onOpenChange` receives
  `{ open: false }` on Escape inside the bar and on a press of `ActionBar.CloseTrigger`, and the
  caller clears the selection, which closes the bar.
- Render the root after the list it acts on, so Tab from the list moves into the bar.
- Focus remains on the selection when the bar opens. A polite live region announces `announcement`,
  `Actions available` by default.
- When the bar closes with focus inside it, focus returns to the element that had it when the bar
  opened. Focus that a person moved elsewhere remains there.
- `closeOnEscape={false}` leaves Escape to the caller. An Escape that a control inside the bar
  handles with `preventDefault`, or that a menu portalled out of the bar receives, does not close
  it.
- `ActionBar.CloseTrigger` renders the actions package's `IconButton`, ghost, as an item of the
  toolbar. Name it with `aria-label`. An `onClick` that calls `preventDefault` keeps the bar open.
- Put the close trigger and the count in `Toolbar.Start` and the actions in `Toolbar.End`. The
  toolbar renders its menu of folded actions as its last control, beside the actions. Give the main
  action `priority="primary"` to keep its words in a narrow window.
- The bar is as wide as its content, at least `sizes.2xl`, 672px, and at most the window inside the
  inset. Its toolbar folds in a narrow window and not because of its own content.
- The positioner is fixed above the safe area at the `banner` layer and takes no pointer events, so
  the page beside the bar remains pressable. `placement` sets the bar at the start, in the middle or
  at the end of the bottom edge, and start and end follow the writing direction.
- The bar is not in the document before it first opens, and leaves once its exit motion ends.
  `lazyMount` and `unmountOnExit` default to `true`. It rises from the bottom edge as it fades in,
  and is inert while it leaves.
- The bar has no `palette` and no `effect` axis, because it is a `bg.panel` surface for controls
  that have their own.

| Part                     | Element                    |
| ------------------------ | -------------------------- |
| `ActionBar.Root`         | `div`, `display: contents` |
| `ActionBar.Positioner`   | `div`                      |
| `ActionBar.Content`      | `div`                      |
| `ActionBar.CloseTrigger` | `button`                   |

The bar does not offer these:

- A selection trigger. The count is text the caller renders in the toolbar.
- A bar placed inside a container. The positioner is fixed to the window.
- Escape outside the bar. A list clears its selection with its own keys.

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
    <AppShell.Rail closeLabel="Close navigation" openLabel="Open navigation" />
    <AppShell.Main>…</AppShell.Main>
    <AppShell.Aside aria-label="Invoice detail" folds="under" width="20rem">
      <AppShell.Section grows scrolls>
        …
      </AppShell.Section>
    </AppShell.Aside>
  </AppShell.Body>
  <AppShell.Footer when="narrow">…</AppShell.Footer>
</AppShell.Root>;
```

| Axis      | Values                       | Default |
| --------- | ---------------------------- | ------- |
| `divided` | `true`, `false`              | `true`  |
| `scroll`  | `page`, `window`             | `page`  |
| `variant` | `floating`, `inset`, `plain` | `plain` |

- `divided` renders a hairline on the inner edge of each bar and each panel. A sidebar inside a
  panel sets its ground and no line.
- `scroll="page"` sets the shell to the window's height and scrolls the main region. While a panel
  is under the page, the body scrolls, so the page and the panel scroll together.
- `scroll="window"` scrolls the document, pins each `sticky` bar under the bars before it, and
  sticks a panel beside the page under the pinned bars. A pinned bar is filled with `bg.panel`.
- The body, the main region, a panel's content and a section that scrolls are the primitives
  package's scroll areas, so each bar in the shell is the theme's thin bar, shown under the pointer
  and while the region scrolls. The main region's viewport is the `main` element, and
  `AppShell.Main` passes its props to it. Under `scroll="window"` neither viewport scrolls, and the
  browser's bar scrolls the document.
- `variant="plain"` fills no region, so the shell shows the ground it is placed on.
  `variant="inset"` gives the main region the panel ground, a hairline and a shadow over a muted
  root. `variant="floating"` gives each panel's content the same instead. A sidebar in a panel
  paints its own ground.
- The header and the footer pad by `spacing.gap.md`. `AppShell.Footer when="narrow"` renders below
  the `md` breakpoint alone, and `when="wide"` from it.
- The shell reads its window's height from `WINDOW_HEIGHT`, the custom property
  `--app-shell-window-height`, and `100dvh` without it. A shell drawn in a box of fixed height sets
  it on the box.

The shell has no `palette` and no `effect` axis, because its parts are containers.

### Parts

| Part               | Element  | Landmark        |
| ------------------ | -------- | --------------- |
| `AppShell.Root`    | `div`    | none            |
| `AppShell.Header`  | `header` | `banner`        |
| `AppShell.Body`    | `div`    | none            |
| `AppShell.Navbar`  | `div`    | none            |
| `AppShell.Rail`    | `button` | none            |
| `AppShell.Main`    | `main`   | `main`          |
| `AppShell.Aside`   | `aside`  | `complementary` |
| `AppShell.Section` | `div`    | none            |
| `AppShell.Footer`  | `footer` | `contentinfo`   |
| `AppShell.Trigger` | `button` | none            |

`AppShell.Navbar` has no landmark, because a sidebar inside it renders its own navigation landmarks.
Name `AppShell.Aside` with `aria-label` when an application renders more than one.

`AppShell.Section` is a padded band in a panel or in the main region. `grows` gives it the room its
siblings leave, and `scrolls` makes it a scroll area, so the bands around it remain in place. A band
that scrolls is for content whose every item takes focus, such as a list of links or a navigation,
so its viewport is outside the tab order.

A page in the main region grows to the region's height, and a sidebar in a panel takes the panel's
height exactly and scrolls its own list.

### Panels

`AppShell.Navbar` and `AppShell.Aside` are the same panel on the two sides.

| Prop           | Values                | Default                                        |
| -------------- | --------------------- | ---------------------------------------------- |
| `collapse`     | `hide`, `icons`       | `hide`                                         |
| `folds`        | `over`, `under`       | `over`                                         |
| `foldsBelow`   | a breakpoint, `never` | `md` on the start side, `lg` on the end side   |
| `width`        | a CSS length          | `sizes.sidebar` or `sizes.aside`               |
| `railWidth`    | a CSS length          | `sizes.rail`                                   |
| `defaultOpen`  | `true`, `false`       | `true`                                         |
| `open`         | `true`, `false`       | uncontrolled                                   |
| `onOpenChange` | a function            | none                                           |
| `name`         | a string              | `navbar` on the start side, `aside` on the end |
| `shortcut`     | a key                 | none                                           |

- `collapse` sets what closing the panel beside the page leaves: `hide` hides it, and `icons` leaves
  a rail of `railWidth`. A sidebar inside the panel renders as a rail on its own.
- `folds` sets where the panel goes when the shell is narrower than `foldsBelow`: `over` lays it
  over the page behind a backdrop, and `under` drops it under the main region as a block that is
  always shown. `foldsBelow="never"` keeps the panel in the body at every width.
- `shortcut` toggles the panel with Control or Command held: `shortcut="b"` for ⌘B and Ctrl+B.
- A panel over the page starts closed, and closes again every time the shell narrows. It is a raised
  surface, `bg.panel` with the `lg` shadow, and keeps its width while it slides closed. An
  application that passes `open` controls the panel at every width.
- While a panel is over the page, the bars, the main region and the other panels are inert, focus
  moves into the panel, and Escape or a press on the backdrop closes it and returns focus to the
  control that opened it. The panel has no dialog role, because the inert page and the returned
  focus give a reader the same behaviour.

### Triggers, the rail and hooks

`AppShell.Trigger` renders the library's button, a neutral ghost unless the caller states another
look. It finds its panel by the name passed as `panel`, `navbar` by default, and sets
`aria-controls`, `aria-expanded` and `data-state` from it, with no pressed fill. It does not render
while its panel is under the page, because that panel is always shown. Name the trigger for the
panel, such as `Navigation`, so a screen reader announces "Navigation, collapsed, button".

`AppShell.Rail` is a 24px strip on the edge between a panel and the page, with a 2px line under the
pointer and on focus. Render it after the navbar or before an aside, and name it with `openLabel`
and `closeLabel`. It is not in the tab order, because the trigger and the shortcut open and close
the same panel. It does not render while its panel is over or under the page, and the recipe hides
it under a coarse pointer.

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

## FloatingPanel

Renders a window over the page that a person opens from a trigger, moves by its header and resizes
from its edges and corners. The page around the window remains in use.

```tsx
import { FloatingPanel } from "@stealthscale/component-screen";

<FloatingPanel.Root>
  <FloatingPanel.Trigger as={Button}>Notes</FloatingPanel.Trigger>
  <Portal>
    <FloatingPanel.Positioner>
      <FloatingPanel.Content>
        <FloatingPanel.Header>
          <FloatingPanel.DragTrigger>
            <GripHorizontalIcon aria-hidden />
            <FloatingPanel.Title>Launch notes</FloatingPanel.Title>
          </FloatingPanel.DragTrigger>
          <FloatingPanel.Control>
            <FloatingPanel.StageTrigger stage="minimized">
              <MinusIcon />
            </FloatingPanel.StageTrigger>
            <FloatingPanel.StageTrigger stage="maximized">
              <Maximize2Icon />
            </FloatingPanel.StageTrigger>
            <FloatingPanel.StageTrigger stage="default">
              <Minimize2Icon />
            </FloatingPanel.StageTrigger>
            <FloatingPanel.CloseTrigger>
              <XIcon />
            </FloatingPanel.CloseTrigger>
          </FloatingPanel.Control>
        </FloatingPanel.Header>
        <FloatingPanel.Body>…</FloatingPanel.Body>
        <FloatingPanel.ResizeTriggers />
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </Portal>
</FloatingPanel.Root>;
```

The recipe has no axes.

- The root takes the machine's options: `open` or `defaultOpen` with `onOpenChange`, `size` or
  `defaultSize` with `onSizeChange` and `onSizeChangeEnd`, `position` or `defaultPosition` with
  `onPositionChange` and `onPositionChangeEnd`, `minSize`, `maxSize`, `getAnchorPosition`,
  `getBoundaryEl`, `allowOverflow`, `draggable`, `resizable`, `disabled`, `lockAspectRatio`,
  `gridSize`, `persistRect`, `closeOnEscape`, `initialFocusEl`, `finalFocusEl`, `restoreFocus` and
  `onStageChange`. The panel is 320 by 240 pixels unless stated, at least 240 by 100, and closes on
  Escape unless `closeOnEscape` is false.
- The panel opens in the middle of the window, or where `getAnchorPosition` places it from the
  trigger's and the window's rectangles. A drag can take the panel past the window's edge by the
  distance from the pointer to the panel's edge, and `allowOverflow={false}` keeps it inside.
- A controlled panel remains open until `open` turns false. The trigger, the close trigger and
  Escape call `onOpenChange` with `{ open: false }`.
- The positioner is fixed to the window at the `banner` layer plus the panel's place among the open
  panels: above the page's sticky bands, and under a backdrop, a dialog, a popover, a toast and a
  tooltip. Render it in a portal. A press or focus inside a panel brings it in front, and Escape
  closes the panel in front.
- The trigger opens and closes the panel and sets `aria-expanded` and `aria-haspopup="dialog"`.
  Focus moves to the panel as it opens, or to the element `initialFocusEl` returns, and returns to
  the trigger as it closes.
- The panel is a `dialog` that is not modal, named by its title. A panel without a title takes
  `aria-label`. Tab moves from the trigger into the panel and from the panel's last control to the
  control after the trigger, wherever the portal puts the panel.
- While the panel itself has focus, the arrow keys move it in the arrow's direction under both
  writing directions: 1px at a time and 10px with Shift, times `gridSize`. Alt with an arrow resizes
  it from its end and bottom edges and keeps its aspect ratio under `lockAspectRatio`.
- A drag on `FloatingPanel.DragTrigger` moves the panel, and a double click maximizes it and
  restores it. A press on a button inside the drag trigger does not start a drag. The cursor is
  `move` while the panel can move.
- The resize triggers are 8px strips inside the panel's edges and 8px squares at its corners. Shift
  keeps the aspect ratio during a drag and Alt resizes from the centre. They are hidden while the
  panel is minimized or maximized, disabled or not resizable. `FloatingPanel.ResizeTriggers` renders
  all eight, or those `axes` lists.
- `FloatingPanel.StageTrigger` sets `minimized`, the header alone, `maximized`, the whole window, or
  `default`, the size and place before. Minimize and Maximize show while the panel is at its size,
  and Restore while it is minimized or maximized. A stage trigger hidden with focus moves focus to
  the trigger that reverses it. The stage triggers are hidden while the panel is not resizable.
- `label` names each trigger: "Minimize", "Maximize" and "Restore" by stage, and "Close" for
  `FloatingPanel.CloseTrigger`. Both render the actions `Button` as a ghost `xs` square around the
  caller's glyph.
- `FloatingPanel.Body` renders the primitives' scroll area, whose viewport is a region named by the
  title while its content overflows. It is hidden while the panel is minimized.
- The panel has the `bg.panel` surface, the `lg` shadow, a transparent hairline edge that forced
  colours paint in `CanvasText`, and a ring outside it under keyboard focus. It is not in the
  document before it first opens, and leaves once its exit motion ends. `lazyMount` and
  `unmountOnExit` default to `true`.

| Part                           | Element                         |
| ------------------------------ | ------------------------------- |
| `FloatingPanel.Root`           | `div`, `display: contents`      |
| `FloatingPanel.Trigger`        | `button`                        |
| `FloatingPanel.Positioner`     | `div`                           |
| `FloatingPanel.Content`        | `div`, role `dialog`            |
| `FloatingPanel.Header`         | `div`                           |
| `FloatingPanel.DragTrigger`    | `div`                           |
| `FloatingPanel.Title`          | `h2`                            |
| `FloatingPanel.Control`        | `div`                           |
| `FloatingPanel.StageTrigger`   | `button`                        |
| `FloatingPanel.CloseTrigger`   | `button`                        |
| `FloatingPanel.Body`           | `div` inside a scroll area      |
| `FloatingPanel.ResizeTrigger`  | `div`                           |
| `FloatingPanel.ResizeTriggers` | a `ResizeTrigger` for each axis |

The panel does not offer these:

- `strategy`. The machine computes the panel's place in window coordinates, so the panel is fixed to
  the window.
- `translations`. The triggers take `label`.
- The machine's api. A caller controls `open`, `size` and `position`, and the stage triggers set the
  stage.
- A boundary that scrolls with the page. The machine measures `getBoundaryEl` when it resizes, so
  the panel remains inside a boundary that does not scroll with the page, such as an app shell's
  main region, and leaves one that does.

A menu, a select or a combobox opened inside the panel stacks at the `dropdown` layer, under the
panel.

## Page

Lays out a page as a column of bands: a banner, a header, a navigation, a toolbar, a body with an
optional aside, and a footer.

```tsx
import { Page } from "@stealthscale/component-screen";

<Page.Root measure="wide">
  <Page.Header>
    <Page.Breadcrumbs backIcon={<ArrowLeftIcon />} items={[{ href: "/", label: "Ledger" }]} />
    <Page.Title>Users</Page.Title>
    <Page.Meta when="wide">…</Page.Meta>
    <Page.Description>Everyone with access to this ledger.</Page.Description>
    <Page.Actions more="More actions" moreIcon={<EllipsisIcon />}>
      <Page.Action icon={<SettingsIcon />}>Settings</Page.Action>
      <Page.Action>Preview</Page.Action>
      <Page.Action icon={<PlusIcon />} primary>
        Add user
      </Page.Action>
    </Page.Actions>
  </Page.Header>
  <Page.Nav aria-label="User lists">
    <Page.TabList
      aria-label="Views"
      emptyLabel="No view matches"
      filterLabel="Filter views"
      onValueChange={setView}
      value={view}
    >
      <Page.Tab count={412} value="all">
        All
      </Page.Tab>
      <Page.Tab value="suspended">Suspended</Page.Tab>
    </Page.TabList>
  </Page.Nav>
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
- A page folds below 40rem. A narrow page sets its title one heading size smaller and its actions
  one button size smaller.
- `size` sets the title one heading size larger than a section's title at the same size.
- The root has no landmark, because `AppShell.Main` is the `main` landmark. The header takes its
  name from `Page.Title`.
- `Page.Action` renders the library's button, `outline`, or `solid` with `primary`. `as` renders
  another control in its place, such as a menu's trigger, and the caller sets its look.
- `when="narrow"` renders a part on a folded page alone, and `when="wide"` on an unfolded page
  alone. `Page.Context`, `Page.Meta`, `Page.Leading`, `Page.Actions`, `Page.Action`, `Page.Nav` and
  `Page.Footer` take it, and `<Page.When when="narrow">` wraps anything else.
- Each sticky band sticks under the sticky bands before it.
- `Page.Aside` is a complementary landmark beside the body from the `lg` breakpoint. Name it with
  `aria-label`. Below `lg` it stacks under the body, or leaves the page with `folds="hide"`.
  `sticky` keeps it in view under the shell's pinned bars.
- A sticky aside renders its content in the primitives package's scroll area. Beside the body the
  aside is at most as tall as the area that scrolls the page, less the pinned bars, the sticky bands
  and a gap at each end. A longer aside scrolls on its own, and its viewport is a region named like
  the aside, with a tab stop.
- A section scrolled to by its id stops a gap under the shell's pinned bars.
- The page has no `palette` and no `effect` axis, because it is a layout.

### Breadcrumbs

`Page.Breadcrumbs` takes the pages above this one as `items`, the nearest last, each with `href`,
`label` and an optional `onClick`. The navigation package's breadcrumb renders them in the context
row, named by `label`, with `separator` between the items. On a narrow page one link back to the
nearest item replaces the trail, with `backIcon` before its words.

### Tabs

`Page.TabList` selects one of its `Page.Tab` children by value. The caller controls the value with
`value` and `onValueChange`, or sets `defaultValue`, and the first tab is selected until then.
`Page.Tab` takes its words as a string and an optional `count`, which renders as a badge.

- A wide page renders the disclosure package's tabs on the navigation band, 48px tall at `md`, and
  `Page.Body` is the selected tab's panel.
- On a narrow page a button with `pickerIcon` replaces the strip and opens a list of the tabs. The
  list filters as the reader types into a field named by `filterLabel`, and shows `emptyLabel` when
  the query matches no tab.
- `Page.Picker` and `Page.Palette` are that button and its panel, for a caller that composes its own
  picker: `<Menu.Trigger as={Page.Picker}>`, and the menu's content rendered as `Page.Palette`.

## Section

Renders one part of a page under its own heading, with the actions that apply to it.

```tsx
import { Section } from "@stealthscale/component-screen";

<Section.Root variant="surface">
  <Section.Header>
    <Section.Title>Payment methods</Section.Title>
    <Section.Description>Cards this account can be charged on.</Section.Description>
    <Section.Actions>
      <Section.Action icon={<PlusIcon />}>Add a card</Section.Action>
    </Section.Actions>
  </Section.Header>
  <Section.Body bleed>…</Section.Body>
</Section.Root>;
```

| Axis        | Values             | Default |
| ----------- | ------------------ | ------- |
| `annotated` | `true`             | none    |
| `size`      | `sm`, `md`, `lg`   | `md`    |
| `variant`   | `plain`, `surface` | `plain` |

- The element is `section`. While a `Section.Title` is mounted, the title names it, so it is a
  region landmark with the title as its name.
- A section without `size` takes the page's size, so one `size` on `Page.Root` sets every section in
  it.
- `Section.Action` renders the library's button one size below the section, `outline`, or `solid`
  with `primary`. `Section.Actions` takes `more` and `moreIcon` for its menu of folded actions.
- A section folds when it is narrower than 40rem. An annotated section folds when it is narrower
  than 48rem, because its header and body share the row.
- A plain section after another renders a hairline above itself with a gap on either side.
- `annotated` lays out the header and the body as two columns on a wide section, the layout of a
  settings page.
- `Section.Body bleed` drops the body's padding in a card and runs it to the card's edges under a
  hairline, for a table or a list whose rows pad themselves.
- The section has no `palette` and no `effect` axis, because it is a layout.

## Sidebar

Lays out an application's navigation as a column: a fixed header, scrolling content with nav blocks,
and a fixed footer.

```tsx
import { NavList } from "@stealthscale/component-navigation";
import { Sidebar } from "@stealthscale/component-screen";

<Sidebar.Root variant="subtle">
  <Sidebar.Header>
    <Sidebar.Search
      aria-label="Find a page"
      clearIndicator={<XIcon />}
      clearLabel="Clear the filter"
      placeholder="Filter…"
      searchIndicator={<SearchIcon />}
      shortcut="k"
    />
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Nav>
      <Sidebar.NavLabel>Platform</Sidebar.NavLabel>
      <NavList.Root>…</NavList.Root>
    </Sidebar.Nav>
    <Sidebar.Separator />
    <Sidebar.Nav>
      <Sidebar.NavLabel>Projects</Sidebar.NavLabel>
      <Sidebar.NavAction aria-label="New project">
        <PlusIcon />
      </Sidebar.NavAction>
      <NavList.Root>…</NavList.Root>
    </Sidebar.Nav>
    <Sidebar.Empty>No pages match</Sidebar.Empty>
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
- The content scrolls and the root does not, so the header and the footer remain visible. The
  content is the primitives package's scroll area, with the theme's thin bar. Its viewport is
  outside the tab order, because a link that takes focus scrolls into view. The header and the
  footer pad like the rows, so a search, a switcher or a list in them is as wide as the rows' fills.
- The size sets the rows of every list inside: 24, 32 and 40px at `sm`, `md` and `lg`. A block's
  label is one row tall.
- The content's blocks are 12, 16 and 24px apart at `sm`, `md` and `lg`, three to four times the gap
  between rows. A `Sidebar.Separator` between two blocks sets no margin of its own.
- Each `Sidebar.Nav` is a `nav` landmark named by its `Sidebar.NavLabel` through `aria-labelledby`.
  A block without a label takes `aria-label`, and a caller's `aria-label` replaces the label's name.
- A block whose rows a query matches none of is hidden, its label included, unless it renders an
  empty message.
- `Sidebar.NavHeading` renders a heading over one list inside a block. Pass it an `id`, and pass the
  same identifier to the list's `aria-labelledby`.
- `Sidebar.NavAction` is a 24px ghost square in the navigation list's end column, with the rows' end
  inset. Pass the icon as its child and name it with `aria-label`.
- The sidebar has no `palette` and no `effect` axis. Its looks are neutral grounds, and the
  navigation list offers its own palette and effect for the current row.

### Search

`Sidebar.Search` renders the forms package's search input and takes its props, named by
`aria-label`, `Search` by default. It filters the rows of its scope: every block from the header,
one block from inside a `Sidebar.Nav`. It hides a row whose words do not contain the query and opens
a branch that contains a match. When the query clears, every branch returns to the state it had
before the query.

- The down arrow moves focus from the field to the first row its scope shows.
- `shortcut` moves focus to the field with the platform's modifier held, `k` for ⌘K and Ctrl+K, and
  sets `aria-keyshortcuts` on the field. Inside a closed app shell panel, the shortcut opens the
  panel first.
- `Sidebar.Empty` renders while its scope shows zero rows, and a polite live region announces it
  while a query is active. Put it in the scope the search filters, and name what was searched:
  `No pages match`.
- With children, `Sidebar.Search` contains the caller's field, and the caller filters the rows.

### In an app shell

- Inside a panel that closes to icons, the sidebar is a rail while the panel is closed. `iconic`
  overrides the panel. The labels, the headings and the words in the header and footer are hidden
  visually and kept for screen readers.
- On a rail, a search with `searchIndicator` renders a square button with its name in a tooltip. The
  button opens the panel and moves focus to the field. A rail removes a search without
  `searchIndicator` or outside a panel, the empty message and the block controls.
- In a panel over the page the sidebar renders at `lg`, and a click on a link inside it closes the
  panel.
- The sidebar provides its size and its rail to every `NavList.Root` inside it through
  `NavList.PropsProvider`. A list's own props apply over them.

## Splitter

Lays panels out in a row or a column with a resize trigger between each two. An application starts
the machine with `Splitter.useSplitter` and passes its api to `Splitter.Root`, so a control outside
the root collapses or resizes a panel.

```tsx
import { Splitter } from "@stealthscale/component-screen";

const splitter = Splitter.useSplitter({
  defaultSize: [30, 70],
  panels: [
    { collapsedSize: 0, collapsible: true, id: "notes", maxSize: 50, minSize: 20 },
    { id: "note", minSize: 40 },
  ],
});

<Splitter.Root splitter={splitter}>
  <Splitter.Panel id="notes">…</Splitter.Panel>
  <Splitter.ResizeTrigger id="notes:note" label="Resize the notes list" />
  <Splitter.Panel id="note">…</Splitter.Panel>
</Splitter.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

- `useSplitter` takes the machine's options: `panels`, each with `id`, `minSize`, `maxSize`,
  `collapsible`, `collapsedSize` and `resizeBehavior`, and `orientation`, `defaultSize` or `size`,
  `onResize`, `onResizeStart`, `onResizeEnd`, `onCollapse`, `onExpand` and `keyboardResizeBy`. A
  number is a percentage of the root, and a string with a unit, such as `"200px"`, resolves against
  the root.
- The api reads and changes the sizes: `getSizes`, `setSizes`, `resizePanel`, `collapsePanel`,
  `expandPanel`, `isPanelCollapsed`, `isPanelExpanded` and `resetSizes`. With `size`, the
  application resets by setting its sizes, because the machine records a controlled size as its
  first layout.
- The root is a flex row or column that fills its container, and grows in a flex container, such as
  a column under a toolbar. A panel is a column its content can shrink in. Render content that
  scrolls in the primitives package's scroll area.
- `Splitter.ResizeTrigger` sits between the two panels its `id` names, `before:after`. It is a
  `separator` named by `label`, "Resize" by default. Its value is the before panel's share of the
  root, `aria-controls` points at that panel, and its orientation is its line's: vertical between
  panels in a row. `disabled` removes it from the tab order and hides its pill.
- The arrows move a focused trigger by 1%, or by `keyboardResizeBy`, and by 10% with Shift. Home and
  End move it to the before panel's minimum and maximum. Enter collapses a collapsible before panel
  and restores the size it had before the collapse. F6 moves focus to the next trigger.
- The trigger is 8px across, 24px under a coarse pointer, and stacks above the panels' content. It
  renders a hairline and a pill, which children replace. The palette colours the line and the pill
  while the pointer is over the trigger, while it has focus and while it drags. Under forced colours
  the line is `CanvasText`, an active pill `Highlight` and its ring `CanvasText`.

| Part                              | Element                 |
| --------------------------------- | ----------------------- |
| `Splitter.Root`                   | `div`                   |
| `Splitter.Panel`                  | `div`                   |
| `Splitter.ResizeTrigger`          | `div`, role `separator` |
| `Splitter.ResizeTriggerSeparator` | `div`                   |
| `Splitter.ResizeTriggerIndicator` | `div`                   |

The splitter does not offer the machine's `ids`: the hook builds each id from the encoded panel id,
so an id with a space makes a valid `aria-controls`.

## Switcher

Renders the control that shows the current workspace, project or environment and opens a menu of the
others. `Switcher.Root` is the disclosure package's `Menu.Root`, so the roles, the keyboard and the
positioning are the menu's.

```tsx
import { Switcher } from "@stealthscale/component-screen";

<Switcher.Root
  checkIcon={<CheckIcon />}
  indicator={<ChevronsUpDownIcon />}
  items={[
    { detail: "Pro plan", label: "Ledger", value: "ledger" },
    { detail: "Free plan", label: "Atlas", value: "atlas" },
  ]}
  label="Workspace"
  onValueChange={setWorkspace}
  value={workspace}
>
  <Switcher.Action icon={<PlusIcon />} onClick={create}>
    New workspace
  </Switcher.Action>
</Switcher.Root>;
```

| Axis        | Values                                                                             | Default |
| ----------- | ---------------------------------------------------------------------------------- | ------- |
| `palette`   | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | none    |
| `placement` | `alone`, `sidebar`, `toolbar`                                                      | `alone` |
| `size`      | `sm`, `md`, `lg`                                                                   | `md`    |
| `variant`   | `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`                          | `ghost` |

- `items` lists the choices, each with `value`, `label` and an optional `detail`, `mark`, `disabled`
  and `href`. A choice without `mark` shows its initials. A choice with `href` is a link row.
- The value is the caller's with `value` and `onValueChange`, and the root's own otherwise, starting
  at `defaultValue` or the first choice.
- `label` names what the switcher switches. The trigger renders it as visually hidden text before
  the name, so a screen reader announces `Workspace Ledger`, and the visible name stays in the
  accessible name.
- `Switcher.Action` renders a menu row with `icon` after a separator under the choices.
- `Switcher.Root` reads the sidebar or the toolbar around it for `placement` and `size`, unless the
  caller states them.
- In a sidebar the switcher fills the column and opens a menu as wide as the control. In a sidebar
  closed to icons it is its mark alone, a 32px square at `md`, with its name in a tooltip, and its
  menu opens beside the rail.
- Alone and in a toolbar the switcher is one line as wide as its words, at least as tall as a button
  of its size. In a narrow toolbar a switcher with a mark hides its name.
- The looks and the palettes are the button's. The outline look has the button's light edge.
- Render the menu's positioner in a `Portal` when the switcher is inside an element that clips, such
  as an app shell panel, so the menu renders over the page.

Without `items`, the children are the trigger and the menu, composed from the switcher's parts and
the menu's own:

```tsx
<Switcher.Root placement="toolbar">
  <Toolbar.Item as={Switcher.Trigger} label="Environment">
    <Switcher.Label>
      <Switcher.Name>Production</Switcher.Name>
    </Switcher.Label>
    <Switcher.Indicator>
      <ChevronsUpDownIcon />
    </Switcher.Indicator>
  </Toolbar.Item>
  <Portal>
    <Menu.Positioner>…</Menu.Positioner>
  </Portal>
</Switcher.Root>
```

## Toolbar

Renders a row of controls over a table or a list: a band at each end, a band in the middle, and a
search that folds to a button on a narrow row.

```tsx
import { Toolbar } from "@stealthscale/component-screen";

<Toolbar.Root aria-label="Invoices" more="More actions" moreIcon={<EllipsisIcon />}>
  <Toolbar.Start>
    <Toolbar.Link current href="/invoices/drafts">
      Drafts
    </Toolbar.Link>
    <Toolbar.Link href="/invoices/sent">Sent</Toolbar.Link>
    <Toolbar.Separator />
    <Toolbar.Group>
      <Toolbar.Action icon={<BoldIcon />}>Bold</Toolbar.Action>
      <Toolbar.Action icon={<ItalicIcon />}>Italic</Toolbar.Action>
    </Toolbar.Group>
  </Toolbar.Start>
  <Toolbar.End>
    <Toolbar.Search aria-label="Search invoices" searchIndicator={<SearchIcon />} />
    <Toolbar.Action>Export</Toolbar.Action>
    <Toolbar.Action primary>New invoice</Toolbar.Action>
  </Toolbar.End>
</Toolbar.Root>;
```

| Axis      | Values                        | Default |
| --------- | ----------------------------- | ------- |
| `radius`  | `l1`, `l2`, `l3`              | `l2`    |
| `size`    | `sm`, `md`, `lg`              | `md`    |
| `variant` | `outline`, `plain`, `surface` | `plain` |

- The row has `role="toolbar"`, and the arrow keys move focus between its controls, so the row is
  one tab stop. Name it with `aria-label`.
- The row measures its own width and writes `data-narrow` below `sm`. Its gap is the gap token of
  its size, and every library button in it renders at its size.
- `Toolbar.Action` renders the library's button, `ghost`, or `solid` with `primary`, and folds by
  its priority.
- `Toolbar.Link` renders an `a` in the same look with `href`, `current` and `icon`. `current` sets
  `aria-current="page"`. Its `onClick` takes a router's anchor handler, and its menu row calls the
  same handler.
- `Toolbar.Group` joins controls pressed together, such as bold, italic and underline.
- `Toolbar.Item` renders a link when it has an `href` and a button otherwise, and both stay in the
  arrow-key group. Pass `as` to render another component as the item: `as={Switcher.Trigger}` or a
  menu's trigger.
- `Toolbar.Search` renders the forms package's search input and takes its props, named by
  `aria-label`, `Search` by default. On a narrow row it renders a button with `searchIndicator`, or
  with its name without one, that opens the field over the whole row, the padding and the edge of an
  outline or surface row included. Escape on the empty field, or focus leaving it, closes the field
  and returns focus to the button.
- The toolbar has no `palette` and no `effect` axis, because it is a layout for controls that have
  their own.
