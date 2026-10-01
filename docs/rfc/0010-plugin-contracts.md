---
rfc: 0010
title: "Plugin contracts and manifests"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-09-30
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0010: Plugin contracts and manifests

## Summary

A plugin states everything a host plans over in a contract, and maps each name the contract declares
to code in a manifest. This RFC defines both as TypeScript contracts: the identifiers, the kinds a
contract declares, the marker for each kind, the reference other code imports, the condition
language, the version rule, and the checks `definePlugin` applies to a manifest.

RFC-0009 places this RFC in the plugin system. RFC-0011 composes contracts into a product, and
RFC-0012 to RFC-0019 define what the host does with each kind.

## Motivation

### The requirements

- The host builds its route tree, its menus, its slots, its command list and its access rules before
  any plugin code runs, because the route tree is complete before the router exists (RFC-0013). So
  everything the host plans over is data.
- A plugin targets another plugin's slot, links to its page, runs its command and checks its
  permission with the target's types, and never imports the target's code.
- A name has one spelling everywhere it is used: in the contract, in the session, in a service's
  scope list, in the flag service and in the access service's role editor.
- The type checker checks a name where it is written, the plugin's tests check it again, and the
  product's build checks it against every other installed plugin.
- A contract loads in Node without React, so the build, a service and a test read it.

### Why this layer

Contracts are the lowest layer of the plugin system. `sdk-core` defines the markers, the references,
the conditions and `definePlugin`, and does not import another package at run time. A contract
package imports `sdk-core` and nothing that renders. The web package, the host and the build all
read the same contract object, so none of them keeps a second description of a plugin.

## Detailed design

### A contract package and a web package

A plugin is two packages, released together in one `fixed` changesets group:

| Package                          | Contains                                                          | Imports at run time                                                                    |
| -------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `@acme/plugin-time-off-contract` | The contract, the types it names, and the plugin's catalogues     | `sdk-core`, other plugins' contract packages, and a Standard Schema library for search |
| `@acme/plugin-time-off`          | The manifest, the components, the command modules and the recipes | Its contract package, other contract packages, `sdk-plugin`, component packages        |

- A plugin that targets another plugin's slot depends on that plugin's contract package. Two plugins
  that target each other's slots would depend on each other if the contract were an entry of the web
  package, and the gate refuses a package cycle. With separate contract packages, each web package
  depends on the other's contract, and neither contract depends on a web package.
- Contract packages depend on each other only where one contract names another's reference: an
  extension's target, a route's parent, a condition's member or a requirement. The gate refuses a
  cycle among packages, and the build refuses a cycle among requirements (RFC-0011).
- The web package's main entry exports the manifest and does not import a component when it loads.
  Every component is behind a lazy importer, so the build evaluates the manifest in Node without
  React and without any component package (RFC-0011).
- The contract's version is its package's version, read from `#package.json`. A reference made from
  the contract records that version (see "Versions").

### Identifiers

| Identifier   | Grammar                                        | Used as                                                                   |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------- |
| Plugin id    | `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, 2 to 32 chars | A storage key segment, the catalogue namespace, a URL segment of settings |
| Name         | `^[a-z][A-Za-z0-9]*([.-][A-Za-z0-9]+)*$`       | The part after the slash                                                  |
| Qualified id | `<plugin id>/<name>`                           | The id every reference, route, storage key, catalogue and report uses     |

- Each kind is its own namespace. A route and an extension may share a name, and the host keys a
  render target by kind and qualified id (`route:time-off/overview`).
- A permission's name is its resource or area, then its action: `request.approve` qualifies to
  `time-off/request.approve`, which is the scope the service requires (RFC-0014).
- `defineContract` throws where the plugin id or a name breaks its grammar, so a bad name fails when
  the contract module loads.

### References

A reference points at a declared name. It contains the qualified id, the kind, the version of the
contract it was made from, and the members its marker stated. Its type parameters record what the
target hands over, in a `~types` member that nothing reads at run time.

```ts
/**
 * Lists every kind a contract declares.
 */
export type ReferenceKind =
  | "command"
  | "entitlement"
  | "event"
  | "extension"
  | "featureFlag"
  | "menu"
  | "mutation"
  | "permission"
  | "query"
  | "resource"
  | "role"
  | "route"
  | "settingsPage"
  | "settingsSection"
  | "slot";

/**
 * Points at a name a plugin declared.
 */
export interface Reference<K extends ReferenceKind = ReferenceKind, Id extends string = string> {
  /**
   * The plugin id and the name, joined by a slash.
   */
  readonly id: Id;

  /**
   * The kind of the name.
   */
  readonly kind: K;

  /**
   * The version of the contract the reference was made from, where the contract states one.
   */
  readonly version?: string | undefined;
}

/**
 * Builds the qualified id of a name.
 */
