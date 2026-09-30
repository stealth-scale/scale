---
rfc: 0012
title: "The plugin host: state, evaluation and failure"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-09-30
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0012: The plugin host: state, evaluation and failure

## Summary

The host is the run-time half of the plugin system. It keeps the state that changes while a page
runs, evaluates every condition against that state, isolates a plugin that fails, and reports what
went wrong. This RFC defines the pieces a product composes its application from, the host's stores,
how a plugin's availability is computed, the route evaluator, the start and change sequences,
quarantine, the report, the performance marks, and rendering on a server.

RFC-0013 defines what the host renders: pages, the frame and contributions.

## Motivation

### The requirements

- A switch, a sign-in, a flag change, a kill switch or a quarantine applies while the page runs,
  without a reload.
- A change renders again only the components that read the value that changed.
- A plugin that throws affects its own page or contribution, and never the rest of the product.
- A product can tell which plugin failed, which plugin is slow to load, and why an extension is not
  on the page.
- One route tree serves every request on a server, and the browser's first render matches the
  server's.

### Why this layer

The build resolves the product (RFC-0011), so the host starts from resolved data and keeps only what
changes at run time: the session, the flags, the switches, the availability of each plugin, the
decisions on resources, the placements, the quarantined targets and the slots on screen. One store
per concern lets a reader subscribe to the one value it renders.

## Detailed design

### The pieces a product composes

```tsx
import { product } from "virtual:product";

const routes = createHostRoutes(product);
const root = createAppRootRoute<HostRouterContext>()({
  component: () => (
    <HostRoot>
      <Frame />
    </HostRoot>
  ),
  notFoundComponent: HostNotFound,
});
const tree = root.addChildren([...routes(root)]);
const map = routeMap(tree);

const host = createHost({
  access: identityAccess,
  data: { changes: changesSubscription, transport: gatewayTransport(gateway) },
  flags: openFeatureFlags(),
  product,
  session: identitySession,
  store: localStore(),
});
const router = createRouter({
  ...routerOptions({ data: host.data, host, routes: map }),
  routeTree: tree,
});

await host.ready();

createRoot(element).render(
  <Shell app={product.productId} catalogues={catalogues}>
    <HostProvider host={host} router={router}>
      <RouterProvider router={router} />
    </HostProvider>
  </Shell>,
);
```

| Piece              | Package    | Built                           | Responsible for                                                                    |
| ------------------ | ---------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| `virtual:product`  | the build  | Once per build                  | The resolved product: every declaration, placement and warning (RFC-0011)          |
| `createHostRoutes` | `sdk-host` | Once per route tree             | The plugin routes and the settings routes, compiled under the root                 |
| `createHost`       | `sdk-host` | Once per page, once per request | The stores, the bus, the toaster, the quarantine and the report                    |
| `HostRoot`         | `sdk-host` | The root route's component      | The `layout` and `overlay` regions around the product's frame (RFC-0013)           |
| `HostNotFound`     | `sdk-host` | The root's not-found component  | The not-found page and its reasons (RFC-0013)                                      |
| `HostProvider`     | `sdk-host` | Once per render tree            | The host's contexts, `DataProvider`, the `root` region, and invalidation on change |
| `Frame`            | product    | Product code                    | The product's `AppShell` and the regions it renders                                |

A route's condition reads the host from the router's context rather than from the tree, so one tree
serves every request on a server, as RFC-0006 requires.

### Creating a host

