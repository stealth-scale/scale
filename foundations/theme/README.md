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

A theme is a statement of a character on the axes a page moves on, and it never names a component. A
root theme states its colors: the page and the ink of each mode, the brand's primary, and whatever
else it draws from its own colors. Every surface, ink, line and palette is drawn from that statement
at a measured contrast ratio and a measured distance in lightness. Every other axis is optional:

```ts
import { defineTheme } from "@stealthscale/theme/authoring";

export const cinder = defineTheme({
  colors: {
    code: { keyword: "#d72323" },
    dark: { ink: "#eeeeee", page: "#303841", panel: "#3a4750" },
    light: { ink: "#303841", page: "#eeeeee" },
    primary: "#d72323",
    secondary: "#3a4750",
  },
  depth: { depth: 1.5, hue: 251 },
  name: "cinder",
  shape: { control: "2px", corner: "0.25rem" },
});
```

A derived theme states what differs, and a token stated outright under `tokens` or `semanticTokens`
is merged over what the axes drew:

```ts
import { defineTheme } from "@stealthscale/theme/authoring";

import { fathom } from "@acme/theme-fathom";

export const abyss = defineTheme({
  extends: fathom,
  name: "abyss",
  recipes: { button: { base: { textTransform: "uppercase" } } },
  shape: { corner: "0.5rem" },
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

| Subpath        | Importer                                         | Publishes                                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`            | A component                                      | `css`, `cx`, `styled` and `token` from the generated runtime, the runtime types, `createRecipeContext`, `createSlotRecipeContext`, `ThemeProvider`, `useTheme`, `breakpointKeys`, `breakpoints`, `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` |
| `./authoring`  | A recipe, a theme, an application, a testing kit | The definitions, the contract, the recipe helpers, the patterns, the engine a theme is drawn by, the measurements, every authoring type, and the two attributes a page is switched with                                                       |
| `./theme`      | The build plugin                                 | The foundation, as a default export                                                                                                                                                                                                           |
| `./styles.css` | An application                                   | The cascade order, which the build plugin fills with the compiled stylesheet                                                                                                                                                                  |

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
| `defineTheme(statement)`   | A `Theme`: its name, its font packages, a preset and a variant, drawn from the statement                                                               |

`RecipeProps<typeof recipe>` names the props a recipe lets a caller choose, for a component the
binding cannot type on its own.

### The statement

A theme states a character on nine axes. `defineTheme` draws everything a recipe reads from the axes
it states, and leaves an axis it does not state to the foundation or to the theme it extends. A
derived theme states any part of an axis: the part is merged over its parent's statement of that
axis and the axis is drawn again from the whole, so a theme that restates one corner keeps its
parent's other corners and one that restates a page keeps its parent's ink.

| Axis      | A theme states                                                                                                                                                                               | `defineTheme` draws                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `colors`  | `light` and `dark`, each a page, an ink and an optional panel; `primary`; optionally `secondary`, `accent`, `neutral` and the four statuses; `code` inks; `hues`; `keep`; `chroma`; `ratios` | Every surface, ink, line, palette role and status, at the ratios and distances the gate measures |
| `faces`   | `body`, `heading` and `mono`, each as CSS writes a `font-family`                                                                                                                             | The face tokens, the heading face following the body face unless stated                          |
| `type`    | `base` in rem and `ratio`; the `heading` role's `weight`, `tracking` and `leading`, the `label` role's `weight`, the `body` role's `leading`                                                 | Every font size, every size style, and every text role                                           |
| `motion`  | `pace`, a multiplier on every pace, and the curves `press`, `enter`, `leave` and `move`                                                                                                      | The four semantic paces and curves every control, entrance, exit and panel reads                 |
| `metrics` | `scale`, and any base moved outright: `control`, `icon`, `tag`, `inset`, `gap`, `sidebar`, `aside`, `rail`, `narrow`, `wide`, `prose`                                                        | Every step of every semantic size and spacing, each multiplied by `--density` at run time        |
| `shape`   | `corner`, any of `l1`, `l2` and `l3` outright, the stroke widths `hairline`, `control` and `indicator`, and the `ring`'s `width` and `offset`                                                | The three concentric corners, the three widths, and the ring the focus utility reads             |
| `depth`   | `hue` and `depth`                                                                                                                                                                            | Six heights, an inner shadow and an inset line, per mode                                         |
| `looks`   | `layerStyles`, `animationStyles` and `textStyles` the theme redraws                                                                                                                          | Nothing. A theme's look wins over the foundation's                                               |
| `recipes` | Extensions to recipes, by key, and `slotRecipes` likewise                                                                                                                                    | Nothing. The extension merges over the recipe                                                    |

A solid a theme states is kept where it stands from the page and the panel at 3:1. Where it fails,
its lightness moves towards the ink, hue and chroma kept, only as far as it has to. Its label never
moves it: a label falls back to black or white where neither the theme's ink nor its page carries
it, and the worse of those two clears 4.58:1 on any color there is. `colors.keep` holds a solid
exactly as stated for the gate to report: every solid where it is `true`, and the intents named
where it is a list.

