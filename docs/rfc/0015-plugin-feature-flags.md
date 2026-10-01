---
rfc: 0015
title: "Plugin feature flags"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-01
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0015: Plugin feature flags

## Summary

A plugin declares each flag its code reads. The declaration states the flag's kind, its values and
its default, and a release or an experiment also states the date by which it is removed. A product
sets values at build. A flag service sets them per session at run time. A developer or a tester
overrides them in one tab.

The host evaluates a flag the first time the page reads it and keeps the value for the session. It
evaluates the flag again when the flag service reports a change.

This RFC defines the kinds of flag, the markers, the order in which values apply, the flag source
and its OpenFeature adapter, the kill switch of every plugin, overrides, exposures of experiments,
the flag catalogue the build writes, and the checks that remove a flag once its date has passed.

## Motivation

### The requirements

- A plugin merges unreleased work behind a flag, and turning the flag on releases the work without a
  deployment.
- An experiment serves each person one of its variants, and the product records which variant each
  person saw.
- An operator turns a feature, or a whole plugin, off during an incident without a deployment.
- A product runs without a flag service. Every flag then has the product's value or the contract's
  default.
- A release and an experiment have an end. The build reports a flag that is past its date.
- The flag service receives every declared flag with its kind, its default and its variants, without
  reading TypeScript.
- A developer and a tester see either side of a flag without editing code or the flag service.
- A page, a contribution, a command and a component agree on a flag's value at every moment.

### Why this layer

A flag changes which code runs. Who may run it is access (RFC-0014). A flag's value comes from
outside the plugin, so the plugin declares the flag in its contract and reads it through the host.
The product chooses the flag service, and a plugin reads a flag through `sdk-plugin` alone.

## Detailed design

### Three kinds

| Kind         | Purpose                                             | Value               | Lifetime                                    | `expires` |
| ------------ | --------------------------------------------------- | ------------------- | ------------------------------------------- | --------- |
| `release`    | Code merged before it is released                   | On or off           | Until the release. The flag is then removed | Required  |
| `experiment` | Variants of one feature, compared on real sessions  | One of its variants | Until the experiment ends                   | Required  |
| `ops`        | A kill switch or a degraded mode during an incident | On or off           | Permanent for a kill switch                 | Optional  |

- A value that decides who may use a feature is a permission or an entitlement (RFC-0014), never a
  flag. A flag is not enforced by any service.
- A value that differs per deployment is configuration (RFC-0011), and a value a person chooses is a
  setting (RFC-0017).

### Markers