```ts
/**
 * Lists what a host is created from.
 */
export interface HostOptions {
  /**
   * Source of decisions on single resources. Every decision is the tenant-wide one without it
   * (RFC-0014).
   */
  readonly access?: AccessSource | undefined;

  /**
   * The transport and the changes stream the host's data client runs on (RFC-0020). A sampled
   * transport over the contracts' samples where left out.
   */
  readonly data?: Pick<DataClientOptions, "changes" | "transport"> | undefined;

  /**
   * Source of flag values per session. Every flag has its product value or its default without
   * one (RFC-0015).
   */
  readonly flags?: FlagSource | undefined;

  /**
   * Milliseconds `ready` waits for the flag source's first `identify`. 1,000 by default.
   */
  readonly flagsTimeout?: number | undefined;

  /**
   * Reads and writes flag overrides. On by default outside a production build (RFC-0015).
   */
  readonly overrides?: boolean | undefined;

  /**
   * The resolved product, from `virtual:product`.
   */
  readonly product: ResolvedProduct;

  /**
   * Failed renders in a row after which a route or an extension is quarantined. 3 by default.
   */
  readonly quarantineAfter?: number | undefined;

  /**
   * Receives every entry the host reports. Writes to the console by default.
   */
  readonly report?: ((entry: HostReport) => void) | undefined;

  /**
   * Source of the session.
   */
  readonly session: SessionSource;

  /**
   * Where the host keeps a person's switches, settings and placements (RFC-0017).
   */
  readonly store: SettingStore;
}

/**
 * Creates a host for one page, or for one request on a server.
 *
 * @throws {@link Error} When the product's manifests lack code for a declared name.
 */
export function createHost(options: HostOptions): Host;

/**
 * Describes a host.
 */
export interface Host {
  /**
   * The data client of the page or the request, which the router's context contains (RFC-0005).
   */
  readonly data: QueryClient;

  /**
   * Stops listening to the session source, the flag source, the access source and the setting
   * store, and cancels the data client's fetches.
   */
  readonly dispose: () => void;

  /**
   * Resolves once the eager plugins' modules are imported and the flag source has identified the
   * session, or once the flag timeout passes.
   */
  readonly ready: () => Promise<void>;

  /**
   * Lifts a target's quarantine and forgets its failures.
   */
  readonly retry: (target: RenderTarget) => void;

  /**
   * The host's stores, which `HostProvider` provides and the hooks of `sdk-plugin` read.
   */
  readonly stores: HostStores;
}
```

- `createHost` checks every declared route, extension, command and component section against the
  manifests, and throws where one lacks code. The types of `definePlugin` prevent it, so the check
  covers an untyped caller.
- `createHost` subscribes to the session source, the setting store, the flag source and the access
  source when it is created. `dispose` ends the subscriptions.

### The router context

```ts
/**
 * Lists what the router's context contains in a product.
 */
export interface HostRouterContext extends DataContext, RoutesContext {
  /**
   * The host whose state every route condition reads.
   */
  readonly host: Host;
}
```

`routerOptions({ data, host, routes })` puts the host and its data client in the context. A route's
loader reads the client from there (RFC-0005), and a route's `beforeLoad` reads the host, which
needs one change to `provider-router`: `Evaluate` receives the route's context as its second
argument.

```ts
/**
 * Returns whether a route's condition is true for the router whose context is given.
 */
export type Evaluate<Condition = unknown, Context = unknown> = (
  when: Condition,
  context: Context,
) => boolean;
```

The compiler's gate passes `beforeLoad`'s own `context` through
(`foundations/providers/router/src/compile.ts:281-285`). An evaluator that ignores the second
argument keeps working.

### Stores

Every hook of `sdk-plugin` reads one store, a value with its listeners, through
`useSyncExternalStore` with a selector. A component then renders again only when the value it
selected changes.

```ts
/**
 * Keeps one value the host changes while the page runs.
 */
export interface Store<T> {
  /**
   * Returns the value now. Returns the same object until the value changes.
   */
  readonly get: () => T;

  /**
   * Calls the listener after the value changes. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}
```

| Store          | Value                                                       | Changes when                                                         | Read by                                                     |
| -------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| `session`      | The session, with its permissions and entitlements as sets  | The session source reports a change                                  | `useSession`, `usePermission`, `useEntitlement`, conditions |
| `flags`        | Every flag the page has read, with its value and its source | A first read, the flag source reports a change, an override          | `useFeatureFlag`, conditions (RFC-0015)                     |
| `switches`     | Every switchable plugin's switch, as the person set it      | A person switches a plugin, or another tab does                      | The Plugins page, `availability`                            |
| `availability` | Every plugin's state: on, or the reason it is not           | A switch, a kill switch, a plugin condition or a requirement changes | Conditions, the route evaluator, `usePluginStatuses`        |
| `access`       | Decisions on single resources for the session's subject     | A decision arrives, is primed, is forgotten, or the source reports   | `useAccess` (RFC-0014)                                      |
| `placements`   | The person's placements per slot                            | A person changes a placement, or another tab does                    | `Slot`, `useSlot`                                           |
| `quarantine`   | Every quarantined target, with its last error               | A target fails its last allowed render, or `retry` lifts it          | `Slot`, the route evaluator, the not-found page, reports    |
| `mounted`      | Every slot on screen, with a count of its mounted instances | A `Slot` mounts or unmounts                                          | Reports                                                     |
| `pages`        | Every page contribution made with `Into`                    | An `Into` mounts, changes or unmounts                                | `Slot`                                                      |
| `reports`      | The last 100 runtime report entries                         | The host reports an entry                                            | The inspector                                               |

