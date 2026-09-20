# @stealthscale/testing-theme

`@stealthscale/testing-theme` checks a theme, a recipe and a preset against the theme contract, and
reads what a recipe declares and what a rendered component drew. Each gate returns a list of
sentences rather than a verdict, so one assertion reports which role, pair, token or file broke the
contract.

## Install

```bash
pnpm add -D @stealthscale/testing-theme
```

The package peers on `@stealthscale/theme` and `vitest`. Install both.

## Usage

A theme package runs its theme through the gate, naming the preset it is layered on and the recipes
the workspace publishes:

```ts
import { describe, expect, it } from "vitest";

import actions from "@acme/actions/theme";
import { publishedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { fathom } from "#index.ts";

describe("fathom", () => {
  it("keeps the theme contract", () => {
    expect(
      violations(fathom, {
        at: import.meta.dirname,
        base: foundation,
        recipes: publishedRecipes(actions),
      }),
    ).toStrictEqual([]);
  });
});
```

A component package runs each recipe and its preset through the gate:

```ts
import { presetViolations, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#button/button.recipe.ts";
import preset from "#theme.ts";

expect(recipeViolations(recipe, { parts: anatomy.keys() })).toStrictEqual([]);
expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
```

A specification about a rendered component reads the classes on each element:

```ts
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

expect(recipeClasses(container, "button")).toContain(variantClass("button", "variant", "solid"));
```

## Reference

### `violations(theme, options)`

| Check                 | Reports                                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name.attribute`      | A name outside `[a-z][a-z0-9-]*`, which a page cannot write as the theme attribute                                                                                                                                     |
| `contract.roles`      | A palette that leaves one of the ten roles out, and a family, the code family included, that leaves one of its members out                                                                                             |
| `contract.modes`      | A color stated in one mode and not the other                                                                                                                                                                           |
| `contract.references` | A reference that points at a token nothing defines, or at itself                                                                                                                                                       |
| `contract.extensions` | An extension naming a recipe key the workspace does not publish, or naming `className` or `slots`                                                                                                                      |
| `contract.variants`   | A variant on an axis the recipe does not offer, a value the axis does not offer, or a part the recipe's value does not style, where `recipes` maps each key to its recipe                                              |
| `contract.compounds`  | A compound for a selection the component's recipe declares no compound for, or styling a part the recipe's compound does not, where `recipes` maps each key to its recipe                                              |
| `contract.listed`     | A file under `recipes/` or `slot-recipes/` exporting `extension` that the theme does not list, where `at` is given                                                                                                     |
| `contract.styles`     | A text, layer or animation style that states nothing, and a text style without a `fontSize`                                                                                                                            |
| `contrast.text`       | Every ink on every surface and each palette's ink on the page, the raised surfaces and its fills below 7:1; `fg.subtle` on every surface below 4.5:1; each palette's `contrast` on its solid and its hover below 4.5:1 |
| `contrast.boundary`   | `border.emphasized` below 3:1 on the page, the panel, the popover and the first well; `border` below 1.45:1 on the page and the panel; each palette's solid and lines below 3:1 on the page and the panel              |
| `contrast.focus`      | A palette's `focusRing` below 3:1 on any surface                                                                                                                                                                       |
| `distinct.surfaces`   | The page and the panel, the page and the first well, the raised surfaces and the first well, or two consecutive wells closer than 0.02 in OKLab lightness in either mode                                               |
| `distinct.inks`       | Two consecutive inks, from `fg` to `fg.subtle`, closer than 0.02 in OKLab lightness                                                                                                                                    |
| `distinct.lines`      | Two consecutive lines, from `border.subtle` to `border.emphasized`, closer than 0.02 in OKLab lightness                                                                                                                |
| `distinct.fills`      | Two steps of a palette closer than 0.02 in OKLab lightness: a quiet fill and the next, a solid and its hover, a line and its hover, or the resting fill and the page, the panel or the popover                         |
| `status.distinct`     | Two status solids, or a status solid and the primary's or the neutral's, closer than 0.05 in OKLab, in either mode                                                                                                     |
| `status.identity`     | A status solid more than 30 degrees of hue from the canonical hue of its status, or a grey, in either mode                                                                                                             |
| `ramp.monotonic`      | A ramp under `tokens.colors` whose lightness turns back between two steps, or a step that cannot be read                                                                                                               |
| `ramp.hue`            | A step of a ramp whose hue drifts more than 45 degrees from the ramp's median hue, greys left out                                                                                                                      |
| `fonts.installed`     | A font package the theme names that does not resolve from `at`, and nothing where `at` is not given                                                                                                                    |

`options.recipes` lists the recipe keys the workspace publishes, or maps each key to its recipe,
which adds the variants check and the compound check. `publishedRecipes(...presets)` builds that map
out of the presets the component packages publish, so the list is the one an application installs
rather than one written out by hand. `options.base` names the preset the theme is layered on, which
the resolver follows a reference into. `options.thresholds` changes any of the five ratios (`text`,
`tertiary`, `label`, `boundary`, `hairline`, `focus`) and the four distances (`distinct`, `status`,
`identity`, `hue`). A theme whose stated ink cannot reach 7:1 on its stated page draws to the ratio
it can reach and hands the same number here. `options.skip` leaves a check out, each with a reason.

A ramp is a group under `tokens.colors` with at least three steps keyed by number. A dark ramp
nested under the light one, as `blue.dark`, is read as a ramp of its own.

### `report(theme, options)`

Measures a theme and returns the numbers rather than a verdict. The options are the ones
`violations` takes.

| Field      | Holds                                                                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margins`  | Per class of pair (`text`, `boundary`, `focus`): the lowest ratio, the median, and the ten tightest pairs lowest first, each with the ratio it is held to, with a pair that cannot be measured first |
| `steps`    | Per mode: the OKLab lightness between consecutive surfaces, inks and lines                                                                                                                           |
| `statuses` | Per mode and per pair of statuses, on the solid and on the ink: the OKLab distance for typical vision and under protanopia, deuteranopia and tritanopia                                              |
| `outside`  | The steps of the theme's ramps outside sRGB, as `blue step 500`                                                                                                                                      |