```ts
/**
 * Types a date in the form `2026-12-31`.
 */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * Lists the kinds of flag.
 */
export type FlagKind = "experiment" | "ops" | "release";

/**
 * Lists what every flag states.
 */
export interface FlagOptions extends MarkerOptions {
  /**
   * Key of the flag's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Describes a release flag, which keeps merged code off until its release.
 */
export interface ReleaseFlagOptions extends FlagOptions {
  /**
   * Value where neither an override, the flag source nor the product states one.
   */
  readonly default: boolean;

  /**
   * Date by which the flag is removed from the code and the contract.
   */
  readonly expires: IsoDate;

  /**
   * Marks the flag as a release flag.
   */
  readonly kind: "release";
}

/**
 * Describes an ops flag, which an operator turns off during an incident.
 */
export interface OpsFlagOptions extends FlagOptions {
  /**
   * Value where neither an override, the flag source nor the product states one. On, for a
   * feature an operator turns off.
   */
  readonly default: boolean;

  /**
   * Date by which a temporary ops flag, such as a degraded mode during a migration, is removed. A
   * kill switch states none.
   */
  readonly expires?: IsoDate | undefined;

  /**
   * Marks the flag as an ops flag.
   */
  readonly kind: "ops";
}

/**
 * Describes an experiment, whose value is one of its variants.
 */
export interface ExperimentOptions<V extends string> extends FlagOptions {
  /**
   * The control variant, served where neither an override, the flag source nor the product states
   * one.
   */
  readonly default: NoInfer<V>;

  /**
   * Date by which the experiment ends and the flag is removed.
   */
  readonly expires: IsoDate;

  /**
   * Marks the flag as an experiment.
   */
  readonly kind: "experiment";

  /**
   * The variants, at least two.
   */
  readonly variants: readonly [V, V, ...V[]];
}

/**
 * Marks a release flag or an ops flag.
 */
export function flag(options: OpsFlagOptions | ReleaseFlagOptions): FlagMarker<boolean>;

/**
 * Marks an experiment.
 */
export function flag<const V extends string>(options: ExperimentOptions<V>): FlagMarker<V>;

/**
 * Describes a flag as its marker states it.
 */
export interface FlagMarker<
  Value extends boolean | string = boolean | string,
> extends MarkerOptions {
  /**
   * The flag's value, for the type checker alone.
   */
  readonly "~types"?: { readonly value: Value };

  /**
   * Value where neither an override, the flag source nor the product states one.
   */
  readonly default: Value;

  /**
   * Key of the flag's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Date by which the flag is removed, where it states one.
   */
  readonly expires?: IsoDate | undefined;

  /**
   * Whether the flag is a release flag, an ops flag or an experiment.
   */
  readonly flagKind: FlagKind;

  /**
   * The kind of the marker.
   */
  readonly kind: "featureFlag";

  /**
   * `"boolean"` for a release or an ops flag, `"string"` for an experiment.
   */
  readonly type: "boolean" | "string";

  /**
   * The variants of an experiment.
   */
  readonly variants?: readonly Value[] | undefined;
}

/**
 * Points at a flag a plugin declared, with its value in the type alone.
 */
export interface FlagReference<
  Value extends boolean | string = boolean | string,
  Id extends string = string,
>
  extends Partial<Omit<FlagMarker<Value>, "~types" | "kind">>, Reference<"featureFlag", Id> {
  /**
   * The flag's value, for the type checker alone.
   */
  readonly "~types"?: { readonly value: Value };
}
```

- The marker states the flag's own kind as `flagKind`, because `kind` is the kind of every
  reference, `featureFlag`.
- `FlagReference` takes the value as its first type parameter, because every reader of a flag states
  it: `FlagReference<boolean>` for a release or an ops flag, `FlagReference<"list" | "board">` for
  an experiment.

A contract with one flag of each kind:

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

### Reading a flag

| Reader      | Boolean flag                                                   | Experiment                                             |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| A condition | `when: { featureFlag: timeOffContract.featureFlags.calendar }` | `when: { variant: flagIs(layout, "board") }`           |
| A component | `useFeatureFlag(calendar)` returns a boolean                   | `useFeatureFlag(layout)` returns `"list"` or `"board"` |
| A command   | `host.flag(calendar)` (RFC-0016)                               | `host.flag(layout)`                                    |

```ts
/**
 * Reads a boolean flag for the session, and renders again when it changes.
 */
export function useFeatureFlag(flag: FlagReference<boolean>): boolean;

/**
 * Reads the variant an experiment serves the session, and renders again when it changes.
 */
export function useFeatureFlag<V extends string>(flag: FlagReference<V>): V;
```

A condition reads a boolean flag or an experiment's variant, and never compares values any other
way. A page that renders each variant differently reads the variant with `useFeatureFlag`.

`useFeatureFlag` returns the reference's `default` for a flag that no installed plugin declares,
such as an optional plugin's, and false where the reference states none. A condition reads such a
flag as false.

### Value precedence

The host takes a flag's value from the first of these sources that states one:

| Source      | Stated in                                           | Varies per             |
| ----------- | --------------------------------------------------- | ---------------------- |
| Override    | A development panel or the inspector, in one tab    | Tab                    |
| Flag source | The product's flag service, through a `FlagSource`  | Session, and over time |
| Product     | `featureFlags` in the product definition (RFC-0011) | Build                  |
| Contract    | The marker's `default`                              | Release of the plugin  |

