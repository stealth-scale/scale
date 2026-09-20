# @stealthscale/specimen

`@stealthscale/specimen` is both halves of a catalogue: what a specimen file is written with, and
what draws the pages an application indexed.

## Install

```bash
pnpm add -D @stealthscale/specimen
```

The package peers on `@stealthscale/component-a11y`, `@stealthscale/component-actions`,
`@stealthscale/component-content`, `@stealthscale/component-data`, `@stealthscale/component-forms`,
`@stealthscale/component-layout`, `@stealthscale/component-navigation`,
`@stealthscale/component-screen`, `@stealthscale/component-surfaces`,
`@stealthscale/component-typography`, `@stealthscale/provider-hotkeys`,
`@stealthscale/provider-i18n`, `@stealthscale/provider-router`, `@stealthscale/vite-plugin-specimen`
and `react`. A package writing specimens does not declare it, the way a package writing
specifications does not declare the testing kits: a specimen runs in the catalogue and resolves
through the workspace root.

## The catalogue

The package publishes route declarations and builds no router and no shell. An application places
the catalogue under a route of its own, registers the frame it is drawn in, and compiles the result
beside whatever else it declares.

```tsx
import { compileRoutes } from "@stealthscale/provider-router";
import { declarations } from "@stealthscale/specimen";
import { pages } from "virtual:specimen-index";

const compiled = declarations(pages, {
  id: "docs.components",
  layout: ["docs.frame"],
  path: "components",
});

root.addChildren([...compileRoutes(compiled, { layouts: { "docs.frame": Frame }, parent: root })]);
```

`declarations` returns the route the catalogue hangs under, its index, and one page per entry. The
route draws the router's outlet and nothing else, so every page is served beneath its path and drawn
inside its frame. Placing the catalogue at `components` serves the index at `/components` and the
button at `/components/actions/button`. A page's route is named `routeId(page.id)`, which turns the
identifier's slashes into dots: `specimen.actions.button`. The index is named `indexId(id)`:
`docs.components.index`.

`Placing` states where the catalogue goes:

| Member   | What it states                                                                           |
| -------- | ---------------------------------------------------------------------------------------- |
| `id`     | The id of the route the catalogue hangs under                                            |
| `path`   | The path that route is served at, relative to the compiler's parent                      |
| `layout` | The layouts the catalogue is drawn in, outermost first. Drawn bare when absent           |
| `beside` | Pages the application wrote, compiled with the rest and listed by the rail and the index |

The pages are passed in rather than imported, so this package draws a catalogue without the build
plugin in its own graph and a specification renders one without a build at all.

## The rail

`Rail` reads declarations, not the index. Anything compiled into the catalogue that carries an entry
is listed, so a page an application wrote itself appears beside a page the plugin found. Hand it the
array `declarations` returned.

```tsx
import { Sidebar } from "@stealthscale/component-screen";
import { Rail } from "@stealthscale/specimen";

<Sidebar.Root>
  <Sidebar.Content>
    <Rail declarations={compiled} />
  </Sidebar.Content>
</Sidebar.Root>;
```

The rail is one block of a sidebar, `Sidebar.Nav` under its own heading, so draw it inside
`Sidebar.Root` from the screen package. It holds one branch per group. The branch holding the page
being read is open, and a reader opens and closes the others by hand. A navigation into another
group redraws the list, which opens that group's branch and closes the rest.

`RailSearch` draws the field that narrows the rail. It is the forms package's search input in the
room the sidebar keeps for one, and the platform's modifier and K put the reader in it from anywhere
on the page. The words are the application's state, handed to the field and to the rail alike:

```tsx
const [query, setQuery] = useState("");

<Sidebar.Root>
  <Sidebar.Header>
    <RailSearch onValueChange={setQuery} value={query} />
  </Sidebar.Header>
  <Sidebar.Content>
    <Rail declarations={compiled} query={query} />
  </Sidebar.Content>
</Sidebar.Root>;
```

A query keeps the pages whose words contain it, whatever the case, and opens every branch it leaves
standing. A query no page matches leaves the sidebar's empty line in place of the list. The search
reads the shell's `navbar` panel, so draw it inside `AppShell.Root`: where the shell has folded the
panel over the page and closed it, the shortcut opens the panel first.

A page the application writes carries an entry under `navigation`, and nests under the catalogue's
route unless it names a parent of its own:

```ts
const overview: RouteDeclaration = {
  component: Overview,
  id: "docs.theming.overview",
  navigation: { about: "How a theme is built.", group: "Theming", label: "Overview" },
  path: "theming/overview",
};

declarations(pages, { beside: [overview], id: "docs.components", path: "components" });
```

`Entry` is that shape and `entryOf` reads it, because the router types `navigation` as `unknown` and
a declaration the catalogue did not write could carry anything under that name. A declaration
carrying no entry is left out, which is what a page in no rail looks like.

`grouped` sorts those into the tree the rail draws: groups by name, pages by the words their entry
carries, and pages naming no group under a heading of their own, last.

## The index and the pages

`Index` draws the catalogue's index: one section per group, holding a card per page. The card's
title is the link, and its description is the sentence the page opens with. The catalogue's route
serves it, and an application drawing it elsewhere as well hands it the same declarations.

