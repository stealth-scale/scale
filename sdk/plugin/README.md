# @stealthscale/sdk-plugin

`@stealthscale/sdk-plugin` is the package a plugin's components import. It renders the slots plugins
contribute to, and its hooks read the host's state: the session, access, flags, commands, events,
settings and data.

A plugin's components never import the host, so they render the same under a product's host and
under a test's.

## Install

```bash
pnpm add @stealthscale/sdk-plugin
```

## The host

The host provides a `HostRuntime` through `HostContext`. Every hook throws outside a host and names
itself:

```text
useSlot() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.
```

| Member     | Contains                                                             |
| ---------- | -------------------------------------------------------------------- |
| `product`  | The resolved product, with each installed plugin's manifest          |
| `stores`   | The stores the hooks read, each a `Store` with `get` and `subscribe` |
| `run`      | Runs a command by its qualified id and resolves with its result      |
| `events`   | The event bus, which checks who may emit each event                  |
| `toaster`  | The product's toaster                                                |
| `report`   | Records a `HostReport` entry                                         |
| `settings` | The `SettingStore` a person's choices are kept in                    |

## The plugin's scope

The host renders each page of a plugin, and `Slot` renders each extension, inside `PluginProvider`
with the plugin's id. A hook that acts as a plugin reads the id there.

| Export                 | Returns                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `usePlugin()`          | `{ pluginId }` of the calling component. Throws outside every plugin |
| `useConfig(schema)`    | The product's configuration over the schema's defaults               |
| `useResolvedProduct()` | The resolved product, without the manifests' code                    |
| `useToaster()`         | The product's toaster                                                |
| `useHostActions()`     | `retry(target)`, which lifts a quarantine                            |

Pass `useConfig` your plugin's own schema. It throws for another plugin's.

## Session and access

| Hook                                | Returns                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `useSession()`                      | The session                                                                |
| `usePermission(permission)`         | True where the session has the permission, for the tenant or on one record |
| `useEntitlement(entitlement)`       | True where the tenant is licensed for the entitlement                      |
| `useAccess(permission, resourceId)` | `allowed`, `denied` or `pending` for one resource                          |
| `useAccessActions()`                | `prime(decisions)` and `forget(resource?)`                                 |

- `useAccess` takes a permission scoped to a resource kind. For a pending decision it requests a
  check after the render commits, and the host sends every check of one task in one call.
- `useAccess` returns `denied` for a permission outside every installed contract.
- `decisionKey(check)` returns the key the host keeps a decision under.

## Flags

```tsx
const calendar = useFeatureFlag(timeOffContract.featureFlags.calendar);
const layout = useFeatureFlag(timeOffContract.featureFlags.layout);
```

- `useFeatureFlag` returns a release or ops flag's boolean, or the variant an experiment serves.
- For a flag outside every installed contract, `useFeatureFlag` returns the reference's default, or
  false where the reference states none.
- `useFlagActions()` returns `override(flag, value?)` and `overrides`. An override applies to this
  tab, and an override without a value is removed.
- `useFlagStatuses()` returns one `FlagStatus` per declared flag. It reads the flags the page read
  and evaluates no other.

## Conditions

`useWhen(when?)` returns true where a condition is true for the session, the flags, the plugins that
are on and the matched routes. Check `{ plugin }` before you read an optional plugin's query.

`conditionContextOf(stores, place?)` builds the context a host's evaluator reads. It reads a flag
only when a condition checks it.

## Commands

```tsx
const request = useCommand(timeOffContract.commands.request);

return (
  <Button disabled={!request.enabled} onClick={() => void request.run()}>
    {request.label}
  </Button>
);
```

- `useCommand(reference)` returns `enabled`, `keys` formatted for the operating system, the
  translated `label`, and `run`, typed by the reference's arguments and result.
- `useCommand` disables a command outside every installed contract and translates the reference's
  own label.
- `useCommands()` lists every command of the installed plugins, in install order.
- `isCommandEnabled(command, stores, matched)` returns true where the command's plugin is on and its
  condition is true.

## Events

- `useEvent(event, handler)` subscribes for as long as the component is mounted. The bus calls the
  handler of the latest render.
- `useEmit(event)` returns a function that emits the event. It throws where no installed plugin
  declares the event, or where the component's plugin may not emit it.
- Both act as the component's plugin, and as the product outside every plugin's scope.

## Menus and titles

- `useNavigation(menu?)` lists the entries of a menu the person may open, the host's main menu where
  you name none. Each entry has `href`, `label` and `routeId`. Ranked entries come first, by
  `order`, then the rest by label.
- `useDocumentTitle(title)` titles the document `<title> · <product name>` from the deepest matched
  page, and restores the product's name when the page unmounts.

## Slots