- A plugin's settings are read through `useSettings`, straight from the setting store, because each
  section's value has a key of its own (RFC-0017).
- A selector that returns an object returns the same object while its inputs are unchanged. The
  host's selectors keep the last input and the last result for that reason.

### Availability

A plugin is on where it passes these four tests:

| Test                                                         | Reason where it fails |
| ------------------------------------------------------------ | --------------------- |
| Its kill switch, `host/plugin.<plugin id>`, is on (RFC-0015) | `unavailable`         |
| It is locked, or its switch is on (RFC-0017)                 | `off`                 |
| Its condition from the product's `installed` is true         | `condition`           |
| Every plugin it requires without `optional` is on            | `requirement`         |

- The `availability` store computes every plugin's state in requirement order, which the build
  guarantees is acyclic (RFC-0011). It computes again when a store that any plugin condition reads
  changes: the session, the flags or the switches.
- `context.on(pluginId)` in a condition reads this store, so `when: { plugin }` is false for a
  plugin that is not on, whatever the reason.
- A plugin that is not on has every route not found, every extension unplaced, every command
  disabled, every settings page and section hidden, and every menu entry unlisted.

### Evaluating conditions

The host evaluates every condition with `evaluateWhen` of `sdk-core` (RFC-0010), against a context
it builds from the stores (RFC-0014).

A plugin route compiles with a host condition that contains its plugin's id:

```ts
/**
 * Lists what a compiled plugin route's condition contains.
 */
export interface HostCondition {
  /**
   * Id of the plugin that declared the route.
   */
  readonly pluginId: string;

  /**
   * Qualified id of the route.
   */
  readonly routeId: string;

  /**
   * The route's condition joined with the product's `when`. Absent where neither states one.
   */
  readonly when?: When | undefined;
}
```

The route evaluator runs in `beforeLoad` on every navigation and every `router.invalidate()`:

1. Where the route's plugin is not on, it throws `notFound`. The data contains the id of the plugin
   whose state makes the page unavailable, the route's own or a plugin it requires, with the reason
   `off` or `unavailable`. Where the plugin's condition is false, the evaluator throws `notFound()`
   without data.
2. Where the route is quarantined, it throws
   `notFound({ data: { reason: "quarantined", target } })`.
3. Where `when` is false, the session is not authenticated and the sign-in rule of RFC-0014 applies,
   it throws `redirect` to the sign-in route.
4. Where `when` is false, it returns false, and the compiled gate throws `notFound()` without data,
   which confirms nothing about the page (ADR-0024).
5. Otherwise it returns true.

`HostNotFound` reads the data, and RFC-0013 lists what it renders for each reason. An extension, a
command, a menu entry and a settings section evaluate their conditions without throwing, against the
same stores and the router's matches.

### Starting

In the browser:

1. The entry imports `virtual:product`. The module contains the resolved product and imports each
   installed plugin's manifest. The manifests' importers do not load a component yet.
2. `createHostRoutes(product)` compiles the plugin routes and the settings routes under the root.
3. `createHost` reads the session, and reads the switches and the placements from the setting store.
   It starts the flag source's `identify` and starts importing the eager plugins' modules.
4. The product builds the router with the host in its context.
5. `host.ready()` resolves once the eager modules are imported and `identify` resolved, or once the
   flag timeout passed.
6. The product renders. The router matches the address, runs `beforeLoad` for each match, loads the
   page's chunk and renders the page inside the frame.

### Changes while the page runs