`Page` loads a page's module and draws its scenes, each as a section under its title, which is the
first time that component reaches the browser. The row above the page's title leads back to the
index, and the group the page is filed under stands beside the title as a badge. The body opens with
the statement that imports the page's components from their package, in the content package's code
block with the clipboard's trigger beside it. The plugin lists the components from what the specimen
imports under the package's own imports map. Each scene stands on a card whose footer holds a
`Source` control at its right end, a disclosure that shows the scene's source under the stage in the
same code block, cut by the plugin from the specimen's file. Each section is anchored by its worded
title, `looks-and-sizes`, and a rail beside the page lists the sections, marks the ones on screen
and scrolls the page to the one pressed. The rail is the navigation package's table of contents in
the page's aside, which leaves a narrow page and sticks beside a wide one. `declared` and `parted`
are the shaping behind it. `parted` splits what a page's parts accept into the variants a theme
moves and the options a caller sets, each row carrying the members of every named type it refers to,
with the dropped counts beside them.

## The words

Every word the catalogue writes itself is a key under the `specimen` namespace, in
`locales/en/specimen.json`. An application overriding one declares the same key under the same
namespace: the plugin reads packages deepest first and the application last, so the application
wins. A group's heading is looked up as `groups.<name>` in the same namespace and shown as the name
where no entry exists, so an application translates the groups in one place.

A page's own words are keys in the same namespace, under a prefix of the page's own. The package
that writes the page keeps them beside it as `locales/<language>/specimen/<page>.json`, which the
plugin places under `<page>` in the namespace. The page's title, its opening and each scene's title
and opening are keys the catalogue resolves in the language a reader chose, and a key with no entry
is shown as the key, so a page written in plain words reads as written. A page whose words live in
another namespace names it with `namespace`.

A scene reads its words through `useWords`, bound to the namespace under the prefix it names, so a
specimen imports nothing from the i18n foundation:

```tsx
import { useWords } from "@stealthscale/specimen";

function Looks(): ReactElement {
  const { t } = useWords("button");

  return <Button>{t("publish")}</Button>;
}
```

## specimen

A specimen file's default export declares the page. The index plugin parses the call out of the
source and never evaluates the module, so nothing here runs at build time.

```tsx
import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";

const SIZES = ["sm", "md", "lg"] as const;

export const sizes: Scene = {
  about: "The three steps every control in the library shares.",
  draw: () => (
    <Matrix direction="row" knob="size" of={SIZES}>
      {(size) => <Button size={size}>Press</Button>}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about: "The element a person presses.",
  group: "Actions",
  id: "actions/button",
  scenes: [sizes],
});
```

| Field       | What it declares                                                            |
| ----------- | --------------------------------------------------------------------------- |
| `id`        | The address of the page, required and unique across the catalogue           |
| `scenes`    | The scenes, in the order they are drawn                                     |
| `title`     | The page heading. The last segment of the identifier when absent            |
| `group`     | The group a navigation rail lists the page under. Empty when absent         |
| `about`     | The sentence or two the page opens with. Empty when absent                  |
| `namespace` | The catalogue namespace the words are keys in. Shown as written when absent |

The scenes are listed rather than gathered from the file's exports, because a module returns its
names in alphabetical order and a page written Variants, States, Anatomy would be read back Anatomy,
States, Variants.

`draw` is a component rather than a node, so a scene that holds state declares its hooks in its own
render.

## Matrix

`Matrix` draws one captioned cell per value of an axis, or one per pair of values where a second
axis crosses the first.

| Prop        | What it does                                                             |
| ----------- | ------------------------------------------------------------------------ |
| `of`        | The values, in the order the cells are drawn                             |
| `knob`      | The prop the axis turns, written before each value in the muted ink      |
| `label`     | Converts a value into the name its cell is captioned with                |
| `across`    | A second axis, whose values run across each row of the first             |
| `direction` | Which way the cells of one axis run, `row` or `column`. `row` by default |

```tsx
<Matrix across={{ knob: "size", of: SIZES }} knob="variant" of={VARIANTS}>
  {(variant, size) => (
    <Button size={size} variant={variant}>
      Publish
    </Button>
  )}
</Matrix>
```

One axis is a row of captioned cells that wraps where it runs out of room, so a row of sizes folds
onto the next line on a narrow page, or a column of them. Two axes are one captioned row per value
of the first axis, holding one captioned cell per value of the second. A third axis nests one matrix
in another.

## Tile and Room

`Tile` is a block that stands in for content, so a specimen of a layout has boxes to arrange rather
than bare words. `Room` is a box held to one of the page's measures, `sm` by default, for a scene
that only reads once the width runs out: a row that wraps, a heading cut to one line, a label beside
its control.

```tsx
<Room size="xs">
  <Heading truncate>A long title for a page that could have used a shorter one</Heading>
</Room>
```

## The recipes it states

Every part the catalogue draws is a component of the library: the caption is `Text`, the page is
`Page`, the rail is `Sidebar.Nav` over `NavList`. The matrix, the tile and the room state a recipe
each, published as a preset from `@stealthscale/specimen/theme`, and every value in them is a
semantic token, so a theme that moves the library moves the catalogue with it.

## Types

`Axis<Value>` describes an axis: `of`, `knob` and `label`. `MatrixProps<Value>` extends it with
`children` and `direction`. `Specimen` and `Scene` describe what a page declares. `Placing`
describes where a catalogue goes.

## Licence

MIT. See [LICENSE](LICENSE).
