# @stealthscale/testing-router

## 0.1.1

### Patch Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`70f258d`](https://github.com/stealth-scale/scale/commit/70f258d9060c497ded332400cfde04f49c337251) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-router: settle the render in mountRouter before returning it
  
  - `mountRouter` renders inside an async `act` and flushes one microtask before it returns, so a page
    holding a component built on a state machine no longer reports an update outside `act`.
    `mountRoute` calls it and gains the same.
- Updated dependencies [[`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706)]:
  - @stealthscale/provider-router@0.2.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`4fc003b`](https://github.com/stealth-scale/config/commit/4fc003b8995960215e7e47d20efeeb1fe08358cb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-router: add the helpers a specification mounts a route tree with
  
  - `mountRoute` takes a tree and a path, builds a router over it, reads the map every link resolves
    through out of the same tree, waits for everything the path loads, and renders it. A specification
    reads a screen rather than driving a router.
  - `mountRouter` takes a router instead, for an application that decides what its own router holds,
    such as one built for a session. `routerOver` builds the router without rendering it, for a case
    that reads `routesById` or a resolved path.
  - A router loads its matches before anything renders them. Rendering first draws the page the router
    was on rather than the page the path names, and nothing reports it. Each helper does the three
    steps in order, so the trap is written once here rather than at every site.
  - Preloading is off in a mounted router, so a link in the rendered page fetches nothing on its own.
  - Each call builds a router of its own. Two cases sharing one would navigate each other, and the
    library caches a processed tree keyed by the tree's identity.

### Patch Changes

- Updated dependencies [[`4fc003b`](https://github.com/stealth-scale/config/commit/4fc003b8995960215e7e47d20efeeb1fe08358cb)]:
  - @stealthscale/provider-router@0.1.0
