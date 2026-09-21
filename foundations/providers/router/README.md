# @stealthscale/provider-router

`@stealthscale/provider-router` gives you the pieces an application builds a router from. You call
TanStack Router's own `createRouter`, so all forty-eight of its options remain yours to set.

Three things come from here. `routerOptions` states what every router in this design system starts
from. `compileRoutes` turns route declarations a host read out of a manifest into routes you place
in your own tree. `namedRoute`, `routeMap`, `routeHref` and `RouteLink` let anything link to
anything by id.

**Use this package when an address is decided at run time.** An application whose routes are all in
the build should use TanStack Router directly, where the compiler checks every path. This package
exists for the pages that are not in the build: ones another deployment declares, ones a condition
decides, ones a host mounts under a path it chooses when it starts.

**Link by id, not by path.** A path belongs to whoever composed the application, so a page that
might be composed differently tomorrow has no path it can write down. An id does not move. That
holds for a host's own routes as much as for a plugin's, which is why `namedRoute` gives a route
written in code the same kind of id the compiler gives a declared one.

## Install

```bash
pnpm add @stealthscale/provider-router
```

The package peers on `@tanstack/react-router` and `react`. It re-exports the library, so you import
the router from here rather than from two places.

## A host that draws routes a manifest declared

```tsx
import {
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  namedRoute,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

function buildTree(declarations) {
  const root = createAppRootRoute()();
  const shell = createRoute({ getParentRoute: () => root, path: "/app" });
  const home = createRoute({
    ...namedRoute("app.home"),
    getParentRoute: () => shell,
    path: "/home",
  });

  const plugins = compileRoutes(declarations, { evaluate, layouts, parent: shell });

  return root.addChildren([shell.addChildren([home, ...plugins])]);
}

const tree = buildTree(await loadManifests());
const router = createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
```

`compileRoutes` creates routes and never touches the parent you pass it. Build the tree as a
function of the declarations and call it once per declaration set. Compile every contributor's
declarations in one call, because two calls under one parent cannot read each other's paths.

Mount the router under the path the application is served at with
`basepathOf(import.meta.env.BASE_URL)`. The base `/design/` gives `/design`, and `/` gives the root.
A base naming another host says where the assets are and nothing about the documents, so it gives
the root unless a second argument names the documents' path.

```ts
const router = createRouter({
  ...routerOptions({ routes: routeMap(tree) }),
  basepath: basepathOf(import.meta.env.BASE_URL),
  routeTree: tree,
});
```

Use `createAppRootRoute` rather than `createRootRoute`. It types the router context so the route map
fits, and the alternative reports the mismatch at `createRouter` rather than at the root.

**Do not graft into a tree a router has already been built from.** The library caches a processed
tree on a server, keyed by the tree object and written once per process, so a second router built
from a mutated tree reads the first one's routes. That failure appears in production and not in
development.

## Naming routes

`routeMap` walks the assembled tree and reads the id off every route that carries one. The compiler
writes that id for a declared route. `namedRoute` writes it for one you wrote yourself. Both kinds
enter the map the same way, so you pass one value rather than a pair.

```tsx
const settings = createRoute({
  ...namedRoute("app.settings"),
  getParentRoute: () => shell,
  path: "/settings",
});
```

The walk refuses two routes carrying one id. Two routes under one id would send a link somewhere
different without the link itself changing.

### A path only one route may serve

The same walk refuses two routes serving one path under a shared parent. It counts the routes you
placed yourself as well as the ones it compiled. A pathless layout consumes no path segment, so
`/app/_yours/settings` and `/app/settings` are one URL however many layouts stand between.

A development build of the library reports that pair as a duplicate route. A production build keeps
the first and drops the rest without reporting it. The refusal is here as well so that both builds
fail the same way.

## Linking by id

Pass the reference the plugin SDK returned, not a string. A reference carries the id and, in its
type alone, the parameters the route's path names.

```tsx
import { RouteLink, useRouteHref } from "@stealthscale/provider-router";

<RouteLink activeProps={{ className: "current" }} params={{ invoice }} to={invoices.one}>
  Open
</RouteLink>;

const href = useRouteHref(invoices.one, { invoice });
```

Filling the wrong parameter is a compile error, because the reference's type says which ones the
path names. A bare id string works too, and gives up that check.

```tsx
<RouteLink params={{ id: "42" }} to={invoices.one} />
// 'id' does not exist in type '{ invoice: string }'
```

`RouteRef` is declared structurally, so a plugin SDK's own reference type satisfies it without this
package depending on that SDK. Anything carrying an `id` fits.

The same resolution serves `navigate` and a `redirect` thrown in a loader, because both take the
path `routeHref` returns. A hook cannot run inside an event handler, so take the map and resolve
there.

```tsx
const map = useRouteMap();
const navigate = useNavigate();

const open = (row: Row) => navigate({ to: routeHref(map, invoices.one, { invoice: row.id }) });
```

A resolved path is relative to the route tree, and the library adds your `basepath` when it builds
the link. A router at `basepath: "/admin"` draws `/admin/app/invoices` for a route compiled at
`/app/invoices`.

