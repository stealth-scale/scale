# @stealthscale/theme

`@stealthscale/theme` is the design-system package. It publishes the foundation every recipe is
written against, the runtime every component binds its recipe with, and the vocabulary a theme is
written in. A component package, a theme package and an application import from here and from
nowhere else.

## Install

```bash
pnpm add @stealthscale/theme
```

The package peers on `react`. An application also installs `@stealthscale/vite-config-theme`, which
adds the compiler that turns every recipe and theme into one stylesheet.

## Usage

A component binds its recipe and draws through the binding:

```ts
import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "./button.recipe.ts";

const { withContext } = createRecipeContext(recipe);

export const Button = withContext("button");
```

A bound element carries the recipe's name as `data-recipe`, which is the handle the testing kit
finds it by. The attribute is written where `process.env.NODE_ENV` is not `production`, so a test
runner and a dev server see it and a production page does not.

A recipe states what a component is. The helpers read semantic tokens, layer styles and text styles,
so no value in the recipe is a color, a pixel length or a color mode:

```ts
import {
  controlSizes,
  defineRecipe,
  interactive,
  lookVariants,
  stack,
} from "@stealthscale/theme/authoring";

export const recipe = defineRecipe({
  base: { ...interactive(), ...stack({ direction: "row", gap: "gap.sm" }) },
  className: "button",
  defaultVariants: { size: "md", variant: "solid" },
  jsx: [/Button$/u],
  variants: {
    size: controlSizes(["xs", "sm", "md", "lg", "xl"]),
    variant: lookVariants(["solid", "subtle", "outline", "ghost", "plain"]),
  },
});
```

A theme states values and recipe extensions, and never names a component. A root theme fills the
contract in two calls, and redraws the ramps it moves:

```ts
import { colorScale, defineTheme, families, palettes, radii } from "@stealthscale/theme/authoring";

export const fathom = defineTheme({
  name: "fathom",
  semanticTokens: {
    colors: { ...families({ dark: 11, light: 96 }, 195, 0.016), ...palettes({ primary: "teal" }) },
    radii: radii("1rem"),
  },
  tokens: { colors: { teal: colorScale(185, 0.12) } },
});
```

A derived theme states what differs:

```ts
import { defineTheme, paletteAlias, radii } from "@stealthscale/theme/authoring";

import { fathom } from "@acme/theme-fathom";

export const abyss = defineTheme({
  extends: fathom,
  name: "abyss",
  recipes: { button: { base: { textTransform: "uppercase" } } },
  semanticTokens: { colors: { primary: paletteAlias("teal") }, radii: radii("1rem") },
});
```

An application lists its themes in `theme.config.ts`. The first is the default, and every one of
them switches under `data-theme`. A recipe written in the application rather than in a package is
registered there too, through a preset the application states under `presets`, and a theme extends
it by its key as it extends any other:

```ts
import { type Application } from "@stealthscale/theme/authoring";

import { abyss } from "@acme/theme-abyss";
import { fathom } from "@acme/theme-fathom";

import own from "./src/theme.ts";

export default { presets: [own], themes: [fathom, abyss] } satisfies Application;
```

An application that states no theme draws the foundation alone.

A page switches its theme and its color mode with two attributes, on the document root or on any
element for a subtree. Five rules decide what a switch covers:

- The element carrying an attribute switches its own tokens, so everything drawn from a token
  follows. The rules a theme or a recipe writes for that theme or mode apply to the elements below
  it, because the compiler scopes them to descendants.
- A subtree switched to a theme is drawn from that theme and the foundation alone. Every token the
  theme leaves unstated takes the foundation's value there, not the value of the theme around it.
- A component whose own rules must switch goes inside the element that carries the attribute.
- Where neither attribute is written, the first theme draws the page and the reader's operating
  system decides the mode.
- Every color is compiled as one `light-dark(light, dark)` value and evaluated where it is used,
  against the `color-scheme` the attribute sets, so a subtree switched to either mode inside the
  other reads every color, alias and shadow from its own mode. A recipe's own `_dark` and `_light`
  styles switch by the attribute above the element.

```html
<html data-theme="fathom" data-color-mode="dark"></html>
```

A React page writes both through the provider, and a part below reads them with `useTheme()`:

