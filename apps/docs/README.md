# @stealthscale/docs

`@stealthscale/docs` hosts the catalogue. It is the first application in the workspace to call
`specimen.catalogue()`, so it is what proves the plugin against real pages rather than a scratch
workspace.

## Run it

```bash
pnpm --filter @stealthscale/docs dev
```

The server listens on port 4100. The patterns search across the workspace, so every `*.specimen.tsx`
under `components/*/src` is indexed whether or not this application depends on the package holding
it. The stylesheet is compiled from the packages this application depends on, so a package whose
specimens are indexed is listed in `package.json` as well, or its recipes reach no page.

## What is here

The application settles the locale, loads the catalogues, places the catalogue the plugin indexed
under one route, draws the shell around every page, and states which themes the page can wear.

```
src/app.tsx                        the providers and the router
src/catalogue.ts                   where the catalogue is placed, and the routes it compiles to
src/routes.tsx                     the tree, and the redirect from the site root
src/frame.tsx                      the shell every page is drawn in
src/chrome/bar.tsx                 the bar across the top
src/chrome/theme-switcher.tsx      the switcher over the shell's theme choice
src/chrome/color-mode-switcher.tsx the switcher over the shell's colour mode
src/themes.ts                      the names of the twelve themes, for the switcher
src/main.tsx                       the mount
locales/en/docs.json               the words the chrome writes
theme.config.ts                    the twelve themes, and static: "*"
vite.config.ts                     the layers
```

Everything drawn on a page belongs to `@stealthscale/specimen`, which defines the rail, the index,
the page and the route declarations. This application composes the shell around them out of the
screen components, and adds the chrome the kit leaves to an application.

## The routes

`src/catalogue.ts` places the catalogue at `/components`: the index at that path, and every page
beneath it, `/components/actions/button` for the button. The site root redirects to the index. That
path is this application's choice: the declarations carry no leading slash, so moving the mount
moves every address with it.

The catalogue's route names the layout `docs.frame`, which `src/routes.tsx` registers with the
compiler, so every page is drawn inside `Frame` without naming it. A theming page or a written page
this application adds goes in through `Placing.beside`, carrying a `navigation` entry so the rail
and the index list it under its own heading.

## The shell

`Frame` is an `AppShell`: a sticky bar across the top, the rail in a navigation panel that folds
over the page below the middle breakpoint, and the page in the main region. The main region is the
target of the skip link at the top of the document.

The bar holds the control that opens the navigation, the brand leading to the index, and two
switchers. Each switcher is a `Switcher` over a `Menu`, and each reads and writes the shell's own
setting: `useThemeChoice()` for the theme and `useColorMode()` for the colour mode. A choice is
remembered under this application's name, so it holds across a reload.

## The host's own decisions

`theme.config.ts` states `static: "*"`, which compiles every recipe outright. The compiler extracts
a value written as a JSX literal and nothing it reads from a prop, so without it a scene drawing
`variant={one}` renders every look, size and status alike. A product application states nothing
there.

`src/themes.ts` lists the names of the twelve themes for the switcher, because a theme's definition
is what the compiler reads and nothing a browser needs. Its specification holds the list to
`theme.config.ts`, so the two cannot drift.

Any word the kit writes can be renamed here by declaring the same key under the `specimen`
namespace. The plugin reads packages deepest first and this application last.

## Still missing

The three virtual modules are the contract, and this reads one of them. `virtual:specimen-fragments`
and `virtual:specimen-props` are already served and nothing opens them yet, so a page shows its
scenes and neither its source nor what its parts accept.

A width switcher, which draws a page at a stated width, is not here yet.

## Licence

MIT. See [LICENSE](LICENSE).
