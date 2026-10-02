---
rfc: 0011
title: "Composing a product from plugins at build"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0011: Composing a product from plugins at build

## Summary

A product states the plugins it installs in a definition typed by their contracts. A Vite plugin
loads the definition while the product builds, checks every plugin against the others, resolves the
routes, the placements, the commands, the access declarations, the flags and the rest, and writes
the result into one virtual module. The browser receives resolved data and the plugins' lazy code,
and runs no check. The build also writes an access catalogue, a flag catalogue and an operation
catalogue for the services that grant access, serve flags and run operations.

This RFC defines the definition, the resolver, every check, the resolved product, the catalogues,
the chunks each plugin builds into, and the development server's behaviour.

## Motivation

### The requirements

- A product states in one place which plugins it installs, how each is configured, which a person
  may switch off, which load at start, and under which condition each plugin is available.
- Every fault a product can have is reported before it is deployed, with the plugin and the path of
  the value at fault.
- The browser does not validate or resolve a product, so a product's start costs the same with one
  plugin or thirty.
- Each plugin's code loads in one request, the first time a person opens one of its pages.
- The access service, the flag service and the gateway receive every declaration they act on, from
  the build that deploys it.

### Why this layer

In the first slice every plugin is a package the product depends on. Every contract is known at
build, and a check at build reports each fault in the terminal of whoever made it. The browser then
receives no validator. The host also needs the resolved routes before it starts, because the route
tree is complete before the router exists (RFC-0013).

## Detailed design

### The product definition

```ts
/**
 * Describes a product: the plugins it installs and what it states about each.
 */
export interface ProductDefinition {
  /**
   * Extensions the product leaves out everywhere.
   */
  readonly extensions?: { readonly disabled?: readonly ExtensionReference[] } | undefined;

  /**
   * Flag values the product sets over the contracts' defaults, built with `setFlag` (RFC-0015).
   */
  readonly featureFlags?: readonly SetFlag[] | undefined;

  /**
   * Key of the product's name in its own catalogue, whose namespace is the product's id.
   */
  readonly name: string;

  /**
   * The installed plugins, each as `installed` returns it, in install order.
   */
  readonly plugins: readonly InstalledPlugin[];

  /**
   * Id of the product, used as a storage key segment and as its catalogue namespace.
   */
  readonly productId: string;

  /**
   * The route a person who is not signed in is sent to (RFC-0014).
   */
  readonly signIn?: RouteReference | undefined;

  /**
   * The product's placements, per slot (RFC-0017).
   */
  readonly slots?: readonly FilledSlot[] | undefined;

  /**
   * The product's own version, which each build states. The host reloads a page once per version
   * after a chunk fails to import (RFC-0012), so a deployment that keeps the version shares one
   * reload with the build before it.
   */
  readonly version: string;

  /**
   * A condition joined into every plugin route's condition except the sign-in route's.
   */
  readonly when?: When | undefined;
}

/**
 * Installs a plugin. The manifest's contract types the configuration.
 */
export function installed<const M extends PluginManifest>(
  manifest: M,
  ...args: Installed<M["contract"]>
): InstalledPlugin;

/**
 * Describes how a product installs one plugin, with the configuration typed by its contract.
 */
export interface Installing<C extends AnyContract> {
  /**
   * The plugin's configuration, as its schema admits it.
   */
  readonly config?: ConfigWritten<C["config"]> | undefined;

  /**
   * Imports the plugin's modules before the first render, for a plugin on every page.
   */
  readonly eager?: boolean | undefined;

  /**
   * The switch's state before a person chooses. On where left out.
   */
  readonly enabled?: boolean | undefined;

  /**
   * Keeps the plugin on for everybody, out of every person's reach.
   */
  readonly locked?: boolean | undefined;

  /**
   * Condition under which the whole plugin is available, such as an entitlement or a permission.
   * Available always where it states none.
   */
  readonly when?: When | undefined;
}

/**
 * Returns the definition. The build loads the module that exports it and checks it.
 */
export function defineProduct(definition: ProductDefinition): ProductDefinition;
```

- `installed` takes the manifest, so the product imports each plugin's web package. The build needs
  each plugin's code to split it into chunks, and the browser needs the manifests' importers.
- `Installed<C>` requires `config` where the plugin's schema requires a property without a default,
  and allows `installed(manifest)` alone otherwise.