export type QualifiedId<P extends string, N extends string> = `${P}/${N}`;
```

| Kind              | Marker              | Reference type                           | `~types` member     | Members at run time                                             |
| ----------------- | ------------------- | ---------------------------------------- | ------------------- | --------------------------------------------------------------- |
| `route`           | `route()`           | `RouteReference<Id, Params, Search>`     | `params`, `search`  | `path`, `parent`, `navigation`, `search`, `sample`, `when`      |
| `slot`            | `slot()`            | `SlotReference<Id, Props>`               | `props`             | `arity`, `keyed`, `sample`                                      |
| `extension`       | `extension()`       | `ExtensionReference<Id, Props>`          | `props`             | `target`, `position`, `order`, `match`, `required`, `when`      |
| `command`         | `command()`         | `CommandReference<Id, Args, Result>`     | `args`, `result`    | `label`, `keys`, `arguments`, `result`, `when`                  |
| `event`           | `event()`           | `EventReference<Id, Payload>`            | `payload`           | `emit`, `sticky`                                                |
| `featureFlag`     | `flag()`            | `FlagReference<Id, Value>`               | `value`             | `kind`, `type`, `default`, `variants`, `expires`, `description` |
| `permission`      | `permission()`      | `PermissionReference<Id, Scoped>`        | `scoped`            | `description`, `resource`                                       |
| `resource`        | `resource()`        | `ResourceReference<Id>`                  | none                | `description`                                                   |
| `role`            | `role()`            | `RoleReference<Id>`                      | none                | `description`, `permissions`                                    |
| `entitlement`     | `entitlement()`     | `EntitlementReference<Id>`               | none                | `description`                                                   |
| `menu`            | a name              | `MenuReference<Id>`                      | none                | none                                                            |
| `query`           | `query()`           | `QueryReference<Id, Data, Variables>`    | `data`, `variables` | `operation`, `records`, `decisions`, `sample`, `staleTime`      |
| `mutation`        | `mutation()`        | `MutationReference<Id, Data, Variables>` | `data`, `variables` | `operation`, `changes`, `sample`                                |
| `settingsPage`    | `settingsPage()`    | `SettingsPageReference<Id>`              | none                | `label`, `order`, `when`                                        |
| `settingsSection` | `settingsSection()` | `SettingsSectionReference<Id, Values>`   | `values`            | `target`, `label`, `order`, `schema`, `version`, `when`         |

A `RouteReference` is structurally a `RouteRef` of `provider-router`: it has `id` and
`~types.params`. RFC-0013 adds `~types.search` to `RouteRef`, so `RouteLink`, `useRouteParams` and
`useRouteSearch` take a plugin's route reference with its types.

### Markers

A marker is a plain object that states one name. Its function types the argument and adds the kind.
Every marker takes `deprecated`.

```ts
/**
 * Lists what any marker may state beside its own members.
 */
export interface MarkerOptions {
  /**
   * Marks the name as deprecated, with what to use instead.
   *
   * @remarks
   *   The build warns once for every plugin that still references the name.
   */
  readonly deprecated?: string | undefined;
}

/**
 * Declares the props a slot or an extension renders with, in the type alone.
 *
 * @returns An empty object whose type records `Props`.
 */
export function props<Props extends object>(): Propped<Props>;

/**
 * Declares the parameters a route's path names, in the type alone.
 *
 * @returns An empty object whose type records `Params`.
 */
export function params<Params extends PathParams>(): Parameterised<Params>;
```

A phantom helper spreads into the options, so TypeScript derives every other type parameter from the
same argument. In `route({ ...params<{ id: string }>(), path: "$id", search })` the search type
comes from the validator. An explicit type argument would prevent that, because TypeScript derives
no type argument from the call once the caller writes one.

#### Routes

```ts
/**
 * Maps each parameter a path names to the string it matched.
 */
export type PathParams = Readonly<Record<string, string>>;

/**
 * Types a path pattern with a `$name` segment for every parameter of `Params`.
 */
export type PathWith<Params extends PathParams> = [keyof Params] extends [never]
  ? string
  : UnionToIntersection<
      keyof Params extends infer Name
        ? Name extends string
          ? `${string}$${Name}${string}`
          : never
        : never
    >;

/**
 * Validates a page's search string. Any library that implements Standard Schema provides one.
 */
export type SearchSchema<Search = unknown> = StandardSchemaV1<unknown, Search>;

/**
 * States where a route is listed.
 */
export interface NavigationItem {
  /**
   * Key of the entry's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Menu the entry is listed in. The host's `main` menu where it names none.
   */
  readonly menu?: MenuReference | undefined;

  /**
   * Rank of the entry, ascending. Entries without a rank follow, sorted by their text.
   */
  readonly order?: number | undefined;
}

/**
 * States a page: its path, its parent, its search, its data, where it is listed and when it is
 * routed.
 */
export interface RouteOptions<
  Params extends PathParams = PathParams,
  Search = unknown,
> extends MarkerOptions {
  /**
   * The queries the page reads, which load with its code (RFC-0020).
   */
  readonly data?: readonly RouteData[] | undefined;

  /**
   * Menu entry of the route. Allowed only on a path without parameters.
   */
  readonly navigation?: NavigationItem | undefined;

  /**
   * Route the page nests under. The page renders where the parent renders `Outlet`.
   */
  readonly parent?: RouteReference | undefined;

  /**
   * Path pattern in the router's `$name` form, relative to the parent or to the frame.
   */
  readonly path: PathWith<Params>;

  /**
   * Parameters the plugin's tests open the page at. Required on a path with parameters.
   */
  readonly sample?: Params | undefined;

  /**
   * Validator of the search string the page reads.
   */
  readonly search?: SearchSchema<Search> | undefined;

  /**
   * Condition under which the route is routed. Routed always where it states none.
   */
  readonly when?: When | undefined;
}

/**
 * Marks a route.
 *
 * @returns The marker, with the parameters and the search in its type.
 */
export function route<Params extends PathParams = PathParams, Search = unknown>(
  options: Parameterised<Params> & RouteOptions<Params, Search>,
): RouteMarker<Params, Search>;
```

- Every path is relative to its parent: `time-off/$id` under the frame, or `$id` under
  `self.route("overview")`. A leading slash is allowed and means the same, as it does in TanStack
  Router (`foundations/providers/router/src/map.ts:105-117`).
- `navigation` is refused on a path with parameters, because a menu entry is a link without
  parameters. The type refuses it, and the build refuses it for an untyped caller.
- `sample` is required on a path with parameters, so the page's test and its catalogue scene open a
  real page. The type requires it.
- A route's condition cannot state `route`, because the location is what the route decides. The
  build refuses it (RFC-0011).
- `StandardSchemaV1` comes from `@standard-schema/spec`, a package of types alone, which
  `provider-form` already installs (`foundations/providers/form/package.json:49`). `sdk-core`
  imports its types and no code from it.

#### Slots and extensions

```ts
/**
 * States a slot: how many contributions it renders, whether it selects them by a value, and the
 * props its extensions render with in their tests.
 */
