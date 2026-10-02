---
rfc: 0018
title: "A plugin's words and styles"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0018: A plugin's words and styles

## Summary

A plugin's words are translated like every package's in this repository, and its styles compile into
the product's stylesheet like every component's. This RFC defines where a plugin keeps its
catalogues, how the build finds and checks them, how a contract's labels and descriptions and a
component's text are translated, how the host keeps one namespace per plugin, and how a plugin's
recipes compile, extend under every theme and keep unique class names.

## Motivation

### The requirements

- Every word a plugin shows is translated: its menu entries, its commands, its settings, its pages,
  and the descriptions an access service and a flag service show.
- A missing translation fails a test or the build before the product is deployed.
- A component that calls `t` with a key its namespace lacks fails to compile.
- One plugin cannot change another package's words.
- A plugin looks like the rest of the product under every theme, and its class names cannot collide
  with another package's.

### Why this layer

This repository translates every word through `vite-plugin-i18n` and `provider-i18n`, and styles
every element through a recipe (ADR-0009):

- `vite-plugin-i18n` finds each package's catalogues on the application's dependency graph, merges
  them per language and namespace, writes a declaration of every key, and fails a build on a key the
  fallback language lacks (`packages/vite-plugin-i18n/src/find.ts`, `src/typegen.ts`,
  `src/check.ts`).
- `vite-plugin-theme` compiles the recipes of every package on the graph that publishes `./theme`,
  so every theme extends them (`packages/vite-plugin-theme/README.md:97-100`).

A plugin is a package on the product's graph, so both work for a plugin without new machinery. This
RFC states the rules a plugin follows so that they do.

## Detailed design

### Catalogues

| File                                  | Package          | Contains                                                                        |
| ------------------------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `locales/<language>/<pluginId>.json`  | Contract package | Every word of the plugin: its labels, its descriptions and its components' text |
| `locales/<language>/<productId>.json` | Product          | The product's own words: its name, its frame's text                             |
| `locales/<language>/host.json`        | `sdk-host`       | The host's words: the not-found page, the Plugins page, the palette             |

- The catalogue is in the contract package, because the contract's labels are keys into it and the
  contract package is on the graph of every product that installs the plugin.
- The namespace is the plugin's id. A file under a subdirectory nests its keys under the rest of its
  path: `locales/en/time-off/settings.json` contributes `settings.*` to `time-off`
  (`packages/vite-plugin-i18n/src/find.ts:76-97`).
- A catalogue may be JSON or YAML, and its leaves are strings
  (`packages/vite-plugin-i18n/src/emit.ts:116-141`).

Every plugin's catalogue defines two keys the host reads:

| Key                  | Shown                                                     |
| -------------------- | --------------------------------------------------------- |
| `plugin.name`        | The Plugins page, the palette's group, the not-found page |
| `plugin.description` | The Plugins page, under the plugin's switch               |

### The keys a contract names

| Declaration      | Keys                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Route            | `navigation.label`                                                                                   |
| Command          | `label`, and `<label>.keywords` where the palette should match other words (RFC-0016)                |
| Flag             | `description`                                                                                        |
| Permission       | `description`                                                                                        |
| Resource kind    | `description`                                                                                        |
| Role             | `description`                                                                                        |
| Entitlement      | `description`                                                                                        |
| Configuration    | Each property's `description`                                                                        |
| Settings page    | `label`                                                                                              |
| Settings section | `label`, and the form's identifiers `settings.<section>.fields.<path>.label` and the rest (RFC-0017) |

- The host translates a label with the plugin's namespace: `i18n.t(label, { ns: pluginId })`.
- The build translates every description of the access and flag declarations in every language the
  plugin's catalogues contain, and writes the translations into the catalogues for the services
  (RFC-0011). A role editor and a flag service then show a description in the language of the person
  who reads it. A language whose catalogue lacks the key is left out of that description.

### Translating in a component and a command

A component reads its plugin's words with `useTranslation` of `provider-i18n`, named by the
contract's plugin id:

```tsx
const { t } = useTranslation(timeOffContract.pluginId);

return <Page.Title>{t("request.title", { id })}</Page.Title>;
```

