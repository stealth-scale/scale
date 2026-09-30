---
rfc: 0016
title: "Plugin commands, events and notifications"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-09-30
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0016: Plugin commands, events and notifications

## Summary

A plugin acts through commands and announces facts through events. This RFC defines how the host
resolves, binds and runs a command, what the command palette lists, the API a command runs with, the
event bus and its policy, the events the host emits, and how a plugin raises a toast or opens a
dialog.

## Motivation

### The requirements

- A person runs a command from a key, from the palette, from a menu or from a button, and another
  plugin runs it by reference.
- A command's condition applies however the command is run, so a control rendered before a
  permission was revoked cannot run it.
- A plugin asks another plugin for a value, such as the people picked in the other plugin's dialog,
  without importing its code.
- A key press runs at most one command.
- One plugin announces a fact and another acts on it, without either importing the other's code.
- A toast and a dialog look and behave alike whichever plugin raises them.

### Why this layer

A command's label, keys and condition are data in the contract (RFC-0010), so the host binds keys,
lists the palette and disables controls before any command code loads. Its code is a lazy module in
the manifest, loaded on the first run. An event's payload is typed in the contract, so an emitter
and a subscriber agree on it without sharing code.

## Detailed design

### A command's lifecycle

1. The contract declares the command with its label key, its keys, its condition, its arguments and
   its result (RFC-0010).
2. The manifest maps it to a lazy module that exports one `CommandRun`.
3. The build validates its keys, reports a chord two commands bind, and writes the command into the
   resolved product (RFC-0011).
4. The host binds its keys, lists it in the palette, and returns its status to `useCommand`.
5. A key press, the palette, a component or another command runs it. The host checks the condition,
   imports the module once, and calls the function.

### Resolved commands

```ts
/**
 * Describes a command as the build resolved it.
 */
export interface ResolvedCommand {
  /**
   * Qualified id of the command.
   */
  readonly id: string;

  /**
   * Keys in TanStack Hotkeys notation, validated at build. Absent where the command binds none.
   */
  readonly keys?: string | undefined;

  /**
   * Key of the command's text in its plugin's catalogue.
   */
  readonly label: string;

  /**
   * Qualified ids of the commands the manifest's entry needs, by the name the function reads.
   */
  readonly needs: Readonly<Record<string, string>>;

  /**
   * Id of the plugin that declared the command.
   */
  readonly pluginId: string;

  /**
   * True where the command resolves with a result, so the palette does not list it.
   */
  readonly returnsResult: boolean;

  /**
   * True where the command takes arguments, so a key and the palette cannot run it.
   */
  readonly takesArguments: boolean;

  /**
   * Condition under which the command may run.
   */
  readonly when?: When | undefined;
}
```

### Reading a command

```ts
/**
 * Describes one command as a component reads it.
 */
export interface Command<R extends CommandReference = CommandReference> {
  /**
   * True where the command's condition is true now and its plugin is on.
   */
  readonly enabled: boolean;

  /**
   * Keys formatted for the person's operating system, `⌘ ⇧ R` or `Ctrl+Shift+R`.
   */
  readonly keys?: string | undefined;

  /**
   * The command's text, translated.
   */
  readonly label: string;

  /**
   * Runs the command with its arguments, and resolves with its result.
   *
   * @throws {@link Error} When the command's condition is false or no installed plugin declares it.
   */
  readonly run: (...args: CommandArguments<R>) => Promise<CommandResult<R>>;
}

/**
 * Reads a command by reference. Renders again when `enabled` changes.
 */
export function useCommand<R extends CommandReference>(reference: R): Command<R>;

/**
 * Reads every command of the installed plugins, in install order, for a menu or a toolbar that
 * lists them.
 */
export function useCommands(): readonly CommandStatus[];
```

- `enabled` is the command's condition evaluated against the host's stores and the router's matches
  (RFC-0014). It is false while the command's plugin is not on.
- A command no installed plugin declares reads as disabled with the label its reference contains.
  Its `run` rejects. A plugin may reference an optional plugin's command this way.

### Running a command

`run` does this, in order:

1. Finds the resolved command by the reference's id. It rejects with
   `No installed plugin declares the command time-off/approve.` where there is none.
2. Evaluates the command's condition against the stores and the matches at that moment. It rejects
   with `The command time-off/approve cannot run: its condition is false.` where the condition is
   false, so a menu rendered before a permission was revoked cannot run the command.
3. Imports the command's module on the first run and keeps the promise, keyed by the importer, so
   every later run reuses one import. The module exports one function.
4. Resolves the command's needs: each needed command becomes a function that runs it through the
   same `run`, with its own condition checked.