export interface SlotOptions<Props extends object = object> extends MarkerOptions, Propped<Props> {
  /**
   * Renders one contribution where `"one"`, and any number where left out. A keyed slot renders
   * one contribution per value.
   */
  readonly arity?: "one" | undefined;

  /**
   * Renders only the extensions whose `match` equals the value the slot renders with, such as a
   * feed that renders each item with the extension for its type.
   */
  readonly keyed?: true | undefined;

  /**
   * Kind of the record the slot renders with in its `record` prop, which an extension's `field`
   * condition reads (RFC-0020).
   */
  readonly record?: ResourceReference | undefined;

  /**
   * Props an extension in the slot renders with in its own tests. Required where `Props` has a
   * required member.
   */
  readonly sample?: Props | undefined;
}

/**
 * Lists where an extension goes against its target.
 */
export type ExtensionPosition = "after" | "before" | "replace" | "wrap";

/**
 * Targets every slot, every route or every extension. Takes `wrap` alone.
 */
export interface EveryTarget {
  /**
   * The kind every member of which the extension wraps.
   */
  readonly every: "extension" | "route" | "slot";
}

/**
 * Lists what an extension attaches to.
 */
export type ExtensionTarget = EveryTarget | ExtensionReference | RouteReference | SlotReference;

/**
 * States an extension: its target, its position, its rank, when it shows, and the props a
 * decorator of it renders with.
 */
export interface ExtensionOptions<Props extends object = object>
  extends MarkerOptions, Propped<Props> {
  /**
   * Value a keyed slot renders the extension for. Required where the target is a keyed slot, and
   * refused on any other target.
   */
  readonly match?: string | undefined;

  /**
   * Rank among the extensions in the same position, ascending. Unranked extensions follow.
   */
  readonly order?: number | undefined;

  /**
   * Position against the target.
   */
  readonly position: ExtensionPosition;

  /**
   * Marks the product as wrong without the extension. A person cannot remove it, and the host
   * reports it where nothing renders its target.
   */
  readonly required?: true | undefined;

  /**
   * Props a decorator of this extension renders with in its tests.
   */
  readonly sample?: Props | undefined;

  /**
   * What the extension attaches to.
   */
  readonly target: ExtensionTarget;

  /**
   * Condition under which the extension shows. Always where it states none.
   */
  readonly when?: When | undefined;
}
```

An extension's component receives props determined by its target. `definePlugin` checks the
component against them:

| Target            | Props the component receives                                |
| ----------------- | ----------------------------------------------------------- |
| A slot            | The slot's `Props`, and `targetId`                          |
| A route           | `routeId` and `targetId`                                    |
| Another extension | That extension's `Props`, and `targetId`                    |
| `{ every: … }`    | `Record<string, unknown>`, and `targetId`                   |
| Any, at `wrap`    | The above, and `children`: what it wraps, already decorated |

RFC-0013 defines how the host places each position and how a keyed slot selects its extensions.

#### Commands and events

```ts
/**
 * States a command: its label, its keys and when it may run.
 */
export interface CommandOptions extends MarkerOptions {
  /**
   * Default binding in TanStack Hotkeys notation, `Mod+Shift+A`. Only a command without arguments
   * and without a result binds keys, because a key press has no arguments to give and no caller
   * to hand a result to.
   */
  readonly keys?: string | undefined;

  /**
   * Key of the command's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Condition under which the command may run, however it is run. Always where it states none.
   */
  readonly when?: When | undefined;
}

/**
 * Declares the arguments a command takes: in the type, and as a flag the build reads.
 *
 * @returns An object whose type records `Args`.
 */
export function args<Args>(): Taking<Args>;

/**
 * Declares the value a command resolves with: in the type, and as a flag the build reads.
 *
 * @returns An object whose type records `Result`.
 */
export function returns<Result>(): Returning<Result>;

/**
 * Lists what a command with arguments states beside its label: no keys, and a sample.
 */
export type Called<Args, Result> = Omit<CommandOptions, "keys"> &
  Partial<Returning<Result>> &
  Taking<Args> & {
    /**
     * Arguments the command's tests run it with.
     */
    readonly sample: NoInfer<Args>;
  };

/**
 * Marks a command that keys, the palette and components run without arguments.
 */
export function command(options: CommandOptions): CommandMarker<void, void>;

/**
 * Marks a command that takes arguments, and resolves with a result where it spreads `returns`.
 */
export function command<Args, Result = void>(
  options: Called<Args, Result>,
): CommandMarker<Args, Result>;

/**
 * Marks a command without arguments that resolves with a result, such as a picker.
 */
export function command<Result>(
  options: Omit<CommandOptions, "keys"> & Returning<Result>,
): CommandMarker<void, Result>;

/**
 * States an event: who may emit it, and whether a late subscriber receives the last payload.
 */
export interface EventOptions extends MarkerOptions {
  /**
   * `"owner"` lets the declaring plugin alone emit it. `"anyone"` lets every plugin emit it, for
   * a request the owner acts on. The owner alone where left out.
   */
  readonly emit?: "anyone" | "owner" | undefined;

  /**
   * Keeps the last payload and hands it to each new subscriber at once.
   */
  readonly sticky?: true | undefined;
}

/**
 * Marks an event with its payload: `event<{ requestId: string }>()`.
 */
