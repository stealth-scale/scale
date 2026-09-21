---
"@stealthscale/specimen": minor
---

specimen: load axe on the first audit only

- `audited.ts` imported the engine's types inline, which `verbatimModuleSyntax` keeps as a
  side-effect import, so axe-core (587 kB, 160 kB gzipped) was bundled into the chunk every reader
  loads first. The types come from `catalogue/types.ts` now, and the engine loads on the first
  audit. Measured on the docs build: the entry's static imports no longer reach axe.

specimen: add audit rules and device heights to Placing, and a panel and a shortcut to RailSearch

- `Placing.audit` takes axe's run options and `Placing.heights` the height per width name. Both
  reach every page through a context `declarations` provides, each merged over the catalogue's own,
  so a rule or a height the application does not name keeps the catalogue's value.
- `RailSearch` takes `panel`, the name of the shell panel the rail is drawn in (`navbar` by
  default), and `shortcut`, the hotkey that focuses the field (`Mod+K` by default). The field's
  `aria-keyshortcuts` follows the shortcut.
- `useWords()` with no prefix reads the catalogue's own words, so the namespace is named once.

specimen: fix the props type, the audit control and the frame's location

- `PropsType` matched a named type inside a longer identifier, so `Scaled` opened a control for
  `Scale`. A name matches a whole identifier now, and the longest name is tried first.
- After a clean audit the next press did nothing and the press after it ran the audit. A press runs
  the audit whenever its panel is closed.
- The device's frame loaded `/<path>` and ignored the router's base. It builds the location through
  the router where one is above it.
- `useReportedChoices` posted on every render and `useUpdated` re-subscribed on every render. Both
  act once per change now.
