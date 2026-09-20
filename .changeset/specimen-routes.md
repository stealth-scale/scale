---
"@stealthscale/specimen": minor
---

publish the routes a catalogue is built from, and list the rail from them

- `declarations` gives one route per indexed page, carrying no leading slash, so every page hangs
  beneath whatever parent an application compiles them under. A parent at `/docs` serves the button
  at `/docs/actions/button` and the package never states the prefix.
- `Rail` reads declarations rather than the index, so a page an application wrote is listed beside a
  page the plugin found. `Entry` is the shape a declaration carries for it and `entryOf` reads it,
  because the router types `navigation` as `unknown` and a declaration the catalogue did not write
  could hold anything under that name.
- `grouped` takes declarations and returns the tree the rail draws: groups sorted by name, pages
  sorted by the words their entry carries, and pages naming no group under a heading of their own,
  last.
- `routeId` names a page's route. The package builds no router and states no address of its own.

111 tests, 100% on all four metrics.
