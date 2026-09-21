# @stealthscale/vite-plugin-specimen

`@stealthscale/vite-plugin-specimen` indexes specimen files from their source. A catalogue lists
every page in the index and loads a page's components only when somebody opens it.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-specimen
```

The package peers on `vite` and `@stealthscale/vite-plugin-base`. Most repositories reach it through
`@stealthscale/vite-config-specimen` rather than adding it by hand.

```ts
import { specimens } from "@stealthscale/vite-plugin-specimen";

export default defineConfig({ plugins: [specimens({ patterns: ["src/**/*.specimen.tsx"] })] });
```

`patterns` has no default. A pattern resolves against the project root, and an application that
shows a catalogue of a workspace's components sits beside those components rather than above them.

## Declaring a page

A specimen's default export is a call taking one object literal. The plugin reads `id`, `group`,
`title`, `about` and `namespace` out of the source text, so nothing in the file is evaluated at
build time.

```tsx
export const sizes = { draw: () => <Badge size="sm" />, title: "Sizes" };

export default specimen({
  about: "A small label that marks a status.",
  group: "Data",
  id: "data/badge",
  scenes: [sizes],
});
```

`id` is required and unique. `title` defaults to the last segment of the identifier, with hyphens
read as spaces. `group`, `about` and `namespace` default to empty. `namespace` names the catalogue
namespace the page's words are keys in, for a page whose words live outside the catalogue's own.

Neither the callee's name nor the module it came from is checked, so a repository supplies its own
`specimen` function.

## virtual:specimen-index

```ts
import { pages } from "virtual:specimen-index";
```

`pages` carries one entry per file, sorted by path. Each entry has the metadata the file declares,
the name of the package the file belongs to, and `load`, a dynamic import of the page's module. The
plugin writes every page and what it reaches beyond the entry into one chunk, `pages-[hash].js`,
fetched by the first page a reader opens and cached for every page after it, so a rail that lists
100 pages loads no component and a page after the first loads nothing. A page's props are a second
loader where the index was asked to read them. Every page's props share one chunk,
`props-[hash].js`, loaded where somebody first opens them and not again for another page.

A page states its own import line and each scene its own source. Neither is read out of the file, so
the plugin parses no syntax tree.

Add the types with a triple-slash directive from a file the project already compiles.

```ts
/// <reference types="@stealthscale/vite-plugin-specimen/client" />
```

## virtual:specimen-props

State `props` to have the plugin resolve what each page's components accept, out of their types.

```ts
specimens({ patterns: ["src/**/*.specimen.tsx"], props: {} });
```

```ts
const { dropped, parts, shapes } = await import("virtual:specimen-props/data/badge");
```

Left out, no page carries props and no compiler starts, so an installation without TypeScript still
indexes. Stated, the first page opened starts a compiler, and the pages after it reuse that one.

A part is a `*Props` type a module exports beside the part it is named after, from the specimen's
own package. The reader resolves that type to its properties and classifies each one by every
declaration behind it:

| Where a property is declared                                        | What it is                               |
| ------------------------------------------------------------------- | ---------------------------------------- |
| A `recipe.ts` or `*.recipe.ts`                                      | A variant, the axis a theme moves        |
| The component's own package, or a package it depends on at run time | An option                                |
| Anywhere else                                                       | Dropped, and counted under `dropped`     |
| Nowhere at all                                                      | A styling condition, dropped and counted |

Reading every declaration rather than the first is what keeps a variant that a style prop shares a
name with. On a list, `gap` is declared by both the generated style props and the recipe. On an icon
button, `aria-label` is declared twice by the rendering library and once by the component. Stopping
at the first declaration loses the variant and the accessible name.

A dependency counts as the component's own because a component built over a state machine takes its
options from the machine's package. The dependencies are walked from the component's manifest
through `dependencies` alone. A peer is therefore foreign, and the rendering library's attributes
and the foundation's style props are declared by peers. A menu root resolves to 1351 properties and
keeps 31: four variants from its recipe, and 27 options from the machine and the packages the
machine depends on, `open`, `onOpenChange`, `positioning` and `onEscapeKeyDown` among them.

A button resolves to 1341 properties, six of which are its own. `dropped` reports the other 1335
under the reason each was cut, so a table can show its own arithmetic rather than ask to be trusted.

`shapes` maps each named type the props refer to, keyed by the package and the name, onto its
members. A union written under a name is recorded as its options, which is what turns `size: Scale`
into its eight steps. A type from TypeScript's own libraries is skipped.

`Reading` takes `depth`, how far to follow the types a prop refers to, and `members`, how many a
type may hold before it is named rather than listed. Both have defaults.

A change to any typed file under a searched directory restarts the compiler and reloads every props
module that was already loaded. Re-resolving one page costs tens of milliseconds, which is cheaper
than serving text that no longer matches the types.

## Unreadable files

A file that matched a pattern but doesn't declare a page is still listed, under its path, with the
reason as its opening and a loader that rejects with the same reason. A build throws instead, naming
every unreadable file in one error.

One identifier declared by two files is the same fault. The second is refused and names the first.

## Hot updates

A page appearing, disappearing, or changing the metadata it declares reloads the index. An edit that
changes only a scene reloads that page and leaves the index alone.

A listed specimen accepts its own hot update. A specimen file exports scenes and constants beside
its components, so the refresh runtime cannot accept an edit to it, and without a boundary the edit
climbs through the index to the application's own modules, which run again on every save. The plugin
appends the boundary to each specimen it transforms, and the boundary dispatches `UPDATED`
(`specimen:updated`) on the window with the page's identifier and the module that replaced the old
one as the event's detail. The catalogue kit listens for the event and redraws the page. The module
accepts itself rather than the index accepting it, because a server that bundles registers a module
reached through a dynamic import under an identifier of its own, which an accepting importer cannot
name.

The directories the patterns start in are added to the watcher, including those outside the project
root, because a dev server watches its own root and nothing above it.

A server that bundles runs no hot update hook and reports a change to `watchChange` instead. A
change to a typed file restarts the compiler there. The index lists a stamp file as a file it
watches, and the plugin rewrites the stamp when a specimen appears, disappears, or changes the
metadata it declares, classified the way a hot update is with the file read from disk. The bundler
then generates the index again on its next rebuild, and a scene-only edit leaves the stamp and the
index alone. The stamp is under the system's temporary directory, in a directory named for the
project root, so the task runner counts it as neither an input nor an output.

## Licence

MIT. See [LICENSE](LICENSE).