- `provider-i18n` sets `defaultNS: false`, so every call states its namespace
  (`foundations/providers/i18n/src/resources.ts:24-28`). The contract's `pluginId` is a literal
  type, so the call is typed by the plugin's catalogue.
- `vite-plugin-i18n` writes `src/i18n.gen.d.ts` in each package it runs in. The file augments
  `Resources` of `provider-i18n` with every namespace on the package's graph, each key typed by its
  fallback string (`packages/vite-plugin-i18n/src/typegen.ts:34-61`). The web package depends on its
  contract package, so its components are typed by the plugin's own catalogue.
- A command translates through `HostApi.t`, which is bound to its plugin's namespace (RFC-0016).
- The SDK does not add a translation hook of its own. `useTranslation` already types a namespace,
  and a second hook would be a second way to do one thing.

### Checks

| Fault                                                         | Detected by           | Result                                   |
| ------------------------------------------------------------- | --------------------- | ---------------------------------------- |
| A label or description key the fallback catalogue lacks       | `checks()`, the build | The test fails. The build fails          |
| `plugin.name` or `plugin.description` missing                 | `checks()`, the build | The test fails. The build fails          |
| An installed plugin has no catalogue in the fallback language | The build             | The build fails, naming the scope to add |
| Another package publishes a plugin's namespace                | The build             | The build fails, naming each publisher   |
| A translation key the fallback language lacks                 | `vite-plugin-i18n`    | The build fails                          |
| A translation that drops a placeholder                        | `vite-plugin-i18n`    | The build fails                          |
| A component calls `t` with a key its namespace lacks          | The type checker      | Fails to compile                         |

`vite-plugin-i18n` reports the two translation faults itself
(`packages/vite-plugin-i18n/src/check.ts:225-257`), and its generated declaration lets the type
checker report the last. A contract's labels are data, so the type checker does not check them
(RFC-0010). `checks()` and the build check each against the fallback catalogue.

### One namespace per plugin

`vite-plugin-i18n` merges two packages' catalogues of one namespace in the order it walks them, and
the later package's words replace the earlier's key by key without a report
(`packages/vite-plugin-i18n/src/find.ts:151-159`, `src/check.ts:202-206`). A plugin whose id matched
a component package's namespace would change that package's words.

- The product build lists the catalogues through the `api` of the `stealth:i18n` plugin, which
  returns each catalogue's namespace, the package that contains it, and whether the application
  contains it (`packages/vite-plugin-i18n/src/plugin.ts:52-81`).
- It refuses a product where a plugin's namespace is contained in a package other than the plugin's
  contract package, and where two installed plugins share an id (RFC-0011).
- The application's own catalogues may contain any namespace, because an application may change the
  words of any package it installs.

### Finding a plugin's catalogues

`vite-plugin-i18n` follows only the packages in its `scopes` option, which defaults to the scope of
the application's own package (`packages/vite-plugin-i18n/src/find.ts:151-159, 204-219`). A product
`@acme/people` finds the catalogues of `@acme/plugin-time-off-contract` without configuration. A
product that installs a plugin from another scope lists that scope:

```ts
export default defineConfig({
  extends: [...i18n.layers({ scopes: ["@acme", "@partner"] }), ...product.layers()],
});
```

The product build refuses an installed plugin whose namespace has no catalogue in the fallback
language. Where the plugin's contract package has catalogues the i18n layer did not find, a line
after the problems states the scope to add. The layer follows scoped packages alone, and the line
for a contract package without a scope states that.

### Loading

- The fallback language is part of the entry chunk. Another language's namespace is imported the
  first time a component reads it, and that component suspends until it arrives
  (`packages/vite-plugin-i18n/src/emit.ts:207-220`).
- A plugin's namespace in another language loads when the first component of the plugin renders in
  that language: one request per plugin and language. `eager` on the i18n layer inlines every
  language and removes those requests.
- A menu and the palette call `useTranslation` with the namespaces of every plugin they list, which
  suspends until each namespace has loaded, so a menu never shows a raw key. In a language other
  than the fallback, opening the palette costs one request per plugin whose namespace has not loaded
  yet.