```tsx
import { ThemeProvider } from "@stealthscale/theme";

<ThemeProvider colorMode="dark" theme="abyss">
  <App />
</ThemeProvider>;
```

## Entry points

| Subpath        | Importer                                         | Publishes                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.`            | A component                                      | `css`, `cx`, `styled` and `token` from the generated runtime, the runtime types, `createRecipeContext`, `createSlotRecipeContext`, `ThemeProvider`, `useTheme`, `breakpointKeys`, `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` |
| `./authoring`  | A recipe, a theme, an application, a testing kit | The definitions, the contract, the scales, the recipe helpers, the patterns, the contrast measurement, every authoring type, and the two attributes a page is switched with                                                    |
| `./theme`      | The build plugin                                 | The foundation, as a default export                                                                                                                                                                                            |
| `./styles.css` | An application                                   | The cascade order, which the build plugin fills with the compiled stylesheet                                                                                                                                                   |

A recipe file imports `./authoring` and never `.`. The compiler's configuration reaches this package
through every theme, and a recipe that imported the runtime would put every generated file behind
that configuration.

## Reference

### Definitions

| Export                     | Returns                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `defineRecipe(recipe)`     | The recipe, typed against the vocabulary, with the literal values of each variant and each compound's class written from its `name`, as `button--hero` |
| `defineSlotRecipe(recipe)` | The slot recipe, typed the same way, with each compound split per slot it styles, as `card__root--hero`                                                |
| `defineStyles(styles)`     | A style object two recipes share, typed                                                                                                                |
| `definePreset(preset)`     | The preset a component package publishes under `./theme`                                                                                               |
| `defineTheme(config)`      | A `Theme`: its name, its font packages, a preset and a variant                                                                                         |
| `contract(variant)`        | The variant unchanged. The parameter's type is the check                                                                                               |

`RecipeProps<typeof recipe>` names the props a recipe lets a caller choose, for a component the
binding cannot type on its own.

### The contract

A root theme states every color in `ROLES`, `HUES`, `PALETTES` and the three families. `ThemeTokens`
is that type, and a theme that leaves a role out fails to compile.

| List          | Members                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ROLES`       | `bg`, `subtle`, `muted`, `emphasized`, `border`, `border.hover`, `solid`, `solid.hover`, `fg`, `fg.muted`, `contrast`, `focusRing` |
| `MODES`       | `base`, `_dark`                                                                                                                    |
| `HUES`        | `blue`, `cyan`, `gray`, `green`, `indigo`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`                                     |
| `PALETTES`    | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`                                                 |
| `BACKGROUNDS` | `DEFAULT`, `subtle`, `muted`, `emphasized`, `inverted`, `panel`, `popover`, `backdrop`, `disabled`                                 |
| `FOREGROUNDS` | `DEFAULT`, `muted`, `subtle`, `inverted`, `disabled`, `link`                                                                       |
| `BORDERS`     | `DEFAULT`, `muted`, `subtle`, `emphasized`, `inverted`, `focus`                                                                    |

A hue palette states every role in both modes. A semantic palette states one value per role, which
`paletteAlias(hue)` writes as references. Each family adds `info`, `success`, `warning` and `error`
as references into the status palettes.

A theme transcribed from another design system keeps that system's steps. It keys each ramp with
`ramp(keys, values)`, nests a dark ramp under the light one where the system draws one, and places
the roles with a table: `paletteRoles("blue", STEPS, "blue.dark")`, where `STEPS` names a step for
each role in each mode, or states a role outright. `ROLE_STEPS`, `FOREGROUND_STEPS` and
`BORDER_STEPS` are the foundation's own tables, and a theme spreads over them for the roles it
moves.

### Scales

