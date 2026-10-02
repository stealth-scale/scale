# @stealthscale/component-data

React components that display one value: `Badge`, `Status`, `Stat`, `Tag`, `ColorSwatch`, `Format`,
`Timestamp`, `Timer` and `QrCode`. Each component renders through a recipe, so a theme restyles it
by extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change is a recipe axis, and a caller sets it as a prop. A caller changes
the rendered element with `as`.

## Install

```bash
pnpm add @stealthscale/component-data
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks` and
`@stealthscale/provider-locale`, whose locale `Format` and `Timestamp` write in. It depends on
`@zag-js/i18n-utils` for the number and size formatters. An application lists the preset under
`./theme` among the presets its compiler installs.

## Badge

Renders a short label or a count. The looks are flat, so a badge does not repaint on hover,
including inside a hoverable row. Numerals are tabular, so a column of changing counts keeps its
width.

```tsx
import { Badge, BadgePropsProvider } from "@stealthscale/component-data";

<Badge>New</Badge>;
<Badge aria-label="3 failed" palette="error" radius="full">
  3
</Badge>;
<Badge palette="success">
  <CircleCheckIcon aria-hidden />
  Paid
</Badge>;
<BadgePropsProvider value={{ size: "sm", variant: "surface" }}>
  <Badge>Public</Badge>
  <Badge palette="success">Live</Badge>
</BadgePropsProvider>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`                   | `subtle`  |
| `size`    | `sm`, `md`, `lg`, `xl`                                             | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `radius`  | `l1`, `l2`, `l3`, `full`                                           | `l2`      |
| `effect`  | `glow`, `pulse`                                                    | none      |

The sizes match `Tag`: the height from the tag scale, the padding and gap from the gap scale, and
the text one size smaller. An `svg` child is 1em square, so an icon matches the text at every size.

`BadgePropsProvider` sets the variants of every badge below it. A prop on the badge overrides the
provider's. The recipe lists every palette in `staticCss`, so a palette set from data has a rule.

The element is a `span` with no role, so a screen reader announces only its text. A badge that
conveys a status by color states the status in its text or its `aria-label`, because WCAG 1.4.1
rejects color alone. Pass `role="status"` to announce a count as it changes. Under forced colors the
badge draws a hairline `CanvasText` outline.

## Status

Reports what something is doing now with a colored dot and a word.

```tsx
import { Status } from "@stealthscale/component-data";

<Status.Root palette="success">
  <Status.Indicator />
  Live
</Status.Root>;
<Status.Root effect="pulse" palette="success" size="inherit">
  <Status.Indicator />
  live
</Status.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |
| `size`    | `sm`, `md`, `lg`, `inherit`                                        | `md`      |
| `effect`  | `glow`, `pulse`                                                    | none      |

| Part        | Element | What it renders                         |
| ----------- | ------- | --------------------------------------- |
| `Root`      | `span`  | The dot and the word, on one line       |
| `Indicator` | `span`  | The dot, hidden from assistive software |

The word carries the meaning, so the status is readable without the color and a screen reader
announces the word alone. `palette` offers all eight semantic palettes, because a caller maps its
own states to them.

The root is a `span`, so a status is valid inside a paragraph, a table cell or a button. `inherit`
takes the font of the surrounding text, and the word is aligned on its baseline. The dot and the gap
are sized in `em`, so they follow the text at every size.

`pulse` animates a halo around the dot, the usual signal for a live connection, and stops when the
reader prefers reduced motion. The dot keeps its color in forced colors mode.

## Stat

Presents a figure with the label that names it and a line of help text, such as a change or a
comparison.

```tsx
import { Stat } from "@stealthscale/component-data";

<Stat.Root palette="success">
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>£48,200</Stat.ValueText>
  <Stat.HelpText>
    <Stat.Indicator>
      <ArrowUpIcon aria-hidden />
    </Stat.Indicator>
    +12% from last month
  </Stat.HelpText>