A theme whose stated ink cannot reach 7:1 on its stated page states the ratios it draws to under
`colors.ratios` (`text`, `tertiary`, `label`, `boundary`, `hairline`), and its specification passes
the same object to the gate as `thresholds`. `FLOOR` is where lowering stops. Text, labels and the
tertiary ink are held at 4.5:1 and a boundary at 3:1, whatever a theme states, because those are
what WCAG asks of normal-size text and of the information that identifies a control. A theme whose
colors cannot reach the floor is reported rather than measured against a lower number, so the
palette changes rather than the threshold. The hairline is a quality target all the way down: a
separator carries nothing a reader has to read.

A theme whose page is saturated enough that every surface in its tint reads as one wall of color
states `colors.chroma`, the share of the page's chroma a raised surface and a well keep.

A status a theme leaves unstated keeps the canonical hue of its name, so it is read from its color
before its word on any page, at the chroma of the brand's most saturated intent and no lower than
0.1, so a muted brand's statuses do not shout over it. A status that lands within 0.05 of the
primary or the neutral in OKLab, or within 0.12 of one of its own hue, moves 0.15 in lightness, so a
red brand's error is not a red a shade off its primary button.

The colors of the foundation are published as `FOUNDATION`, and its two pages as `PAGES`, for a
theme that keeps the foundation's pages and moves the brand alone.

### The contract

A root theme's colors fill the three families, the code family and the eight intents. The eleven hue
palettes are optional: a theme draws them with `colors.hues` and an application names a hue in
`css()`. `ThemeColors` is that type.

| List          | Members                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `ROLES`       | `subtle`, `muted`, `emphasized`, `border`, `border.hover`, `solid`, `solid.hover`, `fg`, `contrast`, `focusRing` |
| `MODES`       | `base`, `_dark`                                                                                                  |
| `HUES`        | `blue`, `cyan`, `gray`, `green`, `indigo`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`                   |
| `PALETTES`    | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`                               |
| `BACKGROUNDS` | `DEFAULT`, `subtle`, `muted`, `emphasized`, `inverted`, `panel`, `popover`, `backdrop`                           |
| `FOREGROUNDS` | `DEFAULT`, `muted`, `subtle`, `inverted`, `link`                                                                 |
| `BORDERS`     | `DEFAULT`, `muted`, `subtle`, `emphasized`, `inverted`, `focus`                                                  |
| `CODE`        | `keyword`, `string`, `number`, `function`, `type`, `tag`, `attr`, `comment`, `inserted`, `deleted`               |

Each family adds `info`, `success`, `warning` and `error` as references into the status palettes.
`fg.link` reads the accent's ink and `border.focus` the accent's ring, and the accent is the primary
unless a theme states one.

Each surface has one job. `bg.panel` and `bg.popover` rise above the page in both modes.
`bg.subtle`, `bg.muted` and `bg.emphasized` are wells, sunk below the page in both modes, for a
region rather than a control. A palette's `subtle`, `muted` and `emphasized` are fills, stepped
towards the ink and above the popover, for a control's resting, hovered and pressed states, and
every palette's fills sit at one lightness and differ by hue alone. `fg.muted` is secondary text at
7:1 on every surface, `fg.subtle` tertiary text at 4.5:1, `border` the structural hairline, and
`border.emphasized` a control's boundary at 3:1.

### The engine

Each axis is one function, published for an application or a test that draws a palette without
defining a theme.

| Export                                      | Draws                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `drawColors(colors)`                        | The four families, the eight intents, and the hue palettes where asked                             |
| `drawAxes(axes)`                            | Every stated axis into `semanticTokens`, `tokens` and `textStyles`                                 |
| `inked(modes, options?)`                    | The three families from the page and the ink of each mode                                          |
| `drawn(solid, modes, options?)`             | One palette of ten roles from one color, stated for both modes or for each                         |
| `intents(modes, spec, options?)`            | The eight intents, each unstated status from its canonical hue at the brand's chroma               |
| `hues(modes, solids?, options?)`            | The eleven hue palettes, the grey from the ink                                                     |
| `coded(modes, colors?)`                     | The code inks                                                                                      |
| `canonical(hue)`                            | The foundation's color for a hue on each side                                                      |
| `ladderOf(side, text?)`                     | The panel, the popover, the three wells and the three fills of one side                            |
| `typeScale(type?)`                          | `fontSizes` and `textStyles` from one base and one ratio                                           |
| `metrics(metrics?)`                         | `sizes` and `spacing`, the five scales multiplied by the density                                   |
| `shape(shape?)`                             | `radii` and `borderWidths`                                                                         |
| `depth(depth?)`                             | `shadows`                                                                                          |
| `faces(faces)`                              | The face tokens                                                                                    |
| `colorScale(hue, chroma)`, `scaleOf(color)` | Eleven OKLCH steps, `50` to `950`, from a hue and a chroma or from a color                         |
| `alphaScale("white" \| "black")`            | Eleven steps of an overlay                                                                         |
| `stepOf(hue, chroma, step)`                 | One step of a ramp                                                                                 |
| `oklch(lightness, chroma, hue)`             | One color as CSS writes it                                                                         |
| `mixed(from, to, share)`                    | A mix of two colors in OKLab                                                                       |
| `lightened(color, lightness)`               | A color moved to a lightness with its hue and chroma kept, and its chroma reduced to stay in gamut |
| `polar(color)`, `lightnessOf(color)`        | A color as OKLCH reads it, and its OKLab lightness                                                 |
| `stated(light, dark?)`, `referenced(path)`  | A color token written outright per mode, and one written as a reference                            |
| `slides()`                                  | The sixteen slide keyframes                                                                        |

