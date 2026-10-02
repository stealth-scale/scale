# @stealthscale/vite-config-css

`@stealthscale/vite-config-css` runs Stylelint over the stylesheets a package imports, as one layer
the package's Vite configuration extends alongside its tier. The guide is
`stylelint-config-standard`, with seven rules over it covering selector specificity, the cascade,
declaration order and the cost of an animation. The check runs during a build and behind a
development server alike, and a violation fails the build unless you demote it.

## Install

```bash
pnpm add -D @stealthscale/vite-config-css
```

The package peers on `@stealthscale/vite-config-core`, `stylelint`, `stylelint-config-standard`,
`stylelint-order`, `stylelint-use-nesting`, `stylelint-high-performance-animation`,
`vite-plugin-stylelint`, `vite` and `vitest`. Install all nine. Stylelint receives an absolute path
to the shared guide and to each plugin, resolved while this module loads, so a peer nobody installed
fails the configuration rather than the check.

## Usage

A package extends one tier and lists `css.layers()` among its other add-ons.

```ts
import * as css from "@stealthscale/vite-config-css";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [css.layers()] });
```

The call returns a single contribution, and its position among the other add-ons does not change the
result. The contribution appends to Vite's `plugins` array and does not read a key another layer
sets.

A workspace root calls `css.workspace()`, which contributes no layer.

```ts
import * as css from "@stealthscale/vite-config-css";
import { defineConfig } from "@stealthscale/vite-config/preset/workspace";

export default defineConfig(import.meta.dirname, { extends: [css.workspace()] });
```

The check runs while the package importing a stylesheet builds, and a workspace root builds no
package. The call exists so a root configuration lists every add-on the same way. Dropping it
changes nothing about what gets checked.

## Reference

| Export      | Signature                                | What it returns                                  |
| ----------- | ---------------------------------------- | ------------------------------------------------ |
| `layers`    | `(stated?: Checked) => readonly Layer[]` | One contribution named `css.check`               |
| `warn`      | `(stated: Warned) => readonly Layer[]`   | A removal of `css.check`, then a reporting check |
| `workspace` | `() => readonly Layer[]`                 | An empty array                                   |

`Checked` configures which stylesheets the check reads and whether a violation fails the build.
Every field is optional. `Warned` takes the same four fields and adds a required `because`, which
the removal carries.

| Field    | Type                                | What it does                              |
| -------- | ----------------------------------- | ----------------------------------------- |
| `also`   | `readonly string[]`                 | Replaces the globs the plugin checks      |
| `except` | `readonly string[]`                 | Replaces the globs the plugin skips       |
| `rules`  | `Readonly<Record<string, unknown>>` | Rules layered over the four sets, by name |
| `warn`   | `boolean`                           | Warns instead of failing the build        |

Note: `also` and `except` replace the plugin's own lists rather than adding to them. Stating `also`
means the check reads those globs and no others, in place of the default
`src/**/*.{css,scss,sass,less,styl,vue,svelte}`. Stating `except` replaces the default
`node_modules` and `virtual:`.

A name in `rules` that one of the four sets already declares takes the value given here. Nothing is
cached between runs, so a rule you change applies on the next run rather than after a cache is
cleared.

### Blocks

| Block   | What it publishes                                            |
| ------- | ------------------------------------------------------------ |
| `rules` | The four rule sets, and `all()` merging them into one record |

## Rules

`rules.all()` merges the four sets into the record the check passes to Stylelint.

| Rule                                             | Set         | What it refuses                             |
| ------------------------------------------------ | ----------- | ------------------------------------------- |
| `selector-max-id`                                | `SELECTOR`  | An id in a selector                         |
| `selector-no-qualifying-type`                    | `SELECTOR`  | A class qualified by an element type        |
| `declaration-no-important`                       | `CASCADE`   | `!important` on a declaration               |
| `no-descending-specificity`                      | `CASCADE`   | A looser selector after a stricter one      |
| `no-duplicate-selectors`                         | `CASCADE`   | The same selector written twice             |
| `order/properties-alphabetical-order`            | `ORDER`     | A block sorted any other way                |
| `plugin/no-low-performance-animation-properties` | `ANIMATION` | Animating anything but transform or opacity |

The shared guide leaves all seven rules to this package, and each name belongs to one set only. A
test here fails when an upgrade moves one of them into the guide. Put a rule of your own in
`Checked.rules`, which overrides the merged record rather than editing a set.

The check loads `stylelint-order`, `stylelint-high-performance-animation` and
`stylelint-use-nesting`, because Stylelint reports a rule from a plugin it has not loaded as unknown
and fails the run. Only `ORDER` and `ANIMATION` use a plugin rule, which leaves
`csstools/use-nesting` free for you to turn on in `rules`.

## Reporting instead of failing

Demote the check where a repository has a backlog of violations to work through.

```ts
export default defineConfig(import.meta.dirname, {
  extends: [
    css.layers(),
    css.warn({ because: "the theme package has violations to work through" }),
  ],
});
```

`warn()` removes `css.check` by name and adds a reporting check called `css.warn` in its place.
Everything `layers()` accepts is accepted here too, so the reporting check reads the globs and rules
the repository had already configured.

Warning: the removal resolves against the layers listed above it. A configuration that lists
`css.warn()` before `css.layers()`, or without it, throws while it loads. A removal that matched
nothing would otherwise pass and leave the failing check in place.

## Licence

MIT. See [LICENSE](LICENSE).
