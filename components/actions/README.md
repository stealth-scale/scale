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

Copies a value when its trigger is pressed and shows the copied state for a moment. The root runs
the Zag clipboard machine and holds the value. The parts:

- `Trigger` copies the value.
- `Indicator` shows `children` in the idle state and `copied` in the copied state.
- `Label` names the value, `Input` shows it read-only, and `ValueText` renders it inline.

`Clipboard.Trigger` takes its accessible name from `label`, "Copy to clipboard" by default, and from
`copiedLabel`, "Copied to clipboard" by default, during the copied state. A trigger with visible
text passes that text as `label` and shows `copiedLabel` during the copied state, so the accessible
name contains the visible label in both states (WCAG 2.5.3).

The trigger has no control styles. Render it as `Button` or `IconButton` with `as`, and set the
button variants through `ButtonPropsProvider`, because `as` does not retype the forwarded props.

```tsx
import { Button, ButtonPropsProvider, Clipboard } from "@stealthscale/component-actions";

<Clipboard.Root value="https://stealthscale.io/payouts/4109">
  <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
    <Clipboard.Trigger as={Button} copiedLabel="Copied" label="Copy the link">
      <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
        <CopyIcon size="1em" />
      </Clipboard.Indicator>
      <Clipboard.Indicator copied="Copied">Copy the link</Clipboard.Indicator>
    </Clipboard.Trigger>
  </ButtonPropsProvider>
</Clipboard.Root>;
```

Next to a field, the label names the input. The input is read-only but focusable and selectable, so
a person can copy by hand when the browser denies clipboard access:

```tsx
<Clipboard.Root value={link}>
  <Clipboard.Label>Link to the payout</Clipboard.Label>
  <Clipboard.Control>
    <Clipboard.Input as={Input} />
    <Clipboard.Trigger as={IconButton}>
      <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
        <CopyIcon size="1em" />
      </Clipboard.Indicator>
    </Clipboard.Trigger>
  </Clipboard.Control>
</Clipboard.Root>
```

`Clipboard.Consumer` passes the machine's API to a render function, for a custom control or for text
that changes with the state:

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

The root takes the machine options: `value` or `defaultValue`, `timeout` in milliseconds (3000 by
default), `onStatusChange`, `onValueChange` and `ids`. The root `size` sets the label and the gaps.
The field and the button take their size through `InputPropsProvider` and `ButtonPropsProvider`. The
clipboard has no colour or surface of its own, so it offers no `palette` or `effect` axis.

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

## Licence

MIT. See [LICENSE](LICENSE).
