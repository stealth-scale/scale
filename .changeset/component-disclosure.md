---
"@stealthscale/component-disclosure": minor
---

- Hide `Menu.Indicator`, `Popover.Indicator`, `Collapsible.Indicator` and `Tabs.Indicator` from
  assistive technology.
- Render `Menu.Indicator` as a `span`, mirrored under `dir="rtl"`.
- Render the indicator of every tab look.
- Size popovers at least as wide as their trigger.
- Add `Menu.ItemMark`, `Menu.ItemLines`, `Menu.ItemDescription` and `Menu.ItemCommand`.
- Keep a menu open after a checkbox row is selected.
- Size a menu row's leading icon, and apply `inset` only to rows without an icon or mark.
- Style `Popover.Trigger` as a control.
- Breaking: `Collapsible.Root` takes `palette` in place of `status`.
- Add `palette` to `Tabs.Root` and `Menu.Root`.
- Breaking: `Tabs.Root` and `Popover.Root` take no `translations`.
- Keep a menu or popover open when its trigger press closes another overlay.
- Play the exit motion of popovers, menus and tooltips through `usePresence`.
- Breaking: the content parts take no `ref`.
- Edge elevated and inverted panels and the subtle collapsible under forced colors.
- Return focus to a closing menu's trigger only from a panel or the body.
- Scroll a menu's rows in `ScrollArea`, with the viewport as the `menu` element.
- Name a popover's panel from its mounted `Title` and `Description`.
- Set `Popover.Title` in the body text of the panel's size, semibold.
- Add `Accordion` over `@zag-js/accordion`.
- Add `Steps` over `@zag-js/steps`.
- Add `HoverCard` over `@zag-js/hover-card`.
- Add `ToggleTip` on the popover machine.
- Add `Menubar` on `Menu` and `RovingFocus`.
- Add `Truncate`.
- Add `Details` on the native `details` element.
- Add closable tabs: `Tabs.Trigger closable`, `Tabs.CloseTrigger`, `Tabs.Root onClose` and
  `Tabs.selectionAfterClose`.
- Measure the tab indicator again when a tab enters or leaves the list.
- Scroll the selected tab into view inside a sideways scroll area.
- Mark the selected tab under forced colors in the line, plain and subtle looks.
- Size an `svg` in a tab to one text size, and start a vertical tab's words at its inline start.
- Peer on `component-a11y` and `component-primitives`.
- Add a specimen per component.