- `FilledSlot` is `{ slot: SlotReference; add?; remove?; order? }` with extension references. Every
  name is a reference, so a name no installed contract declares fails to compile.
- A plugin's `when` applies to every declaration of the plugin: its pages, extensions, commands,
  settings pages and sections, and menu entries. RFC-0012 evaluates it with the plugin's switch and
  its kill switch.

A product's definition, `src/product.ts`:

```ts
import { manifest as identity } from "@acme/plugin-identity";
import { identityContract } from "@acme/plugin-identity-contract";
import { manifest as inspector } from "@acme/plugin-inspector";
import { manifest as timeOff } from "@acme/plugin-time-off";
import { timeOffContract } from "@acme/plugin-time-off-contract";
import { defineProduct, installed, setFlag } from "@stealthscale/sdk-core";

export default defineProduct({
  featureFlags: [setFlag(timeOffContract.featureFlags.calendar, true)],
  name: "product.name",
  plugins: [
    installed(identity, { eager: true, locked: true }),
    installed(timeOff, {
      config: { approvers: 2 },
      when: { entitlement: timeOffContract.entitlements.module },
    }),
    installed(inspector, { enabled: false }),
  ],
  productId: "people",
  signIn: identityContract.routes.signIn,
  version: "2026.10.1",
  when: { authenticated: true },
});
```

### The build plugin

`@stealthscale/vite-plugin-product` composes the product, and `@stealthscale/vite-config-product`
adds it as a layer, the way `vite-plugin-i18n` and `vite-config-i18n` pair
(`packages/vite-config-i18n/src/layers.ts:19-21`).

```ts
/**
 * Lists the options of the product plugin.
 */
export interface ProductOptions {
  /**
   * Path of the module whose default export is the product's definition. `src/product.ts` by
   * default, and the generated definition under `standalone`.
   */
  readonly definition?: string | undefined;

  /**
   * The standalone page of a plugin, which the plugin serves under a development server
   * (RFC-0019). No page where left out.
   */
  readonly standalone?: StandalonePage | undefined;
}

/**
 * Composes a product from its plugins, and serves the result as `virtual:product`.
 */
export function product(options?: ProductOptions): Plugin;

/**
 * Returns the layers that compose a product: the plugin, and the lint excuse for the definition
 * module's default export.
 */
export function layers(options?: ProductOptions): readonly Layer[];
```

When the build starts, and when a development server starts, the plugin does this:

1. It opens an importer with `importer` of `vite-plugin-base` over an environment of its own, under
   the application's server conditions, so a workspace package resolves to its source
   (`packages/vite-plugin-base/src/load.ts:279-301`). It does not borrow a development server's
   runner, which leaves an externalised package to Node and does not record the imports behind it.
   The first composition opens the importer, and every later one reuses it. Before a later
   composition, `invalidate` drops the transforms of the files that changed and every module the
   runner evaluated. The importer closes when the bundle closes
   (`packages/vite-plugin-product/src/plugin.ts:279-332`). Vite's resolve plugin keeps every
   environment it served reachable after the environment closes (vite-plus-core 1.0.0
   `dist/vite/node/chunks/node.js:34240-34262`). An environment per composition would keep every
   module it transformed: 2.5 MB of heap per change at 30 plugins.
2. It imports the definition. The importer returns the module, every file its evaluation read, and
   every module it evaluated with its exports, each after the modules it imports
   (`load.ts:158-180`).
3. It finds each installed plugin's web package and contract package among those modules
   (`packages/vite-plugin-product/src/discover.ts:87-155`). The web package contains the first
   module to export the manifest, by identity. A module that re-exports the manifest imports the
   module that defines it, and so evaluates later. The contract package is found the same way. A
   manifest the definition builds itself, which no module exports, belongs to the package of the
   definition module. The product's own package counts among its dependencies. A plugin the
   product's package defines therefore has a web package. A web package outside the product's
   package and its dependencies is left out, and the resolver reports the plugin. No package is
   imported for the search alone, so no component package loads in Node.
4. It reads the words from the `api` of the `stealth:i18n` plugin, which `cataloguesOf` of
   `vite-plugin-i18n` finds among the configuration's plugins
   (`packages/vite-plugin-i18n/src/plugin.ts:76-81`): the fallback language's catalogue of each
   namespace, and the packages that publish each namespace. The plugin's contract package and the
   application's own catalogues are left out of the publishers (RFC-0018). A configuration without
   that plugin fails the build.
