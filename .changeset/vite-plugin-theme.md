---
"@stealthscale/vite-plugin-theme": minor
---

- Watch every workspace package's source directory from `theme.stylesheet()`.
- Make `Application.themes` optional, and compile the foundation without a theme.
- Install the base preset without its patterns.
- Take a preset only from a package that is or depends on the system package.
- Write every moded color as one `light-dark()` value.
- Scope a theme's rules to the nearest `[data-theme]`.
- Start the compiler at `buildStart` without blocking the dev server's first request.
- Apply a change once, and send nothing when the compiled rules are unchanged.
- Apply changes under a bundling dev server from `watchChange`.