| Change                                            | Stores updated                               | Then                                                                                          |
| ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| The session changes                               | `session`, `availability`, `access`, `flags` | RFC-0014 lists the sequence: reset the data, invalidate, `identify`, evaluate the flags again |
| A flag changes at the source                      | `flags`, `availability`                      | `router.invalidate()` where a value changed                                                   |
| An override is set or removed                     | `flags`, `availability`                      | `router.invalidate()`                                                                         |
| A person switches a plugin                        | `switches`, `availability`                   | `router.invalidate()`, and `host/pluginSwitched` on the bus                                   |
| Another tab switches a plugin                     | `switches`, `availability`                   | The same, from the setting store's notification                                               |
| The access source reports a change                | `access`                                     | Every reader of `useAccess` asks again                                                        |
| A person changes a placement                      | `placements`                                 | Every affected `Slot` renders again                                                           |
| A target is quarantined or retried                | `quarantine`                                 | `router.invalidate()` for a route, a `Slot` render for an extension                           |
| A mutation settles, or the changes stream reports | none. The data client's cache changes        | `invalidateChanges` for the changed records, and `host/recordsChanged` on the bus (RFC-0020)  |

`HostProvider` subscribes to `session`, `flags`, `availability` and `quarantine`, and calls
`router.invalidate()` after a change that a route condition reads. `invalidate` runs `beforeLoad`
for every matched route. Measured on TanStack Router 1.170.34 in Chromium and Firefox, a condition
that turns false renders the page not found inside the frame, and turning it true again mounts the
page, with the frame's state kept (RFC-0013 lists the measurement).

### Quarantine

A render target is a kind and a qualified id: `route:time-off/overview`, `extension:billing/card`.

```ts
/**
 * Names one thing the host renders from a manifest.
 */
export type RenderTarget = `extension:${string}` | `route:${string}`;
```

- The host renders every extension inside an error boundary of its own, and every plugin route with
  an `errorComponent` that the compiler attaches per declaration
  (`foundations/providers/router/src/compile.ts:20-26`).
- Each render that throws counts one failure for its target, and the count returns to zero when a
  render commits. The count is per render rather than per second, so a page rendered sixty times a
  minute and one rendered once an hour follow the same rule.
- While a target has failed fewer times than the limit, the manifest's fallback renders in its place
  where there is one, and the host's error component or nothing where there is none.
- After `quarantineAfter` failures in a row, 3 by default, the host quarantines the target:
  - An extension leaves its slot.
  - A route is not found, with a retry on the not-found page.
- `host.retry(target)` lifts the quarantine and forgets the failures. The inspector and the
  not-found page call it.
- Quarantine lasts until a retry or a reload. It is not stored, because a release may have fixed the
  fault.

### Reports

```ts
/**
 * Describes one entry the host reports.
 */
export type HostReport =
  | { readonly error: unknown; readonly kind: "access-failed" }
  | { readonly error: unknown; readonly kind: "command-failed"; readonly target: string }
  | { readonly kind: "event-chain-cut"; readonly target: string }
  | { readonly error: unknown; readonly kind: "event-handler-failed"; readonly target: string }
  | { readonly flag: string; readonly kind: "flag-exposed"; readonly variant: string }
  | {
      readonly flag: string;
      readonly kind: "flag-ignored";
      readonly source: "override" | "product" | "source";
      readonly value: unknown;
    }
  | { readonly error: unknown; readonly kind: "flags-failed" }
  | { readonly error: unknown; readonly kind: "quarantined"; readonly target: RenderTarget }
  | {
      readonly error: unknown;
      readonly kind: "render-failed";
      readonly target: "host" | RenderTarget;
    }
  | { readonly error: unknown; readonly kind: "session-failed" }
  | { readonly key: string; readonly kind: "setting-dropped"; readonly reason: string }
  | { readonly kind: "slot-full"; readonly slot: string; readonly target: string }
  | { readonly kind: "unplaced"; readonly slot: string; readonly target: string };
```

- Each entry records the plugin it concerns through its target's qualified id or its flag's.
- The host passes each entry to `report`, which writes to the console by default with the prefix
  `[host]`. A product passes its telemetry client, which also forwards `flag-exposed` to its
  analytics (RFC-0015).
