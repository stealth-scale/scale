# @stealthscale/component-actions

Draws what a person presses: the button, and the square button that holds one glyph. Every component
binds a recipe and draws nothing of its own, so a theme restyles all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-actions
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Button

Draws the element a person presses, in a look, a size and a status, raised off the page and glowing
or rippling where a page sets that effect. Under a press the look fills to its pressed colour, the
box scales to 98 percent, and an elevated button drops towards the page. A button that opens with a
mark leads with one step less inset, so the room before the mark is the width of the gap after it
rather than a word's worth. The element is `button`, and `type` defaults to `button` so one inside a
form does not send it.

```tsx
import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";

<Button size="lg" variant="outline">
  Save
</Button>;
<Button as="a">Read on</Button>;
<ButtonPropsProvider value={{ size: "sm", variant: "subtle" }}>
  <Button>Cancel</Button>
  <Button variant="solid">Save</Button>
</ButtonPropsProvider>;
```

`ButtonPropsProvider` sets the variants of every button below it. A prop on the button itself
overrides the provider's.

The `glass` look is translucent, so the contrast of its label depends on what sits behind it. The
theme's contrast gate measures the opaque looks alone, and a page puts a glass button on a surface
it has checked.

| Axis        | Values                                                             | Default |
| ----------- | ------------------------------------------------------------------ | ------- |
| `variant`   | `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`, `glass` | `solid` |
| `size`      | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                  | `md`    |
| `status`    | `info`, `success`, `warning`, `error`                              | primary |
| `shape`     | `square`                                                           | none    |
| `effect`    | `glow`, `ripple`                                                   | none    |
| `elevation` | `raised`, `floating`                                               | flat    |

## IconButton

Draws a button that holds one glyph and no words. It binds the button's recipe with the square shape
as its default, so it takes every axis a button takes and a theme that moves the button moves it
too. A glyph names nothing, so the props require an accessible name: `aria-label`, or
`aria-labelledby` pointing at the element that holds the words. The type refuses an icon button
without one.

```tsx
import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";

<IconButton aria-label="Close" variant="ghost">
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
</IconButton>;
```

A button that stays pressed is a button with `aria-pressed`. The recipe fills it while it is on,
against that attribute, so the fill and what a screen reader announces cannot disagree:

```tsx
<IconButton aria-label="Dark mode" aria-pressed={dark} onClick={toggle} variant="ghost">
  {dark ? <Moon /> : <Sun />}
</IconButton>
```

## Licence

MIT. See [LICENSE](LICENSE).