</Stat.Root>;
<Stat.Root size="sm">
  <Stat.Label>Time to settle</Stat.Label>
  <Stat.ValueText>
    3<Stat.ValueUnit>hr</Stat.ValueUnit>
  </Stat.ValueText>
</Stat.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |

| Part        | Element | What it renders                              |
| ----------- | ------- | -------------------------------------------- |
| `Root`      | `dl`    | The stat, as a description list              |
| `Label`     | `dt`    | The name of the figure                       |
| `ValueText` | `dd`    | The figure                                   |
| `ValueUnit` | `span`  | A unit after a number in the figure          |
| `HelpText`  | `dd`    | A change or a comparison under the figure    |
| `Indicator` | `span`  | The glyph that shows the direction of change |

`size` sets the figure's heading text style: 22.8px, 27.2px and 32.4px at the foundation's metrics.
The label and the help text keep their size. The figure uses tabular numerals, so a value that
updates in place keeps its width. The component formats nothing, so any number formatter can render
the figure.

`palette` colors the indicator only. The direction of a change and whether it is good are separate
facts, so the caller chooses both. A rise in revenue takes `success`, and a rise in open tickets
takes `error`. Pass the glyph with `aria-hidden` and write the direction in the help text with a
sign, such as `+12%`, which a screen reader announces.

The help text is a `dd`, because a description list may contain only terms and details as its direct
children.

## Tag

Labels something with a short word: a filter a person applied, the kind of thing a record is, or its
state. A mark goes at either end, and a close trigger removes the tag.

```tsx
import { Tag } from "@stealthscale/component-data";

<Tag.Root palette="info">
  <Tag.StartElement>
    <HashIcon aria-hidden />
  </Tag.StartElement>
  <Tag.Label>payouts</Tag.Label>
</Tag.Root>;
<Tag.Root palette="primary" variant="solid">
  <Tag.Label>{filter}</Tag.Label>
  <Tag.CloseTrigger aria-label={`Remove ${filter}`} onClick={remove}>
    <XIcon aria-hidden />
  </Tag.CloseTrigger>
</Tag.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`                   | `surface` |
| `size`    | `sm`, `md`, `lg`, `xl`                                             | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `neutral` |
| `radius`  | `l1`, `l2`, `l3`, `full`                                           | `l2`      |
| `effect`  | `glow`, `pulse`                                                    | none      |

| Part           | Element  | What it renders                 |
| -------------- | -------- | ------------------------------- |
| `Root`         | `span`   | The tag                         |
| `Label`        | `span`   | The text, cut with an ellipsis  |
| `StartElement` | `span`   | A mark before the label         |
| `EndElement`   | `span`   | A mark after the label          |
| `CloseTrigger` | `button` | The button that removes the tag |

`CloseTrigger` is a `button` with `type="button"`, and its props type requires `aria-label` or
`aria-labelledby`. Name what it removes, such as `Remove payouts`. Pass the glyph as its child. Its
focus ring is drawn inside its box, in the contrast ink on a solid tag. Under a coarse pointer its
hit area grows to a medium control's size.

The looks are flat, so a tag does not change under the pointer. A tag does not shrink in a row, so a
row of tags wraps. A tag is capped at its container's width, and its label is cut with an ellipsis
at that width. The whole label stays in the DOM. Marks and the close glyph are sized in `em`. In
forced colors mode every look draws a hairline outline.

## Color swatch

Shows a color as a box: the value a person picked, a token beside its name, or a theme's colors as
one mark.

```tsx
import { ColorSwatch, ColorSwatchMix } from "@stealthscale/component-data";

<ColorSwatch value="#D72323" />;
<ColorSwatch shape="circle" size="inherit" value={picked} />;
<ColorSwatchMix items={["#3E3636", "#D72323", "#F5EDED"]} shape="circle" size="lg" />;
```