```tsx
<Slot match={item.type} props={{ record: item }} slot={feedContract.slots.item}>
  <FeedItemFallback item={item} />
</Slot>
```

- `match` is required on a keyed slot and refused on any other.
- `props` is required where the slot's props have a required member, optional where every member is
  optional, and refused where the slot declares none.

A slot renders, in order:

1. Its `before` extensions.
2. The last `replace` extension, or its own children where none applies.
3. Its `after` extensions.
4. What the pages on screen contribute with `Into`, by `order`.

- `wrap` extensions nest around the result, the first in order outermost. The wrappers of every slot
  wrap the whole slot, outermost.
- Every extension renders with the slot's props and the slot's id as `targetId`, in its plugin's
  scope, in a `Suspense` boundary of its own, and inside an error boundary that renders the
  manifest's fallback after a render throws.
- An extension attached to another renders before, after, around or in place of it, with that
  extension's id as `targetId`. The wrappers of every extension wrap each extension a slot renders.
- A keyed slot keeps the extensions whose `match` equals its own. A slot of arity one renders the
  first extension, and the host reports each of the others as `slot-full`.

`Into` contributes its children to a slot for as long as it is mounted, and returns `null` where it
is mounted:

```tsx
<Into order={10} slot={hostContract.slots.toolbar}>
  <Button onClick={exportRequests}>{t("export")}</Button>
</Into>
```

- The contribution keeps its place while its content changes.
- The content renders inside the slot, in the plugin scope `Into` renders in.

`useSlot(slot, match?)` returns what a slot contains for the current page: `rendered`, `dropped`,
`contributions` and `filled`. Leave out a frame's region while `filled` is false. The hook reads no
record, so a `field` condition is false there.

`useExtensionStatuses()` returns one `ExtensionStatus` per extension. A status states whether a
mounted slot renders the extension, with the reason where none does.

| Reason        | The extension                                                        |
| ------------- | -------------------------------------------------------------------- |
| `off`         | Belongs to a plugin that is not on. `pluginReason` states why        |
| `quarantined` | Failed too many renders in a row                                     |
| `condition`   | Has a condition that is false                                        |
| `match`       | Renders for another value of its keyed slot                          |
| `full`        | Targets a slot of arity one in which another came first              |
| `replaced`    | Replaces the content where a later `replace` renders                 |
| `moved`       | Was disabled by the product, or taken out of its slot by a placement |
| `unmounted`   | Targets a slot or a page that is not on screen                       |

## Settings and placements

```tsx
const { reset, update, values } = useSettings(timeOffContract.settings.sections.reminders);

update({ days: 3 });
```

- `values` are the stored values over the schema's defaults. The hook renders again when they change
  in this tab or another.
- `update(change)` checks the change against the schema and writes it over the stored values.
  `reset()` removes the stored value.
- Both throw where your plugin's code writes another plugin's section. `update` also throws for a
  value the schema refuses and for a section outside every installed contract.
- A stored value of an earlier version runs through the manifest's migrations. The hook reports each
  part of a stored value it drops as `setting-dropped`, and returns the defaults in its place.

`usePlacements()` returns the person's placements by slot, with `update(change)` and `reset()`, for
a plugin that offers a layout editor.

## Data

```tsx
const request = useData(timeOffContract.queries.request, { id });
const approve = useChange(timeOffContract.mutations.approve, { scope: id });

return <Button onClick={() => approve.mutate({ requestId: id })}>{t("approve")}</Button>;
```

- `useData(query, variables)` suspends until the data arrives and renders again when it changes. It
  reads the cache entry the page's loader filled.
- `useChange(mutation, options?)` returns `mutate`, `mutateAsync` and the mutation's state. Once a
  run settles, the data client refetches the records its declared changes name.
- `optimistic` returns the patches to apply at once. `scope` runs the mutations of one scope one at
  a time.
- Both throw for a query or a mutation outside every installed contract.

## Status

| Hook                  | Returns                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `usePluginStatuses()` | One `PluginStatus` per installed plugin: on or the reason, quarantined targets, switchable, version |
| `useHostReports()`    | The build's `warnings` and the host's last runtime `entries`                                        |

| Report kind                                       | Reported when                                               |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `render-failed`                                   | A page, an extension or the host's own frame throws         |
| `quarantined`                                     | A target failed too many renders in a row                   |
| `command-failed`, `event-handler-failed`          | A command or an event handler throws                        |
| `event-chain-cut`                                 | An emit would start a 17th delivery inside the ones running |
| `flag-exposed`                                    | A session reads an experiment for the first time            |
| `flag-ignored`                                    | A flag's source states a value of the wrong type            |
| `setting-dropped`                                 | A stored setting, switch or placement fails its check       |
| `slot-full`, `unplaced`                           | An extension finds no place                                 |
| `access-failed`, `flags-failed`, `session-failed` | A source of the host fails                                  |