`formatReport(report)` writes the numbers as Markdown tables. A theme's specification can write it
into a snapshot, or a script can print it for a person to read:

```ts
import { formatReport, report } from "@stealthscale/testing-theme";

console.log(formatReport(report(fathom, { base: foundation, thresholds: { text: 4.5 } })));
```

The status distances under a color vision deficiency are simulated with the matrices of Machado,
Oliveira and Fernandes (2009) at full severity. They are reported and not gated: a red and a green
converge for a reader with deuteranopia whatever the theme does, and a recipe pairs each status with
an icon for that reader. The steps outside sRGB are reported and not gated either, because the
foundation's own ramps place 48 steps outside it on purpose. A theme drawn for sRGB alone runs
`gamut` in its own specification.

### `recipeViolations(recipe, options)`

| Check               | Reports                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipe.className`  | A class name outside `[a-z][a-z0-9-]*`                                                                                                                                                                                    |
| `recipe.values`     | A value that writes the class another value writes, across the recipe's axes, or that a boolean axis writes at `true`                                                                                                     |
| `recipe.compounds`  | A compound without a name, two compounds under one name, and a compound whose name writes the class of a variant                                                                                                          |
| `recipe.empty`      | A value or a compound that states no styles, whose class the runtime writes and no rule reaches                                                                                                                           |
| `recipe.defaults`   | A default naming an axis the recipe does not offer, or a value the axis does not offer                                                                                                                                    |
| `recipe.selections` | A compound matched on an axis the recipe does not offer, or on a value the axis does not offer                                                                                                                            |
| `recipe.jsx`        | A name in `options.names` that no `jsx` pattern matches, and a pattern that matches no name, where `names` lists what a consumer writes the component under                                                               |
| `recipe.colors`     | A color written outright, a ramp step, a reference, a hue, a palette role that does not exist, or `colorPalette` pointed at a hue                                                                                         |
| `recipe.tokens`     | A token the preset does not define, named by one word or by a path, in any category a property reads, and any composition name it does not define. A CSS-wide keyword and a size a box takes from its content are ignored |
| `recipe.conditions` | A condition neither the compiler's base preset nor the preset defines                                                                                                                                                     |
| `recipe.lengths`    | A length in `px`, `rem` or `pt` on a property outside `options.lengths`, the compiler's token function and a custom property's fallback left out                                                                          |
| `recipe.modes`      | `_dark`, `_light`, `_osDark` or `_osLight` anywhere in the recipe                                                                                                                                                         |
| `recipe.slots`      | A slot `options.parts` stamps no part for, and a part no slot styles                                                                                                                                                      |

The color properties and the category each property reads are taken from the compiler's base preset
at run time. The tokens and conditions are read from `options.preset`, which is the foundation
unless a theme package states its own.

### `boundViolations(recipe, draw, options)`

Checks a bound component against its recipe. `draw(props)` renders the component with the props a
caller would write and returns what it rendered into. The check renders the component once with
nothing picked and once per value of every axis. On each render it reads the classes that open with
the recipe's class off the element and compares them with what the recipe writes: the class of each
value picked or defaulted and the class of each compound whose selection matches. Each class the
element lacks is reported, and so is each class it has that the recipe does not write. A part of a
slot recipe, named by `options.slot`, gets a value's class only where the value styles that slot.
`options.defaults` names the values a binding fixes through its default props, whose classes the
element has where nothing is picked. A fixed value is written by no JSX literal, so the check also
reports one the recipe does not list under `staticCss`. `options.subject` finds the element where
`data-recipe` and the slot class do not identify it.

```tsx
import { render } from "@testing-library/react";

