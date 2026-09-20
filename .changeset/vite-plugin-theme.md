---
"@stealthscale/vite-plugin-theme": minor
---

vite-plugin-theme: watch the workspace packages and draw the foundation without a theme

- `theme.stylesheet()` hands the source directory of every workspace package the compiler scans to
  the dev server's watcher, so a file added to a package beside the application reaches the compiler
  without a restart.
- An application whose statement names no theme compiles the foundation and the published presets
  alone. `Application.themes` is optional.
- The compiler's base preset is installed without its patterns in both rendered configurations, so
  the runtime carries no pattern module and the compiler reports no conflict between a recipe named
  `stack`, `grid`, `container`, `divider` or `spacer` and a pattern of the same name.

vite-plugin-theme: require a contributor to name the system package

- A package on the graph contributes a preset when it publishes `./theme` and is the system package
  or names it as a dependency or a peer. `@tanstack/highlight` publishes `./theme` of its own, and
  the dev server failed to start with it on the graph: the plugin imported it as a preset.

vite-plugin-theme: render every moded color as light-dark()

- A color stated in both modes, in the foundation, a preset or a theme, is written into the
  compiler's configuration as one `light-dark(light, dark)` value. The browser evaluates it where
  the color is used, against the element's `color-scheme`, so a subtree switched to light inside a
  dark page reads the light side, which the dark attribute blocks never gave it. An alias of such a
  color inherits the function unevaluated and evaluates at the use site too.
- The dark attribute and dark preference blocks for colors are gone from the stylesheet. The
  multi-theme example's stylesheet falls from 654 to 487 kB, and from 80 to 45 kB gzipped. Its
  tokens layer falls from 70 to 35 kB gzipped.
- A color stated once, one naming a condition beside the two modes, and every token outside the
  `colors` group are written as they are.

vite-plugin-theme: scope a theme's rules to the nearest theme

- A theme's rules are nested under `[data-theme=<name>] &:not([data-theme=<name>] [data-theme] *)`
  rather than under the attribute alone. The exclusion stops them at the boundary of a theme nested
  inside, which is what a reader means by the theme a thing is in. A theme's tokens already stopped
  there, because the inner element redeclares them, and its rules did not: a button inside Ink
  inside Regatta was drawn in Ink's colors and Regatta's capitals, weight and corners.
- Measured in Chromium against the compiled stylesheet: that button now reads weight 500, no
  transform and a 7.5px corner, which is what Ink draws on its own.

vite-plugin-theme: start the compiler without holding the dev server

- A dev server starts the assembly at `buildStart` and answers its first request without waiting for
  it: the stylesheet waits when it is asked for, beside the modules the server transforms meanwhile.
  The catalogue's server answered its first request after 0.4 seconds rather than 3.3. A build still
  waits, because everything it bundles reads the compiled rules. An assembly that failed is tried
  again on the next request rather than reported for the life of the process.
- A change the server reports is applied once, however many environments it is reported to and
  however many times an editor saves it, and the rules are compiled there rather than at the next
  request. A change that compiles to the rules the stylesheets already hold, which is most edits to
  a specimen or a page, invalidates nothing and sends nothing to the browser. The catalogue's server
  sent the stylesheet three times per save before.
- Under the bundling server the hot update hook receives no environment. The change is still applied
  to the compiler. The bundler regenerates the stylesheets itself, from the watch files the
  transform registered for every source behind them.
