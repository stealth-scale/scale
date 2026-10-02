---
"@stealthscale/specimen": minor
---

- `declarations` takes a `Placing` and returns the catalogue route, its index and one page per
  entry.
- Add `indexId` and `Index`, a section per group with a card per page.
- Add `Placing.beside` for pages an application writes.
- Render `Rail` as one `Sidebar.Nav` with a `NavList` branch per group.
- Render `Page` with a `Page.Header` and a `Section` per scene.
- Add `about` to an entry.
- Peer on `component-navigation`, `component-screen` and `component-surfaces`, not
  `component-actions`.