export function event<Payload = void>(options?: EventOptions): EventMarker<Payload>;
```

- A command states its arguments with `args<Args>()` and its result with `returns<Result>()`, both
  spread into its options as `props` and `params` are. TypeScript derives both type parameters from
  the one call, which an explicit type argument for either would prevent.
- `Called` requires `sample` and has no `keys` member, so a command with arguments that binds keys,
  or has no sample, fails to compile. A command with a result has no `keys` member either.
- A command with a result lets one plugin ask another for a value without importing its code: the
  identity plugin's `pickPerson` opens its own dialog and resolves with the people picked
  (RFC-0016).
- `event` takes an explicit type argument, because it has one type parameter and nothing else to
  derive.

#### Permissions, resources, roles and entitlements

RFC-0014 defines how the host and the services use each of these four kinds.

```ts
/**
 * States a permission: what it lets a person do, and the kind of resource it is granted on.
 */
export interface PermissionOptions<Scoped extends boolean = boolean> extends MarkerOptions {
  /**
   * Key of the permission's description in the plugin's catalogue. A role editor shows it.
   */
  readonly description: string;

  /**
   * Kind of resource the permission is granted on, one resource at a time. The permission applies
   * to the whole tenant where it names none.
   */
  readonly resource?: Scoped extends true ? ResourceReference : undefined;
}

/**
 * Marks a permission. The reference records whether it is granted per resource.
 */
export function permission<const O extends PermissionOptions>(
  options: O,
): PermissionMarker<O["resource"] extends ResourceReference ? true : false>;

/**
 * States a kind of resource a permission is granted on, such as a request or an invoice.
 */
export interface ResourceOptions extends MarkerOptions {
  /**
   * Key of the resource kind's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Marks a resource kind.
 */
export function resource(options: ResourceOptions): ResourceMarker;

/**
 * States a role: a named set of the plugin's own permissions that an access service offers as one
 * grant.
 */
export interface RoleOptions extends MarkerOptions {
  /**
   * Key of the role's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Permissions the role grants, each declared by the same contract.
   */
  readonly permissions: readonly PermissionReference[];
}

/**
 * Marks a role.
 */
export function role(options: RoleOptions): RoleMarker;

/**
 * States a capability a tenant is licensed for, such as a module or a feature of a plan.
 */
export interface EntitlementOptions extends MarkerOptions {
  /**
   * Key of the entitlement's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Marks an entitlement.
 */
export function entitlement(options: EntitlementOptions): EntitlementMarker;
```

- A resource kind's qualified id is its type in every resource check: `time-off/request`.
- A role lists permissions of its own contract. The build refuses a role that names another plugin's
  permission (RFC-0011), because a grant across plugins is the access service's to make.
- A condition checks a permission or an entitlement, never a role. The access service maps roles to
  permissions, and the session lists the permissions that result (RFC-0014).

#### Feature flags

RFC-0015 defines flags in full. A flag is either a boolean, which a release or an ops flag is, or
one of a list of variants, which an experiment is:

```ts
/**
 * Marks a boolean flag: a release flag or an ops flag.
 */
export function flag(options: OpsFlagOptions | ReleaseFlagOptions): FlagMarker<boolean>;

/**
 * Marks an experiment: a flag whose value is one of its variants.
 */
export function flag<const V extends string>(options: ExperimentOptions<V>): FlagMarker<V>;
```

#### Queries and mutations

RFC-0020 defines both markers. A contract declares the queries and mutations its plugin runs, each
with its operation, its sample, and the records it reads or changes:

```ts
/**
 * Marks a query, with its operation, the records its data contains, and its sample.
 */
export function query<const Data, const Variables extends object>(
  options: QueryOptions<Data, Variables>,
): QueryMarker<Data, Variables>;

/**
 * Marks a mutation, with its operation, the records it changes, and its sample.
 */
export function mutation<const Data, const Variables extends object>(
  options: MutationOptions<Data, Variables>,
): MutationMarker<Data, Variables>;

/**
 * Types the data of a query reference.
 */
export type QueryData<Q> = Q extends QueryReference<string, infer D> ? D : never;

/**
 * Types the variables of a query reference.
 */
export type QueryVariables<Q> = Q extends QueryReference<string, unknown, infer V> ? V : never;

/**
 * Types the data of a mutation reference.
 */
export type MutationData<M> = M extends MutationReference<string, infer D> ? D : never;

/**
 * Types the variables of a mutation reference.
 */
export type MutationVariables<M> =
  M extends MutationReference<string, unknown, infer V> ? V : never;
```

- The operations come from `defineQuery` and `defineMutation` of `sdk-core`, which return the
  `Operation` type of the data foundation structurally (RFC-0005), so a contract depends on no data
  library.
- A route states the queries its page reads under `data`, and the host builds the route's loader
  from them (RFC-0020).

#### Menus

A contract lists the menus it declares by name: `menus: ["reports"]`. A route's `navigation` names a
menu by reference. The host declares the `main` and `settings` menus.

#### Configuration

A plugin's configuration is what a product states about the plugin at build. The schema is a subset
of JSON Schema, with each description a catalogue key:

```ts
/**
 * States one configuration property.
 */
export interface ConfigProperty {
  /**
   * Value where the product states none, of the kind `type` names.
   */
  readonly default?: boolean | number | string | undefined;

  /**
   * Key of the property's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Kind of value the property takes.
   */
  readonly type: "boolean" | "number" | "string";
}

/**
 * Defines a configuration schema. The returned type records each property's kind.
 *
 * @param properties - The properties by name.
 * @param options - The names a product has to state. None where left out.
 * @returns A JSON Schema object that admits those properties and no other.
 */
export function defineConfigSchema<const P extends ConfigProperties, const R extends Keys<P>>(
  properties: P,
  options?: SchemaOptions<R>,
): DefinedSchema<P, R>;
```

`ConfigOf<S>` types what a component reads through `useConfig(schema)`, and `ConfigWritten<S>` types
what a product writes through `installed` (RFC-0011). A property with a default is always present
when read. A required property without a default must be written.

#### Settings

A plugin declares settings pages and settings sections. RFC-0017 defines both markers, the values
schema and the storage. The contract lists them under `settings`:

```ts
/**
 * Lists the settings pages and sections a plugin declares.
 */
export interface SettingsDefinition {
  /**
   * Pages the plugin creates, by name.
   */
  readonly pages?: Readonly<Record<string, SettingsPageMarker>>;

