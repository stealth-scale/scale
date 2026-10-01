# @stealthscale/sdk-core

`@stealthscale/sdk-core` defines what every part of the plugin system reads:

- A plugin's contract and its manifest
- The conditions a host evaluates
- A product's definition, and the product `resolveProduct` resolves from it
- The catalogues a service reads to learn a product's access names, flags and operations

The package does not import another package at run time, so the build, the host and a service read
the same contract objects in Node and in a browser.

## Install

```bash
pnpm add @stealthscale/sdk-core
```

## Identifiers

| Identifier   | Grammar                                             | Example                    |
| ------------ | --------------------------------------------------- | -------------------------- |
| Plugin id    | `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, 2 to 32 characters | `time-off`                 |
| Name         | `^[a-z][A-Za-z0-9]*([.-][A-Za-z0-9]+)*$`            | `request.approve`          |
| Qualified id | The plugin id and the name, joined by a slash       | `time-off/request.approve` |

- `isPluginId` and `isName` check each grammar.
- `qualify` joins a plugin id and a name. `pluginOf` returns the plugin id a qualified id starts
  with.
- The plugin id `host` belongs to the host's own contract.

## Contracts

Define a plugin's contract in its contract package. Each member lists the names of one kind, and a
marker builds each name.

```ts
import {
  command,
  defineContract,
  extension,
  params,
  permission,
  props,
  resource,
  route,
  slot,
} from "@stealthscale/sdk-core";

