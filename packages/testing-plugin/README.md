# @stealthscale/testing-plugin

`@stealthscale/testing-plugin` renders a plugin's components under the host a product runs, in a
specification. A case states the session, the decisions, the flags and the data it needs, and
changes them after the render the way a product's sources change them. The package also derives the
cases every plugin and every product runs from what they declare.

## Install

```bash
pnpm add -D @stealthscale/testing-plugin
```

The package peers on `@stealthscale/sdk-host`, `@stealthscale/sdk-plugin`,
`@stealthscale/provider-data`, `@stealthscale/provider-form`, `@stealthscale/provider-router`,
`@stealthscale/settings`, `@stealthscale/testing-react`, `@testing-library/react`, `react`,
`react-i18next` and `vitest`. Install them, and the packages `sdk-host` peers on.

## Usage

```tsx
import { act, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { renderPlugin } from "@stealthscale/testing-plugin";

import { notesContract } from "@acme/plugin-notes-contract";

import { EditButton } from "#edit-button.tsx";
import { manifest } from "#manifest.ts";

it("disables editing when the access source denies it", async () => {
  const view = await renderPlugin(<EditButton noteId="n1" />, {
    contract: notesContract,
    manifest,
  });

  await act(async () => {
    view.access.deny();
  });

  const button = within(view.container).getByRole("button", { name: "Edit" });

  expect(button.getAttribute("aria-disabled")).toBe("true");
});
```

`renderPlugin` takes four steps:

1. It resolves a product that installs the plugin and the plugins beside it.
2. It creates the product's host over the sources the options state.
3. It opens a memory router at the route, and loads the route.
4. It renders the frame, then the element in the plugin's scope inside a `Suspense` boundary.

The router loads before the render, so the function returns a promise.

## Options

| Option       | Type                                          | Default                                                       |
| ------------ | --------------------------------------------- | ------------------------------------------------------------- |
| `contract`   | `AnyContract`                                 | Required. The plugin the element belongs to                   |
| `manifest`   | `PluginManifest`                              | The plugin installed from its contract alone                  |
| `beside`     | `readonly AnyContract[]`                      | None. Other plugins, each installed from its contract alone   |
| `config`     | The plugin's configuration                    | The schema's defaults                                         |
| `route`      | `{ to; params?; search? }`                    | The router opens at `/`                                       |
| `session`    | `Session`                                     | Signed in with every permission and entitlement declared      |
| `access`     | `(check: AccessCheck) => boolean`             | Every check on one resource allowed                           |
| `flags`      | `Readonly<Record<string, boolean \| string>>` | Every boolean flag on, every experiment at its default        |
| `switches`   | `Readonly<Record<string, boolean>>`           | Every plugin on                                               |
| `settings`   | Values per settings section, by section id    | The schemas' defaults                                         |
| `placements` | `Readonly<Record<string, SlotPlacement>>`     | None                                                          |
| `samples`    | `Readonly<Record<string, Sample>>`            | The contracts' samples. A refusal rejects the operation's run |
| `frame`      | `ComponentType`                               | A frame that renders every region of the host                 |

- A plugin installed from its contract alone renders a placeholder page for each route. The page
  names the route and renders the plugin's slots with their sample props.
- `route` fills the route's parameters from `params`, or from the route's sample where `params` is
  absent.
- `switches` and `settings` are written into the setting store under the session's subject before
  the host starts.

## The result

`renderPlugin` resolves with Testing Library's render result, without `rerender`, and these members:

| Member    | What a case does with it                                                        |
| --------- | ------------------------------------------------------------------------------- |
| `host`    | Reads the host's stores, and overrides a flag with `host.stores.flags.override` |
| `router`  | Navigates, and reads the location                                               |
| `session` | Replaces the session with `session.set`                                         |
| `access`  | Switches every decision with `allow`, `deny`, `pending` or `decide`             |
| `store`   | Reads and writes the person's switches, settings and placements                 |

`unmount` unmounts the render and disposes the host.

## Hooks

`renderPluginHook(hook, options)` calls the hook in a component under the same host, and returns
what the hook returned at its last render as `result.current`.

```ts
const view = await renderPluginHook(() => useSession().authenticated, { contract: notesContract });

expect(view.result.current).toBe(true);
```

## The checks of a plugin

`checks(contract, manifest, options)` derives the cases every plugin runs from its contract and its
manifest. It builds the list and runs nothing. A plugin's web package runs the list in one spec:

```ts
import { describe, it } from "vitest";

import { checks } from "@stealthscale/testing-plugin";

import { identityContract } from "@acme/plugin-identity-contract";
import { timeOffContract } from "@acme/plugin-time-off-contract";

import { manifest } from "#manifest.ts";
import theme from "#theme.ts";

describe("time-off", () => {
  it.each(checks(timeOffContract, manifest, { beside: [identityContract], theme }))(
    "checks that $name",
    async ({ run }) => {
      await run();
    },
  );
});
```

