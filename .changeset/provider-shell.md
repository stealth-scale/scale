---
"@stealthscale/provider-shell": minor
---

provider-shell: keep the chosen theme as a setting

- `Shell` takes `themes`, the themes the application offers, in place of `theme`. The first is drawn
  until a person chooses another.
- `Themed` keeps the choice under the application's name as the setting `theme`, held to the themes
  offered, so a name no longer offered falls back to the first.
- `useThemeChoice()` returns `{ theme, themes, setTheme }`, and `themeSetting` and `THEME_SETTING`
  build the key for a reader without React.
