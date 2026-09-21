# @stealthscale/provider-viewport

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-viewport: publish widthOf
  
  - `widthOf(breakpoint)` reads the width a breakpoint starts at, in pixels, so a component measuring
    its own element compares against the vocabulary rather than against a number a caller invented.
    Every screen component now folds at `useNarrow(ref, widthOf("md"), "md")`.
  - It answers a number rather than a condition, and the README says so. A component that reads it
    measures its own element and folds on that. A component that wants the window folds on a style
    prop or a media query, which is what the breakpoints are for.
  
  provider-viewport: measure before the first paint
  
  - `useNarrow` takes its first measurement in the layout effect that starts watching the element and
    leaves the later ones to the observer. The viewport's first answer is its fallback, because the
    window is read in an effect, so every measured component rendered narrow first. A component
    folding on the answer was painted folded and unfolded a frame later.
  - An element that measures no width has no box to compare, and the answer it had stands. A document
    with no layout engine reports every width as 0.
  
  provider-viewport: read the breakpoints from the statement rather than the token map
  
  - `sizesOf` and `widthOf` read `breakpoints` from `@stealthscale/theme` and sort the widths
    themselves, so the provider no longer keeps the token map in the bundle. The widths are the same
    numbers.

### Patch Changes

- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`679f0af`](https://github.com/stealth-scale/config/commit/679f0af3dbdb51770dd96026ccd33aa1e5b7e35a) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-viewport: add the provider that lays a subtree out for a stated width
  
  - `ViewportProvider` lays its subtree out for a width in pixels, or for the window until one is
    stated. A catalogue states one to show a page as a phone sees it, and a specification states one
    to render a component at a size without stubbing `matchMedia`.
  - `useViewport` reads the width, the widths on offer and the setter a toolbar drives. Outside a
    provider the window decides and setting a width changes nothing, which is what lets every
    breakpoint hook ask without insisting on a provider above it.
  - `useBreakpoint` returns the widest breakpoint that starts at or under the width, counting only the
    ones a caller names. The window is read the way the styling engine reads it, one `min-width` query
    per breakpoint, so a component and its stylesheet switch at the same pixel.
  - `useBreakpointValue` returns the value stated for that breakpoint, keyed by name or listed in the
    theme's order. A breakpoint that states nothing takes the nearest narrower one's value.
  - `useNarrow` measures an element rather than the window, so a page beside an open sidebar reports
    its own width. Until the element is measured the result comes from the viewport, so a phone never
    lays out wide first.
  - `sizesOf` reads the widths the design system's breakpoints start at, from the compiled vocabulary
    rather than from a theme, and builds the list once. `pixelsOf` converts a length against the
    sixteen pixels the styling engine compiled its queries with.
  - `ViewportProvider` takes `width` as the caller's, `defaultWidth` as its own, and `onWidthChange`
    to report to the caller what the setter was given, the way every controllable component here takes
    a value. A width the caller changes reaches the subtree on the next render.
  - A breakpoint name is a `Breakpoint`, which is `base` or one the vocabulary states, in
    `useBreakpoint`, `useBreakpointValue`, `useNarrow` and `Responsive`. A misspelt name is refused
    where it is written.
  - `useNarrow` measures an element that arrives after the first layout, and measures again against a
    width the caller changes.
  - `useBreakpoint` reads no query from the window where a provider states the width.
  
  The breakpoint hooks come from the hook package of the library we are porting from. They read the
  viewport, so they belong beside it rather than in a package that peers on React alone.

### Patch Changes

- Updated dependencies [[`614fb9f`](https://github.com/stealth-scale/config/commit/614fb9ff17f757776a5d5132c5d21a3bb6c41efb), [`6ac64f2`](https://github.com/stealth-scale/config/commit/6ac64f2666f92a187fc06d34df1d2cd023266434), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/hooks@0.1.0
  - @stealthscale/theme@0.3.0