`RATIOS` fixes the ratios the colors are drawn to and `HAIRLINES` the ratios of the three hairlines.
`STATUS_HUES` fixes the canonical hue of each status, which the gate holds a status to. `RAMPS`
places each hue on the wheel with its chroma.

### Recipe helpers

| Export                                | Writes                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `axis(values, write)`                 | An axis helper: every value when called with nothing, the values named otherwise   |
| `interactive()`                       | The hand, the transition, no selection, the disabled look, the focus ring          |
| `highlightVariants(highlights, when)` | A `highlight` axis, each value a mark on the row the keys are on                   |
| `link()`                              | The link ink, an underline on hover, the focus ring                                |
| `lookVariants(looks)`                 | A `variant` axis, each look a layer style                                          |
| `statusVariants()`                    | A `status` axis, each status a palette                                             |
| `toneVariants(tones)`                 | A `tone` axis over the inks: the family's four and the four statuses               |
| `controlSizes(sizes)`                 | A `size` axis over the control height, the inset, the gap and the label text style |
| `iconSizes(sizes)`, `iconOnly(sizes)` | A `size` axis over the icon box, or a square control with no inset                 |
| `touchTarget()`                       | A hit area of a medium control under a coarse pointer                              |
| `field()`                             | An input's surface, its boundary at the control's stroke width, its ink and states |
| `surface(elevation)`                  | A panel with a hairline edge at an elevation of the shadow scale                   |
| `floating()`, `overlay()`             | A popover with a hairline edge, and the backdrop behind a dialog                   |
| `motion(enter, exit)`                 | The animation styles a thing opens and closes with                                 |
| `divider(orientation)`                | A hairline                                                                         |
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
| `fill.{solid,subtle,muted,surface,ghost,plain}` | A control's fill with its hover, the surface with a border at the control's width                           |
| `outline.{solid,subtle}`                        | A control's edge at the control's width with its hover                                                      |
| `indicator.{top,bottom,start,end}`              | A bar along one edge at the indicator's width                                                               |
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
`luminance(color)`, `oklab(color)`, `linear(color)` and `readable(foreground, background, level)`
measure the parts. The foundation is held to 7:1 for every ink on every surface, 4.5:1 for the
tertiary ink and for every label on a solid, 3:1 for every boundary and ring, and 1.45:1 for the
structural hairline, and its own specification measures every pair.

## The foundation

The foundation is the same statement as every theme, drawn at its defaults: its pages are the two
ends of the grey ramp, each written in the other, its primary is the canonical blue, and every
intent left unstated takes its canonical color. Beside the colors it fills every category the
compiler reads: reference tokens in nineteen categories, three concentric radii, three stroke
widths, eight shadows, the semantic sizes and spacing, text styles with roles over the sizes, the
fills and outlines and indicators as layer styles, the animation styles, the keyframes, the
breakpoints, the containers, fourteen conditions and the global styles. It holds no recipe. A recipe
belongs beside the component it draws.

The build plugin generates the runtime under `generated/` from the foundation, once, in this
package. Every other package reads that runtime through `.`.

Three stroke widths are semantic tokens every border-drawing recipe reads. `borderWidths.hairline`
is a separator, a card edge, a table rule or a divider. `borderWidths.control` is an input's edge,
an outline button or a switch track. `borderWidths.indicator` is an active bar. A theme moves each
through `shape`. Five layout sizes are semantic tokens the shell reads: `sizes.sidebar`,
`sizes.aside` and `sizes.rail` for the panels of an application, and `sizes.page.narrow` and
`sizes.page.wide` for the measures a page reads at. A theme moves the panels through `metrics`.

Three semantic tokens are not a theme's to move. `sizes.prose` is the measure body text is read at,
counted in characters so it stays right at every type size. `spacing.marker` is the gutter a browser
draws a list marker in. `spacing.safe.{top,right,bottom,left}` is the room a device keeps for a home
indicator, a notch or a rounded corner, which only the browser knows. Anything fixed to an edge of
the screen reads the safe tokens rather than writing `env()`, which a recipe may not do, and reads
zero on every device that reserves nothing.

## Licence

MIT. See [LICENSE](LICENSE).
