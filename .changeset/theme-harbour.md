---
"@stealthscale/theme-harbour": minor
---

theme-harbour: add the theme

- A steel blue product on navy and mist. The navy is the dark page and the light ink, the deep blue
  the secondary, the accent and the type ink, the steel blue the primary and the keyword ink, and
  the mist the light page and the dark ink.
- The four colors are stated outright and `defineTheme` draws every other value from them. The navy
  reads at 9:1 on the mist. Three wells a reader can tell apart under a secondary ink need the text
  ratio at 6:1 there, so the theme states `text: 6`. The panel on the dark page is drawn from the
  navy rather than stated as the deep blue. The mist reads at only 6.7:1 on the deep blue, and a
  panel carries text. Each status keeps its canonical hue at the chroma of the steel blue. No status
  shouts over a quiet brand, and information is still told from the primary. The specification holds
  the theme to the same ratio with nothing skipped.
- Harbour draws soft on every axis it states. The shadows fall at six tenths of the default ink, and
  the surfaces after dark keep three quarters of the navy's chroma. Every control, icon, tag, inset
  and gap is drawn at 105% density, and a column of text is read at 70 characters. Every pace is a
  quarter longer than the foundation's, and a thing that arrives or moves eases in and out. Body
  text is set with relaxed leading and every heading at a medium weight.
