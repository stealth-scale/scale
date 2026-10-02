---
rfc: 0019
title: "Testing plugins, and the tools of a plugin's author"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0019: Testing plugins, and the tools of a plugin's author

## Summary

A plugin's contract states enough to test most of the plugin without a test written by hand: every
page has a sample, every slot has sample props, every command has sample arguments, and every
condition names what it reads. This RFC defines the checks derived from a contract and a manifest,
the render helpers a plugin's own tests use, the checks of a product, the standalone host an author
develops a plugin in, the inspector, the scaffold that starts a plugin, and the lint rules that keep
the two packages apart.

## Motivation

### The requirements

- Every page, extension, command, settings section and flag a plugin declares is tested, without a
  test written by hand for each.
- Every render of a plugin passes axe.
- Every condition can be true and can be false, so none hides a declaration for everybody or gates
  nothing.
- A test renders a plugin the way a product renders it, so a test and a product cannot disagree.
- An author sees each side of every condition while developing, without editing code or a service.
- A person responsible for a product sees, while the product runs, why a plugin or an extension is
  missing and where each flag's value came from.

### Why this layer

`testing-react` renders and audits components (`packages/testing-react`). The plugin kit audits
through it and adds what a contract makes derivable: one case per declaration, under a real host.
The kit builds the host's router itself, because a plugin's pages render under `HostProvider`, and
`testing-router`'s `mountRouter` renders `RouterProvider` without it.

## Detailed design

### One product for a test and a page

`@stealthscale/sdk-host/standalone` builds the product a plugin runs in on its own. The tests of
`testing-plugin` and the standalone page both start from it, so a test and the page run one product
under one session.

```ts
/**
 * Returns the definition of a product that runs one plugin: the plugin from its manifest, and each
 * plugin beside it from its contract alone.
 */
export function standaloneProduct(options: {
  readonly beside?: readonly AnyContract[];
  readonly config?: Readonly<Record<string, boolean | number | string>>;
  readonly contract: AnyContract;
  readonly manifest?: PluginManifest;
}): ProductDefinition;

/**
 * Returns the same definition from the plugin's manifest module and each contract package's module.
 */
export function standaloneFrom(
  plugin: StandaloneModule,
  beside?: readonly StandaloneModule[],
): ProductDefinition;

/**
 * Returns the session, access and flag sources a panel or a test switches.
 */
export function standaloneSources(
  product: Pick<ResolvedProduct, "entitlements" | "permissions">,
): StandaloneSources;
```

- The entry imports `sdk-core` alone, so the build evaluates a definition that calls it in Node.
- The product's id is the plugin's id, and its name is the key `plugin.name`, so the product's name
  is the plugin's own.
- A plugin installed from its contract alone gets a placeholder for every name that needs code. A
  route renders a page whose heading is the route's id, and which renders each of the plugin's slots
  with its sample props. An extension renders the content it wraps, or nothing. A command resolves
  with nothing. A settings section without a schema renders words that name the plugin.
- `standaloneFrom` throws unless the plugin's module exports exactly one manifest and each module
  beside it exactly one contract. The error names the module.
- The session starts signed in, with every permission and entitlement the product declares, no role
  and no person. `set` replaces it.
- The access source denies a check whose permission the session lacks. It allows every other check
  until `deny`, `pending` or `decide` switches the decision, and it notifies on each switch and on
  each change of the session, so the host's access store asks again.
- The flag source returns true for every boolean flag and no value for an experiment, so the
  product's value or the default applies.

### Derived checks

```ts
/**
 * Describes one derived test case.
 */
export interface Check {
  /**
   * The behaviour the case checks, worded to follow "checks that".
   */
  readonly name: string;

  /**
   * Runs the case, and rejects with the fault.
   */
  readonly run: () => Promise<void>;
}

/**
 * Lists what the derived cases read beside the plugin's contract and manifest.
 */
export interface ChecksOptions {
  /**
   * Contracts of the plugins the plugin targets or needs, each installed beside it from its
   * contract alone.
   */
  readonly beside?: readonly AnyContract[] | undefined;

  /**
   * The plugin's `./theme` preset. The recipe case is left out without it.
   */
  readonly theme?: ThemePreset | undefined;
}

/**
 * Derives the test cases every plugin runs from its contract and its manifest.
 */
export function checks(
  contract: AnyContract,
  manifest: PluginManifest,
  options?: ChecksOptions,
): readonly Check[];
```

