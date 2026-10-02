---
"@stealthscale/provider-shell": minor
---

- Breaking: `Shell` takes `themes` in place of `theme`. The first theme is the default.
- Store the chosen theme as the setting `theme`, limited to the offered themes.
- Add `useThemeChoice()`, which returns `{ theme, themes, setTheme }`.
- Add `themeSetting` and `THEME_SETTING` for readers without React.
