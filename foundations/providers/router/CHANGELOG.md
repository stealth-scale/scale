# @stealthscale/provider-router

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-router: move the window in one step on navigation
  
  - `routerDefaults` states `scrollRestorationBehavior: "instant"`. The library moved the window with
    the page's own scroll behaviour, and the foundation sets `html { scroll-behavior: smooth }` for a
    link into the page, so a page opened from a scrolled one glided to the top. A link into the page
    keeps the smooth scroll.

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`4fc003b`](https://github.com/stealth-scale/config/commit/4fc003b8995960215e7e47d20efeeb1fe08358cb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-router: add the pieces an application builds a router from
  
  - `routerOptions` returns the three defaults and the router context as an object to spread into
    TanStack Router's own `createRouter`. The library states forty-eight router options, and a factory
    wrapping it would expose the few it thought of and hide the rest, so an application calls the
    library itself and keeps all of them.
  - `compileRoutes` turns the route declarations a host read out of a manifest into routes it places
    in its own tree. It creates routes and never mutates the parent it is given, so a second call
    returns a second set sharing no object with the first. Compile every contributor's declarations in
    one call, because two calls under one parent cannot read each other's paths.
  - Grafting into a tree a router has already been built from is why the compiler is pure.
    `addChildren` replaces a route's children on the object it is called on, and the library caches a
    processed tree on a server keyed by that object and written once per process. A second router
    built from a mutated tree reads the first one's routes, in production and not in development.
  - `routeMap` reads the assembled tree and returns every id against the route that serves it. The
    compiler writes an id onto a declared route and `namedRoute` writes one onto a route written in
    code, so both reach the map the same way and an application carries a tree rather than a pair.
  - A path belongs to whoever composed the application, so a page that might be composed differently
    tomorrow has no path it can write down. A host composed of plugins is in the same position as a
    plugin, which is why a host names its own routes the same way.
  - The walk refuses two routes carrying one id, and two serving one path under a shared parent. A
    pathless layout consumes no path segment, so a declared `/settings` and a host's own `/settings`
    inside a layout of its own are one URL. A development build of the library reports that as a
    duplicate route and a production build keeps the first and drops the rest without reporting it.
  - A link is specified by a reference rather than a path or a bare string. `RouteRef` states the
    shape structurally, so a plugin SDK's own reference type satisfies it without this package
    depending on that SDK, and the parameters the route's path names are carried in the reference's
    type. Filling the wrong parameter is a compile error. A bare id still works and gives up that
    check.
  - `useRouteParams` returns a page its own parameters, under the names the reference carries. A
    compiled route is outside the tree an application registered, so the library types its parameters
    as a loose record. The hook checks at run time that the page is the route the reference names
    before it makes the claim.
  - `useRouteMap` returns the map itself, for a route chosen after the render. A hook cannot run
    inside an event handler and `routeHref` can, so a row a person clicked resolves there.
  - `routeHref`, `useRouteHref` and `RouteLink` reach a route whose path an application's own types do
    not know. Each throws rather than resolve a wrong path: an unknown id, a missing parameter, and a
    tree no router has processed all fail where somebody wrote them. `RouteLink` takes everything the
    library's own `Link` takes, so a declared link is styled and given an active state the usual way.
  - A declaration states its page as a component, or as an importer and the export it is published
    under. Both go to the library's `lazyRouteComponent`, so a page's chunk loads on the first
    navigation to it and a module publishing a named export needs no wrapper around its importer.
  - A declaration names its layouts outermost first, and two naming the same layouts with the same
    options share one pathless parent. Naming a layout a route above already draws is refused, because
    the frame would otherwise be drawn twice.
  - A condition is whatever language a host writes one in, and one that fails makes the route a 404,
    because a route nobody may reach should resolve to nothing.
  - A declaration stating `outlet` is refused. This package draws no panes, and a page that asked to
    be a pane and was drawn as the whole content is wrong in a way nobody notices.
  - `createAppRootRoute` types the router context the other pieces expect, so the mismatch is reported
    at the root rather than at `createRouter`.
  - A named route carries its id in the library's own `staticData`, and `declaredOf` and
    `useDeclaredRoute` read it back. A menu, a breadcrumb or a telemetry hook reads the name off the
    match the library already hands it, rather than holding a second copy of the list.
  - Both read the object the route carries rather than a copy of it, and `useRouteParams` selects the
    id and the parameters alone under structural sharing. Measured over three navigations on one
    route, a component reading either hook renders once where it rendered four times before.
  - `routeMap` reads a path with the slashes around it trimmed, as the library reads one, so `home`,
    `/home` and `home/` under one parent are refused as the one route the library builds from them.
  - A declared route carries `navigation` only where its declaration states one.