  /**
   * Sections the plugin adds to its own pages or to another plugin's, by name.
   */
  readonly sections?: Readonly<Record<string, SettingsSectionMarker>>;
}
```

### Defining a contract

```ts
/**
 * Lists the names a plugin declares, per kind.
 */
export interface ContractDefinition {
  readonly commands?: Readonly<Record<string, CommandMarker>>;
  readonly config?: ConfigSchema;
  readonly entitlements?: Readonly<Record<string, EntitlementMarker>>;
  readonly events?: Readonly<Record<string, EventMarker>>;
  readonly extensions?: Readonly<Record<string, ExtensionMarker>>;
  readonly featureFlags?: Readonly<Record<string, FlagMarker>>;
  readonly menus?: readonly string[];
  readonly mutations?: Readonly<Record<string, MutationMarker>>;
  readonly permissions?: Readonly<Record<string, PermissionMarker>>;
  readonly queries?: Readonly<Record<string, QueryMarker>>;
  readonly requires?: readonly Requirement[];
  readonly resources?: Readonly<Record<string, ResourceMarker>>;
  readonly roles?: Readonly<Record<string, RoleMarker>>;
  readonly routes?: Readonly<Record<string, RouteMarker>>;
  readonly settings?: SettingsDefinition;
  readonly slots?: Readonly<Record<string, SlotMarker>>;
  readonly version?: string;
}

/**
 * Defines a plugin's contract: one typed reference per declared name.
 *
 * @param pluginId - The plugin's id.
 * @param definition - The names per kind, or a function of `self` that returns them.
 * @returns The references per kind and name, with the plugin id, the requirements and the version.
 * @throws {@link Error} When the plugin id or a name breaks its grammar, or when `self` names a
 *   name the definition does not declare.
 */
export function defineContract<const P extends string, const D extends ContractDefinition>(
  pluginId: P,
  definition: ((self: Self<P>) => D) | D,
): Contract<P, D>;
```

A definition that references its own names is a function of `self`. `self` has one factory per kind,
named after the kind: `self.route("detail")`, `self.permission("request.approve")`,
`self.resource("request")`, `self.featureFlag("calendar")`, `self.query("requests")`. Each returns a
bare reference from the name. `defineContract` records every name `self` produced and throws once
the contract is built where a name is not declared:
`The contract time-off references its own route "detial", which it does not declare.`

`Contract<P, D>` has one member per kind, each a record of references keyed by name and typed by its
marker, plus `pluginId`, `requires`, `version` and `config`. `AnyContract` is the widened form that
`definePlugin`, `installed` and the resolver accept.

A complete contract:

```ts
import { identityContract } from "@acme/plugin-identity-contract";
import {
  args,
  command,
  defineConfigSchema,
  defineContract,
  entitlement,
  event,
  extension,
  flag,
  hostContract,
  needs,
  params,
  permission,
  props,
  resource,
  role,
  route,
  settingsPage,
  settingsSection,
  slot,
} from "@stealthscale/sdk-core";
import { z } from "zod";

import pkg from "#package.json" with { type: "json" };

export interface RequestSidebarProps {
  readonly requestId: string;
}

export const timeOffContract = defineContract("time-off", (self) => ({
  commands: {
    approve: command({
      ...args<{ readonly requestId: string }>(),
      label: "commands.approve",
      sample: { requestId: "7" },
      when: { permission: self.permission("request.approve") },
    }),
    request: command({ keys: "Mod+Shift+R", label: "commands.request" }),
  },
  config: defineConfigSchema({
    approvers: { default: 1, description: "config.approvers", type: "number" },
  }),
  entitlements: {
    halfDays: entitlement({ description: "entitlements.halfDays" }),
    module: entitlement({ description: "entitlements.module" }),
  },
  events: { approved: event<{ readonly requestId: string }>() },
  extensions: {
    balance: extension({ position: "after", target: hostContract.slots.status }),
  },
  featureFlags: {
    calendar: flag({
      default: false,
      description: "flags.calendar",
      expires: "2026-12-31",
      kind: "release",
    }),
  },
  permissions: {
    "request.approve": permission({
      description: "permissions.approve",
      resource: self.resource("request"),
    }),
    "request.read": permission({ description: "permissions.read" }),
  },
  requires: [needs(identityContract, "^0.4.0")],
  resources: { request: resource({ description: "resources.request" }) },
  roles: {
    approver: role({
      description: "roles.approver",
      permissions: [self.permission("request.approve"), self.permission("request.read")],
    }),
  },
  routes: {
    overview: route({
      navigation: { label: "navigation.overview", order: 30 },
      path: "time-off",
      search: z.object({ status: z.enum(["open", "approved"]).optional() }),
      when: { permission: self.permission("request.read") },
    }),
    request: route({
      ...params<{ id: string }>(),
      parent: self.route("overview"),
      path: "$id",
      sample: { id: "7" },
    }),
  },
  settings: {
    pages: { "time-off": settingsPage({ label: "settings.title", order: 40 }) },
    sections: {
      reminders: settingsSection({
        label: "settings.reminders",
        target: self.settingsPage("time-off"),
      }),
    },
  },
  slots: {
    "request-sidebar": slot({ ...props<RequestSidebarProps>(), sample: { requestId: "7" } }),
  },
  version: pkg.version,
}));
```

### Conditions

A condition is data. The host evaluates it for a plugin, a route, an extension, a command, a
settings page and a settings section. RFC-0014 and RFC-0015 define where each member's value comes
from.

```ts
/**
 * States when a name applies. Every member stated must be true.
 */
export interface When {
  /**
   * Conditions that must all be true.
   */
  readonly allOf?: readonly When[] | undefined;