5. Calls the function with the arguments, the needs and a `HostApi` bound to the command's plugin,
   inside the `stealth:command:<command id>` performance measure (RFC-0012).
6. Resolves with the function's result, or rejects with its error.

A run that is in progress when its plugin turns off completes. The next run refuses.

```ts
/**
 * Lists what a command's function receives beside its arguments.
 */
export interface HostApi {
  /**
   * Resolves whether the person has a permission: on the resource where a resource id is given
   * for a scoped permission, and for the tenant otherwise (RFC-0014).
   */
  readonly can: (permission: PermissionReference, resourceId?: string) => Promise<boolean>;

  /**
   * Runs a declared query or mutation through the host's data client, with its declaration applied
   * (RFC-0020).
   */
  readonly data: {
    readonly mutate: <M extends MutationReference>(
      mutation: M,
      variables: MutationVariables<M>,
    ) => Promise<MutationData<M>>;
    readonly query: <Q extends QueryReference>(
      query: Q,
      variables: QueryVariables<Q>,
    ) => Promise<QueryData<Q>>;
  };

  /**
   * Emits an event as the command's plugin.
   */
  readonly emit: <E extends EventReference>(event: E, payload: EventPayload<E>) => void;

  /**
   * Reads a flag's value for the session (RFC-0015).
   */
  readonly flag: <V extends boolean | string>(flag: FlagReference<V>) => V;

  /**
   * Qualified id of the deepest matched route, or undefined outside a declared page.
   */
  readonly matched: string | undefined;

  /**
   * Navigates to a route by reference, with its parameters and its search.
   */
  readonly navigate: <R extends RouteReference>(
    to: R,
    options?: NavigateOptions<R>,
  ) => Promise<void>;

  /**
   * Id of the command's plugin.
   */
  readonly pluginId: string;

  /**
   * The session at the time of the run.
   */
  readonly session: Session;

  /**
   * Translates a key of the plugin's catalogue in the person's language.
   */
  readonly t: (key: string, values?: Readonly<Record<string, unknown>>) => string;

  /**
   * The host's toaster, to report the outcome of the run.
   */
  readonly toaster: Toaster;
}
```

- `navigate` resolves the reference through `routeHref` of `provider-router` and calls the router's
  `navigate`, so a command links by reference like a component does.
- `can` reads the host's `access` store, so a decision the page already primed costs no request.

A command module:

```ts
import { type CommandRun } from "@stealthscale/sdk-core";

export const approve: CommandRun<{ readonly requestId: string }, object> = async (
  { requestId },
  _needs,
  host,
) => {
  await approveRequest(requestId);
  host.emit(timeOffContract.events.approved, { requestId });
  host.toaster.create({ title: host.t("toasts.approved"), type: "success" });
};
```

### Commands with a result

A command that resolves with a result lets one plugin ask another for a value without importing its
code. The identity plugin declares a picker, and opens its own dialog when the picker runs:

```ts
export const identityContract = defineContract("identity", () => ({
  commands: {
    pickPerson: command({
      ...returns<readonly PersonRef[]>(),
      label: "commands.pickPerson",
    }),
  },
}));
```

The time-off plugin runs it by reference and receives the people picked:

```tsx
const pick = useCommand(identityContract.commands.pickPerson);

async function delegate(): Promise<void> {
  const people = await pick.run();

  await delegateApprovals(people);
}
```

- `run` resolves with the function's result, typed by the marker's `returns`.
- A command with a result binds no keys, and the palette does not list it, because a key press and
  the palette have no caller to hand the result to.
- A picker that the person closes without picking resolves with an empty list, as its result type
  states. It does not reject, so a rejection always means a fault.
- The command's condition applies as to any command, so a person who may not pick people cannot run
  the picker either.

### Keys

- The host renders one `CommandKeys` component inside the router. It groups the resolved commands by
  chord, normalised for the operating system, and registers each chord once with `useHotkey` of
  `provider-hotkeys`.
- A press runs the first command of the chord, in install order, whose `enabled` is true, and does
  nothing where none is. Commands with conditions that exclude each other may share a chord:
  `Mod+Enter` approves on a request page and saves on a settings page.
- One registration per chord is needed because `provider-hotkeys` runs every handler registered for
  a chord under its default `conflictBehavior: "warn"`, so two registrations of one chord would run
  both commands on one press (`@tanstack/hotkeys` 0.8.0, `src/manager.utils.ts:212-218`).
- The binding runs the command without arguments. A command that takes arguments or resolves with a
  result has no keys, which the contract's types enforce (RFC-0010).
- A chord with `Mod` runs while a text field has focus, and a single key or a `Shift` or `Alt` chord
  does not. These are the library's defaults for `ignoreInputs` (`@tanstack/hotkeys` 0.8.0,
  `src/manager.utils.ts:26-34`).