| Export                                              | Draws                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `colorScale(hue, chroma)`                           | Eleven OKLCH steps, `50` to `950`                                                                                   |
| `alphaScale("white" \| "black")`                    | Eleven steps of an overlay                                                                                          |
| `ramp(keys, values)`                                | A ramp transcribed from a source, keyed as the source keys it                                                       |
| `backgrounds(pages, hue, chroma)`                   | The `bg` family from the page's lightness in each mode                                                              |
| `surfaces(ramp, steps, darkRamp?)`                  | The `bg` family from the steps a table names on a neutral ramp                                                      |
| `foregrounds(ramp, steps?, darkRamp?)`              | The `fg` family from a grey ramp, at the foundation's steps or a table's                                            |
| `borders(ramp, steps?, darkRamp?)`                  | The `border` family from a grey ramp, at the foundation's steps or a table's                                        |
| `stepped(ramp, light, dark, darkRamp?)`             | One color as a reference to a step in each mode                                                                     |
| `paletteRoles(ramp, steps?, darkRamp?)`             | The twelve roles of a hue palette, at `ROLE_STEPS` or a table's, from one ramp or one per mode                      |
| `paletteAlias(hue)`                                 | The twelve roles of a semantic palette, by reference                                                                |
| `neutralFills()`                                    | The neutral palette's quiet fills, pointed at the page's surfaces                                                   |
| `families(pages, hue, chroma)`                      | The three families in one call                                                                                      |
| `palettes(aliases)`                                 | Every hue palette from its ramp, and every semantic palette pointed at the hue named for it, or at the foundation's |
| `radii(largest)`                                    | Three concentric corners                                                                                            |
| `shadows(hue, depth)`                               | Six heights, an inner shadow and an inset line, per mode                                                            |
| `controls()`, `icons()`, `insets()`, `gaps()`       | The semantic sizes and spacing, five steps each                                                                     |
| `fontSizes(base, ratio)`, `typography(base, ratio)` | The type scale, and the text styles that name each size with its leading and tracking                               |
| `slides()`                                          | The sixteen slide keyframes                                                                                         |
| `oklch(lightness, chroma, hue)`                     | One color as CSS writes it                                                                                          |

### Recipe helpers

| Export                                | Writes                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `interactive()`                       | The hand, the transition, no selection, the disabled look, the focus ring          |
| `highlightVariants(highlights, when)` | A `highlight` axis, each value a mark on the row the keys are on                   |
| `link()`                              | The link ink, an underline on hover, the focus ring                                |
| `lookVariants(looks)`                 | A `variant` axis, each look a layer style                                          |
| `statusVariants()`                    | A `status` axis, each status a palette                                             |
| `controlSizes(sizes)`                 | A `size` axis over the control height, the inset, the gap and the label text style |
| `iconSizes(sizes)`, `iconOnly(sizes)` | A `size` axis over the icon box, or a square control with no inset                 |
| `touchTarget()`                       | A hit area of a medium control under a coarse pointer                              |
| `field()`                             | An input's surface, edge, ink and states                                           |
| `surface(elevation)`                  | A panel at an elevation of the shadow scale                                        |
| `floating()`, `overlay()`             | A popover, and the backdrop behind a dialog                                        |
| `motion(enter, exit)`                 | The animation styles a thing opens and closes with                                 |
| `divider(orientation)`                | A hairline                                                                         |
| `dense(styles)`                       | The styles under compact density                                                   |
| `slotsOf(anatomy)`                    | An anatomy's parts as a recipe's slots                                             |

### Patterns

Each pattern is a function from typed props to a style object, and nothing is generated from any of
them: `stack`, `hstack`, `vstack`, `flex`, `center`, `grid`, `simpleGrid`, `visuallyHidden`,
`absoluteCenter`, `cluster`, `sidebar`, `switcher`, `cover`, `frame`, `reel`, `scrollable`,
`sticky`, and `bento` with `bentoCell` for a dense grid of tiles that span columns and rows.
`responsive(value, transform)` applies a function to every breakpoint of a responsive prop. The
compiler's base preset is installed without its own patterns, so no pattern module is generated and
a recipe named `stack`, `grid`, `container`, `divider` or `spacer` shares its name with nothing.

### Looks and motions

A recipe picks a look with `layerStyle` and a motion with `animationStyle`. The looks read the
virtual palette, so each draws in whichever palette the recipe points at, and the motions are turned
off for a reader who asked for reduced motion.