5. It calls `resolveProduct` with the definition, the web packages, the words, the publishers, and
   `validateHotkey` of `@tanstack/hotkeys` 0.10.0, the version `@tanstack/react-hotkeys` 0.12.0
   binds keys with.
6. It fails the build on any problem, and prints every warning. The message lists every problem,
   then one hint for each contract package whose catalogues the i18n layer does not follow, with the
   scope to add. On a development server it shows the message in the error overlay.
7. It serves `virtual:product`.
8. In a build, it writes the access, flag and operation catalogues (see "Catalogues").

The importer resolves every package through Vite with `noExternal: true`
(`packages/vite-plugin-base/src/load.ts:237-266`). Vite's module runner evaluates ES modules, and a
module that imports React's CommonJS entry fails in it. A recipe that imports a React module fails
the theme plugin the same way. For that reason RFC-0010 keeps the definition, every contract and
every manifest entry free of React. A definition that fails to load fails the build with its error
and that rule.

### The resolver

```ts
/**
 * Checks a product's plugins against each other and resolves every declaration.
 *
 * @param definition - The product's definition.
 * @param packages - Each installed plugin's web package, by plugin id.
 * @param options - The catalogues, the namespaces, the day and the hotkey validator.
 * @returns The resolved product, the problems that fail the build and the warnings.
 */
export function resolveProduct(
  definition: ProductDefinition,
  packages: Readonly<Record<string, PluginPackage>>,
  options?: ResolveOptions,
): Resolution;

/**
 * Describes an installed plugin's web package, as the build found it on the product's graph.
 */
export interface PluginPackage {
  /**
   * Directory of the web package.
   */
  readonly directory: string;

  /**
   * Name of the web package.
   */
  readonly name: string;
}

/**
 * Lists what the build passes beside the definition and the packages.
 */
export interface ResolveOptions {
  /**
   * The fallback language's catalogue of each namespace, nested as the files nest it. The words
   * checks run where it is given.
   */
  readonly catalogues?: Readonly<Record<string, Readonly<Record<string, unknown>>>> | undefined;

  /**
   * The packages that publish each namespace, by namespace, leaving out each installed plugin's
   * contract package.
   */
  readonly namespaces?: Readonly<Record<string, readonly string[]>> | undefined;

  /**
   * The day the build runs, which a flag's date is compared with. The current date where left
   * out.
   */
  readonly today?: IsoDate | undefined;

  /**
   * TanStack Hotkeys' `validateHotkey`. The keys checks other than the library's run without it.
   */
  readonly validateHotkey?: ((hotkey: string) => HotkeyCheck) | undefined;
}

/**
 * Describes what resolving a product returns.
 */
export interface Resolution {
  /**
   * Faults that fail the build, each with the path of the value and the reason.
   */
  readonly problems: readonly Problem[];

  /**
   * The resolved product. Absent where a problem was found.
   */
  readonly product?: ResolvedProduct | undefined;

  /**
   * Faults that do not fail the build.
   */
  readonly warnings: readonly Problem[];
}

/**
 * Describes one fault by the dotted path of its value and the reason.
 */
export interface Problem {
  /**
   * Dotted path of the value at fault: `time-off.routes.request.sample`.
   */
  readonly path: string;

  /**
   * Reason the value is at fault: `is required on a path with parameters`.
   */
  readonly reason: string;
}
```

`resolveProduct` is a pure, synchronous function in `sdk-core` that collects every problem rather
than stopping at the first. The second slice's loader calls the same function over the contracts
that remotes serve (RFC-0009), so the two paths cannot resolve a product differently.

`HotkeyCheck` is the result of TanStack Hotkeys' `validateHotkey`, `{ errors, valid }`. The build
passes the function, so `sdk-core` depends on no hotkey library.

It resolves in this order:

1. The shapes of every contract, every manifest and the definition. Where one differs from its type,
   the resolution returns after this step, because every later step reads them.
2. Every plugin's identity, with its id, its API version and its contract's version.
3. The requirements, and the cycles among them.
4. The references every contract makes, against the installed contracts' versions and deprecations.
5. Every plugin's condition, and one kill switch per installed plugin, `host/plugin.<plugin id>`
   (RFC-0015).
