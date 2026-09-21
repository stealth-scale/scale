# @stealthscale/provider-color-mode

## 0.2.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`dece6ae`](https://github.com/stealth-scale/scale/commit/dece6ae8193e5204079c50c5a9311360243d3557) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Write every `<` in the inlined script as its JavaScript escape, so an HTML parser ends the script
  element where the application closes it whatever the application is called. Publish
  `colorModeScript` under the `./script` subpath as well, for a server that writes the document
  without React.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
  - @stealthscale/settings@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`97bf274`](https://github.com/stealth-scale/config/commit/97bf27489f83ee3e3382fccec0d94ce16f696c93) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-color-mode: add the provider that puts a colour mode in scope
  
  - `ColorModeProvider` names the application the choice is kept under, so two applications on one
    origin keep their own. It takes a store, which is how an application rendered on a server keeps
    the choice in a cookie and writes the attribute in its first response.
  - `useColorMode` returns the way the page is drawn, the choice behind it, and the setter. It throws
    where there is no provider above it, because a hook returning a default would let a subtree draw
    in a mode nothing is writing.
  - Following the machine is written as the absence of the attribute rather than as a resolved mode.
    The theme foundation's rules already draw a page carrying no attribute by the operating system's
    setting, so somebody following the machine keeps following it when they change it.
  - `useSystemColorMode` reads the machine's own setting through `useSyncExternalStore` and follows it
    as it changes. It returns `light` on a server, which no first paint rests on.
  - `colorModeScript` writes the script a static application inlines in its head. It reads the key the
    setting is kept under and writes the attribute before the first paint, which is the one case CSS
    alone cannot cover: a stored choice that disagrees with the machine.
  - `colorModeSetting` returns the definition, for a server or a script reading the same choice
    without React around it.
  - The attribute is written in a layout effect, before the browser paints React's first commit, so
    nothing React draws is painted in the wrong mode.
  
  The package peers on `@stealthscale/settings`, `@stealthscale/theme` and React.

### Patch Changes

- Updated dependencies [[`044f611`](https://github.com/stealth-scale/config/commit/044f6110d6f70ace50ab25e7d545c3399d0ea72b), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/settings@0.1.0
  - @stealthscale/theme@0.3.0
