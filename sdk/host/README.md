# @stealthscale/sdk-host

`@stealthscale/sdk-host` runs a product composed from plugins. It keeps the state the plugins read
through `@stealthscale/sdk-plugin` and compiles their routes. It renders the frame's regions, the
command palette, the toasts, the not-found page and the settings pages.

A product creates one host per page in the browser and one per request on a server.

## Install

```bash
pnpm add @stealthscale/sdk-host
```

The package peers on `react`, `react-dom`, `@tanstack/react-router-ssr-query`,
`@stealthscale/sdk-plugin`, the providers it reads and the component packages it renders:

- `provider-data`, `provider-router`, `provider-i18n`, `provider-hotkeys`, `provider-form`,
  `settings` and `hooks`
- `component-actions`, `component-feedback`, `component-forms`, `component-layout`,
  `component-modals`, `component-navigation`, `component-screen` and `component-typography`

The `./openfeature` entry peers on `@openfeature/web-sdk` as well, which is optional. The
`./standalone/app` entry peers on `provider-color-mode`, `provider-locale` and `provider-shell`,
which are optional for the other entries. The host's words are in the `host` catalogue namespace,
`locales/<language>/host.json`.

## Compose the application

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

const host = createHost({
  data: { changes: changesSubscription, transport: gatewayTransport(gateway) },
  flags: openFeatureFlags(),
  product,
  session: identitySession,
  store: localStore(),
});
const router = createRouter({
  ...routerOptions({ data: host.data, host, routes: routeMap(tree) }),
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

| Piece                  | Created                           | Renders or keeps                                                                       |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `createHostRoutes`     | Once per route tree               | The plugins' routes, the settings route, its index and a route per settings page       |
| `createHost`           | Once per page, once per request   | The stores, the event bus, the data client, the toaster, the quarantine, the reports   |
| `HostRoot`             | The root route's component        | The `layout` region around the frame, the `overlay` region, the palette and the toasts |
| `HostNotFound`         | The root's not-found component    | The not-found page, with the reason a plugin's page is not found                       |
| `HostProvider`         | Once per render tree              | The host's context, `DataProvider` and the `root` region around the product's tree     |
| `HostContent`          | In the frame, where the page goes | The `content` region around the matched page                                           |
| `setupHostIntegration` | Once per router                   | The host's state in a server render, and the browser's host started from it            |

- Build the tree once. A plugin that turns off makes its routes not found, and the router keeps the
  tree it was built from.
- `routerOptions` puts the host, its data client and the route map in the router's context, which
  `HostRouterContext` types. Every route's condition reads the host from there, so one tree serves
  every request on a server.
- `host.ready()` resolves once the eager plugins' modules are imported and the flag source has
  identified the session, or once `flagsTimeout` passes.

## Create a host

| Option            | Where left out                                    | States                                                                       |
| ----------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `product`         | Required                                          | The resolved product with its plugins' manifests, from `virtual:product`     |
| `session`         | Required                                          | The `SessionSource` the session comes from                                   |
| `store`           | Required                                          | The `SettingStore` a person's switches, settings and placements are kept in  |
| `access`          | Every decision is the tenant-wide one             | The `AccessSource` of decisions on single resources                          |
| `data`            | A transport over the contracts' samples           | The transport and the changes subscription the data client runs on           |
| `flags`           | Every flag has the product's value or its default | The `FlagSource` of flag values per session                                  |
| `flagsTimeout`    | 1,000 ms                                          | How long `ready` waits for the flag source's first `identify`                |
| `glyphs`          | No glyphs                                         | The glyphs the settings sections' forms render, such as a checked box's mark |
| `overrides`       | On outside a production build                     | Whether the tab's flag overrides are read and written                        |
| `quarantineAfter` | 3                                                 | Failed renders in a row after which a route or an extension is quarantined   |
| `report`          | The console                                       | The function that receives every `HostReport` entry                          |

- `createHost` throws where a manifest lacks code for a declared name, and names the plugin and the
  name.
- The console report writes an entry that has an error with `console.error`, and every other entry
  with `console.warn`, each prefixed `[host]`.
- The data client refuses an operation no installed plugin declares. Each arrival of a declared
  query's data primes the access decisions its selectors state.
- `retry(target)` lifts a quarantine. `dispose()` ends the host's subscriptions and cancels the data
  client's fetches.

## Routes

`createHostRoutes(product)` returns a function of the root route. The function compiles every route
in one `compileRoutes` call:

- A plugin route loads its page with the modules of the plugins in its `loads`, loads its declared
  data through the data client, and validates its search with its contract's validator.
- Its condition is evaluated against the host in the router's context. A route whose plugin is off,
  stopped by its kill switch or quarantined is not found, with `NotFoundData` that states the
  reason: `PluginUnavailable` or `PageQuarantined`.
- Where a condition that requires a signed-in person is false for a person who is not signed in, the
  route redirects to the product's sign-in route, with the entered address as the `redirect` search.
- A page that throws renders its manifest's fallback, or the host's error page. Each error counts
  once towards the route's quarantine.

`HostNotFound` renders the not-found page. For a plugin a switch turned off it offers a button that
turns the plugin on, and for a quarantined page a retry. Where the page replaced the page a person
was on, focus moves to its heading.

## The frame

- `HostProvider` renders the host's context, `DataProvider` and the `root` region around the
  product's tree. It invalidates the router after a change a route condition reads, emits
  `host/navigated`, and titles the document with the product's name.
- `HostRoot` renders the frame inside the `layout` region, then the `overlay` region with the
  command palette and the toast region, and binds the commands' keys. `Mod+K` opens the palette.
- `HostContent` renders the matched page inside the `content` region. Render it in the frame where
  the page belongs.
- `HostProvider` and `HostRoot` each render a last boundary. An error outside every plugin renders a
  page that offers a reload, and is reported as `render-failed` with the target `host`.

## Settings

The settings route, `host/settings`, renders a page with the settings menu beside the settings page
a person is on. Its index opens the menu's first entry.

- A settings page renders the sections that target it, each inside its own boundary. A schema
  section renders a form from its schema and saves its values through `useSettings`.
- The Plugins page lists every installed plugin with a switch where the plugin is switchable. It
  asks before it turns off a plugin that other plugins require.
- The account page renders where an installed section targets it.

Pass `glyphs` to `createHost`, or the sections' forms render no marks.

## A chunk that no longer exists

A page loaded before a deployment requests chunks that the deployment replaced. The host reloads the
page once per build version, the product's `version`:

- A plugin's module that fails to import starts the recovery, and so does Vite's `vite:preloadError`
  while `HostProvider` is mounted. The import does not settle, so no error renders while the page
  reloads.
- The version is recorded under `stealth.<productId>.reloaded` in session storage. A second failure
  for the same version renders the error.
- A server, and a page whose storage the browser refuses, render the error without a reload.

Each plugin's first import is measured as `stealth:load:<plugin id>`.

## Server rendering

Call `setupHostIntegration` where you call `setupDataIntegration`: for each request on a server, and
in the browser before the router hydrates.

```ts
setupDataIntegration({ client: host.data, router });
setupHostIntegration({ host, router });
```

- On a server the router's dehydrated state gains the host's snapshot: the subject, the flags the
  render read and the decisions the host knew before the render.
- In the browser the router waits for the snapshot before its first render. The host reads the
  server's flags until `HostProvider` mounts, and takes the decisions where the browser's subject is
  the server's, so the first render matches the server's.
- `HostProvider`'s first effect applies the tab's overrides and the browser's flag source.

Create a host per request on a server, with `constantSession` and a setting store over the request's
cookies.

## A plugin on its own

`@stealthscale/sdk-host/standalone` builds the product a plugin runs in on its own, for its tests
and its standalone page. The entry imports `@stealthscale/sdk-core` alone, so the build evaluates it
in Node.

| Export                           | Returns                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `standaloneProduct(options)`     | The definition that installs the plugin and each contract in `beside` from its contract alone |
| `standaloneFrom(plugin, beside)` | The same definition, from the plugin's manifest module and each contract package's module     |
| `standaloneSources(product)`     | The session, access and flag sources a panel or a test switches                               |

- The product's id is the plugin's, and its name is the plugin's `plugin.name`.
- A plugin installed from its contract alone renders a placeholder page per route. The page's
  heading is the route's id, and the page renders each of the plugin's slots with its sample props.
  Its extensions render the content they wrap, its commands resolve with nothing, and its settings
  sections without a schema name the plugin.
- `standaloneFrom` throws unless the plugin's module exports exactly one manifest and each module
  beside it exactly one contract. The error gives the module's path or package name.
- The session starts signed in, with every declared permission and entitlement. `set` replaces it.
- The access source allows each check on one resource whose permission the session has, until
  `deny`, `pending` or `decide` switches the decision. It notifies on each switch and each session
  change, so the host asks again.
- The flag source turns every boolean flag on and leaves every experiment at its default.

`renderStandalone(options)` from `@stealthscale/sdk-host/standalone/app` renders the standalone page
into the element with the id `root`, or `element`, and resolves with its React root. The layer of
`@stealthscale/vite-config-product` serves the page and calls it.

| Option       | Where left out              | States                                                    |
| ------------ | --------------------------- | --------------------------------------------------------- |
| `product`    | Required                    | The standalone product, from `virtual:product`            |
| `catalogues` | Every key renders as itself | The catalogues, from `virtual:i18n`                       |
| `glyphs`     | No glyphs                   | The settings forms' glyphs and the panel's stage triggers |
| `locales`    | American English alone      | The locales the page offers, the first its fallback       |
| `themes`     | The application's one theme | The themes the page offers                                |

The page opens at the plugin's first menu entry, else at the first route a sample fills. It renders
a frame of every region the plugins fill and the development panel over it. The panel is a floating
panel at the bottom-end corner, with one group of controls each:

- Page: every route a sample fills, by its id.
- Session: signed in, and a switch per declared permission and entitlement.
- Checks on one resource: Allow, Deny and Pending.
- Feature flags: a switch per boolean flag and a picker per experiment, through `flags.override`.
- Plugin: the plugin's switch, and its kill switch.
- Operations: a picker per query and mutation: the sample, the sample after 2 seconds, or a refusal
  of each kind a `DataError` states. A query's pick loads the page's data again.
- Display: the language, the theme and the color mode.

## OpenFeature

`openFeatureFlags({ domain })` from `@stealthscale/sdk-host/openfeature` returns a flag source over
the OpenFeature client of a domain, `stealth.host` by default.

```ts
import { OpenFeature } from "@openfeature/web-sdk";
import { openFeatureFlags } from "@stealthscale/sdk-host/openfeature";

await OpenFeature.setProviderAndWait("stealth.host", provider);

const host = createHost({ flags: openFeatureFlags(), product, session, store });
```

- `identify` sets the domain's evaluation context from the session: the person as the targeting key,
  the tenant, the roles and the entitlements.
- A flag the provider does not know, a flag it disabled, and every flag where no provider is bound
  to the domain take the product's value or the flag's default.
- OpenFeature keeps one context per domain for the page, so a server passes a flag source per
  request.
