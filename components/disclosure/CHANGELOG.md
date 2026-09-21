# @stealthscale/component-disclosure

## 0.1.1

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: hold every package to the barrel rule its ADR already states
  
  - ADR-0018 puts a specification beside every source file, the barrels included, and records that the
    conformance suite holds a package to it "where the package asks with `barrels: true`, which every
    component package does". Ten of the sixteen asked for nothing, so the rule was written down and
    enforced nowhere in them.
  - `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
    `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
    them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
    barrels, and `collections`' collection barrel.
  - A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
    binding is among them, which is what catches a leaked binding and a dropped export.
  - Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
    decision covers them and its enforcement note does not, so they are left for a pass of their own.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-disclosure: read the theme's stroke widths
  
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
- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`c441feb`](https://github.com/stealth-scale/config/commit/c441feb7330380a8fe26cf6147ea1d68f7204547) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-disclosure: publish the collapsible
  
  - `Collapsible` shows and hides the block beneath a control, composed as `Collapsible.Root` holding
    a trigger, the block and the mark that turns as it opens. It binds Zag's collapsible machine
    directly, connected once at the root, so every part reads one api from one running machine.
  - The size sets the trigger, the block and the mark from one step of the scale, and the trigger
    reads the control scale so a collapsible lines up with a button of the same size beside it. Four
    looks frame the pair and three decide how the block appears and disappears, each reading an
    animation style the theme owns.
  - The machine writes the accessibility. The control carries `aria-expanded` and points at the block
    with `aria-controls`, a closed block is out of the tab order and the accessibility tree, and the
    mark is kept out of it because the control already reports whether the block is expanded.
  - The root takes the machine's own settings beside the recipe's axes: `open`, `defaultOpen`,
    `onOpenChange`, `disabled`, `collapsedHeight`, `onExitComplete`, `id` and `dir`. It takes no
    element id or direction, because the machine states both and builds every ARIA reference from the
    id.
  - `collapsedHeight` leaves a strip of the block showing while it is closed, which turns a disclosure
    into a preview.
  - The mark holds still for a reader who asked for reduced motion, and a block that starts open does
    not animate in.
  - `Tabs` shows one panel at a time, chosen from a strip of controls, composed as `Tabs.Root` holding
    a list and a panel for each. Each control names the panel it shows with `value` and each panel
    names its control the same way, which is the only pairing the machine cannot work out.
  - Four looks draw the strip, one size sets the controls and the panels from one step, and the strip
    is distributed or shared out between its controls by two more axes. Which way the set runs is not
    an axis: the machine states it and writes it onto every part, and the recipe reads that, so the
    strip turns into a column and the bar moves to its inline edge without it being stated twice.
  - The strip is one tab stop. Only the control in force is reachable by Tab, the arrows move between
    them, and a panel holding nothing focusable takes a tab stop of its own so tabbing out of the
    strip moves to what was just chosen.
  - The bar marking the control in force is positioned from measurements the machine takes, so the
    recipe states its thickness and its colour and never its place.
  - `Tooltip` shows a short label beside whatever a pointer rests on, composed as `Tooltip.Root`
    holding a control and the box it opens. Two looks draw the box and one size sets its room and the
    size of its words.
  - The machine names no root, because a tooltip is a control and a box that floats beside it rather
    than a thing that frames the two. The root draws an element anyway, with `display: contents` so it
    takes part in no layout, because the two are siblings and a slot recipe passes its variants down
    from above them both.
  - The box states its surface once as a custom property and the point reads it from there, so the two
    are never filled in different colours whichever look is picked.
  - Nothing portals. A page whose tooltip is clipped or stacked wrongly wraps the positioner in the
    portal it wants, which keeps that choice with the page and this package off every other component
    package.
  - Focus opens the box only where the focus came from a keyboard, so clicking a control leaves no
    tooltip hanging over the page.
  - `stated` drops the settings a caller left unset before they reach a machine. A machine takes the
    settings it defaults without `undefined` while its own splitter passes every setting through
    carrying it, and which settings default is different for each machine.
  
  - `Popover` opens a panel beside a control, composed as `Popover.Root` holding the control and the
    panel, with eleven parts between them. Three looks draw the panel and one size moves its room, its
    heading and its paragraph together.
  - The machine gives the panel the dialog role, points it at the heading and the paragraph inside it,
    takes focus as it opens and returns it to the control as it shuts.
  - `Popover.Anchor` positions the panel against something other than the control that opens it, such
    as a whole row.
  
  - `Menu` opens a list of things a reader chooses from, composed as `Menu.Root` holding the control
    and the panel of rows, with sixteen parts between them. Three looks draw the panel, one size sets
    the rows and the panel from one step, and a third axis decides how the row the reader is on is
    marked.
  - `highlight` offers `tint`, `fill` and `bar`. The bar draws a line down the leading edge as well as
    tinting the row, so a reader who cannot separate the two colours still sees the mark.
  - `inset` leaves every row the gutter a mark is drawn in, for a menu whose rows lead with an icon. A
    row that carries a mark is inset whatever the axis says, so a list of options does not step
    sideways as the marks appear. The gutter is measured from the room at the panel's edge, the mark
    and the gap beside it, and the size axis writes it as a custom property.
  - The panel enters from the side the machine placed it on rather than always from the top, and it is
    capped at the height the machine measured so a menu opened near the edge of a window scrolls
    inside itself. A scroll inside it does not reach the page.
  - `Menu.OptionItem` draws a tick a reader turns on and off, or one of a set, in the same slot as a
    plain row. The mark beside it is hidden from a screen reader, because the row already reports its
    state through `aria-checked`.
  - A row states what it is for with `tone`, which is a typed prop rather than an axis, because a slot
    recipe resolves its variants once at the root and a menu draws one row in a different ink from the
    rest. The row passes its value down, so `Menu.ItemText` and `Menu.ItemIndicator` take no props.
  - A `Menu.Root` written inside the panel of another is a submenu. It finds the menu above it and
    registers the two machines with each other, so a pointer moving from the row into the submenu
    leaves it open and the arrow keys open and close it. It draws itself in the variants that menu was
    given unless it picks its own. `Menu.TriggerItem` is both a row of the menu above and the control
    of the menu below, and it throws where the menu it belongs to opens from no other menu.
  - `Menu.ContextTrigger` opens the menu at the point the pointer is at rather than beside a control,
    and responds to a long press as well as a right-click.
  - The panel states no width, so it is as wide as its widest row. A caller who wants the control's
    width sets `positioning: { sameWidth: true }`.
  - Every specification of the package renders through the testing kit's settling render, so the suite
    reports none of the 140 updates outside an act scope it reported before.
  
  The package is the first to take runtime dependencies. It installs the machine, the React adapter
  and the types the adapter's own signatures reach, all pinned together through the workspace catalog,
  because the machines share a core and a core at two versions breaks them.

### Patch Changes

- Updated dependencies [[`614fb9f`](https://github.com/stealth-scale/config/commit/614fb9ff17f757776a5d5132c5d21a3bb6c41efb), [`6ac64f2`](https://github.com/stealth-scale/config/commit/6ac64f2666f92a187fc06d34df1d2cd023266434), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/hooks@0.1.0
  - @stealthscale/theme@0.3.0