- The `reports` store keeps the last 100 entries for the inspector (RFC-0019).
- The build's warnings are part of the resolved product, and the inspector lists them beside the
  runtime entries.

### Performance marks

The host measures the work it does for a plugin with `performance.measure`, so a product's
monitoring attributes load time and run time to plugins:

| Measure                        | From                                          | To                             |
| ------------------------------ | --------------------------------------------- | ------------------------------ |
| `stealth:load:<plugin id>`     | The first import of the plugin's chunk starts | The import resolves            |
| `stealth:command:<command id>` | `run` is called                               | The command's function settles |

A product reads them with a `PerformanceObserver` of the type `measure`, the way it reads any other
entry of the Performance Timeline. The host adds a measure only while plugin code loads or runs.

### Status hooks

`sdk-plugin` returns what the host knows about itself to a plugin that shows it, such as the
inspector (RFC-0019):

| Hook                     | Returns                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `usePluginStatuses()`    | One `PluginStatus` per installed plugin                                                                            |
| `useExtensionStatuses()` | One status per extension for the current page: placed or not, the slot, and the reason                             |
| `useHostReports()`       | The build's warnings and the runtime entries of the `reports` store                                                |
| `useFlagStatuses()`      | One status per declared flag: its kind, its value, the source of the value, its date, and whether it is overridden |
| `useHostActions()`       | `retry(target)`, which lifts a quarantine                                                                          |
| `useResolvedProduct()`   | The resolved product the host started from, without the manifests' code                                            |

An extension that is not placed has one of these reasons:

- Its plugin is not on, with the plugin's reason.
- Its condition is false.
- It is quarantined.
- Its slot is not mounted.
- Its slot takes one contribution, and another came first.
- Its keyed slot rendered another value.
- A placement by the product or the person moved it.

```ts
/**
 * Describes one installed plugin at run time.
 */
export interface PluginStatus {
  /**
   * Id of the plugin.
   */
  readonly id: string;

  /**
   * True where the plugin is available (see "Availability").
   */
  readonly on: boolean;

  /**
   * Every target of the plugin that is quarantined, with its last error.
   */
  readonly quarantined: readonly Quarantined[];

  /**
   * The reason the plugin is not on. Absent while it is on.
   */
  readonly reason?: "condition" | "off" | "requirement" | "unavailable" | undefined;

  /**
   * True where a person may switch it: the product did not lock it.
   */
  readonly switchable: boolean;

  /**
   * The plugin's version, from its contract.
   */
  readonly version: string | undefined;
}
```

Every hook of `sdk-plugin` throws outside `HostProvider`, naming itself:
`useSlot() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.`

### A chunk that no longer exists

A page that loaded before a deployment asks, at its next lazy import, for a chunk the deployment
replaced. The host recovers once per build version:

- The host listens for Vite's `vite:preloadError` event and for a rejected lazy import of a plugin
  module.
- On the first such failure for a build version, it records the version under
  `stealth.<productId>.reloaded` in session storage and reloads the page. The reload loads the new
  build.
- On a second failure for the same version, it renders the route's error component instead of
  reloading again. A chunk that the new build also lacks cannot start a loop of reloads.

### An error outside every plugin

Every plugin route has an error component and every extension has a boundary, so a plugin's error
remains inside its plugin. An error in the product's frame, in a host part or in a provider escapes
them. `HostProvider` renders a last boundary around its children for that case:

- It renders a page that states the product could not render, with a button that reloads the page.
- It reports the error as `render-failed` with the target `host`.
- It does not reset. A person reloads to leave it, because the state of the providers above the
  failure is unknown.

### On a server

- The process builds the tree once, with `createHostRoutes`, because the tree does not depend on a
  host.
- Each request creates a host with `constantSession`, the request's flag source, access source and
  data transport, and a setting store over the request's cookies. The server then reads the switches
  and placements the browser wrote.
- Each request creates a router with that host and its data client in its context, connects them
  with `setupDataIntegration` (RFC-0005), awaits `host.ready()`, and renders.
- The router's dehydrated state contains the flag values the render read, the switches, the
  placements and the primed decisions. The browser's host starts from them, so its first render
  matches the server's.