| Axis    | Values                                                                  | Default   |
| ------- | ----------------------------------------------------------------------- | --------- |
| `size`  | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `full` and `inherit` | `md`      |
| `shape` | `square`, `rounded`, `circle`                                           | `rounded` |

`ColorSwatch` takes one color as `value`, and `ColorSwatchMix` takes two to four as `items`. Both
accept any notation CSS reads. The component writes the color to a custom property, because it is a
runtime value. A mix divides the box by the number of colors: two halves, two quarters over a half,
or four quarters. Its props type rejects a list of one or of five.

`size` follows the icon scale. `full` fills the container, and `inherit` takes the height of the
surrounding text. A checkerboard under the color shows a translucent color as translucent. A
hairline border gives a white swatch an edge on a white page. The color is kept in forced colors
mode.

The swatch has no text, so a screen reader reads nothing for it. Write the color's name or value
beside it wherever a person needs to read it.

## Format

Writes a figure or a size the way a locale writes it: the separators, the symbol and where the
symbol sits. Each renders a `data` element whose `value` is the number a machine reads.

```tsx
import { Format } from "@stealthscale/component-data";

<Format.Number options={{ currency: "EUR", style: "currency" }} value={1056430.5} />;
<Format.Byte value={1450000} />;
```

| Part            | Element | What it renders                                         |
| --------------- | ------- | ------------------------------------------------------- |
| `Format.Number` | `data`  | A number by the options of `Intl.NumberFormat`          |
| `Format.Byte`   | `data`  | A size in bytes or bits, in the largest unit it reaches |

- Both write in `locale`, else in the locale of the nearest `LocaleProvider`, which the shell
  renders, else in the runtime's default locale. Switching the application's locale writes every
  figure again.
- `Format.Number` takes the options of `Intl.NumberFormat` as one `options` object, such as
  `{ notation: "compact" }` or `{ signDisplay: "exceptZero", style: "percent" }`.
- `Format.Byte` takes `unit` (`byte` by default, or `bit`), `unitDisplay` (`short` by default,
  `long` or `narrow`), `unitSystem` (`decimal` by default, or `binary`) and `precision`, the
  significant digits in a larger unit, 3 by default. A size under one kilo-unit writes the unit's
  long name, "512 bytes", where `short` would write "512 byte" in English.
- Under `binary` a larger unit is 1024 of the smaller, and its name is still the decimal one: `Intl`
  names no kibibyte.
- The recipe has no axis. Numerals are tabular, and a figure does not wrap.

The formats do not offer a time or a relative time. `Timestamp` writes an instant.

## Timestamp

Renders an instant as a `time` element whose `dateTime` is the instant in ISO 8601. Its text is the
instant as a date, as the distance from now, or as both.

```tsx
import { Timestamp } from "@stealthscale/component-data";

<Timestamp value={order.placedAt} />;
<Timestamp now={readAt} reads="relative" value={payout.initiatedAt} />;
<Timestamp options={{ dateStyle: "long", timeZone: "Europe/Amsterdam" }} value={signedAt} />;
```

| Prop             | Values                                                           | Default                        |
| ---------------- | ---------------------------------------------------------------- | ------------------------------ |
| `value`          | a `Date`, milliseconds since the epoch, or a string `Date` reads | required                       |
| `reads`          | `absolute`, `relative`, `both`                                   | `absolute`                     |
| `options`        | the options of `Intl.DateTimeFormat`                             | a medium date and a short time |
| `locale`         | a locale                                                         | the locale in scope            |
| `now`            | a `Date` or milliseconds since the epoch                         | the clock at mount             |
| `updateInterval` | milliseconds                                                     | none                           |

- `absolute` writes the exact form. `relative` writes the distance from `now` and puts the exact
  form in `title`. `both` writes the distance followed by the exact form in the muted ink, and sets
  no `title`.