export const timeOffContract = defineContract("time-off", (self) => ({
  commands: {
    request: command({ keys: "Mod+Shift+R", label: "commands.request" }),
  },
  extensions: {
    balance: extension({ position: "after", target: self.slot("request-sidebar") }),
  },
  permissions: {
    "request.approve": permission({
      description: "permissions.approve",
      resource: self.resource("request"),
    }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  routes: {
    overview: route({ navigation: { label: "navigation.overview" }, path: "time-off" }),
    request: route({
      ...params<{ readonly id: string }>(),
      parent: self.route("overview"),
      path: "$id",
      sample: { id: "7" },
    }),
  },
  slots: {
    "request-sidebar": slot({
      ...props<{ readonly requestId: string }>(),
      sample: { requestId: "7" },
    }),
  },
  version: "0.4.0",
}));
```

- `defineContract` returns one reference per name. `timeOffContract.routes.request` has the id
  `time-off/request`, the kind `route`, the contract's version and the marker's members.
- `self` returns a bare reference to a name of the contract you define. `defineContract` throws
  where `self` names a name the definition does not declare.
- `defineContract` throws for the plugin id `host`, and for a plugin id or a name that breaks its
  grammar.
- A plugin that imports another plugin's contract package reads every name with its types, and loads
  none of that plugin's code.

### Markers

| Member              | Marker               | Options                                                              |
| ------------------- | -------------------- | -------------------------------------------------------------------- |
| `routes`            | `route`              | `path`, `parent`, `search`, `data`, `navigation`, `sample`, `when`   |
| `slots`             | `slot`               | `arity`, `keyed`, `record`, `sample`                                 |
| `extensions`        | `extension`          | `target`, `position`, `match`, `order`, `required`, `sample`, `when` |
| `commands`          | `command`            | `label`, `keys`, `sample`, `when`                                    |
| `events`            | `event`              | `emit`, `sticky`                                                     |
| `permissions`       | `permission`         | `description`, `resource`                                            |
| `resources`         | `resource`           | `description`                                                        |
| `roles`             | `role`               | `description`, `permissions`                                         |
| `entitlements`      | `entitlement`        | `description`                                                        |
| `featureFlags`      | `flag`               | `kind`, `default`, `description`, `expires`, `variants`              |
| `queries`           | `query`              | `operation`, `records`, `decisions`, `sample`, `staleTime`           |
| `mutations`         | `mutation`           | `operation`, `changes`, `sample`                                     |
| `settings.pages`    | `settingsPage`       | `label`, `order`, `when`                                             |
| `settings.sections` | `settingsSection`    | `label`, `target`, `schema`, `schemaVersion`, `order`, `when`        |
| `config`            | `defineConfigSchema` | The properties by name, and `required`                               |
| `menus`             | None                 | The names of the menus                                               |
| `requires`          | `needs`              | Another contract and a caret range of its version                    |

Every marker also takes `deprecated`, a note about the name's replacement. `resolveProduct` warns
once for every other plugin that references a deprecated name.

Spread a helper into a marker's options to record a type:

- `params<Params>()` types a route's path parameters. A route whose path names parameters states
  `sample` and no `navigation`.
- `props<Props>()` types the props of a slot or an extension. A slot whose props have a required
  member states `sample`.
- `args<Args>()` and `returns<Result>()` type a command's arguments and its result. Such a command
  cannot bind keys, and the palette does not list it.

`event<Payload>()` takes the payload as its type argument.

### The host's contract

`hostContract` declares the host's own names under the plugin id `host`:

| Kind           | Names                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Regions        | `brand`, `header`, `userMenu`, `navigation`, `aside`, `footer`, `status`, `toolbar` |
| Other slots    | `root`, `layout`, `content`, `overlay`                                              |
| Menus          | `main`, `settings`                                                                  |
| Routes         | `settings`                                                                          |
| Settings pages | `account`, `plugins`                                                                |
| Events         | `navigated`, `pluginChanged`, `recordsChanged`, `sessionChanged`                    |

- `brand` and `userMenu` render one contribution each. Every other slot renders any number.
- No region renders with props, so a product may place an extension in any region.
- `sessionChanged` is sticky: a late subscriber receives the last session.

## Manifests

Declare a plugin's code in its web package. `definePlugin` maps every route, extension and command,
and every settings section without a schema, to a lazy importer:

```ts
import { definePlugin } from "@stealthscale/sdk-core";

export const manifest = definePlugin(timeOffContract, {
  commands: { request: { run: () => import("#request.command.ts") } },
  extensions: { balance: { component: () => import("#balance.tsx") } },
  routes: {
    overview: () => import("#overview.tsx"),
    request: {
      component: () => import("#request.tsx"),
      fallback: () => import("#request-failed.tsx"),
    },
  },
});
```

- The type checker refuses a missing entry, and an entry for a name the contract does not declare.
- It refuses a component whose props differ from its target's, and a command function whose
  arguments, needs or result differ from its marker's.
- Each importer's module exports exactly one function.
- `apiVersion` is `API_RANGE`, the caret range of the plugin API the package implements.
  `resolveProduct` refuses a manifest whose range does not admit the installed `sdk-core`.

## Products

`defineProduct` returns a product's definition: the plugins it installs and what it states about
each.

```ts
import { defineProduct, installed } from "@stealthscale/sdk-core";

const definition = defineProduct({
  name: "product.name",
  plugins: [installed(identity, { eager: true, locked: true }), installed(timeOff)],
  productId: "people",
  signIn: identityContract.routes.signIn,
  version: "2026.10.1",
  when: { authenticated: true },
});
```

- `installed(manifest, options)` types `config` by the contract's schema. You write every required
  property that has no default.
- `enabled` is the switch's state before a person chooses. `locked` keeps the plugin on for
  everybody.
- `eager` loads the plugin's modules before the first render.
- A plugin's `when` is the condition under which the whole plugin is available.
- `slots` adds, removes and orders the extensions of a slot. `extensions.disabled` leaves extensions
  out of every slot.
- `featureFlags` sets flag values built with `setFlag`.
- The product's `when` joins every plugin route's condition except the sign-in route's.

## Resolving a product

`resolveProduct` checks the installed plugins against each other and resolves their declarations:

```ts
import { lineOf, resolveProduct } from "@stealthscale/sdk-core";

const { problems, product, warnings } = resolveProduct(definition, packages, {
  today: "2026-10-01",
});

for (const fault of [...problems, ...warnings]) console.error(lineOf(fault));
```

- `packages` maps each installed plugin's id to its web package: the package's `name` and its
  `directory`.
- The function is pure and synchronous. It returns every problem and every warning, and `product`
  only where it did not find a problem.
- It checks every value against its declared type first. Where a contract, a manifest or the
  definition does not match its type, it returns those faults alone.

| Option           | Use                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------- |
| `catalogues`     | The fallback language's catalogue of each namespace. The words checks need it         |
| `namespaces`     | The packages that publish each namespace                                              |
| `today`          | The day a flag's date is compared with. The current date where left out               |
| `validateHotkey` | TanStack Hotkeys' `validateHotkey`. The keys checks other than its own run without it |

### Faults

A `Problem` names the dotted path of the value at fault and the reason. `lineOf` writes it as one
line:

```text
time-off.code.routes.overview: is missing, and the contract declares the route
```

| Path                                        | Value at fault                                           |
| ------------------------------------------- | -------------------------------------------------------- |
| `<plugin id>.<member>.<name>`               | A member of a contract: `time-off.routes.request.sample` |
| `<plugin id>.code.<member>.<name>`          | A manifest's code: `time-off.code.routes.overview`       |
| `product.plugins.<plugin id>.when`          | The condition the product states for a plugin            |
| `product.plugins.<plugin id>.config.<name>` | A configuration value the product states                 |
| `product.plugins.<index>`                   | An installed plugin whose id cannot be read              |
| `product.<member>`                          | A member of the product itself: `product.signIn`         |

### The resolved product

`product` is data a host starts from without running a check:

- `plugins` lists each installed plugin with its configuration, its switch, its lock and its kill
  switch, the ops flag `host/plugin.<plugin id>`.
- `routes` lists every page with the queries it reads and the plugins whose code loads with it.
- `slots` lists the extensions placed in each slot, sorted by the product's `order` and then by each
  extension's own `order`. Install order breaks a tie.
- `commands`, `events`, `flags`, `permissions`, `resources`, `roles`, `entitlements`, `queries`,
  `mutations` and `settings` list every declaration of their kind.

## Catalogues

`AccessCatalogue`, `FlagCatalogue` and `OperationCatalogue` describe the files a service reads to
learn a product's declarations. Each states the product's id and version.

| Type                 | Lists                                                  | Read by                                    |
| -------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `AccessCatalogue`    | Every permission, resource kind, role and entitlement  | The access service and the licence service |
| `FlagCatalogue`      | Every flag, one kill switch per plugin included        | The flag service                           |
| `OperationCatalogue` | Every query and mutation, with the id the gateway runs | The gateway's publishing step              |

- An access or flag entry contains its qualified id, its plugin, and its description in every
  language the plugin's catalogues contain.
- The access catalogue's lists and the flag catalogue's flags are sorted by id, so a diff of two
  releases lists every added and removed name.

## Versions

A requirement states a caret range over another contract's version. `needs(contract, range)` builds
one with the contract's version where it states one. `compatible` and `below` compare a version with
a range the way semver reads a caret:

| Range    | Admits                          | Refuses          |
| -------- | ------------------------------- | ---------------- |
| `^1.4.0` | `1.4.0` and every later `1.x.y` | `1.3.9`, `2.0.0` |
| `^0.4.0` | `0.4.x`                         | `0.5.0`          |
| `^0.0.3` | `0.0.3` alone                   | `0.0.4`          |
| `^0`     | `0.x.y`                         | `1.0.0`          |

A prerelease satisfies no range, and `below` places it under the release of the same numbers.

## Sessions

`Session` states who is signed in, for which tenant, and the permissions and entitlements the
services granted. `NOBODY` is the session of a person who is not signed in.

- `subjectOf(session)` returns `<userId>@<tenantId>`. A renewed token returns the same subject, and
  a sign-in, a sign-out or a tenant switch returns another.
- `constantSession(session)` returns a source whose session never changes, for a server request, a
  test or the standalone host.

## Flags

```ts
featureFlags: {
  calendar: flag({
    default: false,
    description: "flags.calendar",
    expires: "2026-12-31",
    kind: "release",
  }),
  layout: flag({
    default: "list",
    description: "flags.layout",
    expires: "2026-11-30",
    kind: "experiment",
    variants: ["list", "board"],
  }),
  sync: flag({ default: true, description: "flags.sync", kind: "ops" }),
},
```

- A release flag and an experiment state `expires`. An ops flag may leave it out.
- An experiment's value is one of its variants. `flagIs(layout, "board")` builds a condition that
  the type checker checks against them.
- `setFlag(reference, value)` builds a product's value for a flag, typed by the flag's values.
- A host reads each value from a `FlagSource` per session.

## Conditions

A condition is data. `evaluateWhen(when, context)` returns true where every member the condition
states is true, and `conditionContext(session, lookups)` builds the context from a session.

| Member          | True when                                                                  |
| --------------- | -------------------------------------------------------------------------- |
| `allOf`         | Every condition in the list is true                                        |
| `anyOf`         | At least one condition in the list is true                                 |
| `not`           | Its condition is false                                                     |
| `authenticated` | It equals `context.authenticated`                                          |
| `permission`    | `context.permitted(id)` returns true                                       |
| `entitlement`   | `context.entitled(id)` returns true                                        |
| `featureFlag`   | `context.flag(id)` returns `true`                                          |
| `variant`       | `context.flag(flag)` returns the variant `is` names                        |
| `plugin`        | `context.on(pluginId)` returns true                                        |
| `route`         | `context.matched` contains the route's id. False where it is undefined     |
| `field`         | `context.field(path)` equals `equals`, or is present or absent by `exists` |

An absent condition, and a condition that states no member, are true.
