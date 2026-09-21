---
"@stealthscale/vite-config-react": minor
---

Load `@mdx-js/rollup` when the MDX plugin is constructed rather than when the package is imported,
so a repository that compiles no document imports the tier with the optional peer absent, and a
repository that states the layer without the peer is told which package to install. Read the icon
imports off the bundler's own parse of the source instead of matching text, so a string, a comment
or a template that looks like an import is left as written.