  /**
   * Conditions of which at least one must be true. An empty list is false.
   */
  readonly anyOf?: readonly When[] | undefined;

  /**
   * Whether somebody must be signed in, or must not be.
   */
  readonly authenticated?: boolean | undefined;

  /**
   * An entitlement the tenant must be licensed for.
   */
  readonly entitlement?: EntitlementReference | undefined;

  /**
   * A boolean flag that must be on for the session.
   */
  readonly featureFlag?: FlagReference<boolean> | undefined;

  /**
   * A value of the record the slot renders with: equal to `equals`, or present or absent by
   * `exists`. Allowed only in an extension whose target slot states `record` (RFC-0020).
   */
  readonly field?: FieldCondition | undefined;

  /**
   * A condition that must be false.
   */
  readonly not?: When | undefined;

  /**
   * A permission the person must have, for the tenant or for at least one resource.
   */
  readonly permission?: PermissionReference | undefined;

  /**
   * A plugin that must be installed and on, named by its contract.
   */
  readonly plugin?: { readonly pluginId: string } | undefined;

  /**
   * A route that must be matched: the page is the route or a route nested under it.
   */
  readonly route?: RouteReference | undefined;

  /**
   * An experiment's variant the session must be in, stated with `flagIs`.
   */
  readonly variant?: VariantCondition | undefined;
}

/**
 * States that an experiment serves one variant to the session.
 */
export interface VariantCondition {
  /**
   * Qualified id of the experiment.
   */
  readonly flag: string;

  /**
   * The variant the experiment must serve.
   */
  readonly is: string;
}

/**
 * Builds a variant condition that the type checker checks against the experiment's variants.
 */
export function flagIs<V extends string>(flag: FlagReference<V>, is: NoInfer<V>): VariantCondition;

/**
 * Lists the lookups a condition is evaluated against.
 */
export interface ConditionContext {
  /**
   * True when somebody is signed in.
   */
  readonly authenticated: boolean;

  /**
   * Returns whether the tenant is licensed for the entitlement.
   */
  readonly entitled: (id: string) => boolean;

  /**
   * Returns the value at a dotted path of the record a slot renders with. Present only while a slot
   * that states `record` evaluates its extensions' conditions.
   */
  readonly field?: ((path: string) => unknown) | undefined;

  /**
   * Returns the flag's value for the session: a boolean, or an experiment's variant.
   */
  readonly flag: (id: string) => boolean | string;

  /**
   * Ids of every matched route, outermost first. Undefined where no location applies.
   */
  readonly matched: ReadonlySet<string> | undefined;

  /**
   * Returns whether the plugin is installed and on.
   */
  readonly on: (pluginId: string) => boolean;

  /**
   * Returns whether the person has the permission, for the tenant or for at least one resource.
   */
  readonly permitted: (id: string) => boolean;
}

/**
 * Evaluates a condition. An absent condition, and a condition that states no member, are true.
 */
export function evaluateWhen(when: When | undefined, context: ConditionContext): boolean;
```

| Member          | True when                                                                  |
| --------------- | -------------------------------------------------------------------------- |
| `allOf`         | Every condition in the list is true                                        |
| `anyOf`         | At least one condition in the list is true                                 |
| `not`           | Its condition is false                                                     |
| `authenticated` | It equals `context.authenticated`                                          |
| `permission`    | `context.permitted(id)` returns true                                       |
| `entitlement`   | `context.entitled(id)` returns true                                        |
| `field`         | `context.field(path)` equals `equals`, or is present or absent by `exists` |
| `featureFlag`   | `context.flag(id)` returns `true`                                          |
| `variant`       | `context.flag(flag)` returns the variant `is` names                        |
| `plugin`        | `context.on(pluginId)` returns true                                        |
| `route`         | `context.matched` contains the reference's id. False where it is undefined |

- `evaluateWhen` is pure and synchronous. It is in `sdk-core`, so the build, the host, the tests and
  a Node service evaluate a condition the same way.
- `conditionContext(session, lookups)` of `sdk-core` builds a context from a session: it puts the
  session's permissions and entitlements in sets once, so each check is one lookup.
- A condition is synchronous by design. A check that needs a service, such as a permission on one
  resource, is not a condition. RFC-0014 defines the check a component makes on one resource.

The host evaluates each kind at one moment:

| Declaration      | Evaluated                                                            | A false condition                                         |
| ---------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| Plugin           | Whenever a store the product's `installed` condition reads changes   | Every declaration of the plugin is unavailable (RFC-0012) |
| Route            | In `beforeLoad`, on every navigation and every `router.invalidate()` | The page is not found (RFC-0013)                          |
| Extension        | When its target renders, and again when a store it reads changes     | The extension is not placed                               |
| Command          | When a component reads it, and again when it runs                    | Disabled, and `run` refuses (RFC-0016)                    |
| Settings page    | Like a route                                                         | The page is not found                                     |
| Settings section | Like an extension                                                    | The section is not rendered                               |
| Menu entry       | With its route's condition, without throwing                         | The entry is not listed                                   |

### Versions

A requirement states a caret range over another contract's version:

```ts
/**
 * Lists the only range form a requirement takes: `^1`, `^1.4.0`, `^0.3.0`.
 */
export type CaretRange = `^${string}`;

/**
 * States a plugin another plugin needs, at a range of its contract's version.
 */
export interface Requirement {
  /**
   * Lets the plugin run without the plugin it needs.
   */
  readonly optional?: true | undefined;

