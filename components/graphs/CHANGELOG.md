# @stealthscale/component-graphs

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`1ca0f1c`](https://github.com/stealth-scale/scale/commit/1ca0f1cce9de435eea84777706edccc3681bd510) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package over `@xyflow/react` 12.12.0 and `@dagrejs/dagre` 3.1.1.
  - Add `Graph`: `Root`, `Canvas`, `Node`, `Controls`, `Control`, `ZoomLevel`, `MiniMap`, `Summary`,
    `Empty`, `Caption`, `PaletteItem`.
  - Add `layoutGraph`, a ranked layout with dagre.
  - Add `DirectedGraph` with `trace`, `depth`, `collapsible` and focus.
  - Export `traceGraph`, `relationOf`, `descendantsOf`, `hiddenBy` and `treeEdges`.
  - Add `NetworkGraph` with focus, `depth` and dragging.
  - Add `layoutForce` over `d3-force` 3.0.0, and export `neighborsOf`.
  - Add `diffGraphs` and `Graph.Canvas changes`.
  - Add `onGraphChange` and `onDropItem` to `Graph.Canvas`.

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-locale@0.1.0