A plugin's web package runs them in one spec:

```ts
describe("time-off", () => {
  it.each(checks(timeOffContract, manifest, { beside: [identityContract], theme }))(
    "checks that $name",
    async ({ run }) => {
      await run();
    },
  );
});
```

| Case, after "checks that"                                      | Derived from                             | Passes when                                                                |
| -------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| the manifest has code for every declared name                  | The contract and the manifest            | No name lacks code and no code lacks a name                                |
| requirement `<plugin>` `<range>` admits the installed contract | Each requirement                         | The required plugin is installed beside it, at a version in range          |
| route `<id>` imports one component                             | Each route                               | The manifest maps code, and the module exports exactly one function        |
| route `<id>`'s condition is not constant                       | Each route with a condition              | One context makes it true and another makes it false                       |
| extension `<id>` imports one component                         | Each extension                           | As the route's import case                                                 |
| extension `<id>`'s condition is not constant                   | Each extension with a condition          | As the route's condition case                                              |
| command `<id>` imports one function                            | Each command                             | As the route's import case                                                 |
| command `<id>`'s condition is not constant                     | Each command with a condition            | As the route's condition case                                              |
| route `<id>` renders at its sample                             | Each route, at its sample                | The page and its data load under a host, and axe finds no violation        |
| route `<id>`'s fallback renders at its sample                  | Each route with a fallback               | As the route's render case, with the fallback as the page                  |
| extension `<id>` renders with its target's props               | Each extension, with the target's sample | It commits a render without throwing, and axe finds nothing                |
| extension `<id>`'s fallback renders with its target's props    | Each extension with a fallback           | As the extension's render case                                             |
| command `<id>` runs with its sample                            | Each command                             | The run through the host's command registry resolves                       |
| slot `<id>` is mounted by the plugin                           | Each slot                                | A render of the plugin's routes and extensions mounts the slot             |
| settings section `<id>` renders with its defaults              | Each section                             | Its settings page renders under a host, and axe finds nothing              |
| settings section `<id>`'s defaults pass its schema             | Each schema section                      | The engine of `provider-form` reports no issue                             |
| flag `<id>` is not past its date                               | Each flag with `expires`                 | Today is not later than the flag's date (RFC-0015)                         |
| every key the contract names is in the fallback catalogue      | Every key the contract names             | The build's words check reports no key missing from the plugin's catalogue |
| plugin.name is in the fallback catalogue                       | The catalogue                            | The key is present                                                         |
| plugin.description is in the fallback catalogue                | The catalogue                            | The key is present                                                         |
| every recipe starts with the plugin id                         | The `./theme` preset in `theme`          | Each recipe's class name, else its name, starts with `<pluginId>-`         |
| query `<id>` finds records in its sample                       | Each query with selectors                | Each record and decision selector finds a record in the sample             |
| mutation `<id>`'s changes name variables its sample states     | Each mutation whose changes name one     | Each such variable's value in the sample is a string or a number           |

- `checks()` builds the list and runs nothing. Each case resolves what it reads when it runs, so one
  case's failure leaves the others to run.
- The cases the build decides read the resolver's reports by path: the problems under
  `<plugin>.code`, the problems and warnings at `<plugin>.requires.<index>`, and the warning at
  `<plugin>.featureFlags.<name>.expires`. The resolver is the one authority for code, ranges and
  dates.
- A render case renders under a real host, created with `createHost` over the product
  `standaloneProduct` builds from the plugin and the contracts in `beside`. The case runs the host
  code a product runs. It disposes its host whatever the result.
- The host's data runs on a sampled transport built from the samples of the plugin and of the
  contracts in `beside`. A page renders with data and no service (RFC-0020). A route's data loads
  with the route, and a failed load fails the route's render case.
- A route's render case reports three kinds of fault: a match whose load ended other than in
  success, a render the host reports as failed, and a rule axe finds broken. Axe runs through
  `accessibilityViolations` of `testing-react`, with the rules the catalogue audits use.
- An extension renders on its own with its target's sample props, the target's id, and `children`
  where it wraps.