  /**
   * The id of the plugin needed.
   */
  readonly pluginId: string;

  /**
   * Caret range over the needed contract's version.
   */
  readonly range: CaretRange;

  /**
   * The needed contract's version where the requirement was written.
   */
  readonly version?: string | undefined;
}

/**
 * States that a plugin needs another plugin.
 */
export function needs(
  contract: AnyContract,
  range: CaretRange,
  options?: { readonly optional?: true },
): Requirement;

/**
 * Returns true when a version satisfies a caret range, the way semver reads a caret.
 *
 * @throws {@link TypeError} When the range is not a caret range or the version is not a version.
 */
export function compatible(range: string, version: string): boolean;

/**
 * Returns true when a version is lower than the version a range starts at.
 */
export function below(range: string, version: string): boolean;
```

- A caret range fixes the first non-zero number. `^1.4.0` admits `1.9.2` and refuses `2.0.0`.
  `^0.4.0` admits `0.4.7` and refuses `0.5.0`. `^0.0.3` admits `0.0.3` alone.
- Every package in this repository is 0.x, so every minor of a contract is breaking for the ranges
  that name it.
- A reference records the version of the contract it was made from. The build compares it with the
  installed contract's version (RFC-0011):
  - Compatible: nothing is reported.
  - The installed version is below the reference's: the build fails, because the plugin may
    reference a name the installed contract lacks.
  - The installed version is a later major: the build warns.
- The API version is the major and minor of `sdk-core`. `definePlugin` writes it into the manifest
  as a caret range, `^0.1.0` today. The SDK packages release as one `linked` group, so one version
  names the API. The build refuses a manifest whose range does not admit the installed `sdk-core`.

### Manifests

A manifest maps each name that needs code to a lazy importer. Routes, extensions and commands need
code. Component settings sections need code. Every other kind is data alone.

```ts
/**
 * Renders what a plugin contributes: a function of its props.
 */
export type PluginComponent<Props> = (props: Props) => unknown;

/**
 * Maps a module's export names to the one component it exports.
 */
export type ComponentModule<Props> = Readonly<Record<string, PluginComponent<Props>>>;

/**
 * Imports the module of one component on first use: `() => import("#overview.tsx")`.
 *
 * @remarks
 *   The module exports exactly one function, and the host renders it. `checks()` fails a module
 *   that exports none or more than one.
 */
export type LazyComponent<Props = never> = () => Promise<ComponentModule<Props>>;

/**
 * Maps a module's export names to the one command function it exports, typed by the command's
 * arguments `A`, its needs `N` and its result `R`.
 */
export type CommandModule<A, N, R> = Readonly<Record<string, CommandRun<A, N, R>>>;

/**
 * Imports the module of one command on first use.
 */
export type LazyCommand<A = never, N = never, R = void> = () => Promise<CommandModule<A, N, R>>;

/**
 * Runs a command with its arguments, the commands it needs, and the host's API, and returns the
 * command's result.
 */
export type CommandRun<Args, Needs, Result = void> = (
  args: Args,
  needs: Needs,
  host: HostApi,
) => Promise<Result> | Result;

/**
 * Maps a contract's names to code.
 */
export interface PluginManifest<C extends AnyContract = AnyContract> {
  /**
   * Caret range of the SDK API the manifest was built against.
   */
  readonly apiVersion: CaretRange;

  /**
   * Code by kind and name.
   */
  readonly code: PluginCode;

