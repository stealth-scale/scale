---
"@stealthscale/provider-router": minor
---

provider-router: move the window in one step on navigation

- `routerDefaults` states `scrollRestorationBehavior: "instant"`. The library moved the window with
  the page's own scroll behaviour, and the foundation sets `html { scroll-behavior: smooth }` for a
  link into the page, so a page opened from a scrolled one glided to the top. A link into the page
  keeps the smooth scroll.
