---
rfc: 0019
title: "Testing plugins, and the tools of a plugin's author"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-09-30
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

`testing-react` renders and audits components, and `testing-router` mounts routes
(`packages/testing-react`, `packages/testing-router`). The plugin kit builds on both and adds what a
contract makes derivable: one case per declaration, under a real host.

## Detailed design

### Derived checks

```ts
/**
 * Describes one derived test case.
 */
export interface Check {
  /**
   * What the case checks, written to follow "checks that".
   */
  readonly name: string;

  /**
   * Runs the case, and rejects with the fault.
   */
  readonly run: () => Promise<void>;
}

/**
 * Derives the test cases every plugin runs from its contract and its manifest.
 *
 * @param options - The contracts the plugin targets or needs, which supply their samples.
 */
export function checks(
  contract: AnyContract,
  manifest: PluginManifest,
  options?: { readonly beside?: readonly AnyContract[] },
): readonly Check[];
```

A plugin's web package runs them in one spec:

```ts
describe("time-off", () => {
  it.each(checks(timeOffContract, manifest, { beside: [identityContract] }))(
    "checks that $name",
    async ({ run }) => {
      await run();
    },
  );
});
```

| Case, after "checks that"                                            | Derived from                             | Passes when                                                       |
| -------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| the manifest has code for every declared name                        | The contract and the manifest            | No name lacks code and no code lacks a name                       |
| requirement `<plugin>` `<range>` admits the installed contract       | Each requirement                         | The installed contract's version is in range                      |
| route `<id>` imports one component                                   | Each route                               | The module exports exactly one function                           |
| route `<id>` renders at its sample                                   | Each route, at its sample                | The page renders under a host, and axe finds no violation         |
| route `<id>`'s fallback renders at its sample                        | Each route with a fallback               | As the route's own case                                           |
| route `<id>`'s condition can be true and false                       | Each route with a condition              | At least one context makes it true and one makes it false         |
| extension `<id>` imports one component                               | Each extension                           | The module exports exactly one function                           |
| extension `<id>` renders with its target's props                     | Each extension, with the target's sample | It renders, with `children` where it wraps, and axe finds nothing |
| extension `<id>`'s fallback renders with its target's props          | Each extension with a fallback           | As the extension's own case                                       |
| extension `<id>`'s condition can be true and false                   | Each extension with a condition          | As the route's case                                               |
| command `<id>` imports one function                                  | Each command                             | The module exports exactly one function                           |
| command `<id>` runs with its sample                                  | Each command                             | The run resolves, with stubs for the commands it needs            |
| command `<id>`'s condition can be true and false                     | Each command with a condition            | As the route's case                                               |
| slot `<id>` is mounted by the plugin                                 | Each slot                                | Rendering the plugin's routes and extensions mounts the slot      |
| settings section `<id>` renders with its defaults                    | Each section                             | The form or the component renders, and axe finds nothing          |
| settings section `<id>`'s defaults pass its schema                   | Each schema section                      | The engine of `provider-form` reports no issue                    |
| flag `<id>` is not past its date                                     | Each flag with `expires`                 | Today is not later than the flag's date (RFC-0015)                |
| every label and description is in the fallback catalogue             | Every key the contract states            | Each key is in the plugin's fallback catalogue                    |
| `plugin.name` and `plugin.description` are in the fallback catalogue | The catalogue                            | Both keys are present                                             |
| every recipe starts with the plugin id                               | The plugin's `./theme` preset            | Each recipe name starts with `<pluginId>-`                        |
| query `<id>` finds records in its sample                             | Each query with selectors                | Each record and decision selector finds a record in the sample    |
| mutation `<id>` runs with its sample                                 | Each mutation                            | It resolves, and its changes name variables its sample contains   |
| route `<id>` loads its data at its sample                            | Each route with `data`                   | The loader resolves at the sample parameters (RFC-0020)           |

- A render case renders under a real host, created with `createHost` over a product that
  `resolveProduct` builds from the plugin and the contracts in `beside`. A case runs the host code a
  product runs.
- The host's data runs on a sampled transport built from the samples of the plugin and of the
  contracts in `beside`, so a page renders with data and no service (RFC-0020).
- Axe runs through `accessibilityViolations` of `testing-react`, with the rules the catalogue audits
  use.
- A case unmounts what it rendered, whatever the result.
- The session of a render case has every permission and entitlement the plugin declares or reads,
  every boolean flag the plugin declares or reads is on, every experiment serves its default, and
  every check on one resource is allowed. A plugin's own spec renders the other side with
  `renderPlugin`.

A condition's case evaluates the condition under every combination of the atoms it reads: each
permission, entitlement, boolean flag, variant, plugin and matched route it names, and
`authenticated`.

- A condition that reads six atoms is evaluated in 64 contexts.
- `allOf: [A, { not: B }]` is true in one context of four: A true and B false. A search over fewer
  contexts than every combination can miss that one.
- A condition that reads more than 16 atoms fails its case, because 65,536 contexts is the bound of
  the search. A condition that large is two conditions.
- The case's message contains the declaration and the side that never occurs:

  ```text
  route time-off/overview has a condition that is false in every context, so it is never routed.
  ```

### Rendering a plugin in its own tests

```ts
/**
 * Renders an element as a component of a plugin, under a host and a memory router.
 */
export function renderPlugin(ui: ReactElement, options: PluginRenderOptions): RenderResult;

/**
 * Renders a hook as a hook of a plugin, under the same host.
 */
export function renderPluginHook<T>(
  hook: () => T,
  options: PluginRenderOptions,
): RenderHookResult<T>;
```