A product states values with `setFlag`, which the type checker checks against the flag's values:

```ts
/**
 * Builds a product's value for a flag.
 */
export function setFlag<V extends boolean | string>(
  flag: FlagReference<V>,
  value: NoInfer<V>,
): SetFlag;
```

```ts
featureFlags: [
  setFlag(timeOffContract.featureFlags.calendar, true),
  setFlag(timeOffContract.featureFlags.layout, "board"),
],
```

A value of the wrong type, such as a string for a boolean flag or a variant the experiment does not
declare, is ignored and reported as `flag-ignored`, and the next source applies.

### The flag source

```ts
/**
 * Describes a flag and the type of value the host expects for it.
 */
export interface FlagDescriptor {
  /**
   * Qualified id of the flag.
   */
  readonly id: string;

  /**
   * `"boolean"` for a release or an ops flag, `"string"` for an experiment.
   */
  readonly type: "boolean" | "string";
}

/**
 * Provides flag values for the session the host identified.
 */
export interface FlagSource {
  /**
   * Returns the flag's value for the identified session, or undefined where the source has none.
   *
   * @remarks
   *   Synchronous, because a condition is evaluated inside `beforeLoad` and during render. The
   *   source returns the values it last fetched and calls its listeners when they change.
   */
  readonly evaluate: (flag: FlagDescriptor) => boolean | string | undefined;

  /**
   * Tells the source whom the next evaluations are for. The host awaits it before it evaluates.
   */
  readonly identify?: ((session: Session) => Promise<void>) | undefined;

  /**
   * Calls the listener after the source's values change. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}
```

- `createHost({ flags })` takes the source (RFC-0012). Without one, every flag has the product's
  value or its default.
- `host.ready()` waits for the first `identify` for at most `flagsTimeout`, 1,000 ms by default.
  After that the page renders with the product's values and updates when the source resolves. A flag
  service that does not respond delays the first render by one second and does not block the page.

### Evaluation

- The host evaluates a flag the first time a condition or a component reads it, and keeps the value
  and its source in the flag store for the session. Every later read is one lookup.
- When the source calls its listener, the host evaluates again every flag in the store. Where a
  value changed, it updates the store, the readers of that flag render again, and the host calls
  `router.invalidate()`.
- After a session change the store keeps the previous values while `identify` is pending, then the
  host evaluates again every flag in the store (RFC-0014).
- The host evaluates only what the page reads, because a flag service may record an exposure when it
  evaluates an experiment. An exposure recorded for an experiment the person never saw would count
  the person in the variant.

### Exposures

The first time a session reads an experiment, the host reports `flag-exposed` with the experiment's
qualified id and the variant (RFC-0012). The product's `report` function forwards the entry to its
analytics, which compares the variants over the people exposed to each. A menu entry or an extension
that a variant condition gates counts as an exposure, because the person saw the variant's effect.

### The kill switch of every plugin

- The build declares one ops flag per installed plugin, `host/plugin.<plugin id>`, with the default
  on (RFC-0011). Its plugin is `host`, and its description is the key `flags.killSwitch` of the
  host's catalogue.
- A product may set a kill switch's value in `featureFlags`, like any other flag's:
  `{ flag: "host/plugin.inspector", value: false }`.
- A flag service that turns it off turns the plugin off for the sessions it targets: every page of
  the plugin is not found with the reason `unavailable`, every extension unplaced, every command
  disabled and every settings page and section hidden (RFC-0012, RFC-0013).
- Turning it on again restores the plugin without a reload. The host invalidates the router, and
  every slot renders again.
- `locked` keeps a person from switching a plugin off. An operator still stops a locked plugin with
  its kill switch.
- An ops flag a plugin declares turns one feature of the plugin off, and leaves the rest running.

### Overrides

