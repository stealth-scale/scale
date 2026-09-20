---
"@stealthscale/component-disclosure": patch
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
