# @stealthscale/component-actions

Renders what a person presses: the button, the square button that contains one glyph, the group of
buttons that stay pressed, the two marks a button swaps between, the toggle between light and dark,
the clipboard whose trigger copies a value, and the trigger that saves a file built in the page.
Every component binds a recipe or composes one and does not add styles of its own, so a theme
restyles every component by extending its recipe. The preset under `./theme` registers the recipes
with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-actions
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks` and
`@stealthscale/provider-color-mode`, whose `useColorMode` the color mode toggle reads. An
application lists the preset under `./theme` among the presets its compiler installs.

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
look draws an inset shadow. Under forced colors a button that is on fills with `Highlight` in every
look.

A control in a toolbar uses the ink of the text beside it. Set `palette="neutral"`.

## ToggleGroup

Renders buttons that stay pressed: one at a time, as a choice, or several at once, as a set of
toggles. The root runs the Zag toggle group machine and renders the layout package's `Group`, and
each item renders `Button`.

```tsx
import { ToggleGroup } from "@stealthscale/component-actions";

<ToggleGroup.Root aria-label="Text style" defaultValue={["bold"]} multiple variant="outline">
  <ToggleGroup.Item aria-label="Bold" shape="square" value="bold">
    <BoldIcon size="1em" />
  </ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Italic" shape="square" value="italic">
    <ItalicIcon size="1em" />
  </ToggleGroup.Item>
</ToggleGroup.Root>;
```

| Part   | Element  | What it renders                                |
| ------ | -------- | ---------------------------------------------- |
| `Root` | `div`    | The layout's `Group`, attached by default      |
| `Item` | `button` | The package's `Button`, pressed while it is on |

- `ToggleGroup.Root` takes `value`, `defaultValue`, `onValueChange`, `multiple`, `deselectable`
  (true by default), `orientation`, `disabled`, `loopFocus`, `rovingFocus`, `dir`, `id` and `ids`.
  `ToggleGroup.Item` takes `value` and `disabled`, and every prop of `Button`.
- Without `multiple` the root is a `radiogroup` and every item a radio with `aria-checked`. With
  `multiple` the root is a `group` and every item reports `aria-pressed`. Name the root with
  `aria-label` or `aria-labelledby`.
- The root passes `size`, `variant` and `palette` to every item. An item that is on takes its look's
  pressed fill. The solid look marks it with an inset shadow and a semibold label, which an icon
  does not show.
- `attached={false}` spaces the items by the group's `gap`. The group's other props, such as `grow`,
  pass through.
- The arrow keys, Home and End move focus between the items and skip a disabled one. Space and Enter
  toggle the focused item. In a `toolbar` the focus stops at either end.
- The group is one stop in the tab order. Tab enters it on its first item, and Shift+Tab returns to
  the item focused last.

## Swap

Renders two marks in one place and shows one of them. When the control around it changes state, one
mark leaves while the other enters. Both marks keep their room. The swap takes the size of the
larger mark and nothing beside it moves.

```tsx
import { IconButton, Swap } from "@stealthscale/component-actions";
import { Volume2Icon, VolumeXIcon } from "lucide-react";

<IconButton aria-label="Mute" aria-pressed={muted} onClick={toggle}>
  <Swap.Root swap={muted}>
    <Swap.Indicator type="on">
      <VolumeXIcon aria-hidden size="1em" />
    </Swap.Indicator>
    <Swap.Indicator type="off">
      <Volume2Icon aria-hidden size="1em" />
    </Swap.Indicator>
  </Swap.Root>
