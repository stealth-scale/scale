---
"@stealthscale/component-disclosure": minor
---

component-disclosure: read the theme's stroke widths

- The collapsible's frame, the menu's, the popover's and the tooltip's panels and arrows, the
  enclosed tab's segment and the tab strip's rule read `borderWidths.hairline`, and the line tabs'
  indicator reads `borderWidths.indicator`, rather than the reference widths `sm` and `md`.

component-disclosure: keep an indicator out of the name its control is announced by

- `Menu.Indicator`, `Popover.Indicator` and `Collapsible.Indicator` sit inside the control they
  belong to. Everything inside a control is read as part of that control's accessible name, so a
  trigger named `Workspace Acme` announced as `Workspace Acme ▾`. Each now states `aria-hidden`.
  `Menu.ItemIndicator` already did.
- `Tabs.Indicator` is the bar that slides under the control in force. It is one of the strip's
  children and carries neither a role nor any words, so a reader stepping through the strip met one
  more thing to pass. It states `aria-hidden` once it has something to measure. Which control is in
  force is `aria-selected` on the control itself.
- None of the machines writes the attribute, and `Collapsible.Indicator` documented that one did. A
  caller whose mark says something the control's name does not can state `aria-hidden={false}`.

component-disclosure: hold the menu and popover marks still for a reader who asked for no motion

- Both indicators turn half a revolution as the panel opens, over a transition neither held at zero
  under `_motionReduce`. `NavList`'s identical mark already did.

component-disclosure: draw the menu indicator as a span

- `Menu.Indicator` drew a `div` inside the trigger, and a button holds phrasing content alone. It
  draws a `span`.

component-disclosure: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-disclosure: draw no ring on a menu's panel

- The machine moves focus onto the panel as it opens, and the ring drawn for that read as the panel
  being selected rather than as the highlighted row. The panel keeps `outline: 0` and no ring.

component-disclosure: draw the indicator of every tab look

- The enclosed and subtle indicators take the width and the height the machine measures. They
  rendered at two by two and nothing at all, so the selected tab was unmarked in both looks. The
  indicator sits behind the label and takes no pointer input.
- The collapsible's mark names `rotate` as the property it turns in rather than `transform`, which
  it never changed.

component-disclosure: hold a popover to the width of the control that opened it

- The panel reads `min-inline-size: var(--reference-width)`, the width the machine measures the
  control at and writes on the positioner. A panel narrower than its trigger reads as belonging to
  something else on the page. It is a minimum, so a panel whose contents need more room takes it.

component-disclosure: add ItemMark, ItemLines, ItemDescription and ItemCommand to the menu

- `Menu.ItemMark` renders a tinted square at the start of a row for an initial, an icon or an
  avatar. It is sized from `sizes.tag` at the menu's `size`.
- `Menu.ItemLines` stacks `Menu.ItemText` over `Menu.ItemDescription` in one column. Both lines
  truncate at the same edge. The description uses `fg.subtle` and the `caption` text style.
- `Menu.ItemCommand` renders a `kbd` at the end of a row in `fg.muted`, one text step under the row.
- `Menu.ItemIndicator` is placed at the end of the row and keeps its box while the row is unchecked,
  so the panel does not resize when a tick is removed. The reserved gutter for a tick is removed.
  `inset` still reserves the gutter for an icon.
- The panel is at least as wide as its trigger (`--reference-width`) and grows to its widest row.
  The separator spans the panel's full width. A group label uses `fg.subtle` and one text step under
  the rows. The panel's corners are `l2`. Its shadow is `md` for `surface` and `lg` for `elevated`.
- A checkbox `Menu.OptionItem` keeps the menu open on select. A radio item closes it.
  `closeOnSelect` overrides either.
- `Menu.Indicator` no longer rotates when the menu opens.

component-disclosure: split a root's props over a copy

- `Collapsible.Root`, `Menu.Root`, `Popover.Root`, `Tabs.Root` and `Tooltip.Root` split their props
  through `splitEnumerable` from `@stealthscale/hooks`. Rendered with a `key`, each logged React's
  `key is not a prop` warning and spread `key` onto its element in development.