### Styles

- A plugin's web package publishes `./theme`, a preset of its recipes, like a component package.
  `vite-plugin-theme` compiles the recipes of every package on the application's graph that
  publishes `./theme` and names the system package as a dependency or a peer, so the product's
  stylesheet contains them and every theme's recipe extensions apply to them
  (`packages/vite-plugin-theme/README.md:89-100`).
- A plugin renders with the component packages first, and writes a recipe only for what no component
  renders, following RFC-0004.
- Every recipe name a plugin registers starts with its plugin id: `time-off-balance`. The compiler
  refuses two recipes whose classes rename to one class, with the diagnostic `naming/collision`
  (`packages/pandacss-compiler/src/selectors.ts:245-253`), so a plugin prefix keeps one plugin's
  recipe from failing another's build. `checks()` imports the plugin's preset and fails a recipe
  without the prefix (RFC-0019).
- A plugin never publishes a theme. The product chooses the themes it offers through `Shell`.
- The product compiles only the variants its graph uses, which includes every plugin in the first
  slice. The second slice needs a stylesheet with every variant, because a host cannot read a
  remote's source (RFC-0009).

## Failure handling

| Failure                                                 | Detected by           | Outcome                                                                        |
| ------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| A catalogue lacks a key a contract names                | `checks()`, the build | The test fails, and the build fails naming the plugin and the key              |
| A plugin's catalogue is outside the i18n layer's scopes | The build             | The build fails, naming the scope                                              |
| A plugin's namespace is contained in another package    | The build             | The build fails, naming the plugin and each package                            |
| A plugin's recipe lacks the plugin prefix               | `checks()`            | The test fails, naming the recipe                                              |
| Two recipes rename to one class                         | The compiler          | The build fails with `naming/collision`                                        |
| A language's namespace fails to load                    | `provider-i18n`       | The component's suspense does not resolve. The route's error component renders |

## Alternatives considered

### The catalogue in the web package

**Why not:** a contract's labels would be keys into a catalogue of another package, and the contract
package would be on a product's graph without the words its labels name. A plugin whose web package
is missing from a product would still need its contract's words for another plugin's references.

### A translation hook in the SDK

A hook that reads the plugin's namespace from the plugin's scope.

**Why not:** `useTranslation(contract.pluginId)` types the namespace already, and a second hook
would give every plugin two ways to translate.

### A loader of catalogues per plugin

The host fetches each plugin's catalogue when the plugin first renders.

**Why not:** in the first slice a plugin is a package on the product's graph, and `vite-plugin-i18n`
finds, types, checks and splits its catalogues already. The second slice fetches a remote's
catalogues because the build cannot see them (RFC-0009).

## Drawbacks

- A plugin's words are in its contract package, so a change of wording releases the contract.
- A plugin from another scope needs the product's i18n layer to list that scope.
- A contract's labels are checked by tests and the build, not by the type checker.

## Unresolved and future work

- Typing a contract's labels against its catalogue, once a React-free package defines the catalogue
  interface (RFC-0010).
- A check at run time that a remote's catalogue writes its own namespace alone, for the second
  slice.

## References

| What                                       | Where                                                               |
| ------------------------------------------ | ------------------------------------------------------------------- |
| Finding catalogues on the dependency graph | `packages/vite-plugin-i18n/src/find.ts`                             |
| The declaration of every key               | `packages/vite-plugin-i18n/src/typegen.ts`                          |
| The build gate of the catalogues           | `packages/vite-plugin-i18n/src/check.ts`                            |
| Loading a language on first read           | `packages/vite-plugin-i18n/src/emit.ts:207-220`                     |
| A namespace in every call                  | `foundations/providers/i18n/src/resources.ts`                       |
| Compiling every package's recipes          | `packages/vite-plugin-theme/README.md`                              |
| The class-name collision                   | `packages/pandacss-compiler/src/selectors.ts:245-253`               |
| Styles through a recipe alone              | `docs/adr/0009-style-a-component-through-its-config-recipe-only.md` |
