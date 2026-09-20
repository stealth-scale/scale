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