| Option   | Where left out              | States                                                                                    |
| -------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| `beside` | No other plugin             | The plugins the plugin targets or needs, each installed beside it from its contract alone |
| `theme`  | The recipe case is left out | The plugin's `./theme` preset                                                             |

| Case, after "checks that"                                      | One per                                 | Fails where                                                                       |
| -------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| the manifest has code for every declared name                  | Plugin                                  | A declared name has no code, or code is mapped to a name the contract lacks       |
| requirement `<plugin>` `<range>` admits the installed contract | Requirement                             | The plugin is not installed beside it, or its version is outside the range        |
| route `<id>` imports one component                             | Route                                   | The manifest maps no code, or the module exports other than one function          |
| extension `<id>` imports one component                         | Extension                               | As the route's import case                                                        |
| command `<id>` imports one function                            | Command                                 | As the route's import case                                                        |
| `<kind>` `<id>`'s condition is not constant                    | Route, extension or command with `when` | The condition never changes value, or its atoms make more than 65,536 contexts    |
| route `<id>` renders at its sample                             | Route                                   | A match ends its load other than in success, a render fails, or axe finds a fault |
| route `<id>`'s fallback renders at its sample                  | Route with a fallback                   | As the route's render case, with the fallback as the page                         |
| extension `<id>` renders with its target's props               | Extension                               | The render throws or never commits, or axe finds a fault                          |
| extension `<id>`'s fallback renders with its target's props    | Extension with a fallback               | As the extension's render case                                                    |
| command `<id>` runs with its sample                            | Command                                 | The run through the host's command registry rejects                               |
| slot `<id>` is mounted by the plugin                           | Slot                                    | No render of the plugin's routes and extensions mounts the slot                   |
| settings section `<id>` renders with its defaults              | Settings section                        | The settings page fails as a route's render case fails                            |
| settings section `<id>`'s defaults pass its schema             | Settings section with a schema          | The form engine of `provider-form` reports an issue                               |
| flag `<id>` is not past its date                               | Flag with `expires`                     | Today is later than the date                                                      |
| every key the contract names is in the fallback catalogue      | Plugin                                  | The build's words check reports a key the plugin's catalogue lacks                |
| `plugin.name` is in the fallback catalogue                     | Plugin                                  | The plugin's catalogue lacks the key                                              |
| `plugin.description` is in the fallback catalogue              | Plugin                                  | The plugin's catalogue lacks the key                                              |
| every recipe starts with the plugin id                         | Plugin, with `theme`                    | A recipe's class name does not start with `<pluginId>-`                           |
| query `<id>` finds records in its sample                       | Query with selectors                    | A record or decision selector finds no record in the query's sample               |
| mutation `<id>`'s changes name variables its sample states     | Mutation whose changes name a variable  | The variable's value in the sample is neither a string nor a number               |

- A render case creates its own product, host and router, and disposes the host whatever the result.
  The product installs the plugin from its manifest and each contract in `beside` from its contract
  alone.
- A route and a command render under the first context that makes their condition true. The search
  starts from the standalone session: signed in, every declared permission and entitlement, every
  boolean flag on and every plugin on.
- A condition case evaluates the condition in every context its atoms make, up to 65,536. A boolean
  atom takes true and false: signed in, a permission, an entitlement, a boolean flag, a plugin and a
  matched route. An experiment takes each variant the condition names and one it names none of.
- An extension renders with its target's sample props, the target's id, and `children` where it
  wraps.
- The slot cases share one render of every route and extension, which the first slot case starts.
- The words cases read the catalogues that the package's i18n layers load into the specification's
  instance before it runs.

## The checks of a product

`productChecks(definition, { frame })` derives the cases of a product from its definition and its
frame, the component its root route renders. A product's spec runs them as a plugin's spec runs
`checks()`:

```ts
import { describe, it } from "vitest";

import { productChecks } from "@stealthscale/testing-plugin";

import { Frame } from "#frame.tsx";
import definition from "#product.ts";

describe("office", () => {
  it.each(productChecks(definition, { frame: Frame }))("checks that $name", async ({ run }) => {
    await run();
  });
});
```

| Case, after "checks that"                       | One per            | Fails where                                                            |
| ----------------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| the product resolves                            | Product            | `resolveProduct` reports a problem                                     |
| route `<id>` renders in the frame at its sample | Plugin route       | As a plugin's route render case, inside the product's frame            |
| required extension `<id>` is placed             | Required extension | No render of a route places the extension in an instance of its target |
| the frame mounts the content slot               | Product            | The frame renders no `HostContent`, so no page renders in it           |

- A case resolves the definition when it runs, without the build and without catalogues.
- A route renders with its plugin on, under the first context that makes the route's condition and
  its installation's condition true.
- An extension counts as placed where an instance renders it, or drops it for its own condition or
  for a key it does not match.
- The required-extension cases share one render of every plugin route, which the first of them
  starts. The content case renders the frame at `/` on its own.

## Licence

MIT. See [LICENSE](LICENSE).
