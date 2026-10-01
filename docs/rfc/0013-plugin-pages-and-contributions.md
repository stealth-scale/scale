---
rfc: 0013
title: "Plugin pages, the frame and contributions"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-09-30
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0013: Plugin pages, the frame and contributions

## Summary

The host renders plugin pages, the regions of the product's frame, and contributions in slots. This
RFC defines how a route marker becomes a route in the one tree the router builds, how a page that is
switched off, stopped or failing becomes not found, how menus list entries, which regions a frame
renders with `AppShell`, and how a slot selects, places, orders, decorates and guards the extensions
in it.

## Motivation

### The requirements

- A plugin's page renders inside the product's frame, at an address the router matches, and links to
  another plugin's page by reference.
- A page that a person may not open, or whose plugin is off, is not found, and becomes available
  again without a reload when that changes.
- A plugin contributes to the frame's regions and to another plugin's slots, in an order the product
  and the person can change.
- A slot renders a different contribution per value, such as a feed that renders each item with the
  extension for its type.
- A contribution that throws leaves the rest of the page running.
- The frame, its regions and every contribution render with the component packages, so a plugin
  looks and behaves like the rest of the product.

### Why this layer

`provider-router` compiles routes from declarations, names each route, links by reference, and turns
a failing condition into not found (RFC-0006, ADR-0024). `component-screen` renders an application's
shell with landmark regions, and a page with its header, actions, toolbar and body. This RFC maps a
plugin's declarations onto both.

TanStack Router does not support changing a route tree while a page runs. A router whose tree loses
the open page's route never settles, in Chromium and in Firefox (see "A page that is not found").
The host builds the tree once, and every change while the page runs is a condition.

## Detailed design

### The route tree

```text
__root__                      HostRoot around the product's Frame; not found: HostNotFound
├── the product's own routes  written in code, named with namedRoute
├── time-off/overview         compiled from the time-off plugin's markers
│   └── time-off/request      parent: time-off/overview
├── inventory/list
└── host/settings             the settings frame (RFC-0017)
    ├── host/settings/host/plugins
    └── host/settings/time-off/time-off
```

- `createHostRoutes(product)` returns a function of the root route. It compiles every plugin's
  routes and the settings routes in one `compileRoutes` call, so the compiler sees every path at
  once (`foundations/providers/router/src/compile.ts:481-520`).
- The product places the returned routes beside its own in the root's `addChildren` call, and
  `routeMap(tree)` refuses two routes with one id or one path under one parent
  (`foundations/providers/router/src/map.ts:51-103`).
- The tree is built once per router, before the router exists, and nothing changes it afterwards. A
  product that installs or removes a plugin is a new build.

### From a marker to a declaration

| `RouteDeclaration` member           | Value                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`                                | The qualified id, `time-off/request`                                                                             |
| `path`                              | The marker's path                                                                                                |
| `parent`                            | The qualified id of the marker's parent, or none, which places the route under the root                          |
| `component`                         | A `LazyPage` whose `load` imports the page and the preloads, then returns the host's page component              |
| `loader`                            | `loadNeeds` over the marker's `data`, which loads the page's queries (RFC-0005, RFC-0020)                        |
| `navigation`                        | `{ label, menu, order }` from the marker, which the compiler writes into `staticData`                            |
| `search`                            | The marker's validator                                                                                           |
| `sample`                            | The marker's sample                                                                                              |
| `when`                              | A `HostCondition`: the plugin id, the route id, and the marker's `when` joined with the product's (RFC-0012)     |
| `layout`, `layoutOptions`, `outlet` | Absent. The frame is the root's component, a nested frame is a parent route, and an outlet is refused (ADR-0025) |

The compiler's options are the host's error component per declaration, the host's evaluator, and the
root as the parent:

```ts
compileRoutes(declarations, {
  errorComponent: (declaration) => routeError(declaration.id),
  evaluate: hostEvaluate,
  parent: root,
});
```

`routeError` renders the manifest's fallback for the route where it states one, and the host's error
page otherwise, and counts the failure towards the route's quarantine (RFC-0012).

The host's page component wraps the plugin's page, from the outside in:

1. The plugin's scope, which `usePlugin` and `useConfig` read.
2. The extensions whose target is the route, placed `before`, `after`, `replace` or `wrap` around
   the page, inside the extensions whose target is `{ every: "route" }`, which wrap it outermost.
   Each receives `routeId` and `targetId`.
3. A boundary that reports a render that commits to the quarantine count (RFC-0012).

### Typed search

`RouteRef` of `provider-router` types a route's parameters and not its search
(`docs/rfc/0006-routing.md:461-462`). This design adds the search:

```ts
/**
 * Points at a route by the id it was declared under, with its parameters and its search in the
 * type alone.
 */