- A distance takes the largest unit that counts at least one, from seconds to years, with a month of
  30 days and a year of 365. The count is truncated. `Intl.RelativeTimeFormat` words it with
  `numeric: "auto"`: "yesterday", "now", "in 3 hours".
- The locale is `locale`, else the locale of the nearest `LocaleProvider`, else the runtime's
  default, as for `Format`.
- Pass one `now` to every row of a list, so the rows never drift apart and a page rendered on a
  server matches its hydration. Without `now` the clock is read once at mount. `updateInterval`
  reads it again every so many milliseconds, with one timer per timestamp.
- A browser shows a `title` on hover only. Where the exact instant is part of the record, such as a
  clinical reading, `reads="both"` puts it on the page for a touch screen, a keyboard and a screen
  reader.
- A value `Date` cannot read renders an empty `time` without `dateTime`.
- The element is not a live region, so a distance that updates announces nothing.
- The recipe has no axis. Numerals are tabular, and a timestamp does not wrap.

Not offered:

- A time of day without a date. A `Date` with `options={{ timeStyle: "short" }}` writes an instant's
  time.
- A threshold past which a distance turns into a date, a fixed tense, and a coarsest unit.

## Timer

Counts down to a target or up from a start in tabular figures, with buttons that start, pause,
resume, reset and restart the count.

```tsx
import { Timer } from "@stealthscale/component-data";

<Timer.Root autoStart countdown startMs={Timer.parse({ minutes: 15 })}>
  <Timer.Area>
    <Timer.Item type="minutes" />
    <Timer.Separator>:</Timer.Separator>
    <Timer.Item type="seconds" />
  </Timer.Area>
</Timer.Root>;
<Timer.Root interval={10}>
  <Timer.Area>
    <Timer.Item type="seconds" />
    <Timer.Separator>.</Timer.Separator>
    <Timer.Item type="milliseconds" />
  </Timer.Area>
  <Timer.Control>
    <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
    <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
    <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
    <Timer.ActionTrigger action="reset" variant="outline">
      Reset
    </Timer.ActionTrigger>
  </Timer.Control>
</Timer.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`                   | `plain`   |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | inherited |
| `effect`  | `glow`, `pulse`                                                    | none      |

| Part            | Element  | What it renders                                            |
| --------------- | -------- | ---------------------------------------------------------- |
| `Root`          | `div`    | The count above the buttons                                |
| `Area`          | `div`    | The count, in the `timer` role                             |
| `Item`          | `span`   | One unit of the count                                      |
| `Separator`     | `span`   | A mark between two units, hidden from assistive software   |
| `Control`       | `div`    | The row of buttons                                         |
| `ActionTrigger` | `button` | The library's `Button`, which runs one action of the timer |

The root takes the machine's options: `startMs`, `targetMs`, `countdown`, `interval`, `autoStart`,
`onTick` and `onComplete`. The count ticks every `interval` milliseconds, 1000 by default. A
countdown without `targetMs` runs to zero. `onTick` runs after the render that shows each new count,
with that count. `onComplete` runs in the frame that shows the target.

`Timer.parse` turns an object of `days`, `hours`, `minutes`, `seconds` and `milliseconds` into
milliseconds. It throws for an object that names none of the first four. A date string returns its
epoch milliseconds, so a countdown to a date passes the difference from `Date.now()`.

`size` sets the count's heading text style: 18, 22.8 and 32.4px at the foundation's scale. The root
passes `size` and `palette` to every `Button` inside it. A look other than `plain` sets each unit in
a tile of that flat look. Under forced colors a tile keeps a `CanvasText` edge. The figures are
tabular, so the count keeps its width while it ticks. An item pads its figures to two digits and the
milliseconds to three. Each unit wraps at the next unit, the minutes at 60 and the hours at 24. A
count that can pass an hour renders the hours.

