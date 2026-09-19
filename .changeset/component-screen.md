---
"@stealthscale/component-screen": minor
---

component-screen: publish AppShell, Page, Section, Sidebar, Switcher and Toolbar

- A screen component folds on its own width and never on the window's. Each one measures the element
  it draws against the width a breakpoint starts at, reads that width through `widthOf`, and writes
  `data-narrow` for the recipes to select on. A page beside an open sidebar therefore folds on the
  room the sidebar left it while the window is still wide, and a consumer writes no breakpoint.
- A row of actions folds by priority rather than by measurement. A primary action keeps its words, a
  secondary one keeps them for a screen reader alone, and a tertiary one leaves the document. Three
  rules and no JavaScript. The source this was ported from had each action register itself into a
  menu from an effect, which React 19 reports and which filled the menu in one render after it
  opened.

- `AppShell` lays an application out: bars across the top and the bottom, and a body between them
  holding a panel down either side of the page. Eight parts under one namespace and ten slots.
- Each panel says how it closes and where it goes when the shell runs out of room. `collapse` takes
  `hide` or `icons` and decides what closing it beside the page leaves. `folds` takes `over` or
  `under` and decides where it goes once the shell is too narrow to hold it there. The source had
  one enum carrying both, so a panel could not close to icons beside the page and stack under it on
  a phone.
- A trigger anywhere in the shell reaches a panel by name through a store the panels write to and
  `useSyncExternalStore` reads. The source kept the same list in `useState` and wrote it from a
  layout effect, which React 19 reports. A write that changes nothing tells nobody, so a panel that
  publishes the same facts every render costs its readers nothing.
- `useAppShellPanel(name)` reads a panel from an application's own code, which is how a navigation
  closes when a destination is pressed. `useNearestPanel` reads the panel a part is inside, and
  `useOverlaid` reads what stands over the page.
- A panel over the page makes the bars, the page and the other panels inert, takes the reader in,
  and gives focus back to the control that opened it. Escape and the backdrop put it away. It claims
  no dialog role, because inert already gives a reader what the role would promise: nothing behind
  it to reach, a key to leave by, and the control still under the cursor on return.
- The reader is taken in and handed back on what the panel store says rather than on the panel's own
  state, and the control that opened the panel is written down while the press is still being
  handled. A browser refuses to focus anything inert and takes focus off anything it has just made
  inert, so a move read off the panel's own state was a frame out on both sides: the reader was left
  on the body when the sheet opened, and left inside the sheet when it closed.
- A panel over the page starts closed whatever it was beside the page, and starts closed again every
  time the shell crosses the width. The width is held beside the answer and compared while
  rendering, which is how React drops state a prop has made stale. The source compared the wrong
  pair and never reset, so an application dragged narrow opened with its navigation across the page.
- The backdrop is drawn once and fades rather than mounting and unmounting. The fade therefore runs
  both ways. While nothing stands over the page it takes neither a press nor a reading.
- `AppShell.Rail` and `AppShell.Section` are gone. The rail's selectors never matched the markup the
  source drew, its `col-resize` cursor promised a resize it did not do, and the trigger does the
  same job on every pointer. A panel's bands are `Sidebar`'s.
- Two axes: `scroll` and `variant`. `scroll="window"` pins each bar under the ones before it and
  sticks the panels under all of them.

- `Page` lays a page out: a banner, a header, a navigation, a body and a footer. Twenty-one parts
  and twenty slots.
- The header is a grid of three rows, so the context above the title, what leads it, the title, the
  marks beside it, the actions and the description are written flat and placed by name.
- The root carries no landmark, because `AppShell.Main` draws `main` and a page that claimed one as
  well would give a reader two to choose between on the same screen. The header names itself from
  `Page.Title`, so a caller writes no identifier.
- The gutter and the measure are properties the root states and every band reads, so one value moves
  all of them and a band that bleeds reads the same numbers to line its own cells up.
- `Page.When` draws a part at one width only, and `Page.Picker` is the control a folded page offers
  in place of a strip of tabs. The picker states neither `aria-expanded` nor `aria-controls`,
  because it is a disclosure's trigger rather than a disclosure.
- Five axes: `align`, `divided`, `gutter`, `measure` and `size`.

- `Section` draws one block of a page under its own heading. Nine parts and nine slots.
- The element is `section` and it names itself from `Section.Title`, so a reader jumping by landmark
  hears the heading rather than an unnamed region, and a caller wires nothing.
- A section that states no size takes the page's, so one value on `Page.Root` sets every section
  under it.
- Three axes: `annotated`, `size` and `variant`. `variant` takes `plain` and `surface`, which are
  the names `Sidebar` and `Toolbar` draw the same rule under and the names the vocabulary's looks
  carry. A value called `card` would have named another component.

- `Sidebar` gathers what a person moves around an application by. Ten parts and ten slots.
- The content scrolls rather than the column, so a switcher at the head and an account at the foot
  stay where a reader left them however long the list of destinations grows.
