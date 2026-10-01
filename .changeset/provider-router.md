---
"@stealthscale/provider-router": minor
---

- Set `scrollRestorationBehavior: "instant"` in `routerDefaults`.
- Peer on `@tanstack/react-router` 1.170.40.
- Depend on `@tanstack/router-core` 1.171.33 to interpolate a route's path in `routeHref`.
- Pass `Evaluate` the route's context as its second argument.
- Add `loader` to `RouteDeclaration`, with the route's search as its dependency.
- Type the search in `RouteRef`.
- Add `useRouteSearch`.
- Add `search` to `RouteLink`, typed by the reference.
- Take a Standard Schema `StandardSchemaV1` as `SearchValidator`, and depend on
  `@standard-schema/spec` for its types.