```ts
/**
 * Lists what a development tool may do to the host's flags.
 */
export interface FlagActions {
  /**
   * Overrides a flag's value in this tab, or removes the override where no value is given.
   */
  readonly override: <V extends boolean | string>(
    flag: FlagReference<V>,
    value?: NoInfer<V>,
  ) => void;

  /**
   * Every override in this tab, by the flag's qualified id.
   */
  readonly overrides: Readonly<Record<string, boolean | string>>;
}

/**
 * Returns the flag actions, and renders again when an override changes.
 */
export function useFlagActions(): FlagActions;
```

- The host reads and writes overrides only where `createHost` is given `overrides: true`, which is
  the default outside a production build. A product that tests in production states it.
- The host keeps overrides in session storage under `stealth.<productId>.flag-overrides`, so an
  override applies to one tab and ends when the tab closes.
- The standalone host's panel and the inspector call `override` (RFC-0019). The inspector offers it
  to a person with the permission `inspector/flags.override`, and renders a notice in the `status`
  region while any override is active.
- An override changes the page in one tab. It is not an access decision: a person who overrides a
  release flag sees the unreleased page, and every service still checks what the person may do.

### The OpenFeature adapter

`sdk-host` publishes an adapter for a product that uses OpenFeature, in the subpath
`@stealthscale/sdk-host/openfeature` with `@openfeature/web-sdk` as an optional peer dependency:

```ts
/**
 * Adapts an OpenFeature client to a flag source.
 *
 * @param options - The domain the host's client is bound to, `stealth.host` by default.
 */
export function openFeatureFlags(options?: { readonly domain?: string }): FlagSource;
```

- `identify` calls `OpenFeature.setContext(domain, context)` with the session as the evaluation
  context: `targetingKey` from `userId`, and `authenticated`, `entitlements`, `roles` and `tenantId`
  beside it.
- `evaluate` calls `getBooleanDetails` for a boolean flag and `getStringDetails` for an experiment,
  and returns undefined where the details contain an error code, so a flag the provider does not
  know takes the product's value.
- `subscribe` listens to the provider's `Ready`, `ConfigurationChanged` and `ContextChanged` events.
- A product sets its provider with `OpenFeature.setProvider(domain, provider)`, so a product that
  uses OpenFeature elsewhere keeps its own default provider.

### The flag catalogue

The build writes every flag of the installed plugins, the kill switches included, into
`dist/.product/flags.json` (RFC-0011):

```ts
/**
 * Describes one flag in the flag catalogue.
 */
export interface CatalogueFlag extends CatalogueEntry {
  /**
   * The contract's default.
   */
  readonly default: boolean | string;

  /**
   * Date by which the flag is removed, where it states one. A kill switch states none.
   */
  readonly expires?: string | undefined;

  /**
   * The flag's kind.
   */
  readonly kind: FlagKind;

  /**
   * The product's value, where the product states one.
   */
  readonly product?: boolean | string | undefined;

  /**
   * The variants of an experiment.
   */
  readonly variants?: readonly string[] | undefined;
}

/**
 * Describes every flag of a product's installed plugins, one kill switch per plugin included, for
 * the flag service.
 */
export interface FlagCatalogue {
  /**
   * Every flag, sorted by id.
   */
  readonly flags: readonly CatalogueFlag[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;
}
```

The flag service reads the file to create each flag with its default, its variants and its
description, to list a flag's date, and to archive a flag that no release of the product declares.
`CatalogueEntry` and `CatalogueProduct` are the access catalogue's (RFC-0014).

### Removing a flag

| Fault                                                | Detected by                 | Result                                                  |
| ---------------------------------------------------- | --------------------------- | ------------------------------------------------------- |
| A release flag or an experiment states no `expires`  | The type checker, the build | Fails to compile. The build fails for an untyped caller |
| A flag is past its `expires` date                    | The build                   | A warning naming the plugin, the flag and the date      |
| A flag is past its `expires` date                    | `checks()` of the plugin    | The case fails, from the day after the date (RFC-0019)  |
| An experiment's `default` is not one of its variants | The type checker, the build | Fails to compile. The build fails for an untyped caller |
| The product sets a value the flag does not take      | The type checker, the build | Fails to compile. The build fails for an untyped caller |
| The product sets a flag no installed plugin declares | The build                   | The build fails                                         |

