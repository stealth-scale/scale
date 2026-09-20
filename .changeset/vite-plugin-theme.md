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