- A command runs through the host's registry, so its condition and the commands it needs apply as
  they do in a product. A command of a plugin beside it resolves with nothing.
- The slot cases share one render of every route and extension, which the first slot case starts.
- The words cases read the catalogues that the package's i18n layers load into the specification's
  i18n instance.

A route's render case, its fallback's, the slot walk's render of it and a command's case run under
the first context that makes the declaration's condition true. The search starts from the standalone
session: signed in, every declared permission and entitlement, every boolean flag on and every
plugin on. The first true context changes only the atoms the condition reads, so a page for a
signed-out person renders signed out. An extension and a settings section render under the
standalone session. A plugin's own spec renders the other side with `renderPlugin`.

A condition's case evaluates the condition in every context its atoms make:

- A boolean atom takes true and false: `authenticated`, and each permission, entitlement, boolean
  flag, plugin and matched route the condition names.
- An experiment takes each variant the condition names and one variant it names none of.
- A value of a slot's record takes each value the condition compares it with, one other value and no
  value.
- A condition that reads six boolean atoms is evaluated in 64 contexts.
- `allOf: [A, { not: B }]` is true in one context of four: A true and B false. A search over fewer
  contexts than every combination can miss that one.
- A condition whose atoms make more than 65,536 contexts, the bound of the search, fails its case.
  Sixteen boolean atoms make 65,536 contexts. A condition that large is two conditions.
- The case's message contains the declaration and the side that never occurs:

  ```text
  route time-off/overview has a condition that is false in every context, so it is never routed.
  ```

### Rendering a plugin in its own tests

```ts
/**
 * Renders an element as a component of a plugin, under a host and a loaded memory router.
 */
export function renderPlugin(ui: ReactNode, options: PluginRenderOptions): Promise<PluginRendered>;

/**
 * Renders a hook as a hook of a plugin, under the same host.
 */
export function renderPluginHook<T>(
  hook: () => T,
  options: PluginRenderOptions,
): Promise<PluginHookRendered<T>>;
```

| Option       | Type                                                | Default                                                         |
| ------------ | --------------------------------------------------- | --------------------------------------------------------------- |
| `contract`   | `AnyContract`                                       | Required. The plugin the element belongs to                     |
| `manifest`   | `PluginManifest`                                    | The plugin installed from its contract alone                    |
| `beside`     | `readonly AnyContract[]`                            | None. Other plugins, each installed from its contract alone     |
| `route`      | `{ to: RouteReference; params?; search? }`          | The memory router opens at `/`                                  |
| `session`    | `Session`                                           | Signed in, with every permission and entitlement declared       |
| `access`     | `(check: AccessCheck) => boolean`                   | Every check the session's permissions admit is allowed          |
| `flags`      | `Readonly<Record<string, boolean \| string>>`       | Every boolean flag on, every experiment at its default          |
| `switches`   | `Readonly<Record<string, boolean>>`                 | Every plugin on                                                 |
| `config`     | The plugin's configuration                          | The schema's defaults                                           |
| `settings`   | Values per settings section, by section id          | The schemas' defaults                                           |
| `placements` | `Readonly<Record<string, SlotPlacement>>`           | None                                                            |
| `samples`    | `Readonly<Record<string, Sample>>`, by operation id | The contracts' samples. A refusal rejects the operation's runs  |
| `frame`      | `ComponentType`                                     | A frame that renders every region, so `Into` contributions show |

- `renderPlugin` resolves the product `standaloneProduct` builds, creates the host over
  `standaloneSources`, builds the host's router with `routerOptions`, `createHostRoutes` and a
  memory history, opens it at the route, and loads it. It then renders `HostProvider` around
  `RouterProvider`, with `ui` inside the plugin's scope in a `Suspense` boundary. The router loads
  before the render, so both functions return a promise.
- `route` fills the route's parameters from `params`, or from the route's sample where `params` is
  absent.
- The render resolves with Testing Library's result without `rerender`, which would render without
  the providers, and with `host`, `router`, `session` (`set`), `access` (`allow`, `deny`, `pending`,
  `decide`) and `store`. `unmount` disposes the host.
- The session, the flags, the switches, the decisions, the settings and the placements are the
  host's stores, so a spec changes them after the render and the component updates as it does in a
  product. `switches` and `settings` are written into the setting store under the session's subject
  before the host starts.