6. The routes, with their paths, parents, conditions and menus.
7. The slots and the extensions, with the product's placements laid over the manifests'.
8. The commands and the events.
9. The permissions, the resource kinds, the roles and the entitlements.
10. The queries and mutations, their operations, selectors and samples, and each route's data.
11. The flags, their dates and the product's values.
12. The settings pages and sections.
13. The configuration of each plugin, over its schema's defaults.
14. The catalogue keys of every label and description.
15. Every manifest's code, against the names its contract declares.

The build fails where a plugin's requirement is absent, so no product is deployed without a plugin
that another plugin needs. The product's author fixes the definition.

### The checks

A problem fails the build. A warning is printed, kept in the resolved product, and listed by the
inspector (RFC-0019). A reason reads `<path>: <reason>`, with the path dotted from the plugin id:
`time-off.routes.request.sample: is required on a path with parameters`. `lineOf` writes a fault in
that form.

| Path                                        | Value at fault                                           |
| ------------------------------------------- | -------------------------------------------------------- |
| `<plugin id>.<member>.<name>`               | A member of a contract: `time-off.routes.request.sample` |
| `<plugin id>.code.<member>.<name>`          | A manifest's code: `time-off.code.routes.overview`       |
| `product.plugins.<plugin id>.when`          | The condition the product states for a plugin            |
| `product.plugins.<plugin id>.config.<name>` | A configuration value the product states for a plugin    |
| `product.plugins.<index>`                   | An installed plugin whose id cannot be read              |
| `product.<member>`                          | A member of the product itself: `product.signIn`         |

- A name whose plugin is installed and does not declare it is the references check's problem. A name
  whose plugin is not installed is the fault of the area that reads it, a problem or a warning by
  the following table. No fault is reported twice.
- A region is one of the host's eight frame slots: `brand`, `header`, `userMenu`, `navigation`,
  `aside`, `footer`, `status` and `toolbar` (RFC-0013). The structural slots `root`, `layout`,
  `content` and `overlay` are not regions.

