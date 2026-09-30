---
"@stealthscale/component-graphs": minor
---

- Add the package over `@xyflow/react` 12.12.0 and `@dagrejs/dagre` 3.1.1.
- Add `Graph`: `Root`, `Canvas`, `Node`, `Controls`, `Control`, `ZoomLevel`, `MiniMap`, `Summary`,
  `Empty`, `Caption`, `PaletteItem`.
- Add `layoutGraph`, a ranked layout with dagre.
- Add `DirectedGraph` with `trace`, `depth`, `collapsible` and focus.
- Export `traceGraph`, `relationOf`, `descendantsOf`, `hiddenBy` and `treeEdges`.
- Add `NetworkGraph` with focus, `depth` and dragging.
- Add `layoutForce` over `d3-force` 3.0.0, and export `neighborsOf`.
- Add `diffGraphs` and `Graph.Canvas changes`.
- Add `onGraphChange` and `onDropItem` to `Graph.Canvas`.