- The host binds `Mod+K` to open the palette. The build refuses a command that binds `Mod+K`.
- The build validates each binding with TanStack Hotkeys' `validateHotkey`, so a binding the library
  cannot read fails the build rather than never running.
- The build warns where more than one command binds a chord, listing the commands, so the product's
  author checks that their conditions exclude each other.
- A key press that runs a command whose function rejects is reported and shown as a toast, because a
  key press has no caller to receive the rejection.

### The palette

The host renders the palette in the `overlay` region (RFC-0013): `Command.Root` of
`component-modals` in a `Dialog` with the `plain` variant, which the modals package documents for a
command palette.

- `Mod+K` opens it. `Command.Root` keeps no open state, so the host's `onRun` closes the dialog
  through its `open` and `onOpenChange`.
- It lists every command that takes no arguments, resolves with no result and whose `enabled` is
  true, as one `CommandAction` each (`components/modals/src/command/action.ts:10-46`):

  | `CommandAction` member | Value                                                            |
  | ---------------------- | ---------------------------------------------------------------- |
  | `value`                | The command's qualified id                                       |
  | `label`                | The command's translated text                                    |
  | `group`                | The plugin's name, from `plugin.name` in its catalogue           |
  | `keywords`             | The translation of `<label>.keywords` where the catalogue has it |
  | `shortcut`             | `formatForDisplay` of the command's keys: `⌘ ⇧ R` on a Mac       |

- `Command.Root` takes `aria-label` from the host's catalogue, and matches a query against `label`
  and `keywords`, ignoring case and accents. Groups keep the order of their first command, which is
  install order.
- `onRun(value)` runs the command by its id and closes the dialog. A rejection is reported and shown
  as a toast.
- The palette lists menu entries under a `Go to` group as well, one per entry of the `main` menu
  whose route's condition is true, so every page a person may open is one search away.

### Events

The bus is one `EventTarget` under a policy:

```ts
/**
 * Subscribes the component to an event for as long as it is mounted, as its plugin.
 */
export function useEvent<E extends EventReference>(
  event: E,
  handler: (payload: EventPayload<E>) => void,
): void;

/**
 * Returns a function that emits an event as the component's plugin.
 */
export function useEmit<E extends EventReference>(event: E): (payload: EventPayload<E>) => void;
```

| Rule                  | Behaviour                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Declared events only  | An emit of an event no installed plugin declares throws `No installed plugin declares the event …`  |
| Who may emit          | The declaring plugin alone, unless the marker states `emit: "anyone"`. Another plugin's emit throws |
| Delivery              | Synchronous, to every subscriber, in subscription order                                             |
| Emits during delivery | Queued, and delivered after the current delivery                                                    |
| Chains                | A delivery may queue 16 emits. The 17th is dropped and reported under the emitting plugin           |
| Sticky events         | The last payload is kept and handed to each new subscriber when it subscribes                       |
| Failures              | A handler that throws is reported under its plugin, and the other handlers still receive the event  |
| Disposal              | A subscription ends when its component unmounts                                                     |

- `useEvent` subscribes once per event and calls the handler through React's `useEffectEvent`, so a
  handler that closes over new state is always the current one and never resubscribes.
- A plugin that is not on has its components unmounted, so its subscriptions have ended. Its events
  remain declared, so another plugin that emits an `anyone` event of that plugin succeeds and nobody
  receives it.
- The chain limit stops two plugins from emitting in reply to each other forever. A delivery that
  queues more than 16 emits is cut, and the cut is reported.
- A sticky event gives a late subscriber the current value of a fact, such as the project a switcher
  selected, so a plugin reads another plugin's state without importing its code.

#### The host's events

| Event                 | Payload                     | Emitted                                                                                            | Sticky |
| --------------------- | --------------------------- | -------------------------------------------------------------------------------------------------- | ------ |
| `host/navigated`      | `{ href, matched }`         | After the router resolves a navigation                                                             | No     |
| `host/sessionChanged` | `Session`                   | At start, and after the session changes (RFC-0014)                                                 | Yes    |
| `host/pluginChanged`  | `{ on, pluginId, reason? }` | After a plugin turns on or off: a switch, a kill switch, its condition or a requirement (RFC-0012) | No     |
| `host/recordsChanged` | `{ changes }`               | After a batch of changes to records, from a mutation or the changes stream (RFC-0020)              | No     |

### Toasts

- The host creates one toaster with `Toast.createToaster` of `component-feedback` and renders its
  `Toast.Region` in the `overlay` region.