| Option       | Type                                                | Default                                                              |
| ------------ | --------------------------------------------------- | -------------------------------------------------------------------- |
| `contract`   | `AnyContract`                                       | Required. The plugin the element belongs to                          |
| `manifest`   | `PluginManifest`                                    | None. Where given, the plugin's pages and extensions render in slots |
| `beside`     | `readonly AnyContract[]`                            | None. Other plugins, from their contracts and samples                |
| `route`      | `{ to: RouteReference; params?; search? }`          | None. The memory router opens at the route                           |
| `session`    | `Session`                                           | A session with every permission and entitlement the plugin declares  |
| `access`     | `(check: AccessCheck) => boolean`                   | Allows every check on one resource                                   |
| `flags`      | `Readonly<Record<string, boolean \| string>>`       | Every flag the plugin declares, at its default                       |
| `switches`   | `Readonly<Record<string, boolean>>`                 | Every plugin on                                                      |
| `config`     | The plugin's configuration                          | The schema's defaults                                                |
| `settings`   | Values per settings section                         | The schemas' defaults                                                |
| `placements` | `Readonly<Record<string, SlotPlacement>>`           | None                                                                 |
| `samples`    | `Readonly<Record<string, Sample>>`, by operation id | The contracts' samples. A refusal renders an error state (RFC-0005)  |
| `frame`      | `ComponentType`                                     | A frame that renders every region, so `Into` contributions show      |

- The session, the flags, the switches, the decisions, the settings and the placements are the
  host's stores, so a spec changes them after the render and the component updates as it does in a
  product.
- `renderPlugin` builds on `testing-react`'s render and `testing-router`'s `mountRoute`.
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

| Case, after "checks that"                       | Passes when                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| the product resolves                            | `resolveProduct` returns no problem                                      |
| route `<id>` renders in the frame at its sample | The page renders inside the product's frame, and axe finds nothing       |
| required extension `<id>` is placed             | Some route's render mounts the extension's slot and places the extension |
| the frame mounts the `content` slot             | The frame renders `HostContent`                                          |

A product's spec runs them the way a plugin's spec runs `checks()`, so a frame that leaves out a
region a required extension targets fails a test before a person sees the page.

### The standalone host

`vp dev` in a plugin's web package runs the plugin alone. `vite-config-product` publishes the layer:

```ts
export default defineConfig({
  extends: [...app.layers(), ...product.standalone({ beside: ["@acme/plugin-identity-contract"] })],
});
```

- The layer serves a page with a host over a product that installs the plugin. It installs every
  plugin in `beside` from its contract alone. A route of a `beside` plugin renders a placeholder
  that names it. A slot of a `beside` plugin renders with its sample props.
- The page starts at the plugin's first menu entry, or at its first route with a sample.
- The session starts with every permission and entitlement the plugin declares, every boolean flag
  is on, every experiment serves its default, and every check on one resource is allowed.
- A development panel in the `overlay` region changes, while the page runs:

  | Control                                                    | Changes                                               |
  | ---------------------------------------------------------- | ----------------------------------------------------- |
  | Signed in                                                  | `session.authenticated`                               |
  | One switch per permission and entitlement the plugin reads | The session's lists                                   |
  | Checks on one resource: allow all, deny all, pending       | The decisions `useAccess` returns                     |
  | One switch per boolean flag, one picker per experiment     | Overrides of the flag store                           |
  | The plugin's switch and its kill switch                    | The switch store and the flag store                   |
  | Per operation: sample, 2-second delay, or a refusal kind   | What the sampled transport returns (RFC-0020)         |
  | Page                                                       | The route, from the plugin's routes and their samples |
  | Language, theme, color mode                                | `Shell`'s settings                                    |

  The author sees each condition's false side, each variant and each pending decision without
  editing code, because each change goes through the host's stores.

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
| `plugins/<id>/web/vite.config.ts`            | The standalone layer                                      |

The script refuses an id that breaks the grammar of RFC-0010, and an id another package's namespace
already uses.

### Lint rules

`vite-config-product` publishes two lint layers, one per package kind:

| Layer                  | Refuses                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `lint.plugin.contract` | An import other than `sdk-core`, another contract package, `#package.json` or a Standard Schema library                         |
| `lint.plugin.web`      | An import of `sdk-host` from a component or a command module, and a static import of a component module from the manifest entry |

- The first keeps a contract loadable in Node and free of React (RFC-0010).
- The second keeps a plugin's components on the API of `sdk-plugin`, and keeps the manifest entry
  free of components, which the build requires (RFC-0011).

## Failure handling

| Failure                                                 | Detected by         | Outcome                                             |
| ------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| A page fails axe at its sample                          | `checks()`          | The case fails, naming the route and the violation  |
| A condition is always true or always false              | `checks()`          | The case fails, naming the declaration and the side |
| A condition reads more than 16 atoms                    | `checks()`          | The case fails, naming the declaration              |
| A command rejects with its sample                       | `checks()`          | The case fails with the rejection                   |
| A slot the plugin declares is never mounted             | `checks()`          | The case fails, naming the slot                     |
| A flag is past its date                                 | `checks()`          | The case fails, naming the flag and the date        |
| A required extension's region is missing from the frame | `productChecks()`   | The case fails, naming the extension and the region |
| A component imports `sdk-host`                          | The lint            | The editor and the check report the import          |
| A contract imports React                                | The lint, the build | The editor reports it. The build fails (RFC-0011)   |

## Bounds

- `checks()` renders every route and every extension once, and evaluates each condition in 2^n
  contexts for its n atoms, 65,536 at most. Its run time grows with the plugin's declarations. Not
  measured yet.
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

| What                           | Where                          |
| ------------------------------ | ------------------------------ |
| Axe in this repository's tests | `packages/testing-react`       |
| Mounting a route in a test     | `packages/testing-router`      |
| Test names                     | `docs/standards/test-names.md` |