| Area             | Check                                                                                             | Result  |
| ---------------- | ------------------------------------------------------------------------------------------------- | ------- |
| Identity         | Two installed plugins have one id                                                                 | problem |
|                  | An installed plugin's web package is not among the product's dependencies                         | problem |
|                  | A plugin id is `host`, or a namespace a package other than its contract package publishes         | problem |
|                  | A manifest's API range does not admit the installed `sdk-core`                                    | problem |
|                  | A version string is not a version                                                                 | problem |
| Shapes           | A contract, a manifest or the definition differs from the shape its types state                   | problem |
| Requirements     | A required plugin is not installed, or is installed outside the range                             | problem |
|                  | An optional requirement is installed outside the range                                            | warning |
|                  | Requirements form a cycle                                                                         | problem |
| References       | A reference was made against a later version of a contract than the one installed                 | problem |
|                  | The installed contract is above the caret range of a reference's version                          | warning |
|                  | A reference names a deprecated name, once per plugin that makes it, its declaring plugin excepted | warning |
|                  | A reference names a name the installed contract does not declare                                  | problem |
| Plugins          | A plugin's condition states `route`, or names its own plugin                                      | problem |
|                  | Plugin conditions form a cycle through their `plugin` members                                     | problem |
|                  | Plugin conditions and requirements form a ring together, where a condition names the next plugin  | problem |
| Routes           | Two routes serve one path under one parent, through pathless routes as the router reads them      | problem |
|                  | A route's parent is not declared by an installed plugin, or parents form a cycle                  | problem |
|                  | A path uses `:name` in place of `$name`                                                           | problem |
|                  | A route's condition states `route`                                                                | problem |
|                  | A route with parameters states `navigation`, or states no sample                                  | problem |
|                  | A menu entry names a menu no installed plugin declares                                            | warning |
| Extensions       | An extension targets a plugin that is not installed, and is `required`                            | problem |
|                  | An extension targets a plugin that is not installed                                               | warning |
|                  | An extension targets `every` at a position other than `wrap`                                      | problem |
|                  | An extension targets a keyed slot without `match`, or states `match` for a slot that is not keyed | problem |
|                  | A slot of arity one receives more than one extension, per value in a keyed slot                   | warning |
|                  | The product adds an extension to a slot that is not a region                                      | problem |
|                  | The product names a slot or an extension no installed plugin declares                             | problem |
| Commands, events | A binding `validateHotkey` of TanStack Hotkeys refuses                                            | problem |
|                  | A command with arguments or a result binds keys, or a command with arguments states no sample     | problem |
|                  | A command binds `Mod+K`, `Meta+K` or `Control+K`                                                  | problem |
|                  | More than one command binds a chord                                                               | warning |
|                  | A command needs a command of a plugin it does not require                                         | problem |
| Access           | A permission names a resource kind no installed plugin declares                                   | problem |
|                  | A role names a permission of another plugin, or names none                                        | problem |
| Data             | Two installed plugins declare one operation id under different kinds                              | problem |
|                  | Two installed plugins declare one operation id                                                    | warning |
|                  | A route's data names a variable that no parameter or search supplies (RFC-0020)                   | problem |
|                  | A decision's permission is not scoped, or its kind is not among the query's record kinds          | problem |
|                  | A record, decision or change selector names a resource kind no installed plugin declares          | problem |
|                  | A `field` condition is on anything but an extension of a slot that states `record`                | problem |
| Flags            | A release flag or an experiment states no `expires`                                               | problem |
|                  | A flag is past its `expires` date                                                                 | warning |
|                  | An experiment has fewer than two variants, or its default is not one of them                      | problem |
|                  | The product sets a flag no installed plugin declares, or a value the flag does not take           | problem |
| Settings         | A section targets a page no installed plugin declares                                             | warning |
|                  | A section's schema lacks a default, or states a keyword outside the list of RFC-0017              | problem |
|                  | A section without a schema has no component in its manifest                                       | problem |
|                  | A migration reads a version at or above the section's own version                                 | problem |
| Configuration    | A configuration lacks a required property, has one of another type, or has an unknown one         | problem |
|                  | A configuration schema breaks the rules of RFC-0010                                               | problem |
| Product          | `productId` breaks the plugin id grammar, or `version` is empty                                   | problem |
|                  | `signIn` names a route no installed plugin declares                                               | problem |
| Words            | A label or description key is missing from its plugin's fallback catalogue                        | problem |
|                  | An installed plugin has no catalogue in the fallback language                                     | problem |
| Manifests        | A manifest lacks code for a declared name, or has code for an undeclared one                      | problem |
|                  | The definition, a contract or a manifest entry fails to evaluate in Node                          | problem |

The resolver checks the shapes the type checker checked where each plugin was written, because a
product may install a plugin compiled against other types.

### The resolved product

`virtual:product` exports one value:

```ts
/**
 * Describes a product as the build resolved it, with its plugins' code attached.
 */
export interface Product extends ResolvedProduct {
  /**
   * Each installed plugin's manifest, by plugin id.
   */
  readonly manifests: Readonly<Record<string, PluginManifest>>;
}

/**
 * Describes the data the build resolved for a product.
 */
export interface ResolvedProduct {
  readonly commands: readonly ResolvedCommand[];
  readonly entitlements: readonly ResolvedName[];
  readonly events: readonly ResolvedEvent[];
  readonly extensions: readonly ResolvedExtension[];
  readonly flags: readonly ResolvedFlag[];
  readonly mutations: readonly ResolvedMutation[];
  readonly name: string;
  readonly permissions: readonly ResolvedPermission[];
  readonly plugins: readonly ResolvedPlugin[];
  readonly productId: string;
  readonly queries: readonly ResolvedQuery[];
  readonly resources: readonly ResolvedName[];
  readonly roles: readonly ResolvedRole[];
  readonly routes: readonly ResolvedRoute[];
  readonly settings: ResolvedSettings;
  readonly signIn?: string | undefined;
  readonly slots: Readonly<Record<string, ResolvedSlot>>;
  readonly version: string;
  readonly warnings: readonly Problem[];
  readonly when?: When | undefined;
}
```

