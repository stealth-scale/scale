# @stealthscale/component-navigation

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `NavList` with `highlight`, `iconic`, `radius`, `reveal`, `size`, `variant`, `palette`,
    `effect` and `guide`.
  - Open a `NavList.Branch` with the collapsible machine.
  - Breaking: `NavList.Action` renders a `button`.
  - Add `NavList.PropsProvider` and `tooltip` on `NavList.Link`.
  - Filter `NavList` rows inside a filter scope, and restore branches when the query clears.
  - Size rows to 24, 32 and 40px, and the end column to at least 24px.
  - Add `Toc` over `@zag-js/toc` with `size` and `palette`.
  - Scroll the `Toc` aside placement in `ScrollArea`.
  - Add `inherit` and `palette` to `Link`, and underline links at rest.
  - Add `Pagination` over `@zag-js/pagination`.
  - Word an empty count as `Page 0 of 0`, `0 / 0` and `0–0 of 0` in `Pagination.PageText`.
  - Add `NavigationMenu` over `@zag-js/navigation-menu`.
  - Peer on `component-actions`, `component-disclosure` and `component-primitives`.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`03d7d45`](https://github.com/stealth-scale/config/commit/03d7d4596ab137b8460b355bf72f4ad3519025bc) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-navigation: publish the link and the breadcrumb trail
  
  - `Link` draws words a person follows to somewhere else. The ink, the visited ink, the cursor and
    the focus ring all come from the theme's own link fragment, so a theme decides what a link looks
    like once for every link. Its one axis decides whether the underline is drawn at rest or only
    under a pointer, and both looks underline under one.
  - `Breadcrumb` draws the path from the front of a site to the page a person is on, composed as
    `Breadcrumb.Root` holding a list of crumbs. The size sets the text on the root and the gap on the
    list, so every part reads at one size by inheriting it.
  - The last crumb is `Breadcrumb.CurrentLink` rather than a link. It draws a span carrying
    `aria-current="page"`, which tells a screen reader which crumb is where the reader is, and a link
    to the page already open would be a control that does nothing.
  - The landmark is named `Breadcrumb` by default, because a page usually holds more than one
    navigation landmark and an unnamed one is announced with nothing to tell it from the others. The
    list states its own list role, because a list drawn with no marker loses that role in Safari. The
    separator sits between two crumbs as a row of the list rather than inside one, so a screen reader
    counting the list counts the crumbs, and it carries `aria-hidden` because the order is already in
    the list.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