- The data integration streams each query's data into the page. The browser's host primes the
  decisions that data states as the page hydrates it (RFC-0020).

## Failure handling

| Failure                                               | Detected by                 | Outcome                                                                         |
| ----------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| A manifest lacks code for a declared name             | `createHost`                | Throws before anything renders, naming the plugin and the name                  |
| The open page's plugin is switched off or stopped     | The route evaluator         | Not found, with the plugin and the reason (RFC-0013)                            |
| A page throws while rendering                         | The route's error component | Its fallback or the error component. After 3 in a row, not found with a retry   |
| An extension throws while rendering                   | The extension's boundary    | Its fallback, or nothing. After 3 in a row, quarantined                         |
| A lazy import fails after a deployment                | The host                    | One reload per build version, then the error component                          |
| The session source throws                             | The host                    | The last session remains, and a `session-failed` entry is reported              |
| The flag source fails                                 | The host                    | The previous values remain, and a `flags-failed` entry is reported (RFC-0015)   |
| The access source fails                               | The host                    | The batch is denied for 30 seconds, and `access-failed` is reported (RFC-0014)  |
| A stored switch, setting or placement fails its check | The host                    | The value is dropped, and a `setting-dropped` entry is reported (RFC-0017)      |
| A hook of `sdk-plugin` renders outside a host         | The hook                    | Throws, naming the hook                                                         |
| The frame, a host part or a provider throws           | `HostProvider`'s boundary   | A page that offers a reload, and a `render-failed` entry with the target `host` |

## Bounds

- Resolution runs at build. The host evaluates conditions and nothing else when a page starts.
- A navigation evaluates the conditions of its matched routes, two to four in a frame.
- A `Slot` evaluates the conditions of the extensions placed in it, when it renders and when a store
  it reads changes.
- A store change notifies the store's subscribers. A subscriber renders again only where its
  selector returns another value.
- The `reports` store keeps 100 entries.

## Alternatives considered

### One store with one snapshot

Every change computes the whole state again and publishes a new snapshot.

**Why not:** every reader renders again on every change. A person switching one plugin renders every
slot, every menu and every command reader of the page. Stores per concern render the readers of the
value that changed.

### One function that mounts the application

`mount({ element, product })` builds the router, the providers and the frame in one call.

**Why not:** the router has 48 options and the shell composes seven providers. The frame is the
product's own component. RFC-0006 refused a router factory because a factory hides every option it
did not anticipate, and the pieces leave each option with the product.

### A tree per host

`host.routes(root)` compiles the routes with an evaluator bound to that host.

**Why not:** on a server every request would build and process a tree of its own, and RFC-0006
builds the tree once per process. An evaluator that reads the host from the router's context serves
every request from one tree.

### Stored quarantine

Keep quarantined targets in the setting store, so a failing extension remains out after a reload.

**Why not:** a reload may load a release that fixed the fault, and a stored quarantine would hide
the fix until somebody retries. A target that still fails is quarantined again after three renders.

## Drawbacks

- A product composes seven pieces rather than calling one function.
- `provider-router`'s `Evaluate` gains a second argument, which changes the published type.
- A reload after a deployment loses unsaved input on the page. It happens once per deployment, and
  only where a lazy import fails.
- The number of re-renders per change is not measured. A React Profiler run on
  `examples/app-plugins` compares stores per concern with one snapshot before the host is built.

## Unresolved and future work

- A notice that a new build is served, taken at the next navigation, with the second slice
  (RFC-0009).
- Spans for a command run and a page load, for a product with tracing, beside the performance marks.

## References

| What                                      | Where                                                      |
| ----------------------------------------- | ---------------------------------------------------------- |
| The router's compiler and its gate        | `foundations/providers/router/src/compile.ts:258-286`      |
| Refusing a failing condition as not found | `docs/adr/0024-refuse-a-failing-condition-as-not-found.md` |
| TanStack Router's `notFound`              | router-core 1.171.29, `src/not-found.ts:4-39`              |
| Vite's preload error event                | https://vite.dev/guide/build#load-error-handling           |
| The Performance Timeline's measures       | https://www.w3.org/TR/user-timing/                         |