| Member                      | Each entry contains                                                                                                                                                                                                                                      | Used by                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `plugins`                   | Id, version, `locked`, `enabled`, `eager`, the condition, its kill switch's id, requirements, the configuration over its defaults                                                                                                                        | RFC-0012, RFC-0017           |
| `routes`                    | Qualified id, plugin, path, parent, navigation, condition joined with the product's, sample, data needs, and the plugins whose chunks load with it. Each settings page is a route, `host/settings/<page id>`, under `host/settings` in the settings menu | RFC-0013, RFC-0017, RFC-0020 |
| `queries`, `mutations`      | Qualified id, plugin, operation id and kind, record, decision and change selectors, sample                                                                                                                                                               | RFC-0020                     |
| `slots`                     | Qualified id, plugin, arity, `keyed`, record kind, whether it is a region, and its extensions after the manifests' and the product's placements                                                                                                          | RFC-0013, RFC-0017           |
| `extensions`                | Qualified id, plugin, target key, position, order, `match`, `required`, condition, whether it has a fallback, and whether the product disabled it                                                                                                        | RFC-0013                     |
| `commands`                  | The `ResolvedCommand` of RFC-0016                                                                                                                                                                                                                        | RFC-0016                     |
| `events`                    | Qualified id, plugin, `emit`, `sticky`                                                                                                                                                                                                                   | RFC-0016                     |
| `flags`                     | Qualified id, plugin, kind, type, default, variants, `expires`, the product's value, description key, deprecation note                                                                                                                                   | RFC-0015                     |
| `permissions`               | Qualified id, plugin, resource kind, description key, deprecation note                                                                                                                                                                                   | RFC-0014                     |
| `resources`, `entitlements` | `ResolvedName`: qualified id, plugin, description key, deprecation note                                                                                                                                                                                  | RFC-0014                     |
| `roles`                     | Qualified id, plugin, permissions, description key, deprecation note                                                                                                                                                                                     | RFC-0014                     |
| `settings`                  | Pages and sections with their targets, orders, conditions, schemas and versions                                                                                                                                                                          | RFC-0017                     |

- The module imports the definition, so the browser receives each manifest with its lazy importers
  and each contract with its search validators. The build writes every other member as a literal.
- `vite-plugin-product/client` declares the module's type, as `vite-plugin-i18n` declares
  `virtual:i18n` (`packages/vite-plugin-i18n/client.d.ts:10-59`).

### Catalogues

A build writes three files for the services beside the product, in the build's output directory:

| File                            | Contains                                                                 | Read by                                 | Defined in |
| ------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- | ---------- |
| `dist/.product/access.json`     | Every permission, resource kind, role and entitlement, with descriptions | The access service, the licence service | RFC-0014   |
| `dist/.product/flags.json`      | Every flag with its kind, values, default, date and the product's value  | The flag service                        | RFC-0015   |
| `dist/.product/operations.json` | Every query and mutation the installed plugins declare                   | The gateway's publishing step           | RFC-0020   |

- The plugin emits each as an asset in `generateBundle` of the build's client environment, so they
  belong to the build that deploys the product and change only with it. A server environment and a
  development server write none.
- Each description is translated from the declaring plugin's catalogues into every language they
  contain. A language whose catalogue lacks the key is left out of that description. The plugin
  reads the catalogues and each pair's words through the `api` of the `stealth:i18n` plugin
  (`packages/vite-plugin-i18n/src/plugin.ts:664-670`). A kill switch's description is the key
  `flags.killSwitch` of the host's namespace, which the i18n layer finds where it follows
  `@stealthscale`.
- A deployment pipeline reads the files and sends them to each service before the product goes live,
  so a permission exists in the access service before a page checks it.
- A server that must not publish the files excludes `/.product/` from the served directory.

### Chunks

The plugin adds one chunk group to the build in its `config` hook, ahead of the four that
`vite-config` adds (`packages/vite-config/src/build/chunks.ts:90-117`), under a build and a
development server alike (`packages/vite-plugin-product/src/plugin.ts:334-360`):

```ts
{
  debugName: "plugins",
  name: (id, chunking) => pluginChunkOf(id, chunking, packages),
  priority: 4,
}
```

- `pluginChunkOf` returns `plugin-<id>` for a module inside an installed plugin's web package that
  no entry imports statically, and null for every other module
  (`packages/vite-plugin-product/src/chunks.ts:48-83`). It walks a module's static importers back
  towards an entry through `chunking.getModuleInfo`. Rolldown's `$initial` tag marks the same
  modules, but a group's `tags` filter keeps tagged modules and cannot leave them out.