The area has the `timer` role, a live region that announces nothing while the count ticks. Its name
is the time in words, such as "2 minutes, 5 seconds" in English. A page in another language passes
`label`, a function of the time, to the area.

The machine hides a trigger while its action does not apply: Start while the count runs or is
paused, Pause unless it runs, Resume unless it is paused, and Reset while it is idle. A hidden
trigger takes no room. A trigger that hides while it has focus moves focus to the first trigger that
shows. Enter on Start leaves focus on Pause, and a finished countdown leaves it on Start.

Not offered:

- The root takes no `translations`, because the area takes its name from `label`.
- The package does not export a root provider or a hook that returns the api. The parts read the
  machine from `Timer.Root`.
- A `Separator` after an item renders the item's unit, in place of the machine's item label and item
  value parts.
- A `Progress` reads the count from `onTick`, in place of the api's `progressPercent`.

## QR code

Encodes a value as a pattern a camera reads, with an optional mark over its middle and buttons that
download it as an image.

```tsx
import { QrCode } from "@stealthscale/component-data";

<QrCode.Root value="https://stealthscale.io/join/7fK2mQ">
  <QrCode.Frame label="QR code for the invite link">
    <QrCode.Pattern />
  </QrCode.Frame>
</QrCode.Root>;
<QrCode.Root palette="primary" size="lg" value={address}>
  <QrCode.Frame label="QR code for the pricing page">
    <QrCode.Pattern />
  </QrCode.Frame>
  <QrCode.Overlay>
    <ZapIcon />
  </QrCode.Overlay>
  <QrCode.DownloadTrigger fileName="pricing.png">Download PNG</QrCode.DownloadTrigger>
</QrCode.Root>;
```

| Axis      | Values                                                             | Default |
| --------- | ------------------------------------------------------------------ | ------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`                        | `md`    |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | none    |
| `effect`  | `glow`, `pulse`                                                    | none    |

| Part              | Element  | What it renders                                                    |
| ----------------- | -------- | ------------------------------------------------------------------ |
| `Root`            | `div`    | A grid with the code in its first cell and every other child below |
| `Frame`           | `svg`    | The code as an image, on its ground                                |
| `Pattern`         | `path`   | The dark modules                                                   |
| `Overlay`         | `div`    | A mark over the middle, hidden from assistive software             |
| `DownloadTrigger` | `button` | The library's `Button`, which downloads the code                   |

The root takes `value` or `defaultValue`, `encoding` and `pixelSize`. `encoding` states the
encoder's options: `ecc`, `border`, `boostEcc`, `minVersion`, `maxVersion`, `maskPattern` and
`invert`. The code keeps a quiet zone of four modules, the margin ISO/IEC 18004 asks for. While an
`Overlay` renders, the code encodes at error correction `H`, which recovers up to 30% of the code.
At the default `L`, a code under a mark a quarter of its side does not decode. `encoding` states
either value instead.

`size` sets the code's side: 64, 80, 128, 160, 192 and 256px, or the width of the container at
`full`. The frame and the mark render in the light scheme, so the code is dark on light on a dark
page as well. They keep their colors under forced colors, because the colors are the data. `palette`
colors the pattern and the mark in the palette's solid.

The frame is an image named "QR code" by default. Name it by what a scan does, such as "QR code to
join the Guest network". The value is not the default name, because a code can contain a secret,
such as an authenticator key or a network password.

A press on `DownloadTrigger` writes the code to a file named by `fileName`, as `image/png` unless
`mimeType` states `image/jpeg` or `image/svg+xml`. The image is black on white in any program that
opens it, with the mark, at the size the code renders at times the device pixel ratio. `quality`
sets the quality of a JPEG.

Not offered:

- The package does not export a root provider or a hook that returns the api. The root takes
  `value`, and `DownloadTrigger` writes the file.
- A status over the code, such as expired or scanned: an application renders it beside the code.

## Licence

MIT. See [LICENSE](LICENSE).