  /**
   * The contract whose names the code implements.
   */
  readonly contract: C;
}

/**
 * Declares a plugin's code against its contract.
 *
 * @param contract - The plugin's contract.
 * @param declaration - One importer per route, extension, command and component settings section.
 * @returns The manifest.
 */
export function definePlugin<const C extends AnyContract, const D extends PluginDeclaration<C>>(
  contract: C,
  declaration: D & Verified<C, D>,
): PluginManifest<C>;
```

`PluginDeclaration<C>` has one member per kind that needs code, each keyed by the contract's names:

| Member       | Entry                                                                                 | Checked against                                               |
| ------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `routes`     | `LazyComponent<object>`, or `{ component; fallback? }` of that type                   | A routed component takes no props. It reads through hooks.    |
| `extensions` | `{ component: LazyComponent<P>; fallback?: LazyComponent<P> }`                        | `P` is the props its target renders with, per the table above |
| `commands`   | `{ run: LazyCommand<Args, Needs, Result>; needs?: Record<string, CommandReference> }` | `Args` and `Result` from the marker, `Needs` from the entry   |
| `settings`   | `{ component?: LazyComponent<SettingsSectionProps>; migrations? }`                    | A section without a schema needs a component (RFC-0017)       |

- A fallback renders in place of a page or an extension that threw, until the target is quarantined
  (RFC-0012). A target without one renders the host's error component or nothing.
- A name the contract declares with no entry, and an entry for a name the contract does not declare,
  fail to compile. `Verified<C, D>` maps each extra or missing name to `never`.
- A command's `needs` names other commands by reference. The host resolves each to a function that
  runs it through the registry, with its condition checked (RFC-0016).
- `definePlugin` returns a plain object and does not load a module, so the web package's main entry
  remains free of React and of components.

The manifest of the contract above:

```ts
import { timeOffContract } from "@acme/plugin-time-off-contract";
import { definePlugin } from "@stealthscale/sdk-core";

export const manifest = definePlugin(timeOffContract, {
  commands: {
    approve: { run: () => import("#approve.command.ts") },
    request: { run: () => import("#request.command.ts") },
  },
  extensions: { balance: { component: () => import("#balance.tsx") } },
  routes: {
    overview: () => import("#overview.tsx"),
    request: () => import("#request.tsx"),
  },
});
```

### The host contract

The host declares a contract of its own, `hostContract`, with the plugin id `host`. It declares the
regions a frame renders, the structural slots the host renders itself, the `main` and `settings`
menus, the settings route and the events the host emits. RFC-0013 defines the slots and RFC-0016 the
events. A plugin targets a host slot like any other slot:

```ts
extension({ position: "after", target: hostContract.slots.status });
```

- `host` is a reserved plugin id. `defineContract` throws for any other contract that claims it.
- The build adds one ops flag per installed plugin to the host's declarations,
  `host/plugin.<plugin id>`, which turns the whole plugin off during an incident (RFC-0015).

## Failure handling

| Failure                                                                                    | Detected by           | Outcome                                                            |
| ------------------------------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------ |
| A plugin id or a name breaks its grammar                                                   | `defineContract`      | Throws when the contract module loads, naming the id               |
| `self` names an undeclared name                                                            | `defineContract`      | Throws, naming the kind and the name                               |
| A contract other than the host's claims the id `host`                                      | `defineContract`      | Throws                                                             |
| A command with arguments or a result binds keys, or a command with arguments has no sample | The type checker      | Fails to compile. The build refuses the same for an untyped caller |
| A route with parameters has `navigation`, or has no sample                                 | The type checker      | Fails to compile. The build refuses the same                       |
| An `every` target takes a position other than `wrap`                                       | The type checker      | Fails to compile. The build refuses the same                       |
| `flagIs` names a variant the experiment does not declare                                   | The type checker      | Fails to compile. The build refuses the same                       |
| A role names a permission of another contract                                              | The build             | The build fails, naming the role and the permission                |
| An extension's `match` does not fit its target's `keyed`                                   | The build             | The build fails, naming the extension and the slot                 |
| A manifest omits code for a name, or names an undeclared name                              | The type checker      | Fails to compile. `createHost` throws for an untyped caller        |
| An extension component's props do not match its target                                     | The type checker      | Fails to compile                                                   |
| A component module exports no function or more than one                                    | `checks()`, the host  | The test fails. The host renders the page's error component        |
| A label or description key is missing from the fallback catalogue                          | `checks()`, the build | The test fails and the build fails, naming the plugin and the key  |

## Alternatives considered

### One package per plugin, with a `./contract` entry

**Why not:** two plugins that target each other's slots would depend on each other, and the gate
refuses a package cycle. Separate contract packages keep the web packages out of each other's
dependencies.

### A contract written as JSON

A `contract.json` beside the web package, read by the host and the build.

**Why not:** a reference would lose its types, so a component could not be checked against the slot
it goes into and a link could not be checked against the parameters of its route. The second slice
serves each contract as JSON (RFC-0009), written from the TypeScript contract at build.

### Label keys typed by the catalogue at compile time

Type each `label` as a key of the plugin's catalogue, from the declaration file `vite-plugin-i18n`
generates.

**Why not now:** `sdk-core` would import the type of `provider-i18n`'s `Resources` interface, and a
contract package would need `provider-i18n` to type-check. `checks()` and the build check every key
against the fallback catalogue instead, which covers the same fault one step later.

### Path conditions

`when: { path: "/inventory/*" }` beside `route`.

**Why not:** a path belongs to whoever assembled the product (RFC-0006). A condition written against
a path breaks when the product moves the route, and `route` names the same place by reference.

### Roles in conditions

`when: { role: approver }`, true when the session lists the role.

**Why not:** a role is a grouping the access service changes without a release of the plugin. A
condition on a role copies the service's mapping from roles to permissions into the page, and the
two copies diverge at the service's next change. A condition on the permission reads the result of
the service's mapping, so the page and the service agree.

### A permission per resource in the condition language

`when: { permission, resource: { param: "id" } }`, evaluated against the route's parameters.

**Why not:** the decision needs the service, and a condition is synchronous so that a menu, a
command and `beforeLoad` evaluate it without a request. The service that returns a resource refuses
one the person may not read, and the page then renders not found. RFC-0014 defines the check a
component makes on one resource.

## Drawbacks

- A plugin is two packages, so a new plugin starts with two manifests, two build configurations and
  one `fixed` group. The scaffold writes both (RFC-0019).
- Contract packages form a graph that must remain acyclic. Plugins that extend each other in both
  directions need a third contract for the shared slot.
- A word in a label is part of the contract package, so a change of wording releases the contract.
- A route's search validator makes the contract package depend on a validation library at run time.
- `route` in a condition is true on nested routes. A condition that needs the exact route compares
  it inside the component.
- A contract declares its access model in full: each permission, the resource kinds, the roles and
  the entitlements. A small plugin with one permission states one marker. A plugin sold per module
  states its entitlements as well.

## Unresolved and future work

- Label keys typed at compile time, once a React-free package defines the catalogue interface.
- An icon on a menu entry. An icon is code, so it belongs in the manifest.
- Extension points that contribute data rather than components, such as a provider of search
  results: a slot that states an interface in place of props, and a manifest entry that imports an
  object. The first such extension point in a product brings it in.
- A Standard Schema on a command's arguments and an event's payload, validated at the plugin
  boundary. The second slice brings it in, because a remote's caller is not type-checked against the
  contract.

## References

| What                                      | Where                                                      |
| ----------------------------------------- | ---------------------------------------------------------- |
| The router's route declaration            | `foundations/providers/router/src/declaration.ts:97-159`   |
| Paths relative to a parent                | `foundations/providers/router/src/map.ts:105-117`          |
| Refusing a failing condition as not found | `docs/adr/0024-refuse-a-failing-condition-as-not-found.md` |
| Routing: routes by reference and by id    | `docs/rfc/0006-routing.md`                                 |
| Standard Schema                           | https://github.com/standard-schema/standard-schema         |
| TanStack Hotkeys                          | https://tanstack.com/hotkeys/latest                        |