- Rolldown makes one chunk per name the function returns, so each plugin's pages, extensions,
  commands and component sections build into one chunk and load in one request.
- The package's main entry and its manifest are left out, because the product imports them
  statically through its definition. In the plugin's chunk they would load the whole plugin at
  start. A real build of a product of two plugins writes one `plugin-<id>` chunk per plugin, with
  its lazy modules alone, and the entry chunk contains each main entry and manifest.
- The name function reads the web packages the build start found when rolldown calls it.
- Priority 4 places the group above `shared` (3) and below `vendor` (5), `library` (8) and
  `framework` (10). A plugin's lazy modules load through dynamic imports alone, so the three groups
  tagged `$initial` do not claim them. Rolldown picks the group with the higher priority first
  (`define-config-C7HCoqY8.d.mts:1115-1146` in vite-plus-core 1.0.0).
- One chunk per plugin follows the bundle policy: a chunk serves every page of its plugin, not one
  page.
- An eager plugin's chunk is imported by `host.ready()` before the first render (RFC-0012).
- Not measured yet: the chunks a plugin's own dependencies build into, because `vite-config` sets
  `includeDependenciesRecursively: false` (`packages/vite-config/src/build/chunks.ts:112-117`). The
  first build of `examples/app-plugins` counts the chunks and their sizes, as the bundle policy
  requires after any change to chunking.

### The development server

- The plugin watches every file the importer read for the definition, the contracts and the manifest
  entries.
- A change to one of those files resolves the product again in `watchChange`, which Vite calls for
  the client environment alone and awaits before any hot update. The development server reloads the
  page, because the route tree is built once per router (RFC-0013).
- Compositions run one at a time, in the order of the changes. A change skips its composition when a
  later change arrived before its turn (`packages/vite-plugin-product/src/plugin.ts:438-493`). The
  changes reported during one composition cost one composition together. The composition recorded
  last starts after the last change.
- A composition after a change transforms again only the files that changed, and evaluates every
  module again from the transforms the importer kept. Measured on a per-file server, from the
  watcher's event to the page's notice: 18 ms at 30 plugins and 45 ms at 100.
- Under a server that serves one module per file, `hotUpdate` invalidates `virtual:product` in each
  environment and sends the client's page the reload (`plugin.ts:495-510`).
- Under a server that bundles, no hot update runs, so `watchChange` sends the reload
  (`plugin.ts:478-493`). `virtual:product` lists every file the composition read as a watched file,
  so the rebuild loads it again.
- A change to a page, an extension or a command module updates in place through Fast Refresh.
- A problem after a change shows in the error overlay with every problem, and the page keeps the
  last product that resolved. A definition that fails to load after a change shows its error the
  same way.
- A watching build resolves the product again at its next build start.

## Failure handling

| Failure                                          | Detected by      | Outcome                                                                 |
| ------------------------------------------------ | ---------------- | ----------------------------------------------------------------------- |
| Any problem in the checks table                  | `resolveProduct` | The build fails and lists every problem, naming the plugin and the path |
| The definition module does not evaluate          | The importer     | The build fails with the module's error and the rule of RFC-0010        |
| A manifest entry imports React at load           | The importer     | The build fails with the evaluation's error and the rule of RFC-0010    |
| The definition has no default export             | The plugin       | The build fails, naming the file                                        |
| The configuration has no `stealth:i18n` plugin   | The plugin       | The build fails, naming `@stealthscale/vite-config-i18n`                |
| A contract package is outside the i18n scopes    | The plugin       | The build fails with the words problem and a hint with the scope to add |
| A catalogue cannot be read for a description     | The plugin       | The build fails, naming the plugin and the language                     |
| A problem after a change on a development server | The plugin       | The error overlay. The page keeps the last product that resolved        |
| A plugin chunk is missing after a deployment     | The host         | One reload per build version (RFC-0012)                                 |

## Bounds

We measured generated products of 1 to 100 plugins. Each plugin's contract declares 25 names: 2
routes, 3 commands, 2 events, 2 flags, 2 permissions, a resource kind, an entitlement, a query, a
mutation, a settings page and section, and a slot. Each plugin also extends a slot of the plugin
before it. The builds resolved `sdk-core` from its source. Each value is the median of three builds,
or of twenty changes on a per-file development server.