| Look                                            | Draws                                                                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `fill.{solid,subtle,muted,surface,ghost,plain}` | A control's fill with its hover                                                                             |
| `outline.{solid,subtle}`                        | A control's edge with its hover                                                                             |
| `indicator.{top,bottom,start,end}`              | A bar along one edge                                                                                        |
| `disabled`                                      | The disabled cursor and opacity                                                                             |
| `glow.{sm,md,lg}`                               | A shadow in the palette's solid at half strength                                                            |
| `border.moving`                                 | A conic sweep of the palette's solid round the panel surface, moved by `sweep`                              |
| `glass`                                         | The panel surface at seventy percent behind a blur, solid where transparency is off                         |
| `text.gradient`                                 | Text from the palette's solid to the accent's                                                               |
| `text.shine`                                    | Text in the palette's ink with a band of its emphasized fill, of its solid in dark mode, moved by `shimmer` |
| `backdrop.{dots,grid,stripes,checker}`          | A field of dots, a grid or diagonal stripes in the line color, or a checkerboard in the emphasized surface  |
| `backdrop.noise`                                | A tile of fractal noise over the surface, carried inline                                                    |
| `backdrop.vignette`                             | A darkening towards the edges                                                                               |
| `backdrop.spotlight`                            | A radial pool of the palette's muted fill at `--spotlight-x` and `--spotlight-y`                            |
| `backdrop.aurora`                               | The aurora gradient, moved by `aurora`                                                                      |
| `blur.{sm,md,lg}`                               | A blur of the element by a step of the blur scale                                                           |
| `dim.others`                                    | The siblings of a hovered child blurred and muted                                                           |
| `mask.{bottom,edges,radial}`                    | The element faded out at the bottom, at both sides, or towards its edges                                    |
| `ripple`                                        | A circle of the ink that grows and fades from the centre on release                                         |

| Motion                                         | Runs                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `fade`, `scale-fade`, `slide-fade`, `collapse` | In and out, the slide from the side the placement states                        |
| `shimmer`                                      | A background across and back at the slow ambient pace                           |
| `sweep`                                        | The registered angle round once at the slow ambient pace                        |
| `marquee`                                      | A row half its width across at the slower ambient pace                          |
| `float`                                        | A bob of six percent of the element's height                                    |
| `pulse-glow`                                   | A shadow breathing out to a size token and back                                 |
| `aurora`                                       | A background drifting across and back at the slower ambient pace                |
| `meteor`                                       | A streak across the viewport that fades at the end                              |
| `spin`                                         | A turn round at the ambient pace                                                |
| `twinkle`                                      | A small decoration's opacity between a fifth and full, staggered by `--stagger` |
| `rise`                                         | A fade up once, delayed by `--stagger` so a list rises in turn                  |
| `reveal`                                       | The rise driven by the element's passage into the viewport                      |
| `parallax`                                     | A drift of fifteen percent either way driven by the scroll                      |
| `progress`                                     | A bar filled from the left in step with the scroll                              |

The gradients `brand`, `shine` and `aurora` are semantic tokens, so a theme moves them per mode, and
`--angle` is registered as an angle so a browser interpolates the sweep. The scrolled motions read
the scroll position rather than the clock, and a browser without scroll-driven animations leaves the
element at rest. A component that ripples from the pointer, or draws a spotlight under it, writes
the custom properties the look reads. A backdrop is a background image, so a recipe that pairs one
with a fill writes `backgroundColor`, because the `background` shorthand resets the image.

### Contrast

`contrast(foreground, background)` measures the ratio WCAG defines, from OKLCH, hex or `rgb()`.
`luminance(color)` and `readable(foreground, background, level)` measure the parts. The foundation
is held to 7:1 for every ink on every surface and 3:1 for every line and ring, and its own
specification measures every pair.

## The foundation

The foundation fills every category the compiler reads: reference tokens in nineteen categories, the
three color families and nineteen palettes, three concentric radii, eight shadows, the semantic
sizes and spacing, text styles with roles over the sizes, the fills and outlines and indicators as
layer styles, the animation styles, the keyframes, the breakpoints, the containers, fourteen
conditions and the global styles. It holds no recipe. A recipe belongs beside the component it
draws.

The build plugin generates the runtime under `generated/` from the foundation, once, in this
package. Every other package reads that runtime through `.`.

Three semantic tokens are not a theme's to move. `sizes.prose` is the measure body text is read at,
counted in characters so it stays right at every type size. `spacing.marker` is the gutter a browser
draws a list marker in. `spacing.safe.{top,right,bottom,left}` is the room a device keeps for a home
indicator, a notch or a rounded corner, which only the browser knows. Anything fixed to an edge of
the screen reads the safe tokens rather than writing `env()`, which a recipe may not do, and reads
zero on every device that reserves nothing.

## Licence

MIT. See [LICENSE](LICENSE).
