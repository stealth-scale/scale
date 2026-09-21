# @stealthscale/provider-shell

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`3385a3c`](https://github.com/stealth-scale/scale/commit/3385a3c8d3d1f1c19affe900b6e046ca22c1619f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-shell: keep the chosen theme as a setting
  
  - `Shell` takes `themes`, the themes the application offers, in place of `theme`. The first is drawn
    until a person chooses another.
  - `Themed` keeps the choice under the application's name as the setting `theme`, held to the themes
    offered, so a name no longer offered falls back to the first.
  - `useThemeChoice()` returns `{ theme, themes, setTheme }`, and `themeSetting` and `THEME_SETTING`
    build the key for a reader without React.

### Patch Changes

- Updated dependencies [[`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/provider-viewport@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-color-mode@0.1.1
  - @stealthscale/provider-environment@0.1.0
  - @stealthscale/provider-hotkeys@0.1.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/provider-locale@0.1.0
  - @stealthscale/settings@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`1015599`](https://github.com/stealth-scale/config/commit/1015599ff8970f54fa5a0b2b114a0bb90611671d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-shell: compose every provider an application renders
  
  - `Shell` puts the root node, the colour mode, the theme, the locale, the catalogues, the viewport
    and the shortcuts in scope, in the order each depends on the one before. `app` is the only
    required prop.
  - Routes and data stay the application's own. It renders its router and its clients as children, so
    an application without either bundles neither.
  - `ColorModeProvider` and `ThemeProvider` both own `data-color-mode` on the document root, and the
    theme provider removes it where it is given no mode. `Themed` sits between them, reads the choice
    and passes it on, so the two write the same value rather than undoing each other. A person
    following the machine is passed nothing, which is how both providers represent that choice.
  - `store` reaches every setting, so a specification passes one memory store and the page's local
    storage is left alone.

### Patch Changes

- Updated dependencies [[`97bf274`](https://github.com/stealth-scale/config/commit/97bf27489f83ee3e3382fccec0d94ce16f696c93), [`1c1e6c3`](https://github.com/stealth-scale/config/commit/1c1e6c381bcabc79cdb1e2019131b71d0e88e805), [`02951fd`](https://github.com/stealth-scale/config/commit/02951fdf7a0cc4c3a969029d42c02e1df62d5940), [`83f3481`](https://github.com/stealth-scale/config/commit/83f34814305877c1b60fa3a06ccfd1644c159615), [`39c4394`](https://github.com/stealth-scale/config/commit/39c43948c7e2635746815ead362ac844173758f0), [`679f0af`](https://github.com/stealth-scale/config/commit/679f0af3dbdb51770dd96026ccd33aa1e5b7e35a), [`044f611`](https://github.com/stealth-scale/config/commit/044f6110d6f70ace50ab25e7d545c3399d0ea72b), [`ec4b811`](https://github.com/stealth-scale/config/commit/ec4b81154daadbe496f8172ead2897ca68f0e63d), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/provider-color-mode@0.1.0
  - @stealthscale/provider-environment@0.1.0
  - @stealthscale/provider-hotkeys@0.1.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/provider-locale@0.1.0
  - @stealthscale/provider-viewport@0.1.0
  - @stealthscale/settings@0.1.0
  - @stealthscale/theme@0.3.0
