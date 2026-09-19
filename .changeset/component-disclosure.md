---
"@stealthscale/component-disclosure": patch
---

component-disclosure: keep an indicator out of the name its control is announced by

- `Menu.Indicator`, `Popover.Indicator` and `Collapsible.Indicator` sit inside the control they
  belong to. Everything inside a control is read as part of that control's accessible name, so a
  trigger named `Workspace Acme` announced as `Workspace Acme ▾`. Each now states `aria-hidden`.
  `Menu.ItemIndicator` already did.
- `Tabs.Indicator` is the bar that slides under the control in force. It sits among the controls in
  the strip and carries neither a role nor any words, so a reader stepping through the strip met one
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
