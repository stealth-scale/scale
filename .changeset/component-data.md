---
"@stealthscale/component-data": minor
---

component-data: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-data: add the neutral value to the badge's status axis

- `Badge status="neutral"` points the palette at the neutral one, for a label that states a fact
  rather than a state, such as the group a page is filed under. The value is emitted whether or not
  a page writes it, beside the four statuses.

component-data: add the status

- `Status.Root` and `Status.Indicator` render a colored dot and a word as two `span` elements, so a
  status is valid inside a paragraph, a table cell or a button. The dot has `aria-hidden` by
  default.
- Axes: `palette` (the eight semantic palettes, emitted in `staticCss`, default `neutral`), `size`
  (`sm`, `md`, `lg` on the label scale, and `inherit` for running text) and `effect` (`glow`,
  `pulse` on the dot).
- The root aligns on the word's baseline. Inside a sentence the word measured the same baseline as
  the text around it, and the dot's centre was within 0.01px of the text's centre.

component-data: add the stat

- `Stat.Root` renders a `dl` with `Label` (`dt`), `ValueText` (`dd`), `ValueUnit` (`span`),
  `HelpText` (`dd`) and `Indicator` (`span`). The help text is a `dd`, so the list passes the axe
  `definition-list` rule.
- `size` sets the figure's heading text style: 22.8px, 27.2px and 32.4px at `sm`, `md` and `lg`. The
  figure uses tabular numerals.
- `palette` colors the indicator in the palette's text ink. The caller passes the glyph and chooses
  the palette, because the direction of a change and whether it is good are separate facts.