export interface RouteRef<Params extends AnyParams = AnyParams, Search = unknown> {
  readonly "~types"?: { readonly params: Params; readonly search: Search };
  readonly id: string;
}

/**
 * Reads the search of the page being rendered, typed by the reference the caller passes.
 *
 * @throws {@link Error} When the page being rendered is not the route the reference names.
 */
export function useRouteSearch<Search>(to: RouteRef<AnyParams, Search>): Search;
```

- `useRouteSearch` checks that the deepest declared match is the reference's route, as
  `useRouteParams` does (`foundations/providers/router/src/declared.ts:117-124`), and returns the
  match's validated search.
- `RouteLink` takes `search`, typed by the reference, and passes it to the library's `Link` beside
  the path. `routeHref` and `useRouteHref` return the path alone, because TanStack Router reads `to`
  as a path and takes the search from `search` (router-core 1.171.33, `src/router.ts:1959-2112`).
- `SearchValidator` gains the validator's output type, `StandardSchemaV1<unknown, Search>`, so a
  marker's validator types its reference (RFC-0010).

A page links by reference and never by path:

```tsx
<RouteLink
  params={{ id: request.id }}
  search={{ status: "open" }}
  to={timeOffContract.routes.request}
>
  {request.title}
</RouteLink>
```

### A page that is not found

A page is not found where its plugin is not on, where it is quarantined, or where its condition is
false. The host's evaluator decides it in `beforeLoad` (RFC-0012), on every navigation and every
`router.invalidate()`.

Measured on TanStack React Router 1.170.34 and router-core 1.171.29, in Chromium and in Firefox,
with identical results in both. Each case renders a page under a layout route, each with a counter
pressed three times, then changes the router and calls `invalidate()`:

| Change before `invalidate()`                                            | Page                           | Layout | Router        |
| ----------------------------------------------------------------------- | ------------------------------ | ------ | ------------- |
| `update` to a tree that adds a route, with the same component functions | kept                           | kept   | settles       |
| No `update`: the open page's condition turns false, then true           | not found, then mounted again  | kept   | settles       |
| `update` to a tree that lacks the open page's route                     | the old page remains on screen | kept   | never settles |

The design uses the second row alone. In the last row, `invalidate()` and every later `navigate()`
were still pending after 3 seconds, because router-core's `commitMatches` reads the route of every
committed and cached match, and a removed route is undefined there (`src/load-client.ts:1630-1637`
in router-core 1.171.33).

`HostNotFound` is the root's `notFoundComponent`, so a not-found page renders inside the frame, in
the place of the page. It reads the `data` of the not-found error:

| `data`                              | The page renders                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `{ plugin, reason: "off" }`         | The plugin's name, and a switch that turns it on where the person may switch it |
| `{ plugin, reason: "unavailable" }` | That the plugin is unavailable for now, without a switch (RFC-0015)             |
| `{ reason: "quarantined", target }` | That the page failed, and a retry that lifts the quarantine                     |
| none                                | A plain not-found page, which confirms nothing about the address (ADR-0024)     |

- Turning the plugin on or retrying calls `router.invalidate()`, and the page mounts again. The
  frame keeps its state, as the second row measured.
- When the page a person is on becomes not found without a navigation, focus moves to the not-found
  page's heading, so a screen reader announces what happened.

### Menus

```ts
/**
 * Describes one entry of a menu.
 */
export interface NavigationEntry {
  /**
   * Address of the route, resolved through the route map.
   */
  readonly href: string;

  /**
   * The entry's text, translated.
   */
  readonly label: string;

  /**
   * Qualified id of the route.
   */
  readonly routeId: string;
}

/**
 * Reads the entries of a menu the person may open, in order.
 */
