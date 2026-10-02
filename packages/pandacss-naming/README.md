# @stealthscale/pandacss-naming

`@stealthscale/pandacss-naming` writes the class names of a Panda CSS design system in one readable
scheme. The same functions run in the browser, where the generated runtime writes a class, and over
the compiled stylesheet, where the build renames the selectors, so a class written at run time
matches the selector the stylesheet declares.

| Kind                      | The compiler writes                               | The scheme writes                                |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Variant on a string axis  | `button--size_lg`                                 | `button--lg`                                     |
| Variant on a boolean axis | `card__content--bleed_true`, `…--bleed_false`     | `card__content--bleed`, and no class for `false` |
| Slot                      | `card__root`                                      | `card__root`                                     |
| Compound                  | `button--compound__size_lg__variant_solid`        | `button--expose`, the name the recipe declared   |
| Atomic                    | `grid-ar_{sizes.32}`, `md:grid-tc_repeat(3,_1fr)` | `grid-ar-sizes-32`, `md:grid-tc-repeat-3-1fr`    |
| Value with a capital      | `bg_colorPalette.solid`, `ff_Segoe_UI`            | `bg-color-palette-solid`, `ff-segoe-ui`          |
| Custom property           | `--stagger_0`                                     | `stagger-0`                                      |
| Negative value            | `m_-4`                                            | `m--4`                                           |
| Condition                 | `focusVisible:c_red`, `[&_>_*]:c_red`             | `focus-visible:c-red`, `[&_>_*]:c-red`           |

The compiler's separator, `_` by default, sits between an axis and its value and between a
property's class and its value. The scheme reads that separator on both sides and writes a hyphen in
its place. It accepts the three separators the compiler supports: `_`, `-` and `=`.

## Install

```bash
pnpm add @stealthscale/pandacss-naming
```

## Usage

A recipe author names a compound, and a specification derives the class it expects:

```ts
import { compoundClass, slotClass, variantClass } from "@stealthscale/pandacss-naming";

variantClass("button", "size", "lg"); // "button--lg"
variantClass("button", "loading", true); // "button--loading"
variantClass("button", "loading", false); // ""
slotClass("card", "content"); // "card__content"
compoundClass("button", "expose"); // "button--expose"
```

A build step reads a class the compiler wrote and returns the class of the scheme:

```ts
import { type CompilerConfig, rename } from "@stealthscale/pandacss-naming";

const config: CompilerConfig = {
  recipes: [{ axes: ["loading", "size"], className: "button" }],
  separator: "_",
};

rename("button--size_lg", config); // "button--lg"
rename("button--loading_false", config); // ""
rename("md:grid-tc_repeat(3,_minmax(0,_1fr))", config); // "md:grid-tc-repeat-3-minmax-0-1fr"
```

## The rules

The scheme is sound under four rules. The gate enforces them and this package assumes them:

- The values of one recipe are unique across its axes, and no value equals a boolean axis's name or
  a compound's name. `size: lg` and `radius: lg` in one recipe would both produce `button--lg`.
- A compound declares a name. The name is unique in its recipe, is not a value of any axis, and does
  not start with an axis and the separator.
- An axis name does not contain the separator. Where one axis name prefixes another, `rename` reads
  the longest axis that fits, so it matches `on-off` and not `on` in `card--on-off_true`.
- Two different classes of one stylesheet never sanitise to one name. The stylesheet rewrite checks
  this and reports a collision.

The scheme reads a class as the compiler writes it with `hash` off and no `prefix`. A hashed class
has no structure to read, and the scheme does not strip a prefix from a recipe's class.

## Reference

| Export                                 | Returns                                                                                                                                                                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `variantClass(className, axis, value)` | `<class>--<value>` for a string or a number, `<class>--<axis>` for `true`, and an empty string for `false`                                                                                                                                                                           |
| `slotClass(className, slot)`           | `<class>__<slot>`                                                                                                                                                                                                                                                                    |
| `compoundClass(className, name)`       | `<class>--<name>`                                                                                                                                                                                                                                                                    |
| `atomicClass(pandaClass, separator)`   | The class with each named condition and the property's class in kebab-case, without the hyphens a custom property opens with, the separator written as a hyphen, and the value sanitised and in lower kebab-case. A raw selector or at-rule condition in brackets is kept as written |
| `rename(pandaClass, config)`           | The class as a variant where one of `config.recipes` claims it, with `config.separator` between axis and value, and as an atomic class otherwise                                                                                                                                     |
| `conditionsOf(pandaClass)`             | The conditions of a class, outer to inner, as the compiler wrote them, with a raw one in its brackets                                                                                                                                                                                |
| `sanitise(segment)`                    | The segment with a letter, a digit, a hyphen, `%`, `/`, `!` and the slot separator `__` kept, each run of other characters replaced by one hyphen, and a run at the start dropped. The case is kept, and `atomicClass` lowers it                                                     |
| `kebab(name)`                          | The name with a hyphen at each boundary between a lower-case letter or a digit and a capital, in lower case                                                                                                                                                                          |

## Licence

MIT. See [LICENSE](LICENSE).