Both read the map through the router's own context, so nothing extra is mounted. Both throw rather
than resolve a path that is wrong: an unknown id, a missing parameter, and a tree no router has
processed each fail where you wrote them.

### The active state needs no configuration

`RouteLink` takes everything the library's own `Link` takes, so an active link is marked without you
configuring anything. On the page it names, the anchor carries `data-status="active"`,
`aria-current="page"` and a class of `active`.

```css
a[data-status="active"] {
  font-weight: bold;
}
```

Matching is by prefix on a segment boundary. A link to `/app/invoices` stays marked on
`/app/invoices/42`, which is what a menu wants, and a link to `/` is not marked on `/app/invoices`.
Pass `activeOptions={{ exact: true }}` to mark only the exact page, and `activeProps={{}}` to drop
the `active` class the library adds by default.

## Reading the route a person is on

A named route carries its id in the library's own `staticData`, so a menu, a breadcrumb or a
telemetry hook reads it off the match rather than holding a second copy of the declaration list.

```tsx
import { declaredOf, useDeclaredRoute, useMatches } from "@stealthscale/provider-router";

const here = useDeclaredRoute();
const trail = useMatches().map((match) => declaredOf(match));
```

`useDeclaredRoute` returns the deepest named route. That is the page a person is looking at, and it
returns nothing on a page drawn entirely from routes nobody named. Both functions check the shape
rather than trust it. `staticData` is untyped by design, and a route may carry anything under the
same name.

Each returns a reference to the object the route carries rather than a copy. A navigation that left
the page alone therefore re-renders nothing that reads them.

## Reading a page's own parameters

A compiled route is outside the tree the application registered. The library cannot type its
parameters, and `useParams` returns a loose record. Pass the reference, which carries the types.

```tsx
import { useRouteParams } from "@stealthscale/provider-router";

export function Invoice() {
  const { invoice } = useRouteParams(invoices.one);
}
```

It checks at run time that the page is the route the reference names before it makes the claim, so a
reference copied from another page throws rather than mistyping what it returns.

Search parameters have no equivalent. A reference carries no search type, so read them with
`useSearch({ strict: false })` and validate at the edge.

## A link to a route nobody may reach

A condition decides whether a route is routed, not whether it is named. A route whose `when` fails
is still in the tree and still in the map, so a link to it resolves and then returns a 404.

A menu drawn from declarations has to filter them with the same evaluator the compiler was given.
The foundation does not do it for you, because which entries a person should see is a question about
your product rather than about routing.

```ts
const shown = declarations.filter((one) => one.when === undefined || evaluate(one.when));
```

## Inside a declaration

`RouteDeclaration` is the compiled form a plugin SDK produces, not the manifest form. A page is
either a component or an importer with the export it is published under, because a React component
is a function and nothing at run time separates one from an importer.

```ts
{ component: { export: "Invoices", load: () => import("./invoices.js") } }
```

The export name is optional, and the module's default export is used without one. Both go straight
to the library's `lazyRouteComponent`. The page's chunk loads on the first navigation to it, and a
chunk the deployment has replaced is reported rather than ignored.

`layout` names layouts outermost first. Two declarations naming the same layouts with the same
options share one pathless parent. Naming a layout a route above already draws is refused, because
the frame would otherwise be drawn twice.

A condition is whatever language your host writes one in, and the `evaluate` you pass reads it. A
condition that fails makes the route a 404, so a route nobody may reach resolves to nothing. An
evaluator wanting anything else, such as sending an unauthenticated person to sign in, throws the
library's `redirect` itself.

`compileRoutes` refuses a declaration stating `outlet`. A screen maps to a route and the route
decides the whole screen, so a page drawn beside another as a pane has no route of its own.

Draw a detail beside a list by declaring it as a child, which is what an outlet is for. The parent
lays out its own content beside `<Outlet />`, and the pane gets a real URL, the back button and
preloading with it.

```ts
{ component: List, id: "acme.list", path: "/invoices" }
{ component: Detail, id: "acme.detail", parent: "acme.list", path: "$invoice" }
```

Two `<Outlet />` in one component draw the same child twice. The library matches one route per level
and `Outlet` takes no name, so there is no second pane to fill.

## Testing

`@stealthscale/testing-router` mounts a tree and renders the page a path matches, so a specification
reads a screen rather than driving a router.

```ts
const { result } = await mountRoute(buildTree(await declarations()), "/app/invoices/42");
```

## Registering the type

The library derives paths, params and search from one declared router type. An application whose
routes are all in the build declares it and gets a checked `Link`.

Put it in a declaration file beside the tree. The statement is type-only and erases to nothing.

```ts
// src/register.d.ts
import { type Routed } from "#routes.ts";

declare module "@tanstack/react-router" {
  interface Register {
    router: Routed;
  }
}
```

The import keeps the file a module. `declare module` with no import and no export is an ambient
declaration, which replaces the library's types rather than adding to them.

That augmentation names `@tanstack/react-router`, so an application importing everything else from
this package still names the library in this one file. A route this package compiled is not in the
registered tree, which is why `RouteLink` and `useRouteParams` exist.