- `useToaster()` returns it to a plugin's component, and `HostApi.toaster` returns it to a command,
  so every toast of the product stacks in one region.
- A command that rejects when a key or the palette runs it raises an error toast with the command's
  translated label, from the host's own catalogue: `Could not run "Approve request".`

### Dialogs

A plugin opens a dialog from code with `createOverlay` of `component-modals`, which returns an
`open` that resolves with the value the dialog closes with, and a `Viewport` that renders the open
dialogs (`components/modals/src/overlay/overlay.tsx:77-105`).

- The plugin renders the viewport through an extension in the `overlay` region:
  `extension({ position: "after", target: hostContract.slots.overlay })`, whose component renders
  `Viewport`.
- A command calls `open` from its function. The command module and the extension's component are in
  the plugin's one chunk (RFC-0011), so they share the overlay's store.
- The overlay region renders inside the router and inside the host's providers, so a dialog reads
  the session, the flags and the catalogues.

## Failure handling

| Failure                                                     | Detected by   | Outcome                                                                      |
| ----------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------- |
| A binding TanStack Hotkeys cannot read                      | The build     | The build fails, naming the command and the reason `validateHotkey` returned |
| More than one command binds a chord                         | The build     | A warning listing the commands. A press runs the first enabled one           |
| A command binds `Mod+K`                                     | The build     | The build fails                                                              |
| `run` for a command no installed plugin declares            | The registry  | The promise rejects                                                          |
| `run` while the command's condition is false                | The registry  | The promise rejects with the command's id                                    |
| The command's module fails to load                          | The registry  | The promise rejects. The next run imports again                              |
| The command's module exports no function or more than one   | The registry  | The promise rejects. `checks()` fails the same module (RFC-0019)             |
| The function rejects when run from a key or the palette     | The host      | An error toast, and a report under the plugin                                |
| The function rejects when run from a component              | The component | The promise the component awaited rejects                                    |
| An emit of an undeclared event, or by a plugin that may not | The bus       | `emit` throws                                                                |
| A handler throws                                            | The bus       | A report under the subscriber. The other handlers still receive the event    |
| A delivery queues more than 16 emits                        | The bus       | The emit is dropped and reported under the emitting plugin                   |

## Bounds

- A command's module is imported once per page load. A module that failed to load is imported again
  on the next run.
- A delivery queues at most 16 emits.
- The palette lists the commands and the menu entries of the installed plugins. It filters them with
  `Command`'s own matching, which ignores case and accents.

## Alternatives considered

### A command as a function a plugin exports

Another plugin imports the function and calls it.

**Why not:** the caller would import the other plugin's code. Nothing would check the condition. A
command by reference runs through the registry, which checks the condition and loads the code on the
first run.

### A request and a reply as two events

The asking plugin emits a request event with a correlation id. The plugin that replies emits a reply
event with the same id.

**Why not:** every caller would write the correlation, the timeout and the cleanup, and the reply's
type would not be tied to the request's. A command with a result is one typed call, with its
condition checked and its code loaded on the first run.

### Events through React context

Each plugin provides a context, and a subscriber reads it.

**Why not:** a subscriber would have to render inside the emitter's provider, and a plugin in
another region of the frame renders outside it. The bus delivers to every plugin wherever it
renders.

### A toaster per plugin

**Why not:** two regions would stack toasts in two places, and a person would read two stacks. One
region orders every toast of the product.

## Drawbacks

- A command that takes arguments cannot run from a key or the palette, so an action on the selected
  item needs a component that knows the selection.
- An event is delivered synchronously. A handler that does slow work blocks the emitter until it
  returns, so a handler starts its own asynchronous work and returns.
- The palette lists commands that are enabled now. A person looking for a command they may not run
  does not find it, and learns nothing about why.
- `AppShell`'s panel `shortcut` and `Sidebar.Search`'s `shortcut` listen on the document themselves
  (`components/screen/src/app-shell/keys.ts:42-80`,
  `components/screen/src/sidebar/shortcut.ts:36-58`), outside `provider-hotkeys`. The build cannot
  see those chords, so a command that binds one of them runs beside the panel's toggle.

## Unresolved and future work

- A command that runs on the selected item from a key, through a selection a page publishes.
- Undo for a command.

## References

| What                       | Where                                            |
| -------------------------- | ------------------------------------------------ |
| The palette's actions      | `components/modals/src/command/action.ts`        |
| Opening a dialog from code | `components/modals/src/overlay/overlay.tsx`      |
| Toasts                     | `components/feedback/src/toast`                  |
| TanStack Hotkeys           | https://tanstack.com/hotkeys/latest              |
| `useEffectEvent`           | https://react.dev/reference/react/useEffectEvent |
