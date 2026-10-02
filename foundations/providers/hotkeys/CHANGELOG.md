# @stealthscale/provider-hotkeys

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`9d2dd1b`](https://github.com/stealth-scale/scale/commit/9d2dd1b6a573174fca3711d63465dbdd0605fc0f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Peer on `@tanstack/react-hotkeys` 0.12.

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`02951fd`](https://github.com/stealth-scale/config/commit/02951fdf7a0cc4c3a969029d42c02e1df62d5940) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-hotkeys: publish the keyboard shortcuts under this design system's name
  
  - The package is TanStack's hotkeys renamed, and adds nothing to them. Every default is the
    library's own: a shortcut stops the browser's action, stops the event propagating, and is ignored
    while an input has focus.
  - The re-export is a wildcard rather than a written list. The library states sixty-four names at
    0.10.0 and is still below its first major, so a written list drifts on the release that adds one.
  - The library is a peer rather than a dependency, so an application installs one copy and this
    package pins none.
  
  The whole published artifact is one line. What it buys is the import specifier: an application and
  every component name shortcuts from one place, so a move to another library or a house default of
  its own is a change here rather than at every call site.