- The host provides the command registry, the event bus, the toaster and every slot from the
  contracts, so none of them is an option.

### Checking a product

```ts
/**
 * Derives the test cases of a product from its definition and its frame.
 */
export function productChecks(
  definition: ProductDefinition,
  options: { readonly frame: ComponentType },
): readonly Check[];
```

| Case, after "checks that"                       | Passes when                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| the product resolves                            | `resolveProduct` returns no problem                                |
| route `<id>` renders in the frame at its sample | The page renders inside the product's frame, and axe finds nothing |
| required extension `<id>` is placed             | A route's render places the extension in an instance of its target |
| the frame mounts the content slot               | The frame renders `HostContent`                                    |

A product's spec runs them the way a plugin's spec runs `checks()`, so a frame that leaves out a
region a required extension targets fails a test before a person sees the page.

- Each case resolves the definition when it runs, without the build and without catalogues, because
  a spec runs no Vite. A definition that does not resolve fails every rendering case with its
  problems.
- A route renders with its plugin on, under the first context that makes the route's resolved
  condition and its installation's condition true. The host's settings routes are left out.
- An extension is placed where an instance of its target renders it, or drops it for its own
  condition or for a key it does not match. Any other drop fails the case, naming the slot and the
  reason. A target no route renders fails it, naming the target.
- The required-extension cases share one render of every plugin route in the frame, which the first
  of them starts. The content case renders the frame at `/` on its own.

### The standalone host

`vp dev` in a plugin's web package runs the plugin alone. `vite-config-product` publishes the
layers:

```ts
export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    i18n.layers({ scopes: ["@acme", "@stealthscale"] }),
    product.standalone({ beside: ["@acme/plugin-identity-contract"] }),
  ],
});
```

| Option       | Default               | States                                                                    |
| ------------ | --------------------- | ------------------------------------------------------------------------- |
| `beside`     | None                  | Contract packages installed beside the plugin, from their contracts alone |
| `definition` | The generated module  | A definition module the author writes, in place of the generated one      |
| `glyphs`     | None                  | A module whose `glyphs` export the settings forms and the panel render    |
| `locales`    | `["en-US"]`           | The locales the page offers, the first its fallback                       |
| `manifest`   | `src/manifest.ts`     | The module that exports the plugin's manifest                             |
| `themes`     | The application's one | The themes the page offers                                                |

- The page is the `standalone` option of the product plugin (RFC-0011). Once the configuration
  resolves, the plugin writes a definition that calls `standaloneFrom` with the manifest module and
  each package in `beside`, at `node_modules/.stealth/standalone/product.ts`. The build imports it
  in Node. An unchanged file is left untouched, so the watcher reports no change.
- The plugin serves the page's document at `/` and at every address without a file on disk, its
  entry as `virtual:standalone`, and the definition the page imports as
  `virtual:standalone-product`, the same source with the manifest module imported from the package
  root. The application's vendor group claims every module under `node_modules`, and a page
  importing the file there would run the definition before the manifest module.
- The entry imports the stylesheet alone, and the page's modules through `import()`, with no
  top-level await. The bundling development server installs the React refresh runtime in the entry's
  own body, after every chunk the entry imports statically, so a component in such a chunk would run
  before the runtime.