</IconButton>;
```

| Part        | Element | What it renders                                              |
| ----------- | ------- | ------------------------------------------------------------ |
| `Root`      | `span`  | The inline grid whose one cell both marks share              |
| `Indicator` | `span`  | One mark: `on` while `swap` is true, `off` while it is false |

| Axis     | Values                           | Default |
| -------- | -------------------------------- | ------- |
| `motion` | `scale`, `fade`, `slide`, `none` | `scale` |

- `Swap.Root` takes `swap`, false by default, and writes `data-swap` as `on` or `off`. `lazyMount`
  renders a mark only once it first shows. `unmountOnExit` removes a mark once it has left. Both are
  false by default and leave both marks in the document.
- The mark that leaves runs its exit motion while the other runs its entry. It is `inert` meanwhile
  and then carries `data-hidden`. The recipe renders `data-hidden` as `visibility: hidden`: a hidden
  mark keeps its room and leaves the accessibility tree. A swap that first renders shows its mark at
  rest.
- `scale` grows the entering mark from half its size and shrinks the leaving one, with a fade.
  `fade` fades them. `slide` moves the entering mark up from below and the leaving one up and out.
  `none` swaps them at once. Every motion swaps at once under reduced motion.
- The swap has no role and no name. The control around it states the state: a toggle button keeps
  one name and sets `aria-pressed`, and a button whose words change names the action a press takes
  and sets no `aria-pressed`. An icon mark is `aria-hidden`.

The swap does not offer these:

- `RootProvider` and `useSwap`. A caller passes `swap` from its own state.
- `hideMode`. A hidden mark keeps its room in every case.

## ColorModeToggle

Renders the button that switches the page between light and dark. It reads and sets the mode through
`useColorMode` from `@stealthscale/provider-color-mode`, so it needs a `ColorModeProvider` above it,
which the shell provider renders.

```tsx
import { ColorModeToggle } from "@stealthscale/component-actions";
import { MoonIcon, SunIcon } from "lucide-react";

<ColorModeToggle
  dark={<MoonIcon aria-hidden size="1em" />}
  light={<SunIcon aria-hidden size="1em" />}
/>;
```

- The toggle is the package's `Button` as a ghost, neutral square. Every button prop passes through,
  so a bar sets the size and the look its other controls use.
- `aria-pressed` is true while the page is dark. The name, "Dark mode" unless `label` is passed,
  stays the same in both states.
- The toggle shows the resolved mode. While the choice follows the operating system, it shows the
  mode the system chose, and a press stores the other mode as an explicit choice.
- `dark` and `light` are the caller's glyphs. They change places through `Swap` with its default
  motion.
- `onClick` runs before the mode changes, and a handler that calls `preventDefault` keeps the mode.

The toggle does not offer a choice to follow the operating system. A picker of light, dark and
system sets `setColorMode` from `useColorMode` itself.

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

## DownloadTrigger

Saves a file built in the page when pressed. The browser receives the file through an anchor with a
`download` attribute and an object URL that points at data in the page. The trigger renders
`Button`, and it takes the axes listed under [Button](#button) and the variants a
`ButtonPropsProvider` sets.

- `data` is a string, a `Blob` or a `File`, or a function that returns one or a promise of one. The
  trigger calls the function on each press to build the file when the reader asks for it.
- `fileName` is the name the browser saves the file under.
- `mimeType` sets the type of string data. A `Blob` or a `File` keeps its own type.

```tsx
import { download, DownloadTrigger } from "@stealthscale/component-actions";

<DownloadTrigger data={csv} fileName="ledger.csv" mimeType="text/csv" variant="outline">
  <DownloadIcon size="1em" />
  Download the ledger
</DownloadTrigger>;
<DownloadTrigger
  aria-label="Download ledger.csv"
  data={csv}
  fileName="ledger.csv"
  shape="square"
  variant="ghost"
>
  <DownloadIcon size="1em" />
</DownloadTrigger>;
```

`onClick` runs before the download. A handler that calls `preventDefault` cancels it.

While a `data` promise is pending, a page sets `aria-disabled` on the trigger and cancels a second
press in `onClick`. The trigger has no pending state of its own. `aria-disabled` keeps focus on the
trigger, where `disabled` would drop it:

```tsx
<DownloadTrigger
  aria-disabled={pending}
  data={compress}
  fileName="payouts.csv.gz"
  onClick={(event) => {
    if (pending) event.preventDefault();
  }}
>
  Download all payouts
</DownloadTrigger>
```

A control that is not a button, such as a menu row, calls `download` with the same options. The
promise it returns rejects when the `data` function throws or its promise rejects.

```tsx
<Menu.Root
  onSelect={() => void download({ data: csv, fileName: "ledger.csv", mimeType: "text/csv" })}
>
```

`download` saves text exactly as given and does not prepend a byte order mark. It creates its anchor
in the document of the window it runs in. It revokes the object URL one task after the click.

## Licence

MIT. See [LICENSE](LICENSE).