A plugin's own tests fail once a release flag or an experiment is past its date. The team that
declared the flag then removes it or moves the date in the contract. A new date is a change to the
contract, released like any other, and the plugin's changelog records it.

### On a server

- The server builds a host per request, with a flag source bound to that request. It awaits
  `identify` before it renders, so the page's first render uses the person's flags.
- The values of the flags the server render read are part of the router's dehydrated state. The
  browser's host starts from them, so the browser's first render matches the server's. The browser's
  own flag source takes over once it has identified the session.
- Overrides are in the browser's session storage, so the server renders without them, and the
  browser applies them after hydration.

## Failure handling

| Failure                                             | Detected by    | Outcome                                                                                                      |
| --------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| `identify` rejects                                  | The host       | The previous values remain, `flags-failed` is reported, and `identify` runs again at the next session change |
| `identify` does not resolve within `flagsTimeout`   | `host.ready()` | The first render uses the product's values                                                                   |
| `evaluate` throws for a flag                        | The host       | The next source's value applies, and `flags-failed` is reported                                              |
| A value of the wrong type                           | The host       | Ignored, `flag-ignored` is reported, and the next source's value applies                                     |
| An override for a flag no installed plugin declares | The host       | Ignored                                                                                                      |
| Session storage refuses a write                     | The host       | The override applies until the page reloads                                                                  |

## Bounds

- A flag read is one lookup after its first evaluation in the session.
- A change at the source evaluates again the flags the page has read, not every declared flag.
- `host.ready()` waits at most `flagsTimeout`, 1,000 ms by default, for the flag source.

## Alternatives considered

### Evaluating every declared flag at start

**Why not:** a flag service that records an exposure on evaluation would record one for every
experiment of every installed plugin, and the comparison of variants would count people who never
saw them. The cost would also grow with the number of flags installed rather than read.

### Flags with numbers and objects

A flag whose value is any JSON value, as remote configuration.

**Why not:** an operator would type a value outside any schema, and a wrong value would fail at run
time. A value per deployment is configuration, checked at build (RFC-0011). A value a person chooses
is a setting, checked against its schema (RFC-0017).

### Every plugin reads OpenFeature itself

`useFeatureFlag` calls OpenFeature's React hooks.

**Why not:** every plugin would depend on an OpenFeature package. A product with another flag
service would need an OpenFeature provider for it. A `FlagSource` is three functions, and the
adapter serves a product that uses OpenFeature.

### Applying a change at the next navigation

A changed flag applies when the person next navigates, so an open page never changes under them.

**Why not:** a kill switch has to apply at once. A separate rule per kind of flag would let a
condition read a different value than the component beside it, so every change applies at once.

## Drawbacks

- A plugin's tests fail on a date, without a change to its code. The team removes the flag or moves
  the date in the contract.
- A release flag turned off while a person is on its page makes the page not found at once.
- An override in production shows a person an unreleased page in their own tab. The services still
  refuse what the person may not do, and overrides are off in a production build unless the product
  turns them on.
- A flag service that is slow to identify the session delays the first render by up to one second.

## Unresolved and future work

- A lint that reports a declared flag that no condition and no module reads.
- A link that sets overrides for a tester, signed by the product so nobody else can forge one.
- Flags evaluated in the services from the same catalogue, so a release flag also turns a new
  operation on or off on the server.

## References

| What                             | Where                                                             |
| -------------------------------- | ----------------------------------------------------------------- |
| Conditions and their context     | `docs/rfc/0010-plugin-contracts.md`                               |
| Access, and the access catalogue | `docs/rfc/0014-plugin-access.md`                                  |
| OpenFeature's web SDK            | https://openfeature.dev/docs/reference/technologies/client/web/   |
| OpenFeature's evaluation context | https://openfeature.dev/specification/sections/evaluation-context |