import { boundViolations } from "@stealthscale/testing-theme";

expect(boundViolations(recipe, (props) => render(<Button {...props} />).container)).toStrictEqual(
  [],
);
expect(
  boundViolations(
    recipe,
    (props) =>
      render(
        <List.Root {...props}>
          <List.Item />
        </List.Root>,
      ).container,
    {
      slot: "item",
    },
  ),
).toStrictEqual([]);
```

### `presetViolations(preset, options)`

| Check               | Reports                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `preset.registered` | A `*.recipe.ts` or `recipe.ts` file under `at` the preset does not register, and a key no recipe file defines |
| `preset.keys`       | A recipe registered under a key that is not its class name in camel case                                      |
| `preset.slots`      | A slot recipe under `recipes`, and a recipe without slots under `slotRecipes`                                 |

### Readers

| Export                                                                          | Reads                                                                                                                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeClass`, `variantClass`, `slotClass`, `slotVariantClass`, `compoundClass` | The classes a recipe emits, in the naming scheme of `@stealthscale/pandacss-naming`                                                                                             |
| `axesOf`, `valuesOf`, `defaultsOf`, `slotsOf`, `scaleOf`, `byStep`              | What a recipe declares, without rendering                                                                                                                                       |
| `recipeElement`, `slotElement`, `classesOf`, `recipeClasses`, `slotClasses`     | What a rendered component drew, by `data-recipe` on the element a recipe was bound to and on the root of a compound component, and by the slot class or `data-part` on one part |
| `resolved`, `colorAt`, `palettesOf`, `extendedRecipes`, `fontsOf`               | What a theme states, with every reference followed                                                                                                                              |
| `publishedRecipes`                                                              | Every recipe the presets of the component packages register, keyed as they register it, for `options.recipes`                                                                   |
| `rampsOf`, `outsideGamut`, `gamut`                                              | The ramps a theme draws under `tokens.colors`, and the steps of them outside sRGB                                                                                               |
| `statusPairs`                                                                   | Every pair of statuses on the solid and on the ink                                                                                                                              |
| `distance`, `distanceFor`, `simulated`, `written`, `DEFICIENCIES`               | The OKLab distance between two colors, for typical vision and for each dichromacy                                                                                               |

## Licence

MIT. See [LICENSE](LICENSE).