| Plugins | Composition at build start | Composition after a change | `resolveProduct` | `virtual:product`, raw and gzip | Entry chunk, raw and gzip |
| ------- | -------------------------- | -------------------------- | ---------------- | ------------------------------- | ------------------------- |
| 1       | 91 ms                      | Not measured               | Not measured     | 5.6 kB and 1.4 kB               | 12.8 kB and 4.2 kB        |
| 10      | 120 ms                     | Not measured               | 0.8 ms           | 36 kB and 3.5 kB                | 60 kB and 7.8 kB          |
| 30      | 188 ms                     | 18 ms                      | 2.1 ms           | 104 kB and 7.7 kB               | 165 kB and 14.9 kB        |
| 100     | 414 ms                     | 45 ms                      | 8.4 ms           | 342 kB and 22 kB                | 532 kB and 38 kB          |

- The composition at build start transforms and evaluates every module behind the definition: 173
  modules at 30 plugins and 453 at 100. Transforming them takes most of its time. A later
  composition transforms the changed files alone.
- `resolveProduct` reads the declared names grouped by kind, grouped once per resolution
  (`sdk/core/src/resolve/context.ts:269-293`), so its cost grows with the number of declarations.
- The chunk group's name function walks a plugin module's static importers back to an entry. Its
  total grows faster than the plugin count: 0.3 ms at 1 plugin, 5 ms at 30 and 40 ms at 100.
- In the browser the host evaluates conditions alone. The resolved product is a literal in the entry
  chunk, about 3.4 kB per plugin of 25 declarations before compression and 0.2 kB after. Node 26
  parses and runs the 333 kB literal of 100 plugins in 1 to 4 ms.
- The first build of `examples/app-plugins` measures a product with real pages, and the search
  validators the contracts bring into the entry.

## Alternatives considered

### Resolve the product in the browser

The host checks and resolves each installed contract when the page starts.

**Why not:** every contract is known at build in the first slice. Checking in the browser moves each
fault from the build to a deployed page and sends the validators to every visitor.

### A product definition compiled to JSON

The build writes the definition as JSON, and the host reads the JSON.

**Why not:** in the first slice nothing reads the JSON but the build, which reads the definition
itself. The second slice serves each contract as JSON, written by the same resolver.

### Discover plugins from the dependencies alone

Install every plugin package the product depends on, with no list.

**Why not:** a product states each plugin's configuration, whether it is locked, whether it loads at
start and when it is available, and the install order determines the order of extensions and
commands. A list states each of these in one place, typed by each contract.

### A chunk group with a regular expression per plugin

**Why not:** a regular expression cannot leave out the package's main entry without knowing its
file, and the function has the resolved map in hand. One group with a name function also gives every
plugin the same priority.

## Drawbacks

- A product's build loads every contract and every manifest entry in Node. A contract or a manifest
  entry that imports a module Node cannot evaluate, such as React's CommonJS entry, fails the build.
  The lint layers of RFC-0019 refuse such an import in the editor.
- A change to a contract reloads the page on a development server.
- A plugin whose requirement is not installed fails the build rather than running without the plugin
  it needs.
- Every installed plugin is in the build. A product that switches most plugins off still deploys
  their chunks, which load only when a person opens one of their pages.
- Configuration is fixed at build, so a product that differs per environment builds once per
  environment.

## Unresolved and future work

- Measuring the chunks, their sizes and the resolved product on `examples/app-plugins`.
- A product that installs a plugin only in development, such as the inspector, through a condition
  on the build's mode.
- Configuration read when the page starts and checked against the same schemas, so one build serves
  every environment. The first product deployed to more than one environment brings it in.

## References

| What                                  | Where                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Importing a module through Vite       | `packages/vite-plugin-base/src/load.ts`                                             |
| The catalogue plugin's api            | `packages/vite-plugin-i18n/src/plugin.ts`                                           |
| The build plugin                      | `packages/vite-plugin-product/src/plugin.ts`                                        |
| The chunk groups of every application | `packages/vite-config/src/build/chunks.ts`                                          |
| Rolldown's chunk groups               | vite-plus-core 1.0.0, `dist/rolldown/shared/define-config-C7HCoqY8.d.mts:1030-1236` |
| TanStack Hotkeys' `validateHotkey`    | https://tanstack.com/hotkeys/latest                                                 |