export function useNavigation(menu?: MenuReference): readonly NavigationEntry[];
```

- A menu lists every route whose marker states `navigation` naming the menu, or the host's `main`
  menu where it names none.
- An entry is listed while its plugin is on and its route's condition is true, evaluated without
  throwing against the same stores the route's evaluator reads. ADR-0024 requires a menu to filter
  with the route's own evaluator, because a route whose condition is false is still in the tree.
- Entries sort by `order`, then by translated label in the person's locale.
- A frame renders a menu with the navigation package's `NavList`, or a plugin fills the `navigation`
  region with one. The host renders no menu of its own outside the settings frame.

### The document title

```ts
/**
 * Titles the document after the page for as long as the caller is mounted.
 *
 * @remarks
 *   The title is `<title> · <product name>`. Once the caller unmounts, the document is titled with
 *   the product's name alone.
 */
export function useDocumentTitle(title: string): void;
```

- The product's name is the translation of the key its definition states under `name`, in the
  product's own catalogue namespace, the product's id (RFC-0011).
- The host titles the document with the product's name at start, and again after every navigation
  whose page does not call `useDocumentTitle`.

### The frame

The frame is the product's component. It composes `AppShell` from `component-screen` and renders one
`Slot` per host region it wants:

```tsx
export function Frame(): ReactElement {
  return (
    <AppShell.Root>
      <AppShell.Header>
        <Slot slot={hostContract.slots.brand} />
        <Slot slot={hostContract.slots.header} />
        <Slot slot={hostContract.slots.userMenu} />
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar>
          <Slot slot={hostContract.slots.navigation} />
        </AppShell.Navbar>
        <AppShell.Main>
          <HostContent />
        </AppShell.Main>
        <AppShell.Aside>
          <Slot slot={hostContract.slots.aside} />
        </AppShell.Aside>
      </AppShell.Body>
      <AppShell.Footer>
        <Slot slot={hostContract.slots.footer} />
      </AppShell.Footer>
      <AppShell.Status>
        <Slot slot={hostContract.slots.status} />
      </AppShell.Status>
    </AppShell.Root>
  );
}
```

| Region       | Contributions | Rendered in                                         | Landmark                              |
| ------------ | ------------- | --------------------------------------------------- | ------------------------------------- |
| `brand`      | one           | `AppShell.Header`                                   | banner, the header's `header` element |
| `header`     | any number    | `AppShell.Header`                                   | banner                                |
| `userMenu`   | one           | `AppShell.Header`                                   | banner                                |
| `navigation` | any number    | `AppShell.Navbar`, around a `Sidebar`               | navigation, from `Sidebar.Nav`        |
| `aside`      | any number    | `AppShell.Aside`                                    | complementary                         |
| `footer`     | any number    | `AppShell.Footer`                                   | contentinfo                           |
| `status`     | any number    | `AppShell.Status`                                   | none                                  |
| `toolbar`    | any number    | `Page.Toolbar`, inside a page that renders the slot | none                                  |

- `AppShell.Navbar` renders a `div`, and the `nav` landmark comes from the `Sidebar.Nav` inside it
  (`components/screen/src/app-shell/navbar.tsx`, `components/screen/src/sidebar/nav.tsx:36`).
- `AppShell.Status` renders a bar at the foot of the shell, after `AppShell.Footer`
  (`components/screen/src/app-shell/status.tsx`). The bar is not a live region, because a live
  region would announce every contribution. A contribution that reports a change renders its own
  `output`.
- A frame omits a region's `AppShell` part while the region is empty, through
  `useSlot(slot).filled`, so an empty aside takes no column.

The host renders four structural slots itself, whatever the frame renders:

| Slot      | Rendered by                            | Around                                             |
| --------- | -------------------------------------- | -------------------------------------------------- |
| `root`    | `HostProvider`                         | The router. Its extensions render outside routing  |
| `layout`  | `HostRoot`                             | The product's frame, inside the router             |
| `content` | `HostContent`, which the frame renders | The `Outlet`, so it decorates every page           |
| `overlay` | `HostRoot`, after the frame            | The palette, the toast region and plugins' dialogs |

- A frame that renders `Outlet` in place of `HostContent` renders pages without the `content` slot,
  and the host reports the slot as never mounted.
- A plugin that works in the background, such as a socket that delivers its events, contributes an
  extension to `root` whose component renders nothing and starts the work in an effect. The
  extension mounts while its plugin is on and its condition is true, and unmounts when either
  changes, so the work starts and stops with the plugin and the effect's cleanup stops it.

### Slots

```ts
/**
 * Describes the props of `Slot`, typed by the slot's reference.
 */