- `product.standalone()` returns `product.standalone` (the product plugin with the page),
  `product.standalone.stylesheet` (the theme's stylesheet compiler) and `product.standalone.chunks`
  (an application's chunk groups), each for a development server alone, then
  `product.standalone.bundled` and, where `definition` names the author's module,
  `product.standalone.definition`, which excuses its default export. A build and a specification run
  of the package take none of the first three, so a pack or a test compiles no stylesheet.
- `renderStandalone` of `@stealthscale/sdk-host/standalone/app` renders the page. It creates the
  host over `standaloneSources`, a local setting store and a transport the panel switches, and
  renders `Shell`, the host and a frame of every region the plugins fill.
- The page starts at the plugin's first menu entry, else at the first route a sample or an empty
  path fills.
- A development panel renders in the `overlay` region as a floating panel at the bottom-end corner,
  and changes, while the page runs:

  | Group                  | Controls                                                                  | Changes                               |
  | ---------------------- | ------------------------------------------------------------------------- | ------------------------------------- |
  | Page                   | Every route a sample fills, by its id                                     | The router's location                 |
  | Session                | Signed in, and a switch per declared permission and entitlement           | The session source                    |
  | Checks on one resource | Allow, deny, pending                                                      | The decisions `useAccess` returns     |
  | Feature flags          | A switch per boolean flag, a picker per experiment                        | Overrides of the flag store           |
  | Plugin                 | The plugin's switch and its kill switch                                   | The switch store and the flag store   |
  | Operations             | Per query and mutation: the sample, the sample after 2 seconds, a refusal | What the transport returns (RFC-0020) |
  | Display                | Language, theme, color mode                                               | `Shell`'s settings                    |

  The author sees each condition's false side, each variant and each pending decision without
  editing code, because each change goes through the host's stores. A pick for a query resets the
  data client's queries and invalidates the router, so the page loads its data again. A pick for a
  mutation applies at its next run.

- A change to a component updates in place. A change to the contract reloads the page (RFC-0011).

### The inspector

The inspector is a plugin. Its packages are `@stealthscale/plugin-inspector` and
`@stealthscale/plugin-inspector-contract`, in `sdk/inspector/`. A product installs it like any
plugin.

- Its route, `inspector/overview`, lists:
  - Every installed plugin with its version, whether it is on and the reason where it is not, and
    its quarantined targets. Each target has a retry.
  - Every extension on the page the person came from, placed or not, with the reason.
  - Every flag with its kind, its date, its value and the source of the value: an override, the flag
    source, the product or the contract.
  - The session's permissions, entitlements and roles, and the decisions on single resources the
    page has made.
  - Every command with its keys and whether it is enabled.
  - The build's warnings and the host's recent report entries.
- Its second route, `inspector/contracts`, lists what every installed plugin declares, so an author
  finds the extension points of the other plugins without reading their source:
  - Routes with their paths, parents, menus and samples.
  - Slots with their arity, whether they are keyed, and their sample props.
  - Extensions with their targets, positions and `match` values.
  - Commands with their keys, and whether they take arguments or resolve with a result.
  - Events with who may emit them, permissions with their resource kinds, roles, entitlements and
    flags.
- It sets and removes flag overrides through `useFlagActions` (RFC-0015) for a person with its
  permission `inspector/flags.override`, and contributes a notice to the `status` region while any
  override is active.
- It reads the host through the hooks of RFC-0012: `usePluginStatuses`, `useExtensionStatuses`,
  `useHostReports`, `useHostActions`, `useFlagStatuses`, `useResolvedProduct`, `useSession` and
  `useCommands`.
- Its route's condition is its own permission, `inspector/inspect`, so a product decides who may
  open it.

### The scaffold

`pnpm plugin:create <id>` writes a plugin that builds, passes its checks and runs in the standalone
host:

| File                                         | Contains                                                  |
| -------------------------------------------- | --------------------------------------------------------- |
| `plugins/<id>/contract/package.json`         | The contract package, depending on `sdk-core`             |
| `plugins/<id>/contract/src/index.ts`         | `defineContract` with one route listed in the main menu   |
| `plugins/<id>/contract/locales/en/<id>.json` | `plugin.name`, `plugin.description` and the route's label |
| `plugins/<id>/web/package.json`              | The web package, exporting the manifest and `./theme`     |
| `plugins/<id>/web/src/manifest.ts`           | `definePlugin` with the route's importer                  |
| `plugins/<id>/web/src/overview.tsx`          | The route's page, a `Page` with its title                 |
| `plugins/<id>/web/src/theme.ts`              | An empty preset                                           |
| `plugins/<id>/web/src/manifest.spec.ts`      | The spec that runs `checks()`                             |
| `plugins/<id>/web/vite.config.ts`            | The standalone layers                                     |

The script refuses an id that breaks the grammar of RFC-0010, and an id another package's namespace
already uses.

### Lint rules

`vite-config-product` publishes two lint layers, one per package kind:

| Layer                  | Refuses                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint.plugin.contract` | An import other than `sdk-core`, `@standard-schema/spec`, another contract package, the package's own modules or a Standard Schema library                 |
| `lint.plugin.web`      | An import of `sdk-host` from a component or a command module, and a static import of a `.tsx` module from the manifest entry, `src/manifest.ts` by default |

- The first keeps a contract loadable in Node and free of React (RFC-0010). A contract package is
  named `*-contract`, which is the name the layer admits. `schemas` names the Standard Schema
  libraries, `arktype`, `valibot` and `zod` by default.
- The second keeps a plugin's components on the API of `sdk-plugin`, and keeps the manifest entry
  free of components, which the build requires (RFC-0011). The manifest's lazy `import()` of a
  component passes.
- Both refuse through `no-restricted-imports` in an override on `src/**` that leaves out
  specifications and fixtures. Oxlint checks a dynamic `import()` against the same patterns, except
  where a pattern matches the imported bindings, which a dynamic import has none of. An override
  replaces the options the rule has for its files, so each layer restates the house's refusal of
  `vite-plus`. Probe files that fail and pass each rule, dynamic imports included, measured both
  layers on oxlint 1.85.0.

## Failure handling

| Failure                                                 | Detected by         | Outcome                                             |
| ------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| A page fails axe at its sample                          | `checks()`          | The case fails, naming the route and the violation  |
| A page's data fails to load at its sample               | `checks()`          | The route's render case fails, naming the match     |
| A condition is always true or always false              | `checks()`          | The case fails, naming the declaration and the side |
| A condition's atoms make more than 65,536 contexts      | `checks()`          | The case fails, naming the declaration              |
| A command rejects with its sample                       | `checks()`          | The case fails with the rejection                   |
| A slot the plugin declares is never mounted             | `checks()`          | The case fails, naming the slot                     |
| A flag is past its date                                 | `checks()`          | The case fails with the resolver's warning          |
| A required extension's region is missing from the frame | `productChecks()`   | The case fails, naming the extension and the target |
| A standalone module exports no manifest, or several     | `standaloneFrom`    | The page's definition throws, naming the module     |
| A component imports `sdk-host`                          | The lint            | The editor and the check report the import          |
| A contract imports React                                | The lint, the build | The editor reports it. The build fails (RFC-0011)   |

## Bounds

- `checks()` renders every route and every extension in its own case, once more in the slot cases'
  shared walk, and evaluates each condition in the contexts its atoms make, 65,536 at most. Its run
  time grows with the plugin's declarations. Not measured yet.
- A render case creates a host and resolves a product per case, so no case reads another's state.

## Alternatives considered

### Stubbed host providers

Render a plugin under providers a test fills one by one.

**Why not:** a stub returns what the test author expected, and the host may return something else. A
real host over the plugin's own contract renders the plugin the way a product does, for the cost of
one resolution per case.

### Tests written by hand for every declaration

**Why not:** every plugin would write the same cases. A plugin that skipped one would release a page
that fails axe at its sample. The contract states the samples, and the kit derives the cases from
them.

### A builder per tool

`testing-plugin` and the standalone page each build their own product and sources.

**Why not:** a test and the page would start from two sessions, and a fix to one would leave the
other behind. One builder in `sdk-host` serves both, and it imports `sdk-core` alone, so the build
evaluates the page's definition in Node.

### The inspector as a part of the host

**Why not:** a product determines who may inspect it. A plugin with its own permission is installed,
switched and guarded like any other, so the host renders no page that only some people see.

## Drawbacks

- A page renders with the data its samples state, so a sample that drifts from the gateway's
  responses passes the plugin's checks (RFC-0020).
- The derived cases cover what a contract states. A behaviour a contract does not describe needs a
  spec of its own.
- The standalone host renders another plugin's page as a placeholder, so a flow across two plugins
  runs only in a product.
- The date case fails a plugin's tests on a day without a change to its code (RFC-0015).

## Unresolved and future work

- A catalogue scene per route and extension, rendered from its sample, in the specimen catalogue.
- Measuring the run time of `checks()` on `examples/app-plugins`.
- A comparison of a contract with its last release that refuses a removed name or a changed path in
  a minor release. The first plugin released from a repository other than its products' brings it
  in.

## References

| What                           | Where                                            |
| ------------------------------ | ------------------------------------------------ |
| Axe in this repository's tests | `packages/testing-react`                         |
| The standalone product         | `sdk/host/src/standalone.ts`                     |
| The standalone page            | `packages/vite-plugin-product/src/standalone.ts` |
| Test names                     | `docs/standards/test-names.md`                   |