component-disclosure: style the popover's trigger as a control

- `Popover.Trigger` takes the cursor, the focus ring and the disabled look of a control, and lays
  its children out in a row a gap apart. It carried no rules at all, so it fell back to the
  browser's own focus ring and the arrow cursor. It still draws no fill, edge or padding: a caller
  who wants a button passes one through `as`.
- `Collapsible`'s `variant` lists its looks from the loudest down rather than alphabetically.

component-disclosure: import omitUndefined from the hooks package

- The collapsible, menu, popover, tabs and tooltip machines take `omitUndefined` from
  `@stealthscale/hooks`. The package's private copy, `stated`, is removed.

component-disclosure: take a palette on the collapsible

- Breaking: `Collapsible.Root` takes `palette`, the eight semantic palettes, in place of `status`.
  Replace `status="warning"` with `palette="warning"`. The default is `neutral`, as before.
- The collapsible has no `effect` axis. Its box holds content as well as the trigger.

component-disclosure: add a palette axis to the tabs

- `Tabs.Root` takes `palette`, over the eight palettes. The line indicator, the subtle indicator and
  the selected tab's text read it. Every palette is emitted.
- The tabs have no `effect` axis. The indicator moves on every selection.
- Breaking: `Tabs.Root` no longer takes `translations`. Pass the list's name as `aria-label` on
  `Tabs.List`.

component-disclosure: document the tooltip's parts

- The README's Tooltip section gains a parts table. The tooltip has no `palette` axis, because both
  looks use neutral surfaces, and no `effect` axis, because it is not a control.

component-disclosure: take the popover's close label as a prop

- Breaking: `Popover.Root` no longer takes `translations`. Pass the close trigger's name as
  `aria-label` on `Popover.CloseTrigger`. Without one the machine names it "close".
- The README's Popover section gains a parts table. The popover has no `palette` axis, because every
  look uses a neutral surface, and no `effect` axis, because a panel is not a control.

component-disclosure: add a palette axis to the menu

- `Menu.Root` takes `palette`, over the eight palettes, and sets it on the panel. Every row, the
  highlight and every submenu inherit it, and a critical row keeps the error palette. The default is
  `neutral`, which every row set before. Every palette is emitted.
- The menu has no `effect` axis. The highlight moves with the pointer and the arrow keys, and a glow
  would move with it.
- The README's Menu section gains a parts table. It no longer lists `anchorPoint`, which the
  machine's types declare and the machine never reads, and it gives the panel's minimum width as
  `sizes.44`.

component-disclosure: round the subtle collapsible's trigger

- The subtle look's trigger reads `borderRadius: l2`, the root's radius, so its hover fill follows
  the root's corners. It filled a square box inside the rounded root. An open trigger squares its
  two bottom corners against the content.

component-disclosure: keep a menu or popover open when its press closes another

- `Menu.Root` and `Popover.Root` pass `onRequestDismiss` to the machine. The handler cancels a
  dismissal unless the removed overlay contains the control whose `aria-controls` names the closing
  panel, then calls the caller's `onRequestDismiss`.
- Zag 1.44 closes an overlay one animation frame after a press outside it, and removing a layer
  dismisses every layer registered after it. A press on a second menu's trigger opened that menu and
  closed it within the frame, so it took a second press. A submenu still closes with its menu, and a
  popover opened from inside another popover still closes with it.

component-disclosure: line up a menu's inset rows with its icon rows

- A row sizes an `svg` it starts with to `sizes.icon` one size smaller than the row: 16px at `md`.
- `inset` pads only a row that starts with neither an `svg` nor a `Menu.ItemMark`. It padded every
  row, so the text of an icon row started a gutter further in than the text of a plain row. With
  `inset`, the text of every row in the catalogue's column menu starts 36px from the row's edge.
- The gutter multiplies each of its three terms by the density, as the row does.
- `Menu.Indicator` mirrors under `dir="rtl"`, so a submenu row's chevron points to the side the
  submenu opens on.
