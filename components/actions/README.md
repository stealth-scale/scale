# @stealthscale/component-actions

Draws what a person presses: the button, the square button that holds one glyph, and the clipboard
whose trigger copies a value. Every component binds a recipe and draws nothing of its own, so a
theme restyles all of them by extending the recipe. The preset under `./theme` registers the recipes
with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-actions
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/hooks`. An application lists
the preset under `./theme` among the presets its compiler installs.

## Button

Renders a control that runs an action when pressed. The element is `button`, and `type` defaults to
`button`, so a button inside a form does not submit it. A press changes the fill, spreads a ripple
from the middle of the box and lowers an elevated button, and the box does not move. A button whose
first child is an icon starts with one inset step less, so the space before the icon matches the gap
after it.

```tsx
import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";

<Button size="lg" variant="outline">
  Save
</Button>;
<Button palette="error">Delete</Button>;
<Button effect="glow" palette="accent">
  Upgrade
</Button>;
<Button as="a">Read on</Button>;
<ButtonPropsProvider value={{ size: "sm", variant: "subtle" }}>
  <Button>Cancel</Button>
  <Button variant="solid">Save</Button>
</ButtonPropsProvider>;
```

`ButtonPropsProvider` sets the variants of every button below it. A prop on the button overrides the
provider's value.

`palette` sets the palette every look reads. Without it the button draws in `primary`. `neutral`
draws a control in the ink of the text around it, for a button in a toolbar.

The `glass` look is translucent, so the contrast of its label depends on the surface behind it. The
theme's contrast gate measures the opaque looks only. Put a glass button on a surface you have
checked.

| Axis        | Values                                                             | Default |
| ----------- | ------------------------------------------------------------------ | ------- |
| `variant`   | `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`, `glass` | `solid` |
| `size`      | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                  | `md`    |
| `palette`   | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | primary |
| `shape`     | `square`                                                           | none    |
| `effect`    | `glow`, `pulse`                                                    | none    |
| `elevation` | `raised`, `floating`                                               | flat    |

## IconButton

Renders a square button that contains one icon and no text. It binds the button recipe with `shape`
defaulting to `square`, so it takes every axis a button takes, and a theme that restyles the button
restyles it too. An icon doesn't provide an accessible name, so the props require `aria-label`, or
`aria-labelledby` pointing at the element whose text names the control. An icon button with neither
is a type error.

```tsx
import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";

<IconButton aria-label="Close" variant="ghost">
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
</IconButton>;
```

A toggle is a button with `aria-pressed`. The recipe fills it while the attribute is true, so the
fill matches what a screen reader announces:

```tsx
<IconButton aria-label="Dark mode" aria-pressed={dark} onClick={toggle} variant="ghost">
  {dark ? <Moon /> : <Sun />}
</IconButton>
```

A link rendered as a button in a bar of sections sets `aria-current="page"` on the current section,
and the recipe fills it the same way, in semibold. The ghost, glass, outline and plain looks take
the palette's subtle fill while on, the subtle and surface looks take the muted fill, and the solid
look draws an inset shadow.

A control in a toolbar uses the ink of the text beside it. Set `palette="neutral"`.

## Clipboard

Copies a value when its trigger is pressed and says so for a while. The root runs the machine and
holds the value. The trigger copies it, the indicator swaps its glyph while the copy is fresh, the
label names the value, the input shows it read-only, and the value text writes it in a run of text.
The machine names the trigger for a screen reader, "Copy to clipboard" before a press and "Copied to
clipboard" after, and `translations` on the root replaces both.

The trigger draws no control look of its own. Draw it as the library's button with `as`, and set the
button's variants through `ButtonPropsProvider`, because `as` retypes nothing.

```tsx
import { Button, ButtonPropsProvider, Clipboard } from "@stealthscale/component-actions";

<Clipboard.Root value="https://stealthscale.io/payouts/4109">
  <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
    <Clipboard.Trigger as={Button}>
      <Clipboard.Indicator copied={<Check />}>
        <Copy />
      </Clipboard.Indicator>
      Copy the link
    </Clipboard.Trigger>
  </ButtonPropsProvider>
</Clipboard.Root>;
```

Beside a field, the label names the input and the input can still be focused and selected, which is
what a person falls back on where the browser refuses the copy:

```tsx
<Clipboard.Root value={link}>
  <Clipboard.Label>Link to the payout</Clipboard.Label>
  <Clipboard.Control>
    <Clipboard.Input as={Input} />
    <Clipboard.Trigger as={IconButton}>
      <Clipboard.Indicator copied={<Check />}>
        <Copy />
      </Clipboard.Indicator>
    </Clipboard.Trigger>
  </Clipboard.Control>
</Clipboard.Root>
```

`Clipboard.Consumer` hands the machine to a function, for a control of the page's own or for words
that change with the state:

```tsx
<Clipboard.Root value={link}>
  <Clipboard.Consumer>
    {(api) => (
      <Button onClick={api.copy} palette={api.copied ? "success" : "neutral"}>
        {api.copied ? "Copied" : "Copy the link"}
      </Button>
    )}
  </Clipboard.Consumer>
</Clipboard.Root>
```

The root takes the machine's options: `value` or `defaultValue`, `timeout` in milliseconds (3000 by
default), `onStatusChange`, `onValueChange`, `translations` and `ids`.

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

## Licence

MIT. See [LICENSE](LICENSE).