export type SlotProps<R extends SlotReference> = {
  /**
   * The slot's own content, which extensions go before, after, around or in place of. In a keyed
   * slot, the content renders where no extension matches.
   */
  readonly children?: ReactNode;

  /**
   * The slot.
   */
  readonly slot: R;
} & MatchMember<R> &
  PropsMember<R>;

/**
 * Renders a slot's own content with every contribution placed in it.
 */
export function Slot<R extends SlotReference>(props: SlotProps<R>): ReactElement;

/**
 * Reads what a slot contains for the current page, before anything renders.
 */
export function useSlot(slot: SlotReference, match?: string): SlotContents;
```

- `PropsMember<R>` requires `props` where the slot's `Props` has a required member, allows it where
  `Props` has optional members only, and omits it where the slot declares none.
- `MatchMember<R>` requires `match`, a string, on a keyed slot, and omits it on any other.

A feed renders each item with the extension for its type, and its own content for a type no plugin
renders:

```tsx
<Slot match={item.type} props={{ item }} slot={feedContract.slots.item}>
  <FeedItemFallback item={item} />
</Slot>
```

A slot resolves its contents on every render, from the resolved product and the stores:

1. It takes the extensions placed in the slot by the manifests, the product and the person, in the
   order RFC-0017 defines.
2. It removes each extension whose plugin is not on, which is quarantined, or whose condition is
   false for the current page. A slot that states `record` evaluates each condition with the
   `record` prop, which a `field` member reads (RFC-0020).
3. Where the slot is keyed, it keeps the extensions whose `match` equals the slot's `match` prop.
4. Where the slot's `arity` is `"one"`, it keeps the first extension and reports the rest as
   `slot-full`.
5. It renders the result by position:
   - `before` extensions, in order, then the slot's children, then the `after` extensions, in order,
     then the page contributions made with `Into`, in their `order`.
   - Where one or more `replace` extensions apply, the last in order renders in place of the
     children.
   - `wrap` extensions nest around the result, the first in order outermost.
   - Extensions whose target is `{ every: "slot" }` wrap the whole slot, outermost.

An extension for one value of a keyed slot states `position: "replace"`, so it renders in place of
the slot's children, which render for a value that no extension matches.

Every extension renders:

- With the slot's props and `targetId`, and with `children` where it wraps.
- Inside its plugin's scope.
- Inside an error boundary. The boundary renders the manifest's fallback where there is one, and
  counts the failure towards the extension's quarantine (RFC-0012).
- As a target of its own. Another plugin's extension whose target is this extension renders before,
  after, around or in place of it, with this extension's props. A decorator renders plainly, without
  decorators of its own, so decoration ends after one level.

A slot records that it is mounted for as long as it is mounted. The host reports an extension marked
`required` as `unplaced` when the page settles and its slot is not mounted.

### Contributions from a page

A page contributes to a region outside itself with `Into`: its title into the header, its actions
into the toolbar.

```tsx
<Into order={10} slot={hostContract.slots.toolbar}>
  <Button onClick={exportRequests}>{t("export")}</Button>