- Each `Sidebar.Nav` derives its own identifier and its heading carries it, so the block names its
  landmark from its heading and a caller writes neither. A heading drawn outside a block throws
  where it was written.
- `iconic` is a prop the shell passes rather than state the sidebar measures. The shell decides how
  wide the sidebar is, so a sidebar that measured itself would disagree with the shell for one frame
  every time it moved.
- Two axes: `size` and `variant`.

- `Switcher` draws the control at the head of a sidebar that names what is being worked in. Eleven
  parts and ten slots. The root draws nothing and carries the variants, because a disclosure places
  its list outside the trigger and the list still has to read them.
- `Switcher.Trigger` states a `label` that a screen reader reads before the name, so
  `Workspace Acme` says what pressing the control changes.
- Two axes: `size` and `variant`.

- `Toolbar` draws a row of controls over a table or a list. Nine parts and eight slots.
- The row carries `role="toolbar"` and moves focus with the arrow keys, so it is one stop in the tab
  order rather than one per control.
- `Toolbar.Item` picks its own element from whether it was given an `href`, so a link in the row is
  a link and a control is a button, and both stay in the roving focus group. Handing `as` to a bound
  part replaces the component, which silently took an item out of the group.
- `Toolbar.Search` is laid over the row while it is open. Opening it puts the reader in the field
  and closing it puts them back on the control they pressed, because that control is under the field
  while the field is open.
- `Toolbar.Separator` draws the divider on its end and states `aria-orientation="vertical"`. It drew
  a horizontal rule stretched to the row's height, which is a box with a bottom border rather than a
  line between two sets of controls, and announced as parting what was above it from what was below.
- Three axes: `radius`, `size` and `variant`.

- A rule reaching from one part of a recipe to another selects the class the binding writes, built
  from the recipe's own class name. `Page`'s rule dropping the header's hairline above a navigation
  selected `[data-part=nav]`, which nothing in this repository stamps, and its specification
  asserted the same dead selector.

component-screen: give the page a gutter by default and set its title larger than a section's

- `Page` stated no `gutter` in its defaults, so `--page-gutter` was unset and every band's inline
  padding fell to 0. The default is `md`.
- `size` sets the title one heading step larger than a section's at the same step: `heading.md` at
  `sm`, `heading.lg` at `md` and `heading.xl` at `lg`. The two were set in the same role, so an h1
  and an h2 read at one size.
- The body and the banner inset on the block axis alone, so the gutter holds on the inline axis.

component-screen: part plain sections with room round the hairline

- A plain `Section` after another draws its hairline with `gap.2xl` above and below, so two sections
  read as two. The hairline had no room on either side.

component-screen: add the divided axis to AppShell and fill a pinned bar

- `AppShell divided` draws a hairline on the inner edge of each bar and each panel: under the
  header, over the footer, on the end of the navbar and on the start of the aside. Default `true`.
- A header or a footer told to stick takes `bg` as its fill, the way a page's pinned band does. It
  had none, so the page showed through it.

component-screen: add the subtle variant to Sidebar

- `Sidebar variant="subtle"` is `bg.subtle` and no line, for a sidebar inside a shell panel where
  the shell draws the hairline.

component-screen: add the placement axis to Switcher

- `Switcher placement="toolbar"` takes the width of its words and drops the detail. `sidebar`, the
  default, fills the column as before. The root's `inlineSize: full` moved from the base into the
  `sidebar` value.
- `Switcher.Root` types its own `size` and `variant` over the menu's, whose `variant` axis it
  intersected to a type no value satisfied.

component-screen: measure the toolbar and let an item draw any control

- `Toolbar.Root` measures its own width and writes `data-narrow` below `sm`, which is what folds a
  `Toolbar.Action` by its priority and shows `Toolbar.Folded`. Nothing wrote the attribute before
  this, so the row never folded.
- `Toolbar.Item as={…}` draws the component named with the row's tab stop on the element it renders,
  and takes that component's props beside its own: `as={Button}`, `as={Switcher.Trigger}`.

component-screen: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-screen: draw the shell the way a page is read

- A pinned bar of the shell is filled with the panel surface rather than the page, so it reads as a
  thing laid over the page.
- A toolbar's gap is the gap two steps smaller than its size, so a bar of icon buttons reads as one
  bar.
- A page opens at the extra-large gutter, its header keeps closer to its body than to the bar before
  it, and its context is set a text step smaller than the page.
- A section's title is a heading step and its description a text step smaller than the page's, in
  the page's own ink, and its bands are parted by the gap two steps larger than the size.
- A switcher holds its size's control height with no padding on the block axis, sets its name
  semibold and its control in the neutral palette's ink, and in a toolbar draws its mark as a tinted
  square with a wider gap. The tick of an option is placed at the row's end whatever the menu
  states, and the mark that opens the list holds still and centred as the list opens.
