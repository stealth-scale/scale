# @stealthscale/example-theme-multiple

`@stealthscale/example-theme-multiple` renders a page drawn by the button of
`@stealthscale/example-lib-actions` and switches it between fourteen themes and two color modes: the
four example themes and the ten published ones. An application with more than one theme adds a
statement, a stylesheet import and two attributes:

- `theme.config.ts` lists the themes.
- The build plugin fills a stylesheet import.
- The document root carries the theme attribute and the color mode attribute, and `ThemeProvider`
  writes both.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-multiple dev
pnpm --filter @stealthscale/example-theme-multiple test
```

The development server listens on port 4700. `vp test` runs two specifications.
`theme.config.spec.ts` drives the stylesheet plugin the way a build would, with the drivers of
`@stealthscale/testing`, and reads the stylesheet it compiled from the real themes and the real
recipe: the first theme's values where no attribute is set, every theme's values under its
attribute, the button's rules, Forge's extension under Forge's attribute alone, and no mention of
the compiler. `app.spec.tsx` renders the page into a happy-dom document, picks a theme and a color
mode, and reads the attributes back off the document root.

## The statement

```ts
export default {
  presets: [own],
  themes: [fathom, folio, forge, abyss, ...publishedThemes],
} satisfies Application;
```

The first theme is the default. Each theme is compiled under `[data-theme=<name>]` as well, so a
subtree can take any of them. Abyss is derived from Fathom, and the compiler composes the lineage,
so Fathom's values and Abyss's own both compile under Abyss's attribute. One panel uses Forge while
the page uses whatever the reader picked. `src/published-themes.ts` lists the ten published themes:
Ink, the look the components were drawn against, then nine each drawn from four colors stated
outright.

`own` is the preset of the application's own recipes, `src/theme.ts`, written and checked exactly as
a component package writes and checks its `./theme`. It registers the badge under
`src/badge/badge.recipe.ts`, which has no package for the build plugin to find it in. The plugin
installs it after every package's preset and before the themes, and Abyss extends the badge by its
key alone, every label in capitals, without knowing where the recipe is written.

## The page

`src/app.tsx` keeps the theme and the color mode in state and passes both to `ThemeProvider` from
`@stealthscale/theme`, which writes them onto the document root. It names the mode in a badge, the
application's own component. The buttons are written with literal variants, which is what the
compiler extracts the rules for. The page's own layout and the two panels are written with `css`
from the same package, reading the semantic surfaces, spacing and text styles a recipe reads, so
every theme restyles the page as it restyles the buttons.

Seven sections follow, in this order:

- **The cards.** Four cards from `@stealthscale/example-lib-surfaces` show a slot recipe at work:
  the default, a small one in outline, a large subtle one, and one using Forge, whose header the
  theme's card extension sets in capitals. Each is `Card.Root` holding `Card.Header`, `Card.Content`
  and `Card.Footer`, with the look and the size stated on the root alone and every band drawn in
  them.
- **The candy panel.** A moving border swept by `sweep`, a heading in `text.shine` moved by
  `shimmer`, a glowing button, a breathing one, a rippling one, and a marquee that fades at both
  edges and rises into view as the page scrolls.
- **The looks.** A heading in `text.gradient`, a card of `glass` over a drifting aurora, the three
  glows and the three blurs on chips, a paragraph under `mask.bottom`, a grid under `mask.radial`,
  and a tile under `backdrop.spotlight` whose handler writes the pointer's position into the two
  custom properties the look reads.
- **The motions.** A bar along the top of the viewport that `progress` fills with the scroll, a chip
  under `float`, a ring under `spin`, three dots under `twinkle`, a `meteor` across a dark sky,
  stripes under `parallax` behind a pane, and a list under `rise` that runs again from a button by
  mounting under a new key.
- **The bento.** Five tiles, two of them spanning, each on a backdrop of its own, dimming the others
  while one is hovered.
- **The typography package.** Its headings, paragraph, code, key, icons, lists and quotation.
- **The actions package.** Its button in every look, size and status, with two icon buttons named in
  words and a pair under `ButtonPropsProvider`.

Everything here is drawn in whichever palette the theme points at, and all of it holds still under
`prefers-reduced-motion`. The switches stick to the top of the page while the rest scrolls past.
`src/main.tsx` imports `@stealthscale/theme/styles.css` before the application, and the build plugin
appends the compiled rules to it.

## The configuration

```ts
import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet(), server.port(4700)],
});
```

`theme.stylesheet()` adds the compiler. It reads `theme.config.ts`, walks the dependency graph for
every package publishing `./theme`, and compiles one stylesheet from the foundation, the presets of
the two component packages and the fourteen themes. The statement is a default export, which the
house lint excuses for every `*.config.ts` file, and the shared `tsconfig.json` compiles it and its
specification beside `src`, so the application states nothing of its own for either.