</Into>
```

- `Into` does not render anything where it is mounted. For as long as it is mounted, the slot
  renders its children after the slot's `after` extensions, in `order`.
- `Into` takes its place in the slot when it mounts, and its content updates in that place, so a
  title that changes does not move.
- The contribution is React content that the slot renders, not a portal into the slot's element, so
  it renders in the slot's providers and its own at once.

### Loading

- A plugin's modules form one chunk group, so its pages, extensions, commands and component sections
  load in one request (RFC-0011).
- A route's `load` imports the page and, in parallel, the chunks of the plugins whose extensions
  target a slot the route's plugin declares. The build computes that list from the contracts'
  targets. The router preloads a route on intent (`defaultPreload: "intent"`), so pointing at a link
  loads the page and the contributions to its slots together.
- The route's `loader` fetches the queries its marker lists under `data` in the same preload, so the
  page's data arrives with its code (RFC-0020).
- An extension's component is a `React.lazy` over its importer, inside a `Suspense` boundary per
  slot whose fallback is empty, so a slot renders its own content first and its contributions as
  they arrive.
- Not measured yet: the request count and the time to content on `examples/app-plugins`, with and
  without the preloads.

## Failure handling

| Failure                                              | Detected by                     | Outcome                                                                            |
| ---------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| Two routes with one id, or one path under one parent | `routeMap`, and the build first | The build fails, naming both plugins (RFC-0011)                                    |
| A route's parent is not installed                    | The build                       | The build fails, naming the route and the parent                                   |
| The open page's plugin is switched off               | The route evaluator             | Not found inside the frame, with the switch where the person may switch it         |
| The open page's plugin is stopped by its kill switch | The route evaluator             | Not found inside the frame, stating that the plugin is unavailable                 |
| The open page's condition turns false                | The route evaluator             | Not found without data. Focus moves to the not-found heading                       |
| A page throws while rendering                        | The route's error component     | Its fallback or the error page. After 3 in a row, not found with a retry           |
| An extension throws while rendering                  | Its boundary                    | Its fallback, or nothing. After 3 in a row, quarantined                            |
| A slot of arity one receives a second extension      | The slot                        | The first renders, and the host reports `slot-full`                                |
| A keyed slot renders a value no extension matches    | The slot                        | The slot's children render                                                         |
| A `required` extension's slot is not mounted         | The host                        | An `unplaced` report entry                                                         |
| The frame renders `Outlet` in place of `HostContent` | The host                        | Pages render without the `content` slot, and the slot is reported as never mounted |
| A page's chunk is missing after a deployment         | The host                        | One reload per build version, then the error component (RFC-0012)                  |

## Bounds

- The tree is built once per router. A switch, a session change, a kill switch or a quarantine costs
  one `router.invalidate()`, which runs `beforeLoad` for the matched routes.
- A slot evaluates the conditions of the extensions placed in it, at each render. A keyed slot
  compares one string per extension.
- A page decoration and a slot decoration each add one component per extension. A decorator adds no
  further level.

## Answered questions

- **Does the shell get a status bar?** Yes. `AppShell.Status` joins `component-screen`, and the
  host's `status` region renders in it.

## Alternatives considered

### Change the route tree to switch a plugin

**Why not:** TanStack Router does not support a route tree that changes at run time, and a router
that loses the open page's route never settles again, measured in both engines. A condition switches
the page to not found with no change to the tree, and the frame keeps its state.

### Panes in the search string

A named outlet beside the page, opened through a search parameter.

**Why not:** ADR-0025 renders one page per matched route and refuses an outlet. A detail beside a
list is a child route, which has an address, the back button and preloading.

### A frame contributed by a plugin

A plugin registers a whole-page layout with its landmarks, and the product offers layouts by id.

**Why not now:** no product needs a second frame yet. A frame written in code composes `AppShell`
with every option `AppShell` has, and the host measures which regions it renders instead of trusting
a declaration. A product that needs more than one frame nests routes under parent routes that render
frames of their own.

### Slots through portals

A page contributes to a region by rendering a portal into the region's element.

**Why not:** a portal renders in the page's providers and not in the region's, and the region cannot
order or count what it contains. `Into` puts the contribution into the slot's own rendering.

### A condition over a slot's record in place of keyed slots

An extension states a `field` condition over the item's type, and every extension of the slot
evaluates it.

**Why not:** a slot that renders each item with the extension for its type would evaluate every
extension's condition for every item. A keyed slot selects by one string comparison per extension. A
`field` condition remains for the record's state, such as an item out of stock (RFC-0020).

## Drawbacks

- A product writes its frame. The scaffold and `examples/app-plugins` give it a starting frame.
- A route remains in the tree while its plugin is off, so every menu filters with the evaluator, as
  ADR-0024 already requires.
- A page that a person may not open and a page that does not exist render the same not-found page. A
  person who expects a page learns nothing about why it is missing.
- Extensions render after their chunk arrives, so a region fills in after the page when the preload
  did not run first.

## Unresolved and future work

- Frames contributed by plugins, when a product needs a second frame.
- Measuring the requests and the time to content with the preloads.

## References

| What                                                 | Where                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| The router's compiler                                | `foundations/providers/router/src/compile.ts`                          |
| The route map and its refusals                       | `foundations/providers/router/src/map.ts`                              |
| Reading a declared page's parameters                 | `foundations/providers/router/src/declared.ts`                         |
| Rendering one page per matched route                 | `docs/adr/0025-draw-one-page-per-matched-route.md`                     |
| `AppShell`'s parts                                   | `components/screen/src/app-shell/index.ts`                             |
| A route tree that changes at run time is unsupported | https://github.com/TanStack/router/issues/8571#issuecomment-5908577875 |
