---
"@stealthscale/specimen": minor
---

draw the catalogue on the screen components, and place it under one route

- `declarations` takes a `Placing` and returns the route the catalogue hangs under, its index, and
  one page per entry nested under that route. The route draws the router's outlet, so an application
  names the layout once and every page is drawn inside it. `indexId` names the index.
- `Index` draws the index as one section per group with a card per page. The card's title is the
  link. `Placing.beside` lists pages the application wrote with the rest, nested under the
  catalogue's route unless they name a parent of their own.
- `Rail` is one `Sidebar.Nav` block holding a `NavList` branch per group. The branch holding the
  page being read opens, and a navigation into another group opens that one. Draw it inside
  `Sidebar.Root`.
- `Page` draws the page's title and opening in a `Page.Header`, with the way back to the index in
  the row above the title, and each scene as a `Section` under its own heading.
- An entry states `about`, the sentence the index opens a page's card with.
- The package peers on `@stealthscale/component-navigation`, `@stealthscale/component-screen` and
  `@stealthscale/component-surfaces`, and no longer on `@stealthscale/component-actions`.

149 tests, 100% on all four metrics.
