# @stealthscale/component-forms

React components for form input, styled by the theme's recipes.

| Component       | Renders                                                        |
| --------------- | -------------------------------------------------------------- |
| `Fieldset`      | A group of fields under one legend                             |
| `Field`         | A control with its label, helper text, counter and error text  |
| `Checkbox`      | A box a person checks and unchecks                             |
| `CheckboxCard`  | A card a person checks and unchecks                            |
| `Switch`        | A track a person switches on and off                           |
| `RadioGroup`    | A set of options a person chooses one of                       |
| `RadioCard`     | A set of cards a person chooses one of                         |
| `SegmentGroup`  | A row of options with a thumb that slides to the chosen one    |
| `Input`         | A single-line text field                                       |
| `Textarea`      | A multi-line text field                                        |
| `InputGroup`    | One field box that contains fields, marks and addons           |
| `SearchInput`   | A search field with a search mark and a control that clears it |
| `InputMask`     | A field that formats what a person types to a pattern          |
| `PhoneInput`    | A phone number field with a country picker                     |
| `NumberInput`   | A number field with a button on either side that steps it      |
| `PasswordInput` | A password field with a button that shows or hides the value   |
| `PinInput`      | A row of boxes that take one character of a code each          |
| `Editable`      | A value as text that turns into a field in place               |
| `TagsInput`     | A field that turns typed text into tags a person can remove    |
| `Slider`        | A track a person drags one thumb or two along                  |
| `AngleSlider`   | A dial a person turns a thumb around to pick an angle          |
| `RatingGroup`   | A row of glyphs a person picks a score from                    |
| `FileUpload`    | A dropzone or a button that takes files, and the list of them  |
| `SignaturePad`  | A box a person signs in with a mouse, a pen or a finger        |
| `NativeSelect`  | The browser's own select in the box of a text field            |
| `Select`        | A field that opens a list of rows a person picks from          |
| `Combobox`      | A text field that narrows a list of rows as a person types     |
| `ColorPicker`   | A color field with a panel of an area, sliders and swatches    |
| `DateInput`     | A date field a person types into one segment at a time         |
| `DatePicker`    | A date field a person types into or picks from a calendar      |

Every value a theme can change is an axis of a component's recipe. Set it as a prop, and write no
style. Change the element a component renders with `as`. A component with parts is exported as a
namespace, such as `Field.Root` and `InputGroup.Root`.

The `./form` entry binds these components to `@stealthscale/provider-form`, so a whole form renders
from a JSON Schema. See [Forms from a schema](#forms-from-a-schema).

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks`, `@stealthscale/theme` and
`@stealthscale/provider-locale`. The phone input writes the names of countries in that package's
locale unless its `locale` prop states another. The package depends on `libphonenumber-js`, pinned
to one release, for the phone input's formatting and country metadata. List the preset under
`./theme` among the presets your compiler installs, with the primitives package's preset, which
styles the scroll area of a select's and a combobox's rows.

The `./form` entry also needs `@stealthscale/provider-form`, an optional peer, with its own peers.
The form renders recipes of the a11y, actions, data, disclosure, feedback, layout and primitives
component packages, so an application that compiles its stylesheet lists all seven among its
dependencies.

## Fieldset

`Fieldset` groups fields that belong together under one name.

```tsx
import { Field, Fieldset } from "@stealthscale/component-forms";

<Fieldset.Root disabled={!editable} orientation="horizontal">
  <Fieldset.Legend>Delivery</Fieldset.Legend>
  <Fieldset.HelperText>We deliver on weekdays.</Fieldset.HelperText>
  <Field.Root>
    <Field.Label>Address</Field.Label>
    <Field.Control />
  </Field.Root>
  <Fieldset.ErrorText>Fill in both before going on.</Fieldset.ErrorText>
</Fieldset.Root>;
```

| Axis          | Values                                | Default    |
| ------------- | ------------------------------------- | ---------- |
| `size`        | `sm`, `md`, `lg`                      | `md`       |
| `orientation` | `vertical`, `horizontal`              | `vertical` |
| `status`      | `info`, `success`, `warning`, `error` | none       |

| Part         | Element    | What it renders                                |
| ------------ | ---------- | ---------------------------------------------- |
| `Root`       | `fieldset` | The group, and the state its fields read       |
| `Legend`     | `legend`   | The group's name                               |
| `HelperText` | `p`        | What a person needs to know about the group    |
| `ErrorText`  | `p`        | What is wrong, or the status the group reports |

- `Fieldset.Root` takes `disabled` and `invalid`. Write the legend as the first child, because a
  browser names the group from the first `legend`.
- `disabled` is the element's own attribute: the browser disables every control in the group, takes
  it out of the tab order and out of the form's submission, and leaves the legend enabled. Fields
  inside take the disabled look. State `disabled` on a field to override it.
- The group's `size` reaches every field inside that states none, and the field passes it to its
  control.
- `Fieldset.ErrorText` renders while the group is invalid or reports a status, and sets
  `role="alert"` only while it is invalid. Use it for a fault of the group, such as no option chosen
  or two dates in the wrong order. A fault of one field goes in that field's error text.
- The legend reads the heading role one font size above the field labels, so it reads as the heading
  of the group. It floats, so the root's gap separates it from the next part.

## Field

`Field` wraps a control in a label, the text a person needs in advance, a count and what is wrong.

```tsx
import { Field } from "@stealthscale/component-forms";

<Field.Root invalid={!valid} maxLength={80} required>
  <Field.Label>
    Email
    <Field.RequiredIndicator />
  </Field.Label>
  <Field.Control type="email" />
  <Field.HelperText>We only write about invoices.</Field.HelperText>
  <Field.Counter />
  <Field.ErrorText>That address is not one we recognise.</Field.ErrorText>
</Field.Root>;
```

| Axis          | Values                                | Default    |
| ------------- | ------------------------------------- | ---------- |
| `size`        | `sm`, `md`, `lg`                      | `md`       |
| `orientation` | `vertical`, `horizontal`, `floating`  | `vertical` |
| `status`      | `info`, `success`, `warning`, `error` | none       |

| Part                | Element    | What it renders                                |
| ------------------- | ---------- | ---------------------------------------------- |
| `Root`              | `div`      | The grid, and the state every part reads       |
| `Label`             | `label`    | The control's name                             |
| `RequiredIndicator` | `span`     | A mark on a field that requires a value        |
| `OptionalIndicator` | `span`     | A mark on a field that does not require one    |
| `Control`           | `input`    | The control                                    |
| `Textarea`          | `textarea` | The package's `Textarea`, as the control       |
| `HelperText`        | `p`        | What a person needs to know in advance         |
| `Counter`           | `p`        | The length of the value against `maxLength`    |
| `ErrorText`         | `p`        | What is wrong, or the status the field reports |

- `Field.Root` takes `disabled`, `invalid`, `readOnly`, `required` and `maxLength`. Every part reads
  them, so state each once. The root's `size` also sizes the control.
- State `id` on the root when a label outside the field points at the control. The field derives the
  other identifiers from it, and generates one when you state none.
- `Field.Control` renders an `input`, and `as` renders another element. `Field.Textarea` renders the
  package's `Textarea` and takes its props, `grows` and `maxRows` included. A prop on the control
  overrides the field's.
- `Field.Counter` renders `12 / 80`: the length of the value in UTF-16 code units, the unit
  `maxLength` limits, against `maxLength`. Without `maxLength` it renders the length alone. The
  control lists the counter in `aria-describedby`. Pass children to count another way, such as by
  graphemes.
- `Field.ErrorText` renders while the field is invalid or reports a status, and sets `role="alert"`
  only while it is invalid. `Field.RequiredIndicator` renders only on a required field. Both read
  the palette `status` sets, which defaults to the error palette.
- `Field.OptionalIndicator` renders `(optional)` in the muted ink on a field that does not require a
  value, and nothing on a required one. Pass other words or a `Badge` as its children. A form where
  most fields are required marks its optional fields this way, in place of a required indicator on
  every other field.
- A floating label rests inside an empty text box or textarea, and rises above it while the box has
  focus or a value. A box inside an input group, such as a password input, floats the label too. The
  field reads whether the box is empty from `:placeholder-shown`, so give the box a placeholder. A
  single space works. The placeholder shows only while the box has focus.
- Another component in the field's place, such as a `NativeSelect`, a `RadioGroup` or a
  `SegmentGroup`, takes the control's column: the full width under the label, or the second column
  of a horizontal field.

## Checkbox

`Checkbox` renders a box a person checks and unchecks, and the text that names it.

```tsx
import { CheckIcon, MinusIcon } from "lucide-react";

import { Checkbox } from "@stealthscale/component-forms";

<Checkbox.Root name="terms" onCheckedChange={({ checked }) => setAccepted(checked === true)}>
  <Checkbox.Control>
    <Checkbox.Indicator>
      <CheckIcon strokeWidth={3} />
    </Checkbox.Indicator>
    <Checkbox.Indicator indeterminate>
      <MinusIcon strokeWidth={3} />
    </Checkbox.Indicator>
  </Checkbox.Control>
  <Checkbox.Label>Accept the terms</Checkbox.Label>
</Checkbox.Root>;
```

| Axis      | Values                                      | Default   |
| --------- | ------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                            | `md`      |
| `variant` | `solid`, `subtle`, `outline`                | `solid`   |
| `palette` | `primary`, `secondary`, `accent`, `neutral` | `primary` |
| `status`  | `info`, `success`, `warning`, `error`       | none      |
| `radius`  | `l1`, `l2`, `full`                          | `l1`      |
| `align`   | `center`, `start`                           | `center`  |
| `spread`  | `true`                                      | off       |
| `motion`  | `fade`, `rise`, `reveal`                    | none      |

| Part        | Element | What it renders                             |
| ----------- | ------- | ------------------------------------------- |
| `Root`      | `label` | The row, and the input it toggles           |
| `Control`   | `div`   | The box                                     |
| `Indicator` | `span`  | The mark for one checked state              |
| `Label`     | `span`  | The text that names the checkbox            |
| `Group`     | `div`   | A list of boxes whose values form one value |

- `Checkbox.Root` also takes `checked`, `defaultChecked`, `disabled`, `form`, `invalid`, `name`,
  `onCheckedChange`, `parent`, `readOnly`, `required` and `value`.
- A controlled box whose owner refuses a press keeps the state it was given, and so does the input a
  form submits.
- The root renders the input a form submits. Do not add an input of your own.
- Name the checkbox with `Checkbox.Label`, or state `aria-label` on the root for a box with no text.
- `checked` takes `true`, `false` or `"indeterminate"`. A partly-on box takes the same fill as a
  checked one. Set `indeterminate` on the indicator that renders the partly-on mark, and render a
  second indicator without it for the checked mark. A box that is never partly on needs one
  indicator.
- An `svg` in the indicator fills the box, so the mark scales with `size`. The box is 16, 20 and
  24px at `sm`, `md` and `lg`.
- `palette` sets the fill of a checked box. A `status` sets the edge and the fill, and overrides the
  palette.
- Set `align="start"` for a label that wraps. It puts the box on the first line instead of halfway
  down the text.
- Set `spread` for a settings row. The row takes the width it is given and puts the box at the far
  end.

Inside a `Field`, the checkbox takes the field's `disabled`, `invalid`, `readOnly`, `required` and
`size`, and its input lists the field's texts in `aria-describedby`. Inside a `Fieldset` with no
field around it, it takes the group's `disabled` and `size`. A prop stated on the checkbox overrides
both.

```tsx
<Field.Root invalid={!accepted} required>
  <Checkbox.Root>…</Checkbox.Root>
  <Field.HelperText>Read them before you continue.</Field.HelperText>
  <Field.ErrorText>Accept the terms to continue.</Field.ErrorText>
</Field.Root>
```

### Group

`Checkbox.Group` holds the values of its checked boxes as one array. A box joins the group by its
`value`, and a form submits each checked value under the group's `name`.

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Send payment reminders by</Fieldset.Legend>
  <Checkbox.Group allValues={channels} defaultValue={["email"]} name="channels">
    <Checkbox.Root parent>
      <Checkbox.Control>…</Checkbox.Control>
      <Checkbox.Label>All channels</Checkbox.Label>
    </Checkbox.Root>
    {channels.map((channel) => (
      <Checkbox.Root key={channel} value={channel}>
        <Checkbox.Control>…</Checkbox.Control>
        <Checkbox.Label>{names[channel]}</Checkbox.Label>
      </Checkbox.Root>
    ))}
  </Checkbox.Group>
</Fieldset.Root>
```

| Prop                              | What it sets                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `value`, `defaultValue`           | The values of the checked boxes, controlled or on the first render                   |
| `onValueChange`                   | Called with the new array after a press                                              |
| `name`                            | The name every box submits its value under                                           |
| `allValues`                       | The values a box marked `parent` checks and clears                                   |
| `maxSelectedValues`               | The largest number of values. At the limit every unchecked box is disabled           |
| `disabled`, `readOnly`, `invalid` | The state of every box. `invalid` defaults to the fieldset's                         |
| `orientation`                     | `vertical`, the default, or `horizontal`, a row that wraps                           |
| `size`                            | `sm`, `md` or `lg`, which every box without a size of its own takes. `md` by default |

- Wrap the group in `Fieldset.Root` with a `Fieldset.Legend`. The group is a `div` without a role,
  and the legend names the set. Put the fieldset's helper text straight after the legend and its
  error text after the group.
- A box marked `parent` is on while every value of `allValues` is checked, and partly on while some
  are. A press checks them all, unless all are checked, and then clears them. The parent submits
  nothing. The rows after it start one box and one gap further in, 22, 28 and 36px at `sm`, `md` and
  `lg`, so each box starts where the parent's label starts.
- A prop stated on a box overrides the group's, and both `onCheckedChange` handlers run.
- Every box is its own tab stop, and Space toggles the box with focus.
- The value lists the values in the order they were checked. A form submits them in the order of the
  boxes.
- Not offered: `required` on the group. `required` on a native box requires that one box, so check
  the value on submit and report the fault in the fieldset's error text.

## CheckboxCard

`CheckboxCard` renders a card a person checks and unchecks, with a title, a description, a box and
an optional addon row. It runs the checkbox's machine, so it takes the same options and a field's or
a fieldset's state the same way.

```tsx
import { CheckIcon } from "lucide-react";

import { CheckboxCard, Fieldset } from "@stealthscale/component-forms";

<Fieldset.Root orientation="horizontal">
  <Fieldset.Legend>Notify me by</Fieldset.Legend>
  <CheckboxCard.Root defaultChecked value="email">
    <CheckboxCard.Content>
      <CheckboxCard.Label>Email</CheckboxCard.Label>
      <CheckboxCard.Description>A summary every morning.</CheckboxCard.Description>
      <CheckboxCard.Control>
        <CheckboxCard.Indicator>
          <CheckIcon strokeWidth={3} />
        </CheckboxCard.Indicator>
      </CheckboxCard.Control>
    </CheckboxCard.Content>
    <CheckboxCard.Addon>Free</CheckboxCard.Addon>
  </CheckboxCard.Root>
</Fieldset.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `variant` | `solid`, `subtle`, `surface`, `outline`                            | `outline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `align`   | `start`, `center`                                                  | `start`   |
| `layout`  | `inline`, `stacked`                                                | `inline`  |

| Part          | Element | What it renders                         |
| ------------- | ------- | --------------------------------------- |
| `Root`        | `label` | The card, and the input it toggles      |
| `Content`     | `span`  | The grid of the words and the box       |
| `Label`       | `span`  | The card's title, which names its input |
| `Description` | `span`  | The words under the title               |
| `Control`     | `span`  | The box                                 |
| `Indicator`   | `span`  | The mark for one checked state          |
| `Addon`       | `span`  | The row under the card's divider        |

- `CheckboxCard.Root` also takes `checked`, `disabled`, `form`, `invalid`, `name`,
  `onCheckedChange`, `readOnly`, `required` and `value`.
- A controlled card whose owner refuses a press keeps the state it was given, and so does its input.
- The card's input is named by `Label` and lists `Description` and `Addon` in `aria-describedby`.
- The card and the radio card share their edges, fills, padding and text, and differ in the mark.
- A horizontal `Fieldset` lays the cards in rows of 12rem cards, every card in a row as tall as the
  tallest, and its legend names them.
- A partly-on card fills its box and not the card. Render an `Indicator` with `indeterminate` for
  its mark.
- The card renders the focus ring. The box keeps its size under a coarse pointer, because the card
  is the target.

## Switch

`Switch` renders a track a person switches on and off, and the text that names it.

```tsx
import { Switch } from "@stealthscale/component-forms";

<Switch.Root name="theme" onCheckedChange={({ checked }) => setDark(checked)} spread>
  <Switch.Label>Dark mode</Switch.Label>
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
</Switch.Root>;
```

| Axis      | Values                                      | Default   |
| --------- | ------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                            | `md`      |
| `variant` | `solid`, `subtle`, `outline`                | `solid`   |
| `palette` | `primary`, `secondary`, `accent`, `neutral` | `primary` |
| `status`  | `info`, `success`, `warning`, `error`       | none      |
| `radius`  | `l1`, `l2`, `full`                          | `full`    |
| `align`   | `center`, `start`                           | `center`  |
| `spread`  | `true`                                      | off       |

| Part      | Element | What it renders                   |
| --------- | ------- | --------------------------------- |
| `Root`    | `label` | The row, and the input it toggles |
| `Control` | `span`  | The track                         |
| `Thumb`   | `span`  | The knob inside the track         |
| `Label`   | `span`  | The text that names the switch    |

- `Switch.Root` also takes `checked`, `defaultChecked`, `disabled`, `form`, `invalid`, `name`,
  `onCheckedChange`, `readOnly`, `required` and `value`.
- The root renders the input a form submits, with `role="switch"` and `aria-checked`. Do not add an
  input of your own.
- A controlled switch whose owner refuses a press keeps the state it was given, and so does its
  input.
- Name the switch with `Switch.Label`, or state `aria-label` on the root.
- The track is 36, 40 and 44px wide at `sm`, `md` and `lg`. `Switch.Thumb` states no size. It fills
  the track's height less a 5px inset.
- The off thumb takes the field's edge color, at 3:1 against the track, and turns the status or
  error color with the edge. `palette` sets the fill of a checked track. A `status` overrides it.
- Under forced colors a checked thumb is filled and an off thumb is empty.
- Set `spread` for a settings row, with the label before the track. The row takes the width it is
  given and puts the track at the far end.

Inside a `Field`, the switch takes the field's `disabled`, `invalid`, `readOnly`, `required` and
`size`, and its input lists the field's texts in `aria-describedby`. Inside a `Fieldset` with no
field around it, it takes the group's `disabled` and `size`. A prop stated on the switch overrides
both.

## RadioGroup

`RadioGroup` renders a set of options a person chooses one of, each a circle and its words.

```tsx
import { RadioGroup } from "@stealthscale/component-forms";

<RadioGroup.Root defaultValue="next" name="window" onValueChange={({ value }) => setWindow(value)}>
  <RadioGroup.Label>Payout window</RadioGroup.Label>
  <RadioGroup.Item value="same">
    <RadioGroup.ItemControl />
    <RadioGroup.ItemText>Same day</RadioGroup.ItemText>
  </RadioGroup.Item>
  <RadioGroup.Item value="next">
    <RadioGroup.ItemControl />
    <RadioGroup.ItemText>Next day</RadioGroup.ItemText>
  </RadioGroup.Item>
</RadioGroup.Root>;
```

| Axis      | Values                                      | Default   |
| --------- | ------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                            | `md`      |
| `variant` | `solid`, `subtle`, `outline`                | `solid`   |
| `palette` | `primary`, `secondary`, `accent`, `neutral` | `primary` |
| `status`  | `info`, `success`, `warning`, `error`       | none      |
| `align`   | `center`, `start`                           | `center`  |

| Part          | Element | What it renders                            |
| ------------- | ------- | ------------------------------------------ |
| `Root`        | `div`   | The group, in the `radiogroup` role        |
| `Label`       | `span`  | The group's name                           |
| `Item`        | `label` | One option's row, and the input it checks  |
| `ItemControl` | `span`  | The circle, with a dot while it is checked |
| `ItemText`    | `span`  | The words that name the option             |

- `RadioGroup.Root` also takes `value`, `disabled`, `form`, `invalid`, `orientation`, `readOnly`,
  `required`, `dir`, `id` and `ids`. `RadioGroup.Item` takes `value`, `disabled` and `invalid`.
- Each item renders the input a form submits. Do not add an input of your own. The inputs share
  `name`, or the group's `id` when you state none, so the arrow keys move between them. Give every
  group on a page its own `name`.
- A value may contain spaces. The group percent-encodes it in the IDs it builds from it.
- The group is named by `RadioGroup.Label` while one is rendered. Without it, the label of a `Field`
  or the legend of a `Fieldset` around the group names it. State `aria-label` or `aria-labelledby`
  on the root to name it yourself.
- An option is as wide as its circle and its words, so a press beside the words does not check it.
- `orientation="horizontal"` lays the options in a row that wraps, with the label on a line of its
  own.
- A read-only group shows its value and cancels every press. The group does not disable its inputs,
  so they take focus and a form submits the value.
- The circle is 16, 20 and 24px at `sm`, `md` and `lg`. `palette` sets the fill of the checked
  circle, and a `status` sets the edge and the fill over it.

Inside a `Field`, the group takes the field's `disabled`, `invalid`, `readOnly`, `required` and
`size`, and lists the field's texts in `aria-describedby`. Inside a `Fieldset` with no field around
it, it takes the group's `disabled`, `invalid` and `size`. A prop stated on the group overrides
each.

For a row of options with a sliding thumb, use `SegmentGroup`. For a description under each option,
use `RadioCard`.

## RadioCard

`RadioCard` renders a set of cards a person chooses one of, each with a title, a description, a
circle and an optional addon row. It runs the radio group's machine, so it takes the same options,
and it is named and takes a field's or a fieldset's state the same way.

```tsx
import { RadioCard } from "@stealthscale/component-forms";

<RadioCard.Root defaultValue="next" name="speed" orientation="horizontal">
  <RadioCard.Label>Delivery speed</RadioCard.Label>
  <RadioCard.Item value="next">
    <RadioCard.ItemContent>
      <RadioCard.ItemText>Next day</RadioCard.ItemText>
      <RadioCard.ItemDescription>Leaves the warehouse overnight.</RadioCard.ItemDescription>
      <RadioCard.ItemIndicator />
    </RadioCard.ItemContent>
    <RadioCard.ItemAddon>£4.95</RadioCard.ItemAddon>
  </RadioCard.Item>
</RadioCard.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `variant` | `solid`, `subtle`, `surface`, `outline`                            | `outline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `align`   | `start`, `center`                                                  | `start`   |
| `layout`  | `inline`, `stacked`                                                | `inline`  |

| Part              | Element | What it renders                         |
| ----------------- | ------- | --------------------------------------- |
| `Root`            | `div`   | The set, in the `radiogroup` role       |
| `Label`           | `span`  | The set's name                          |
| `Item`            | `label` | One card, and the input it checks       |
| `ItemContent`     | `span`  | The grid of the words and the circle    |
| `ItemText`        | `span`  | The card's title, which names its radio |
| `ItemDescription` | `span`  | The words under the title               |
| `ItemIndicator`   | `span`  | The circle                              |
| `ItemAddon`       | `span`  | The row under the card's divider        |

- The input of each card is named by `ItemText` and lists `ItemDescription` and `ItemAddon` in
  `aria-describedby`.
- A horizontal set lays the cards in columns of at least 12rem that share the width and wrap when
  the width runs out. Every card in a row is as tall as the tallest, and the addon rows line up.
- A press anywhere on a card checks it, and the card renders the focus ring.
- `layout="stacked"` puts the circle above the words. `align="center"` centres the words, the circle
  and the addon.
- A disabled card fills with `bg.subtle` and dims its words and its circle.
- Under forced colors the checked card's edge is `Highlight`, because every look's fill and palette
  edge give way to the system colors.
- An invalid card takes the error edge on every look, checked or not.

## SegmentGroup

`SegmentGroup` renders a few options side by side, one of them chosen, with a thumb that slides to
the chosen option. It runs the radio group's machine, so it takes the same options, and it takes a
field's or a fieldset's state the same way.

```tsx
import { SegmentGroup } from "@stealthscale/component-forms";

<SegmentGroup.Root aria-label="Reporting period" defaultValue="month" onValueChange={choose}>
  <SegmentGroup.Item value="week">
    <SegmentGroup.ItemText>Week</SegmentGroup.ItemText>
  </SegmentGroup.Item>
  <SegmentGroup.Item value="month">
    <SegmentGroup.ItemText>Month</SegmentGroup.ItemText>
  </SegmentGroup.Item>
</SegmentGroup.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                                       | `md`      |
| `variant` | `solid`, `surface`, `outline`                                      | `surface` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |
| `fitted`  | `true`                                                             | off       |
| `iconic`  | `true`                                                             | off       |

| Part       | Element | What it renders                                   |
| ---------- | ------- | ------------------------------------------------- |
| `Root`     | `div`   | The track and the thumb, in the `radiogroup` role |
| `Item`     | `label` | One option, and the input it checks               |
| `ItemText` | `span`  | The words that name the option                    |

- `SegmentGroup.Root` also takes `value`, `disabled`, `form`, `invalid`, `name`, `readOnly`,
  `required`, `dir`, `id` and `ids`. `SegmentGroup.Item` takes `value`, `disabled` and `invalid`.
- The options run in a row. `orientation="vertical"` stacks them, and the up and down arrow keys
  move the choice.
- The track is a control's height, 32 to 48px from `xs` to `xl`, so a group is level with a button
  or an input of the same size. The thumb slides to the chosen option at the theme's move pace and
  jumps under reduced motion.
- The root renders the thumb. Do not add one of your own.
- The group has no label part. Name it with `aria-label` or `aria-labelledby`, or with the label of
  a `Field` or the legend of a `Fieldset` around it.
- An icon goes before `ItemText`. It is one icon size smaller than the group's size. `iconic`
  squares every option and hides its words visually. The words remain the radio's name.
- `fitted` fills the width of the container and gives every option an equal share. Words wider than
  their option end in an ellipsis.
- A group with no value renders no thumb. A read-only group shows its value and cancels every press.
- Under forced colors the thumb is `Highlight` and the chosen words are `HighlightText`.
- Until the machine measures the chosen option, which covers a server render, the option renders the
  thumb's fill itself.

## Input

`Input` renders a single-line text field.

```tsx
import { Input } from "@stealthscale/component-forms";

<Input aria-label="Search invoices" placeholder="Search" size="sm" variant="subtle" />;
<Input aria-invalid aria-label="Email" defaultValue="ada@example" type="email" />;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |

- The sizes read the control scale. An input and a button of the same size are the same height. The
  inline inset is one size smaller than the button's: 12px at `md`.
- Name the field with a `label` that points at it, with `aria-label`, or by composing it into
  `Field`. A screen reader announces a field without a name as "edit text".
- Set `aria-invalid` on a field whose value is wrong. The invalid styling reads that attribute, so
  the styling and the screen reader report the same state.
- `subtle` and `flushed` draw a block-end edge only. On keyboard focus the edge widens to 2px in the
  ring color, and the text stays where it is.
- A read-only field that is not disabled dashes its edges on every look.

## NativeSelect

`NativeSelect` renders the browser's own `select` in the box of a text field. What opens is the
platform's picker, which a phone shows full screen. Use it for a long list, or where a page works
without JavaScript.

```tsx
import { NativeSelect } from "@stealthscale/component-forms";
import { ChevronDownIcon } from "lucide-react";

<NativeSelect.Root size="sm">
  <NativeSelect.Field aria-label="Account" placeholder="Pick an account">
    <option value="bridge">Bridge Ledger</option>
    <option value="halden">Halden & Co</option>
  </NativeSelect.Field>
  <NativeSelect.Indicator>
    <ChevronDownIcon />
  </NativeSelect.Indicator>
</NativeSelect.Root>;
```

| Axis      | Values                                | Default   |
| --------- | ------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`          | `md`      |
| `variant` | `outline`, `subtle`, `flushed`        | `outline` |
| `status`  | `info`, `success`, `warning`, `error` | none      |

| Part        | Element  | What it renders                                  |
| ----------- | -------- | ------------------------------------------------ |
| `Root`      | `div`    | The box, with the variants                       |
| `Field`     | `select` | The browser's select, with the options           |
| `Indicator` | `span`   | The mark the caller passes, over the field's end |

- The field draws the theme's field looks and reads the control scale, so a select and an input of
  one size match. Its end inset leaves room for the indicator, which is one icon size smaller than
  the control.
- The indicator takes no pointer, so a press on it opens the select. It dims with a disabled field
  and takes the error ink beside an invalid one. Pass the mark, such as a chevron.
- Inside a `Field` the select takes the field's control ID, which the label points at, the helper
  and the error text as its description, and the invalid, disabled and required states. A prop you
  state overrides each. The root takes the field's size unless it states its own.
- `placeholder` renders a first option with an empty value, which a required select does not accept.
- Put options in `optgroup` elements for labelled groups. The recipe sets only the options' ground,
  so the platform's picker follows the page's color scheme.

## Select

`Select` renders a field that opens a list of rows a person picks one or more values from. The
trigger is a `combobox`, the panel is a `listbox`, and a hidden `select` submits the value with a
form.

```tsx
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { useListCollection } from "@stealthscale/component-collections";
import { Select } from "@stealthscale/component-forms";

const { collection } = useListCollection({
  itemToString: (account) => account.name,
  itemToValue: (account) => account.id,
  rows: accounts,
});

<Select.Root collection={collection} name="account">
  <Select.Label>Account</Select.Label>
  <Select.Control>
    <Select.Trigger>
      <Select.ValueText placeholder="Pick an account" />
    </Select.Trigger>
    <Select.ClearTrigger>
      <XIcon />
    </Select.ClearTrigger>
    <Select.Indicator>
      <ChevronDownIcon />
    </Select.Indicator>
  </Select.Control>
  {createPortal(
    <Select.Positioner>
      <Select.Content>
        {collection.items.map((account) => (
          <Select.Item item={account} key={account.id}>
            <Select.ItemText item={account}>{account.name}</Select.ItemText>
            <Select.ItemIndicator item={account}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Positioner>,
    document.body,
  )}
</Select.Root>;
```

| Axis        | Values                                | Default   |
| ----------- | ------------------------------------- | --------- |
| `size`      | `sm`, `md`, `lg`                      | `md`      |
| `variant`   | `outline`, `subtle`, `flushed`        | `outline` |
| `status`    | `info`, `success`, `warning`, `error` | none      |
| `highlight` | `tint`, `fill`, `bar`                 | `tint`    |

| Part              | Element  | What it renders                                                   |
| ----------------- | -------- | ----------------------------------------------------------------- |
| `Root`            | `div`    | The label above the control, and the hidden `select` a form sends |
| `Label`           | `label`  | The name of the trigger and the panel                             |
| `Control`         | `div`    | The box the clear trigger and the indicator are placed in         |
| `Trigger`         | `button` | The `combobox` that shows the value and opens the panel           |
| `ValueText`       | `span`   | The selected items' labels, or the placeholder                    |
| `ClearTrigger`    | `button` | A square button that clears the value, before the indicator       |
| `Indicator`       | `span`   | The mark the caller passes, over the trigger's end                |
| `Positioner`      | `div`    | The element the machine places under the trigger                  |
| `Content`         | `div`    | The panel, around a scroll area whose viewport is the `listbox`   |
| `ItemGroup`       | `div`    | A `group` of rows, named by its label                             |
| `ItemGroupLabel`  | `span`   | The name of a group                                               |
| `Item`            | `div`    | One `option` row                                                  |
| `ItemLines`       | `span`   | The column of a row's text and its description                    |
| `ItemText`        | `span`   | A row's words                                                     |
| `ItemDescription` | `span`   | A second line under a row's words                                 |
| `ItemIndicator`   | `span`   | The mark the caller passes, at the end of a selected row          |

- `Select.Root` takes the machine's options: `collection`, `value`, `defaultValue`, `onValueChange`,
  `multiple`, `deselectable`, `closeOnSelect`, `open`, `defaultOpen`, `onOpenChange`,
  `highlightedValue`, `defaultHighlightedValue`, `onHighlightChange`, `onSelect`, `loopFocus`,
  `positioning`, `scrollToIndexFn`, `composite`, `disabled`, `invalid`, `readOnly`, `required`,
  `name`, `form`, `autoComplete`, `onFocusOutside`, `onInteractOutside`, `onPointerDownOutside`,
  `dir`, `id`, `ids` and `getRootNode`. `lazyMount`, `unmountOnExit`, `onExitComplete` and
  `skipAnimationOnMount` apply to the panel.
- `collection` is a list collection, such as the one the collections package's `useListCollection`
  returns. A row the collection disables keeps its place, and the keys step past it.
- The panel opens under the trigger and as wide as it, at most 24rem tall, and above the trigger
  where the window has no room below. Render the positioner in a portal when the select is inside an
  element that clips.
- The rows scroll in the primitives package's scroll area inside the panel, with the theme's thin
  bar at the panel's end edge. The scroll area's viewport is the `listbox`, so the element that has
  focus is the element that scrolls. A row the keys highlight scrolls into view by the least
  distance, unless `scrollToIndexFn` replaces the machine's reveal. The scroll area draws no focus
  ring, because the highlighted row shows where the keys go.
- `as` on `Select.Content` renders the panel as another element. Every other prop goes to the
  `listbox`.
- A press, Enter, Space or ArrowDown on the trigger opens the panel and moves focus into it. The
  highlight starts on the selected row, and a key that opens an empty select starts it on the first
  row. The arrow keys, Home, End and typed letters move the highlight, and Enter or Space selects.
  On a closed single select the arrow keys, Home, End and typed letters change the value without
  opening the panel.
- A press on a row selects it and closes the panel. With `multiple` a press toggles a row and leaves
  the panel open. The value text joins the labels with commas, unless a function child renders the
  selected items.
- Escape and a press outside close the panel and return focus to the trigger. Tab and Shift+Tab move
  focus on from the trigger. The panel closes as focus leaves it.
- The clear trigger is hidden while nothing is selected, and is named by `label`, which defaults to
  `Clear value`. It returns focus to the trigger once it clears the value. The open panel closes
  when the clear trigger takes focus.
- The trigger is 36, 40 and 44px tall from `sm` to `lg`, the heights of an input of the same size. A
  row's text starts on the line the value starts on. The check at a row's end ends on the
  indicator's line.
- The hidden `select` submits the value under `name`, and a browser's autofill sets it through
  `autoComplete`. A single select's hidden `select` has an empty first option, so `required` refuses
  an empty value.
- A row's ID encodes its value, so a value with a space still makes one valid ID for
  `aria-activedescendant`.
- Without `Select.Label` and outside a field, name the trigger with `aria-label`. The panel takes
  the same name.
- The panel has no search field. Use `Combobox` where a person types to narrow the rows.

Inside a `Field`, the hidden `select` takes the field's control ID, so the field's label points at
it and a press on the label moves focus to the trigger. The trigger is named after the field's
label, lists the field's texts in `aria-describedby`, and takes the field's `disabled`, `invalid`,
`readOnly`, `required` and `size`. Inside a `Fieldset` with no field around it, the select takes the
group's `disabled` and `size`. A prop stated on the root overrides each.

## Combobox

`Combobox` renders a text field that narrows a list of rows as a person types. The input is a
`combobox`, the panel is a `listbox`, and a hidden `select` submits the value, not the text, with a
form.

```tsx
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { useListCollection } from "@stealthscale/component-collections";
import { Combobox } from "@stealthscale/component-forms";

const { collection, narrow } = useListCollection({
  itemToString: (account) => account.name,
  itemToValue: (account) => account.id,
  rows: accounts,
});

<Combobox.Root
  collection={collection}
  name="account"
  onInputValueChange={({ inputValue, reason }) => {
    narrow(reason === "input-change" ? inputValue : "");
  }}
>
  <Combobox.Label>Account</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input placeholder="Search accounts" />
    <Combobox.ClearTrigger>
      <XIcon />
    </Combobox.ClearTrigger>
    <Combobox.Trigger>
      <ChevronDownIcon />
    </Combobox.Trigger>
  </Combobox.Control>
  {createPortal(
    <Combobox.Positioner>
      <Combobox.Content>
        <Combobox.Empty>No account matches.</Combobox.Empty>
        {collection.items.map((account) => (
          <Combobox.Item item={account} key={account.id}>
            <Combobox.ItemText item={account}>{account.name}</Combobox.ItemText>
            <Combobox.ItemIndicator item={account}>
              <CheckIcon />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox.Positioner>,
    document.body,
  )}
</Combobox.Root>;
```

| Axis        | Values                                | Default   |
| ----------- | ------------------------------------- | --------- |
| `size`      | `sm`, `md`, `lg`                      | `md`      |
| `variant`   | `outline`, `subtle`, `flushed`        | `outline` |
| `status`    | `info`, `success`, `warning`, `error` | none      |
| `highlight` | `tint`, `fill`, `bar`                 | `tint`    |

| Part              | Element  | What it renders                                                     |
| ----------------- | -------- | ------------------------------------------------------------------- |
| `Root`            | `div`    | The label above the control, and the hidden `select` a form submits |
| `Label`           | `label`  | The name of the input and the panel                                 |
| `Control`         | `div`    | The box the triggers are placed in, which the panel opens under     |
| `Input`           | `input`  | The `combobox` a person types into                                  |
| `ClearTrigger`    | `button` | A square button that clears the value, before the trigger           |
| `Trigger`         | `button` | A square button at the input's end that opens and closes the panel  |
| `Positioner`      | `div`    | The element the machine places under the control                    |
| `Content`         | `div`    | The panel, around a scroll area whose viewport is the `listbox`     |
| `Empty`           | `div`    | A message while no row matches, which a screen reader hears         |
| `ItemGroup`       | `div`    | A `group` of rows, named by its label                               |
| `ItemGroupLabel`  | `span`   | The name of a group                                                 |
| `Item`            | `div`    | One `option` row                                                    |
| `ItemLines`       | `span`   | The column of a row's text and its description                      |
| `ItemText`        | `span`   | A row's words                                                       |
| `ItemDescription` | `span`   | A second line under a row's words                                   |
| `ItemIndicator`   | `span`   | The mark the caller passes, at the end of a selected row            |

- `Combobox.Root` takes the machine's options: `collection`, `value`, `defaultValue`,
  `onValueChange`, `inputValue`, `defaultInputValue`, `onInputValueChange`, `multiple`,
  `closeOnSelect`, `selectionBehavior`, `inputBehavior`, `allowCustomValue`, `alwaysSubmitOnEnter`,
  `open`, `defaultOpen`, `onOpenChange`, `openOnClick`, `openOnChange`, `openOnKeyPress`,
  `highlightedValue`, `defaultHighlightedValue`, `onHighlightChange`, `onSelect`, `loopFocus`,
  `positioning`, `navigate`, `scrollToIndexFn`, `disableLayer`, `autoFocus`, `disabled`, `invalid`,
  `readOnly`, `required`, `placeholder`, `name`, `form`, `onFocusOutside`, `onInteractOutside`,
  `onPointerDownOutside`, `dir`, `id`, `ids` and `getRootNode`. `lazyMount`, `unmountOnExit`,
  `onExitComplete` and `skipAnimationOnMount` apply to the panel.
- `collection` is a list collection. The collections package's `useListCollection` returns one and a
  `narrow` function. Narrow the rows on `input-change` only. Restore every row for any other reason,
  because a pick writes the row's words into the input. A list narrowed to those words offers one
  row the next time it opens.
- Typing opens the panel, and so do ArrowDown and ArrowUp. `openOnClick` also opens it on a press on
  the input. The trigger opens and closes it. Focus stays on the input while `aria-activedescendant`
  points at the highlighted row. `inputBehavior="autohighlight"` highlights the first matching row
  as a person types. Enter then picks it.
- Enter picks the highlighted row. With `multiple` a pick adds the row, clears the text and leaves
  the panel open. Show the value in your own list of tags. Escape closes the panel, and a second
  Escape restores the value's text.
- Emptying the text of a single combobox clears its value. Leaving the input with a text that
  matches no pick restores the value's text, or clears the text of a multiple combobox, unless
  `allowCustomValue` is set.
- Without `allowCustomValue` the hidden `select` submits the values under `name`, `required` refuses
  an empty value, and the input reports `aria-required`. A reset of the form restores the first
  value. With `allowCustomValue` the input takes `name` and `required`, and a form submits the text.
- `Combobox.Empty` renders while the collection is empty, as a row a person cannot pick, and
  announces its words through the page's polite live region. An open panel hides unless it has rows
  or an empty message.
- The trigger and the clear trigger are out of the tab order, because the keys open the panel and
  emptying the text clears the value. They are named by `label`, which defaults to
  `Toggle suggestions` and `Clear value`. The clear trigger is hidden while nothing is selected.
- The panel opens under the control and as wide as it, at most 24rem tall, and above the control
  where the window has no room below. Render the positioner in a portal when the combobox is inside
  an element that clips.
- The rows scroll in the primitives package's scroll area inside the panel, whose viewport is the
  `listbox`, as in the select. A row the keys highlight scrolls into view by the least distance,
  unless `scrollToIndexFn` replaces the machine's reveal. `as` on `Combobox.Content` renders the
  panel as another element, and every other prop goes to the `listbox`.
- The input is 36, 40 and 44px tall from `sm` to `lg`, the heights of an input of the same size. The
  trigger's glyph ends on the line the rows' checks end on, and a row's text starts on the line the
  input's text starts on.
- Without `Combobox.Label` and outside a field, name the input with `aria-label`. The panel takes
  the same name.
- Not offered: `composite` and a `List` part (the panel is the `listbox`), an indicator group (the
  recipe places both triggers), a focusable trigger, and `translations` (the triggers take `label`).

Inside a `Field`, the input takes the field's control ID, so the field's label names it. The input
lists the field's texts in `aria-describedby`, and takes the field's `disabled`, `invalid`,
`readOnly`, `required` and `size`. Inside a `Fieldset` with no field around it, the combobox takes
the group's `disabled` and `size`. A prop stated on the root overrides each.

## ColorPicker

`ColorPicker` renders a color field: a hex input and a trigger that opens a panel of an area,
channel sliders, channel inputs and swatches. The trigger is named by the label and the color, and a
hidden input submits the color with a form.

```tsx
import { CheckIcon, PipetteIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { ColorPicker } from "@stealthscale/component-forms";

<ColorPicker.Root defaultValue="#2563EB" name="brand">
  <ColorPicker.Label>Brand color</ColorPicker.Label>
  <ColorPicker.Control>
    <ColorPicker.ChannelInput channel="hex" />
    <ColorPicker.EyeDropperTrigger>
      <PipetteIcon />
    </ColorPicker.EyeDropperTrigger>
    <ColorPicker.Trigger>
      <ColorPicker.ValueSwatch />
    </ColorPicker.Trigger>
  </ColorPicker.Control>
  {createPortal(
    <ColorPicker.Positioner>
      <ColorPicker.Content>
        <ColorPicker.Area>
          <ColorPicker.AreaBackground />
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.ChannelSlider channel="hue">
          <ColorPicker.ChannelSliderTrack>
            <ColorPicker.ChannelSliderThumb />
          </ColorPicker.ChannelSliderTrack>
        </ColorPicker.ChannelSlider>
        <ColorPicker.SwatchGroup aria-label="Presets">
          {presets.map((preset) => (
            <ColorPicker.SwatchTrigger key={preset.value} label={preset.name} value={preset.value}>
              <ColorPicker.Swatch />
              <ColorPicker.SwatchIndicator>
                <CheckIcon />
              </ColorPicker.SwatchIndicator>
            </ColorPicker.SwatchTrigger>
          ))}
        </ColorPicker.SwatchGroup>
      </ColorPicker.Content>
    </ColorPicker.Positioner>,
    document.body,
  )}
</ColorPicker.Root>;
```

| Axis      | Values                                | Default   |
| --------- | ------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                      | `md`      |
| `variant` | `outline`, `subtle`, `flushed`        | `outline` |
| `status`  | `info`, `success`, `warning`, `error` | none      |

| Part                     | Element  | What it renders                                                  |
| ------------------------ | -------- | ---------------------------------------------------------------- |
| `Root`                   | `div`    | The label above the control, and the hidden input a form submits |
| `Label`                  | `label`  | The name of the hex input, the trigger and the panel             |
| `Control`                | `div`    | The row of the hex input and the trigger                         |
| `Trigger`                | `button` | A square in the look of a field around the value swatch          |
| `ValueSwatch`            | `span`   | The color over a checkerboard, an image named by the color       |
| `ValueText`              | `span`   | The color as text                                                |
| `Positioner`             | `div`    | The element the machine places under the trigger                 |
| `Content`                | `div`    | The panel: a `dialog`, or a plain box in place when `inline`     |
| `Area`                   | `div`    | A `group` a person drags across to set two channels at once      |
| `AreaBackground`         | `div`    | The gradient of the area's two channels                          |
| `AreaThumb`              | `div`    | The area's `slider`                                              |
| `ChannelSlider`          | `div`    | One channel's label and value text above its track               |
| `ChannelSliderLabel`     | `span`   | The visible name of a slider                                     |
| `ChannelSliderValueText` | `span`   | A slider's value as text                                         |
| `ChannelSliderTrack`     | `div`    | The gradient of the channel's range, which the thumb moves along |
| `ChannelSliderThumb`     | `div`    | The track's `slider`, which goes inside the track                |
| `ChannelInput`           | `input`  | A text input for hex or CSS, or a number input for one channel   |
| `SwatchGroup`            | `div`    | A `group` of swatch triggers                                     |
| `SwatchTrigger`          | `button` | A toggle that sets a preset color                                |
| `Swatch`                 | `span`   | A preset color over a checkerboard                               |
| `SwatchIndicator`        | `span`   | The mark the caller passes, on the swatch of the picker's color  |
| `EyeDropperTrigger`      | `button` | A button that picks a color from the screen, where a browser can |
| `FormatTrigger`          | `button` | A button that moves the picker to its next format                |
| `View`                   | `div`    | Its children while its format is in force                        |

- `ColorPicker.Root` takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onValueChangeEnd`, `format`, `defaultFormat`, `onFormatChange`, `open`, `defaultOpen`,
  `onOpenChange`, `inline`, `closeOnSelect`, `openAutoFocus`, `initialFocusEl`, `positioning`,
  `disabled`, `invalid`, `readOnly`, `required`, `name`, `onFocusOutside`, `onInteractOutside`,
  `onPointerDownOutside`, `dir`, `id`, `ids` and `getRootNode`. `locale` sets the language of the
  thumbs' value texts. `lazyMount`, `unmountOnExit`, `onExitComplete` and `skipAnimationOnMount`
  apply to the panel.
- `value` and `defaultValue` take a `Color` or any CSS color string, `#000000` by default.
  `ColorPicker.parseColor` turns a string into a `Color`, and `onValueChange` receives one. The
  format is `rgba`, `hsla` or `hsba`, and starts as the format of the first color.
- The hidden input submits the color in the format in force, such as `rgba(37, 99, 235, 1)`, under
  `name`. A reset of the form restores the first color.
- The trigger opens the panel under it, with the panel's end on the trigger's end. A trigger at the
  start of its row passes `positioning={{ placement: "bottom-start" }}`. Focus moves to the panel's
  first control. Tab moves through the panel and on from its last control to the control after the
  trigger. Shift+Tab moves from its first control back to the trigger. Escape closes the panel and
  returns focus to the trigger. A press outside closes it too. A press on another control moves
  focus to that control, and a press on anything else returns focus to the trigger.
- The arrow keys move the area's thumb and step a slider's channel. Shift makes an arrow step ten
  times as far. Page Up and Page Down step a slider by ten steps. Home and End set its ends. A
  slider keeps the color in its own format, so the hue of a grey moves under a key as it does under
  a drag.
- A slider reads its channel in a format that has it: RGB for red, green and blue, HSL for
  lightness, and HSB for hue, saturation and brightness, or HSL for hue and saturation in an HSL
  picker. `format` sets another.
- A channel input commits on Enter and when it loses focus, and keeps the color when the text is not
  one. A number input sets a channel of the format in force, so render each format's inputs inside a
  `View` of that format, and switch `format` with a `SegmentGroup` or `FormatTrigger`.
- The hex or CSS input inside `ColorPicker.Control` is the picker's field. It is named by the label,
  described by a field's texts, and reports `aria-invalid` and `aria-required`. A press on the label
  focuses it. Any other input is named by `label`, the channel's English name by default.
- The thumbs take their names from `label`, `Saturation and brightness` and the channel's name by
  default, and format their values in `locale`, such as `217°` and `50%`. The area thumb's
  `valueText` replaces its value text.
- A swatch trigger is named by `label`, the color in hex by default, and reports `aria-pressed`. A
  swatch group is named by its `aria-label`, else by the picker's label, so a picker of swatches
  alone reads as one field.
- `EyeDropperTrigger` renders only where the browser offers the EyeDropper API, and is named by
  `label`, `Pick a color from the screen` by default.
- The hex input and the trigger are 36, 40 and 44px tall from `sm` to `lg`, the heights of an input
  of the same size. A swatch trigger is 24, 28 or 32px. The panel is 16rem wide, the area 176px
  tall, a track 12px thick and a thumb 16px wide at every size.
- Not offered: a `TransparencyGrid` (the recipe paints the checkerboard), a `FormatSelect` (switch
  `format` with a `SegmentGroup`), `translations` (the parts take `label`), and vertical sliders.

Inside a `Field`, the hidden input takes the field's control ID, so a press on the field's label
focuses the hex input, and the field's label names the hex input, the trigger and the panel. The
picker takes the field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a
`Fieldset` with no field around it, the picker takes the group's `disabled` and `size`. A prop
stated on the root overrides each.

## DateInput

`DateInput` renders a date field a person types into one segment at a time: the month, the day and
the year in the order of the locale. Each segment is a `spinbutton` named in the locale, and a
hidden input submits the date in ISO 8601 with a form.

```tsx
import { XIcon } from "lucide-react";

import { DateInput } from "@stealthscale/component-forms";

<DateInput.Root defaultValue={[DateInput.parseDate("2026-10-14")]} name="appointment">
  <DateInput.Label>Appointment</DateInput.Label>
  <DateInput.Control>
    <DateInput.Segments />
    <DateInput.ClearTrigger>
      <XIcon />
    </DateInput.ClearTrigger>
  </DateInput.Control>
</DateInput.Root>;
```

| Axis      | Values                                | Default   |
| --------- | ------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                      | `md`      |
| `variant` | `outline`, `subtle`, `flushed`        | `outline` |
| `status`  | `info`, `success`, `warning`, `error` | none      |

| Part           | Element  | What it renders                                             |
| -------------- | -------- | ----------------------------------------------------------- |
| `Root`         | `div`    | The label above the control, and one hidden input per date  |
| `Label`        | `label`  | The name of the groups and their segments                   |
| `Control`      | `div`    | The row of the groups and the clear trigger                 |
| `SegmentGroup` | `div`    | The field box of one date, a `group` of its segments        |
| `Segment`      | `span`   | One `spinbutton` part of a date, or a separator             |
| `Segments`     | `div`    | A `SegmentGroup` with a `Segment` for each part of its date |
| `ClearTrigger` | `button` | A square button at the field's end that clears the dates    |

- `DateInput.Root` takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `placeholderValue`, `defaultPlaceholderValue`, `onPlaceholderChange`, `onFocusChange`,
  `selectionMode`, `granularity`, `hourCycle`, `hideTimeZone`, `shouldForceLeadingZeros`, `locale`,
  `timeZone`, `createCalendar`, `min`, `max`, `isDateUnavailable`, `disabled`, `invalid`,
  `readOnly`, `required`, `name`, `form`, `dir`, `id` and `ids`.
- `value` and `defaultValue` take an array with one date per group, from `@internationalized/date`:
  a `CalendarDate` from `DateInput.parseDate("2026-10-14")`, a `CalendarDateTime` from
  `parseDateTime`, or a `ZonedDateTime` from `parseZonedDateTime`. `today` and `getLocalTimeZone`
  create today's date. `onValueChange` receives the array.
- `locale` sets the order of the segments, their separators and their placeholders, `en-US` by
  default: `10/14/2026`, `14/10/2026` in `en-GB`, `14.10.2026` in `de-DE` and `2026/10/14` in
  `ja-JP`. `shouldForceLeadingZeros` defaults to true, so `10/02/2026` fills each segment as its
  placeholder does. Set it to false for the locale's own `10/2/2026`. `granularity` adds the hour,
  the minute and the second. A `ZonedDateTime` adds its time zone as a read-only segment unless
  `hideTimeZone` is set. The segments show the time in `timeZone`, else in the zone of a
  `ZonedDateTime` value, else in UTC.
- A digit types into the focused segment, and focus moves on once the segment is full. ArrowUp and
  ArrowDown step it. Page Up and Page Down step the month by 2, the day by 7, the hour by 2 and the
  minute and the second by 15, and move the year to the next multiple of 5. Home and End set the
  segment's ends, Backspace and Delete clear it, and ArrowLeft and ArrowRight move between segments.
  The first step of an empty segment sets the placeholder's value. A paste of a date in ISO 8601,
  such as `2026-10-14`, sets the date.
- `min` and `max` constrain a date when the input loses focus, one segment at a time from the year:
  `2099-05-17` under a `max` of `2026-09-26` becomes `2026-05-17`. `isDateUnavailable` marks the
  input invalid while it returns true for the date.
- The hidden input submits `2026-10-14`, `2026-10-14T09:30:00` or
  `2026-10-14T09:30:00-04:00[America/New_York]` under `name`. A range submits `name[0]` and
  `name[1]`. `required` refuses an empty date, and a reset of the form restores the first dates.
- A segment emptied with Backspace leaves `value` on the last whole date until every segment is
  empty. `onValueChange` does not fire for it. The hidden input submits an empty string while a
  segment of its date is empty.
- A segment is named by its type in `locale`, such as `month` or `Monat`, then its group's
  `aria-label`, then the label: `month, Check-in, Stay`. The field's texts describe the first
  segment, and every segment while the input is invalid. Without `DateInput.Label` and outside a
  field, name each group with `aria-label`.
- `selectionMode="range"` edits two dates. Render a `Segments` for each, with `index={1}` on the
  second. The groups are one gap apart. A glyph between them takes the field's glyph size.
- `ClearTrigger` clears every date and moves focus to the first segment. It is named by `label`,
  `Clear date` by default. It is hidden while no date is set and in a read-only input. It is in the
  tab order because no key clears a whole date.
- A segment group is 36, 40 or 44px tall from `sm` to `lg`, the height of an input of the same size.
  Each editable segment is at least 24px square. A focused segment fills with the palette's solid.
- Not offered: `translations`, because the segments take their names from the locale. `formatter`,
  `allSegments` and `format`, because the hidden input submits ISO 8601. The machine's live region,
  because a screen reader reads the focused segment's value as it changes.

Inside a `Field`, the first hidden input takes the field's control ID, so a press on the field's
label focuses the first segment, and the field's label names the groups and their segments. The
input takes the field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a
`Fieldset` with no field around it, the input takes the group's `disabled` and `size`. A prop stated
on the root overrides each.

## DatePicker

`DatePicker` renders a date field a person types into or picks from a calendar: an input, a clear
trigger and a trigger that opens a panel of views, the days of a month, the months of a year and the
years of a decade. With `inline` the panel renders in place of the field. Hidden inputs submit the
dates in ISO 8601 with a form.

```tsx
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { DatePicker } from "@stealthscale/component-forms";

const views = [
  { table: <DatePicker.DayTable />, view: "day" },
  { table: <DatePicker.MonthTable />, view: "month" },
  { table: <DatePicker.YearTable />, view: "year" },
] as const;

<DatePicker.Root defaultValue={[DatePicker.parseDate("2026-10-14")]} name="appointment">
  <DatePicker.Label>Appointment</DatePicker.Label>
  <DatePicker.Control>
    <DatePicker.Input />
    <DatePicker.ClearTrigger>
      <XIcon />
    </DatePicker.ClearTrigger>
    <DatePicker.Trigger>
      <CalendarIcon />
    </DatePicker.Trigger>
  </DatePicker.Control>
  {createPortal(
    <DatePicker.Positioner>
      <DatePicker.Content>
        {views.map(({ table, view }) => (
          <DatePicker.View key={view} view={view}>
            <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
            {table}
          </DatePicker.View>
        ))}
      </DatePicker.Content>
    </DatePicker.Positioner>,
    document.body,
  )}
</DatePicker.Root>;
```

| Axis      | Values                                      | Default   |
| --------- | ------------------------------------------- | --------- |
| `palette` | `primary`, `secondary`, `accent`, `neutral` | `primary` |
| `size`    | `sm`, `md`, `lg`                            | `md`      |
| `variant` | `outline`, `subtle`, `flushed`              | `outline` |
| `status`  | `info`, `success`, `warning`, `error`       | none      |

| Part                   | Element  | What it renders                                                     |
| ---------------------- | -------- | ------------------------------------------------------------------- |
| `Root`                 | `div`    | The label above the control, and one hidden input per date          |
| `Label`                | `label`  | The name of the inputs, the trigger and the panel                   |
| `Control`              | `div`    | The row of the inputs and the triggers, which the panel opens under |
| `Input`                | `input`  | A text field for one date                                           |
| `ClearTrigger`         | `button` | A square button that clears the dates                               |
| `Trigger`              | `button` | A square button at the field's end that opens the panel             |
| `Positioner`           | `div`    | The element the machine places under the control                    |
| `Content`              | `div`    | The panel: a `dialog`, or a `group` in place when `inline`          |
| `View`                 | `div`    | The days, the months or the years, while that view is in force      |
| `Header`               | `div`    | A view's previous trigger, view trigger and next trigger            |
| `ViewControl`          | `div`    | The row of a view's triggers                                        |
| `PrevTrigger`          | `button` | A button that moves the view back a month, a year or a decade       |
| `NextTrigger`          | `button` | A button that moves the view on a month, a year or a decade         |
| `ViewTrigger`          | `button` | A button with the range text that moves the panel up a view         |
| `RangeText`            | `span`   | The visible month, year or decade                                   |
| `DayTable`             | `table`  | A `grid` of the days of a month, a row per week                     |
| `MonthTable`           | `table`  | A `grid` of the months of a year                                    |
| `YearTable`            | `table`  | A `grid` of the years of a decade                                   |
| `Table`                | `table`  | A `grid` a caller fills with rows of cells                          |
| `TableHead`            | `thead`  | The row of weekday names, hidden from assistive technology          |
| `TableHeader`          | `th`     | A weekday's name                                                    |
| `TableBody`            | `tbody`  | The rows of cells                                                   |
| `TableRow`             | `tr`     | A week, or a row of months or years                                 |
| `TableCell`            | `td`     | The `gridcell` of a day, a month or a year                          |
| `TableCellTrigger`     | `div`    | The `button` in a cell that picks its date                          |
| `WeekNumberHeaderCell` | `th`     | The header of the week numbers' column                              |
| `WeekNumberCell`       | `td`     | A week's number, the `rowheader` of its row                         |
| `MonthSelect`          | `select` | The browser's select of the months                                  |
| `YearSelect`           | `select` | The browser's select of the years                                   |
| `PresetTrigger`        | `button` | A button that sets a preset range or preset dates                   |
| `ValueText`            | `span`   | The dates as text, or a placeholder                                 |

- `DatePicker.Root` takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `focusedValue`, `defaultFocusedValue`, `onFocusChange`, `view`, `defaultView`, `minView`,
  `maxView`, `onViewChange`, `onVisibleRangeChange`, `open`, `defaultOpen`, `onOpenChange`,
  `inline`, `closeOnSelect`, `openOnClick`, `selectionMode`, `maxSelectedDates`, `numOfMonths`,
  `fixedWeeks`, `showWeekNumbers`, `startOfWeek`, `outsideDaySelectable`, `locale`, `timeZone`,
  `createCalendar`, `format`, `parse`, `placeholder`, `min`, `max`, `isDateUnavailable`,
  `positioning`, `disabled`, `invalid`, `readOnly`, `required`, `name`, `dir`, `id`, `ids` and
  `getRootNode`. `lazyMount`, `unmountOnExit`, `onExitComplete` and `skipAnimationOnMount` apply to
  the panel.
- `value` and `defaultValue` take an array of dates from `@internationalized/date`: a `CalendarDate`
  from `DatePicker.parseDate("2026-10-14")`, a `CalendarDateTime` from `parseDateTime`, or a
  `ZonedDateTime` from `parseZonedDateTime`. `today` and `getLocalTimeZone` create today's date.
  `onValueChange` receives the dates, their text in `format` and the view.
- An input shows its date in `format`, `10/14/2026` in `en-US` and `14.10.2026` in `de-DE` by
  default, and refuses letters as a person types. It parses the text in `locale` with `parse` on
  Enter and when it loses focus. When the text does not parse as the input loses focus, `fixOnBlur`,
  true by default, picks the focused date instead. `openOnClick` opens the panel on a press on the
  input. The dates show in `timeZone`, else in the zone of a `ZonedDateTime` value, else in UTC.
- The panel opens under the control with its start on the control's start. Its views scroll in the
  primitives package's scroll area past the room the window leaves, and a cell the keys focus
  scrolls into view. An inline panel has no cap. Focus moves to the first selected date, else to
  `focusedValue`, else to today. Tab moves through the panel and on from its last control to the
  control after the trigger, and Shift+Tab moves from its first control back to the trigger. Escape
  closes the panel and returns focus to the trigger. A press on a control outside the panel closes
  it and leaves focus on that control. A press on anything else outside closes it and returns focus
  to the trigger.
- In the day view the arrows move focus by a day and by a week. In the month and year views they
  move it by one cell and by a row of four. Page Up and Page Down move it by a month, and by a year
  with Shift. Home and End move it to the view's first and last cell, the first and the last day of
  the month in the day view. Enter and Space pick the focused date. `closeOnSelect`, true by
  default, closes a floating panel once a date is picked and moves focus to the input.
- `selectionMode="range"` picks a start and an end, and the dates between them fill with the
  palette's subtle fill as the pointer or focus moves before the second pick. Render an `Input` for
  each, with `index={1}` on the second. `selectionMode="multiple"` adds or removes a date with each
  pick, up to `maxSelectedDates`.
- A `View` renders while its view is in force. The view trigger moves the panel up a view, and a
  pick of a month or a year moves it down. `minView` and `maxView` bound the views. At `maxView` the
  view trigger is disabled and reads as the panel's title.
- The trigger is named by `label`, `Choose date` by default, then the label. A floating panel is a
  `dialog` named by `Content`'s `label` and the label, and an inline panel a `group` named by the
  label. A grid is named by its month, such as `October 2026`, and a day by its date in `locale`,
  such as `Wednesday, October 14, 2026`. The previous and next triggers are named by `label`,
  `Previous month` or `Next decade` by the view. The view trigger is named by its text, then
  `label`: `October 2026, Choose month`. `DayTable`'s `weekLabel`, `Week` by default, names the week
  numbers' column and each row header, such as `Week 42`.
- The machine's live region announces the picked dates in `locale`, and the range the previous and
  next triggers move to in the month and year views.
- The hidden inputs submit `2026-10-14` under `name`. A range submits `name[0]` and `name[1]`, and
  multiple dates one input each under `name`. `required` refuses an empty date: both of a range, the
  first of multiple dates. A reset of the form restores the first dates.
- `PresetTrigger`'s `value` takes an array of dates or a range the machine names: `thisWeek`,
  `thisMonth`, `thisQuarter`, `thisYear`, `lastWeek`, `lastMonth`, `lastQuarter`, `lastYear`,
  `last3Days`, `last7Days`, `last14Days`, `last30Days` or `last90Days`. A named range counts from
  today, so `thisMonth` runs from the first of the month through today. The button is named by its
  words.
- `MonthSelect` and `YearSelect` move the view to the month and the year a person chooses. The year
  select lists the years `min` and `max` allow, else a range around the focused date.
- `numOfMonths={2}` shows two months: render a second `DayTable` with `offset={1}`. Each grid is
  named by its own month.
- `min` and `max` disable the days beyond them, and the previous and next triggers report
  `aria-disabled` at the ends and keep their tab stop. `isDateUnavailable` strikes a day through,
  and a person cannot pick it.
- A read-only picker shows its dates but does not open its panel. Its trigger reports
  `aria-disabled`, and its clear trigger is hidden. `ClearTrigger` clears the dates and moves focus
  to the first input. It is named by `label`, `Clear date` by default, and is hidden while no date
  is set.
- The input is 36, 40 or 44px tall from `sm` to `lg`, the height of an input of the same size. A
  day's cell is 32, 36 or 40px square and never under 24px, and a month's or a year's cell is 1.75
  days wide. A selected cell fills with the palette's solid and a range's middle with its subtle
  fill. Both fill with `Highlight` under forced colors.
- Not offered: `translations`, because every part takes its words as props, and the machine's
  `application` role and English role descriptions.

Inside a `Field`, the first input takes the field's control ID, so a press on the field's label
focuses it, and the field's label names the inputs, the trigger and the panel. The picker takes the
field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field
around it, the picker takes the group's `disabled` and `size`. A prop stated on the root overrides
each.

## Textarea

`Textarea` renders a multi-line text field.

```tsx
import { Textarea } from "@stealthscale/component-forms";

<Textarea aria-label="Notes" grows maxRows={6} rows={2} />;
<Textarea aria-label="Notes" grip="none" onValueChange={setNotes} value={notes} />;
```

| Axis      | Values                                | Default    |
| --------- | ------------------------------------- | ---------- |
| `size`    | `sm`, `md`, `lg`                      | `md`       |
| `variant` | `outline`, `subtle`, `flushed`        | `outline`  |
| `status`  | `info`, `success`, `warning`, `error` | none       |
| `grip`    | `none`, `vertical`, `both`            | `vertical` |
| `grows`   | `true`                                | off        |

- `rows` sets the height and defaults to 3. Without `grows` the field keeps that height and scrolls.
- With `grows` the field takes the height of its text, with `rows` as the least height. The height
  follows the text in the same frame, and no layout is read.
- `maxRows` stops a growing field at that many lines, and the field scrolls past it. It is held at
  `rows` or more, and a field without `grows` ignores it.
- `grip` sets the CSS `resize` property. A style prop named `resize` would shadow an axis of that
  name.
- `value` and `defaultValue` serve a controlled and an uncontrolled field. `onValueChange` receives
  the value on every change, after `onChange` receives the event.
- The text reads the body role. The inset is one size smaller than the size, the same as the
  input's: 12px at `md`.
- `className` goes to the box that draws the edge, not to the `textarea` element.

Inside a `Field`, render `Field.Textarea`, which takes every prop of `Textarea`:

```tsx
<Field.Root maxLength={200}>
  <Field.Label>Delivery notes</Field.Label>
  <Field.Textarea grows maxRows={6} />
  <Field.Counter />
</Field.Root>
```

## InputGroup

`InputGroup` renders one field box that holds fields, marks and addons in one row or in stacked
rows.

```tsx
import { InputGroup } from "@stealthscale/component-forms";

<InputGroup.Root>
  <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
  <InputGroup.Field aria-label="Hourly rate" inputMode="decimal" />
  <InputGroup.Addon>per hour</InputGroup.Addon>
</InputGroup.Root>;

<InputGroup.Root>
  <InputGroup.Row>
    <InputGroup.Field aria-label="Card number" autoComplete="cc-number" />
  </InputGroup.Row>
  <InputGroup.Row>
    <InputGroup.Field aria-label="Expiry month" size={2} />
    <InputGroup.Mark aria-hidden>/</InputGroup.Mark>
    <InputGroup.Field aria-label="Expiry year" size={2} />
    <InputGroup.Field aria-label="Security code" />
  </InputGroup.Row>
</InputGroup.Root>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |
| `align`   | `center`, `start`                                 | `center`  |

| Part    | Element | What it draws                                           |
| ------- | ------- | ------------------------------------------------------- |
| `Root`  | `div`   | The box, its edge and its states, and the variants      |
| `Row`   | `div`   | One row of a box that stacks its items                  |
| `Field` | `input` | A bare control that takes the free width                |
| `Mark`  | `span`  | An icon, a unit, a separator, a counter or a button     |
| `Addon` | `div`   | A segment that reaches the box's edge, behind a divider |

- Every item takes its own width, so a mark of any width never covers the text. A field grows into
  the free width, or keeps the width of its `size` attribute.
- The box reads its state from the controls inside it. It draws the ring when one has keyboard
  focus, the error edge when one is invalid, the dashed edge when every text control is read-only,
  and the disabled look when none is enabled.
- A divider in the edge color separates two adjacent fields, an addon from the fields, and one row
  from the next. A mark between two fields, such as the slash of an expiry date, takes the place of
  a divider.
- `Addon` takes `look`. `filled`, the default, is one surface step darker than the box. `plain` has
  no fill.
- `InputGroup.Field` renders an `input`. Render a `select`, a `textarea` or any component that
  renders an input and forwards its ref with `as`.
- A button at either end of a row sits 4px from the edge, and a press on it keeps its own behaviour.
- A press on a mark, an addon's text or the padding focuses the field nearest the pointer, in the
  addon, row or box pressed. A press that focuses a `select` also opens its list where the browser
  supports `showPicker`.
- Name every field, and state `aria-hidden` on a decorative mark. Give fields a shared name with a
  `Fieldset.Root` and a legend around the group. A disabled `Fieldset.Root` disables every field in
  it.
- Set `align="start"` for a `textarea`, so the marks stay on its first line.

## SearchInput

`SearchInput` renders a search field on an input group, with a search mark before it and a control
at its end that clears it.

```tsx
import { SearchInput } from "@stealthscale/component-forms";

<SearchInput
  aria-label="Search invoices"
  clearIndicator={<XIcon />}
  onSubmit={search}
  searchIndicator={<SearchIcon />}
/>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |

- `searchIndicator` renders a decorative mark before the field, such as a magnifying glass.
- Escape empties a field that has a value and stops there. In an empty field Escape passes on, so a
  dialog around the field still closes.
- Enter calls `onSubmit` with the value.
- The clear control renders while the field has a value and you pass `clearIndicator`. Pressing it
  empties the field and moves focus back to the field. It stays out of the tab order, because Escape
  does the same from the keyboard.
- `clearLabel` names the clear control and defaults to `Clear search`.
- `value` and `defaultValue` serve a controlled and an uncontrolled field. `onValueChange` receives
  the value on every change, clearing included.

## InputMask

`InputMask` renders a field on an input group that formats what a person types to a pattern, or to a
number in a locale, while they type.

```tsx
import { PhoneIcon } from "lucide-react";

import { Field, InputGroup, InputMask } from "@stealthscale/component-forms";

<Field.Root>
  <Field.Label>Phone number</Field.Label>
  <InputMask.Root mask="(999) 999-9999" name="phone">
    <InputGroup.Mark aria-hidden>
      <PhoneIcon />
    </InputGroup.Mark>
    <InputMask.Input autoComplete="tel-national" type="tel" />
  </InputMask.Root>
  <Field.HelperText>Ten digits, such as (555) 123-4567.</Field.HelperText>
</Field.Root>;

<InputMask.Root number={{ fraction: 2, locale: "nl-NL" }}>
  <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
  <InputMask.Input aria-label="Amount" />
</InputMask.Root>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |
| `align`   | `center`, `start`                                 | `center`  |

| Part    | Element | What it renders                                     |
| ------- | ------- | --------------------------------------------------- |
| `Root`  | `div`   | The input group's box                               |
| `Input` | `input` | The field, which shows the value in the mask's form |

| Token | Accepts                                   |
| ----- | ----------------------------------------- |
| `9`   | A digit                                   |
| `a`   | A letter from A to Z, in either case      |
| `A`   | A letter from A to Z, written in capitals |
| `*`   | A letter from A to Z or a digit           |

- `mask` takes a pattern, an array of patterns or a function. A pattern writes every character that
  is not a token as it is. A `!` before a token keeps it as text, so `+4!9 999` writes `+49`.
- An array is chosen from by the length of the value: `["99999", "99999-9999"]` shows five digits as
  a ZIP code and adds the hyphen at the sixth. A function receives the value and returns its
  pattern, such as a card number grouped by the card's brand.
- `tokens` adds tokens, or replaces one of the four by its character. A token takes a `pattern`, a
  `transform` applied to each character before the check, and `optional`, `multiple` or `repeated`.
  The type is maska's `MaskTokens`, exported as `InputMask.MaskTokens`.
- `eager` writes the pattern's next characters once the characters before them are typed, so `12`
  shows as `12/` under `99/99`. Without it they appear with the next typed character.
- `number` formats a number with the grouping and decimal separators of its `locale`, and keeps at
  most `fraction` digits after the separator. `unsigned` refuses a minus sign. A number mask
  replaces `mask`.
- The input masks every edit. It drops a character a token refuses, and the caret keeps its place
  among the typed characters. Backspace or Delete on a character of the pattern also deletes the
  typed character beyond it. A paste or an autofill is masked the same way.
- `value` and `defaultValue` serve a controlled and an uncontrolled input, and the root shows either
  in the mask's form. A number mask reads them in its locale, such as `1.250,00` in `nl-NL`. The
  input submits the value as it shows it.
- `onValueChange` receives `value`, `unmasked` and `complete` on every change. `unmasked` contains
  the characters the tokens accepted, or the number with a `.` decimal separator. `complete` is true
  once the value fills the pattern. For a number mask it is false, because a number has no length to
  fill. `onValueComplete` receives the same details when a change fills the pattern.
- The input sets `inputMode` to `numeric` when every token of the pattern is `9`, and to `decimal`
  for a number with a fraction. Pass `inputMode` for a pattern that a function returns. Spell
  checking is off.
- A token checks one character at a time, so `99/99` accepts month 13. Check the whole value in
  `onValueComplete` or on submit, and show the field's error text.
- The input does not show placeholder slots such as `(___) ___-____`. The field's helper text states
  the format instead.
- A pattern that fills from the end is not offered. A number with buttons that step it is
  `NumberInput`.

Inside a `Field`, the input takes the field's control ID, which the label points at, and lists the
field's texts in `aria-describedby`. The root takes the field's `disabled`, `invalid`, `readOnly`,
`required` and `size`. Inside a `Fieldset` with no field around it, it takes the group's `disabled`
and `size`. A prop stated on the root overrides each.

## PhoneInput

`PhoneInput` renders a phone number field on an input group, with a country picker. The number
formats as a person types it, and the field reports it in E.164 once it is valid.

```tsx
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Field, PhoneInput } from "@stealthscale/component-forms";

<Field.Root>
  <Field.Label>Phone number</Field.Label>
  <PhoneInput.Root
    countries={["NL", "BE", "DE", "GB", "US"]}
    defaultCountry="NL"
    name="phone"
    onValueChange={({ valid, value }) => setPhone(valid ? value : "")}
  >
    <PhoneInput.Country check={<CheckIcon />} indicator={<ChevronDownIcon />} label="Country" />
    <PhoneInput.Input placeholder="06 12345678" />
  </PhoneInput.Root>
</Field.Root>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |
| `align`   | `center`, `start`                                 | `center`  |

| Part      | Element | What it renders                                            |
| --------- | ------- | ---------------------------------------------------------- |
| `Root`    | `div`   | The input group's box, and the hidden input a form submits |
| `Country` | `div`   | An addon with the country button and its list              |
| `Input`   | `input` | The field, of type `tel`                                   |

- `PhoneInput.Root` also takes `value`, `defaultValue`, `onValueChange`, `country`,
  `defaultCountry`, `onCountryChange`, `countries`, `locale`, `nameOf`, `disabled`, `invalid`,
  `readOnly`, `required` and `name`.
- The input keeps the digits and a leading `+` of every edit and formats them for the country with
  `libphonenumber-js`: `0612345678` shows as `06 12345678` in the Netherlands, and `2125550123` as
  `(212) 555-0123` in the United States. The caret keeps its place after the digits before it.
  Backspace or Delete on a formatting character, such as the `-` of `555-0123`, also removes the
  nearest digit beyond it.
- `onValueChange` receives `value`, `text`, `valid` and `country` on every change. `value` is the
  E.164 form once the number is valid, such as `+31612345678`, and the text the input shows before
  that, so a draft returns to the field unchanged.
- `valid` is the library's check with its `min` metadata, which the package bundles: the length and
  the leading digits of a number for its country. It does not check every range a country assigns:
  `+31112345678` is valid under it and not under the library's `max` metadata.
- `value` and `defaultValue` take the E.164 form or a national number. A controlled root that passes
  back the value it reported keeps the text the person typed. Any other value shows formatted for
  the country.
- A `+` prefix moves the picker to the country it names, if the picker offers it, and
  `onCountryChange` reports the country: `+44 20 7183 8750` moves it to the United Kingdom. A prefix
  that more than one country shares, such as `+1`, moves nothing.
- A pick keeps the digits and rewrites them in the picked country's international form, so
  `06 12345678` becomes `+44 612345678` for the United Kingdom.
- `countries` lists the regions the picker offers, in order. Without it the picker offers all 245
  regions of the library's metadata, sorted by name. The names come from `Intl.DisplayNames` in
  `locale`, else in the locale of the nearest `LocaleProvider`, else in the runtime's default
  locale. `nameOf` returns the caller's name for a region, or `undefined` to keep the locale's.
- `PhoneInput.Country` renders the package's `Select` in an addon, `plain` unless `look` states
  otherwise. Its button is a `combobox` named by `label`, which the type requires. The button's text
  is the picked country's name, which only a screen reader reads, and its calling code, or `+` while
  no country is picked.
- `flagOf` returns a glyph for each country, such as a flag, which the button and every row show
  before the name and hide from a screen reader. `libphonenumber-js` does not include flags.
  `indicator` renders after the calling code, and `check` at the end of the picked country's row.
- A press, Enter, Space or ArrowDown on the button opens the list, and typed letters move to a
  country by its name. The list opens in a portal under the whole box, at its start and as wide as
  it. Its rows are the select's `sm` rows at `xs` and `sm`, `md` rows at `md`, and `lg` rows above.
- The button is as tall as the input group's square trigger at the root's size, at least 24px. It
  renders its own focus ring, because the box rings for the number alone.
- Without `PhoneInput.Country`, `country` or `defaultCountry` is the country a number without a `+`
  is read in. Put a mark in the picker's place, such as a phone glyph.
- With `name`, a hidden input after the box submits `value`. `required` makes the input refuse an
  empty number, and `invalid` sets the input's `aria-invalid`, which the box's error edge reads.
  Check `valid` on submit and show the field's error text for a number that is not valid.
- The input is of type `tel` with `inputMode="tel"` and `autoComplete="tel"`, so a phone shows its
  dial pad and a browser offers the person's number. Spell checking is off.
- Not offered: a search field in the list, because typed letters move to a country. The number's
  type, such as mobile or fixed line, is not offered either, because it needs the `max` metadata.

Inside a `Field`, the input takes the field's control ID, which the label points at, and lists the
field's texts in `aria-describedby`. The picker keeps its own label and hidden `select`, so the
field's `invalid` and `required` apply to the number alone. The root takes the field's `disabled`,
`invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field around it, it takes
the group's `disabled` and `size`. A prop stated on the root overrides each.

## NumberInput

`NumberInput` renders a number field on an input group, with a button on either side that steps the
value down or up.

```tsx
import { MinusIcon, PlusIcon } from "lucide-react";

import { NumberInput } from "@stealthscale/component-forms";

<NumberInput.Root defaultValue="4" max={50} min={1} name="seats">
  <NumberInput.DecrementTrigger label="Remove a seat">
    <MinusIcon />
  </NumberInput.DecrementTrigger>
  <NumberInput.Input aria-label="Seats" />
  <NumberInput.IncrementTrigger label="Add a seat">
    <PlusIcon />
  </NumberInput.IncrementTrigger>
</NumberInput.Root>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |
| `align`   | `center`, `start`                                 | `center`  |

| Part               | Element  | What it renders                                    |
| ------------------ | -------- | -------------------------------------------------- |
| `Root`             | `div`    | The input group's box, in the `group` role         |
| `Input`            | `input`  | The field, in the `spinbutton` role                |
| `DecrementTrigger` | `button` | A button in a mark that steps the value down       |
| `IncrementTrigger` | `button` | A button in a mark that steps the value up         |
| `Scrubber`         | `span`   | A mark a person drags sideways to change the value |

- `NumberInput.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onValueCommit`, `onValueInvalid`, `onFocusChange`, `min`, `max`, `step`, `largeStep`,
  `smallStep`, `formatOptions`, `locale`, `inputMode`, `pattern`, `allowMouseWheel`,
  `allowOverflow`, `clampValueOnBlur`, `focusInputOnChange`, `spinOnPress`, `disabled`, `readOnly`,
  `required`, `invalid`, `name`, `form`, `dir`, `id`, `ids` and `getRootNode`.
- The value is a string. `onValueChange` receives it as a string and as a number.
- The arrow keys step the value by `step`, and Shift with an arrow by `largeStep`, which is ten
  steps unless you state it. Home and End set `min` and `max`. The field refuses a character that
  does not form a number.
- `formatOptions` takes the options of `Intl.NumberFormat`, such as a currency. `locale` defaults to
  `en-US`. Pass the reader's locale to format for the reader.
- With `formatOptions`, `value` and `defaultValue` are the text the field shows, read in `locale`:
  `"15%"` or `"15"` is 15% with `style: "percent"`. `min`, `max` and `step` are numbers, so `0.5` is
  50%, and `onValueChange` receives 0.15 as `valueAsNumber`.
- A value out of range is invalid, and the box draws the error edge. On blur the input clamps it to
  `min` or `max`. An empty input is valid, so a person can clear the field to type another value.
- Each trigger renders a button in a mark, with the glyph you pass. `label` names it and defaults to
  `Increase value` or `Decrease value`. The buttons are out of the tab order, because the arrow keys
  step the value from the field. A press steps once. Holding it steps again after 300ms and then
  every 50ms.
- A trigger is a square of the tag height at the box's size, at least 24px, 4px from the box's end:
  the same square as the search input's clear control. It is disabled at its bound and in a
  read-only or disabled input.
- `Scrubber` renders your glyph in a mark with the `ew-resize` cursor. A press locks the pointer,
  and each sideways movement steps the value. It has no keyboard of its own, because the field's
  arrow keys do the same.
- Stacked half-height triggers at the field's end are not offered. In a 40px box each one is under
  the 24px target size.

Inside a `Field`, the input takes the field's control ID, which the label points at, and lists the
field's texts in `aria-describedby`. The root takes the field's `disabled`, `invalid`, `readOnly`,
`required` and `size`. Inside a `Fieldset` with no field around it, it takes the group's `disabled`
and `size`. A prop stated on the root overrides each.

## PasswordInput

`PasswordInput` renders a password field on an input group, with a button that shows or hides the
value.

```tsx
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Field, PasswordInput } from "@stealthscale/component-forms";

<Field.Root>
  <Field.Label>Password</Field.Label>
  <PasswordInput.Root autoComplete="current-password" name="password">
    <PasswordInput.Input />
    <PasswordInput.VisibilityTrigger>
      <PasswordInput.Indicator fallback={<EyeIcon />}>
        <EyeOffIcon />
      </PasswordInput.Indicator>
    </PasswordInput.VisibilityTrigger>
  </PasswordInput.Root>
</Field.Root>;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |
| `align`   | `center`, `start`                                 | `center`  |

| Part                | Element  | What it renders                                  |
| ------------------- | -------- | ------------------------------------------------ |
| `Root`              | `div`    | The input group's box                            |
| `Input`             | `input`  | The field, of type `password` or `text`          |
| `VisibilityTrigger` | `button` | A button in a mark that shows or hides the value |
| `Indicator`         | none     | The glyph for the current visibility             |

- `PasswordInput.Root` also takes the machine's options: `visible`, `defaultVisible`,
  `onVisibilityChange`, `autoComplete`, `ignorePasswordManagers`, `name`, `disabled`, `readOnly`,
  `required`, `invalid`, `dir`, `id`, `ids` and `getRootNode`.
- `autoComplete` defaults to `current-password`. State `new-password` on a field where a person
  chooses a password, so a password manager offers a strong one.
- The field hides the value again when its form submits or resets, so a browser does not store the
  plain value.
- The toggle is in the tab order, because no key in the field shows the value. Enter and Space
  toggle it and keep focus on it. A pointer press toggles it and keeps focus in the field. Pass
  `tabIndex={-1}` to take it out of the tab order.
- `label` names the toggle while the value is hidden and `visibleLabel` while it is shown, which
  default to `Show password` and `Hide password`. The toggle sets no `aria-expanded` or
  `aria-pressed`, because the name states what a press does.
- Each change is announced to a screen reader as `visibleMessage` or `hiddenMessage`, which default
  to `Your password is visible` and `Your password is hidden`.
- `Indicator` renders its children while the value is shown and `fallback` while it is hidden, with
  no element of its own.
- Pass `visible` to show a form's password fields from one control, such as a "Show passwords"
  checkbox under a new password and its repeat, and leave out `VisibilityTrigger`.
- In a read-only field the toggle still shows and hides the value. `ignorePasswordManagers` keeps
  password managers from offering to save a value that is not a person's password, such as a signing
  secret.
- The toggle is the number input's square: the tag height at the box's size, at least 24px, 4px from
  the box's end.

Inside a `Field`, the input takes the field's control ID, which the label points at, and lists the
field's texts in `aria-describedby`. The root takes the field's `disabled`, `invalid`, `readOnly`,
`required` and `size`. Inside a `Fieldset` with no field around it, it takes the group's `disabled`
and `size`. A prop stated on the root overrides each.

## PinInput

`PinInput` renders a row of boxes that take one character each, for a code a person reads from a
message. The form submits the code as one value.

```tsx
import { PinInput } from "@stealthscale/component-forms";

<PinInput.Root
  count={6}
  name="code"
  onValueComplete={({ valueAsString }) => verify(valueAsString)}
  otp
>
  <PinInput.Label>Verification code</PinInput.Label>
  <PinInput.Control>
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <PinInput.Input index={index} key={index} label={`Digit ${index + 1} of 6`} />
    ))}
  </PinInput.Control>
</PinInput.Root>;
```

| Axis       | Values                                | Default   |
| ---------- | ------------------------------------- | --------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`          | `md`      |
| `variant`  | `outline`, `subtle`, `flushed`        | `outline` |
| `status`   | `info`, `success`, `warning`, `error` | none      |
| `attached` | `true`                                | off       |

| Part      | Element    | What it renders                                       |
| --------- | ---------- | ----------------------------------------------------- |
| `Root`    | `fieldset` | The group, and the hidden input a form submits        |
| `Label`   | `label`    | The group's name. A press on it focuses the first box |
| `Control` | `div`      | The row of boxes                                      |
| `Input`   | `input`    | One box, at the place `index` gives it                |

- `PinInput.Root` also takes the machine's options: `count`, `value`, `defaultValue`,
  `onValueChange`, `onValueComplete`, `onValueInvalid`, `type`, `otp`, `mask`, `placeholder`,
  `pattern`, `sanitizeValue`, `autoFocus`, `autoSubmit`, `blurOnComplete`, `selectOnFocus`,
  `disabled`, `readOnly`, `required`, `invalid`, `name`, `form`, `dir`, `id`, `ids` and
  `getRootNode`.
- The value is an array of characters. `onValueChange` and `onValueComplete` also receive it as one
  string.
- Typing moves to the next box. Backspace clears the box and moves back, or clears the box before an
  empty one. The arrow keys move between the filled boxes and the first empty one. Home moves to the
  first box and End to the last filled one. A pasted code fills every box, and so does a code the
  browser inserts into the first box.
- One box is in the tab order at a time: the focused one, or the first empty one.
- `type` defaults to `numeric`, and a box refuses a character the type does not allow. A numeric box
  is of type `tel`, so a phone shows the number pad. `mask` renders every box as a password field.
  `otp` sets `autocomplete="one-time-code"`, so a browser offers a code it received by message.
- Each box is named by `label`, which defaults to `Character 1 of 6`. The group is named by
  `PinInput.Label` while one is rendered, and otherwise by the label of a `Field` or the legend of a
  `Fieldset` around it. State `aria-label` on the root to name it yourself.
- State `count` for a server render. The machine counts the boxes after it mounts, and the default
  names count them from then on.
- A box is a square on the control scale, 32 to 48px from `xs` to `xl`, and at least a 40px square
  under a coarse pointer. `attached` joins the boxes into one strip that shares their edges, and
  raises a hovered or focused box above its neighbours.
- A mark between two boxes, such as a dash that splits a code, goes in `Control` beside them. An
  `svg` there is 1.25 times the text, in the muted ink.

Inside a `Field`, the first box takes the field's control ID, so a press on the field's label
focuses it. The group lists the field's texts in `aria-describedby` and takes the field's
`disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field around
it, it takes the group's `disabled` and `size`. A prop stated on the root overrides each.

## Editable

`Editable` renders a value as text that turns into a field in place.

```tsx
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { Editable } from "@stealthscale/component-forms";

<Editable.Root defaultValue="Bridge Ledger" onValueCommit={({ value }) => rename(value)}>
  <Editable.Label>Workspace name</Editable.Label>
  <Editable.Area>
    <Editable.Preview />
    <Editable.Input />
  </Editable.Area>
  <Editable.Control>
    <Editable.EditTrigger label="Rename the workspace">
      <PencilIcon />
    </Editable.EditTrigger>
    <Editable.SubmitTrigger>
      <CheckIcon />
    </Editable.SubmitTrigger>
    <Editable.CancelTrigger>
      <XIcon />
    </Editable.CancelTrigger>
  </Editable.Control>
</Editable.Root>;
```

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

| Part            | Element    | What it renders                                  |
| --------------- | ---------- | ------------------------------------------------ |
| `Root`          | `div`      | The grid of the label, the area and the control  |
| `Label`         | `label`    | The name of the input and of the preview         |
| `Area`          | `div`      | The cell the preview and the field take turns in |
| `Preview`       | `span`     | The value at rest, in the `button` role          |
| `Input`         | `input`    | The single-line field                            |
| `Textarea`      | `textarea` | The multi-line field, in place of `Input`        |
| `Control`       | `div`      | The row of triggers                              |
| `EditTrigger`   | `button`   | A square button that opens the field             |
| `SubmitTrigger` | `button`   | A square button that saves the value             |
| `CancelTrigger` | `button`   | A square button that restores the value          |

- `Editable.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onValueCommit`, `onValueRevert`, `edit`, `defaultEdit`, `onEditChange`, `activationMode`,
  `submitMode`, `selectOnFocus`, `autoResize`, `maxLength`, `placeholder`, `finalFocusEl`,
  `onFocusOutside`, `onInteractOutside`, `onPointerDownOutside`, `disabled`, `readOnly`, `required`,
  `invalid`, `name`, `form`, `dir`, `id`, `ids` and `getRootNode`.
- `activationMode` defaults to `click`: a press, Enter or Space on the preview opens the field.
  `dblclick` opens it on a double press or Enter. `focus` opens it as the preview takes focus, so
  Tab opens each editable in a form as focus moves onto it.
- Enter saves the value in an input, and Control and Enter (Command and Enter on Apple systems) in a
  textarea. Escape restores the value from before editing. A press outside saves the value unless
  `submitMode` is `enter` or `none`.
- After Enter or Escape focus moves to the edit trigger, or to the preview without one. With
  `activationMode` `focus` it moves to the edit trigger alone, because focus on the preview opens
  the field again.
- The preview is named by the label and its own text, such as "Workspace name Bridge Ledger". A
  read-only editable renders it as plain text and hides the edit trigger, and a disabled one keeps
  the `button` role, dims it and takes it out of the tab order.
- Name the field with `Editable.Label`, the label of a `Field` around the editable, or `aria-label`
  on the input.
- The preview and the field share the font, the padding, the radius and the height at each size, so
  the text keeps its place when the field opens. The preview fills with `bg.muted` on hover and
  shows `placeholder` in the muted ink while the value is empty.
- The triggers are the number input's square: the tag height at the size, at least 24px, with the
  glyph at 1.25 times the text. `label` names each, and defaults to `Edit`, `Save` and `Cancel`.

Inside a `Field`, the input takes the field's control ID and lists the field's texts in
`aria-describedby`, and the preview names itself after the field's label. The root takes the field's
`disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field around
it, it takes the group's `disabled` and `size`. A prop stated on the root overrides each.

## TagsInput

`TagsInput` renders a field that turns typed text into tags, each with a button that removes it. The
tags are the data package's `Tag`.

```tsx
import { CircleXIcon, XIcon } from "lucide-react";

import { TagsInput } from "@stealthscale/component-forms";

<TagsInput.Root defaultValue={["Bridge Ledger"]} name="accounts" placeholder="Add an account">
  <TagsInput.Label>Accounts</TagsInput.Label>
  <TagsInput.Control>
    <TagsInput.Items>
      {(value, index) => (
        <TagsInput.Item index={index} value={value}>
          <TagsInput.ItemPreview>
            <TagsInput.ItemText />
            <TagsInput.ItemDeleteTrigger>
              <XIcon />
            </TagsInput.ItemDeleteTrigger>
          </TagsInput.ItemPreview>
        </TagsInput.Item>
      )}
    </TagsInput.Items>
    <TagsInput.Input />
    <TagsInput.ClearTrigger>
      <CircleXIcon />
    </TagsInput.ClearTrigger>
  </TagsInput.Control>
</TagsInput.Root>;
```

| Axis      | Values                                | Default   |
| --------- | ------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                      | `md`      |
| `variant` | `outline`, `subtle`, `flushed`        | `outline` |
| `status`  | `info`, `success`, `warning`, `error` | none      |

| Part                | Element    | What it renders                                          |
| ------------------- | ---------- | -------------------------------------------------------- |
| `Root`              | `fieldset` | The group, and the hidden input a form submits           |
| `Label`             | `label`    | The name of the input and of the group                   |
| `Control`           | `div`      | The field box around the tags and the input              |
| `Input`             | `input`    | The field a person types the next tag into               |
| `Items`             | none       | One item per tag, from a render function                 |
| `Item`              | `span`     | One tag's item, at the place `index` gives it            |
| `ItemPreview`       | `span`     | The tag at rest: the data package's `Tag.Root`           |
| `ItemText`          | `span`     | The tag's words: `Tag.Label`                             |
| `ItemDeleteTrigger` | `button`   | The button that removes the tag: `Tag.CloseTrigger`      |
| `ItemInput`         | `input`    | The field that edits the tag in place, when `editable`   |
| `ClearTrigger`      | `button`   | A square button that removes every tag, at the box's end |

- `TagsInput.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `inputValue`, `defaultInputValue`, `onInputValueChange`, `onHighlightChange`, `onValueInvalid`,
  `validate`, `sanitizeValue`, `delimiter`, `max`, `allowOverflow`, `allowDuplicates`, `maxLength`,
  `addOnPaste`, `blurBehavior`, `editable`, `autoFocus`, `placeholder`, `onFocusOutside`,
  `onInteractOutside`, `onPointerDownOutside`, `disabled`, `readOnly`, `required`, `invalid`,
  `name`, `form`, `dir`, `id`, `ids` and `getRootNode`.
- Enter or the `delimiter`, a comma by default, adds the typed text as a tag. `sanitizeValue`, which
  trims by default, runs first, and a tag already present is not added twice unless
  `allowDuplicates` is set. `max` stops adding at that count and keeps the typed text in the input.
- `validate` decides whether a tag is added. A refused tag stays in the input to be corrected, and
  `onValueInvalid` reports it.
- `addOnPaste` splits pasted text at the delimiter and adds each part. `blurBehavior` `add` adds the
  typed text when focus leaves the input, and `clear` discards it.
- At the start of the input, Backspace and ArrowLeft highlight the last tag. The arrow keys move the
  highlight, Backspace and Delete remove the highlighted tag, and Escape returns to the input. A
  press on a tag highlights it and keeps focus in the input, which has focus throughout.
- `editable` lets a person edit a tag in place: a double press on it, or Enter on the highlighted
  one, opens `ItemInput` with the tag's text selected. Enter saves it, Escape restores it, and a tag
  saved empty is removed. `sanitizeValue` does not run on an edited tag.
- Every change is announced: `addedMessage` and `removedMessage` receive the tags added or removed,
  `changedMessage` the edited tag and its earlier text, and `highlightedMessage` the tag the
  highlight moved onto, the first move included. Each is a function that returns the words.
- The delete triggers are out of the tab order. Each is named by `label`, which defaults to `Remove`
  and the tag. The clear trigger is in the tab order, because no key removes every tag, and is named
  by `label`, which defaults to `Clear all`. `ItemInput` is named `Edit` and the tag.
- A read-only tags input keeps its input in the tab order, refuses every key that changes the tags,
  and hides the delete and clear triggers. A disabled one disables the `fieldset`.
- One line of tags is the control's height: 36, 40 and 44px from `sm` to `lg`. Each tag takes the
  tag size of the same name, the input starts its text at the inset of an input of the same size,
  and the input moves to a line of its own only when less than 4rem is left beside the tags.
- `ItemPreview` takes the tag's `variant`, `palette`, `radius` and `effect`, so a tag can take a
  palette from its value. A highlighted tag takes a ring in the field's ring color.
- The hidden input submits the tags joined by a comma and a space.
- No list of suggestions is offered yet.

Inside a `Field`, the input takes the field's control ID and lists the field's texts in
`aria-describedby`, and the group is named after the field's label. The root takes the field's
`disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field around
it, it takes the group's `disabled` and `size`, and the legend names the group. A prop stated on the
root overrides each.

## Slider

`Slider` renders a track a person drags one thumb or two along to pick a value or a range.

```tsx
import { Slider } from "@stealthscale/component-forms";

<Slider.Root
  defaultValue={[100, 350]}
  formatOptions={{ currency: "EUR", style: "currency" }}
  max={500}
  name="price"
  step={10}
>
  <Slider.Label>Price</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb index={0} label="Minimum" />
    <Slider.Thumb index={1} label="Maximum" />
  </Slider.Control>
</Slider.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `variant` | `subtle`, `outline`                                                | `outline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

| Part                | Element    | What it renders                                                    |
| ------------------- | ---------- | ------------------------------------------------------------------ |
| `Root`              | `fieldset` | The group of thumbs, and the positions its parts read              |
| `Label`             | `label`    | The name of the group and of every thumb                           |
| `ValueText`         | `span`     | The formatted values, joined by `separator` for a range            |
| `Control`           | `div`      | The area that contains the track, the thumbs and the markers       |
| `Track`             | `div`      | The full length of the values                                      |
| `Range`             | `div`      | The part of the track from the origin to the thumb, or between two |
| `Thumb`             | `div`      | One thumb in the `slider` role, at the place `index` gives it      |
| `MarkerGroup`       | `div`      | The layer over the track that contains the markers                 |
| `Marker`            | `span`     | A dot on the track at `value`, with its words below                |
| `DraggingIndicator` | `span`     | The thumb's value in a bubble above it while it is dragged         |

- `Slider.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onValueChangeEnd`, `onFocusChange`, `min`, `max`, `step`, `largeStep`, `minStepsBetweenThumbs`,
  `orientation`, `origin`, `thumbCollisionBehavior`, `getAriaValueText`, `disabled`, `readOnly`,
  `invalid`, `name`, `form`, `dir`, `id`, `ids` and `getRootNode`.
- The value is an array with one number per thumb. Render one `Thumb` per number.
- The arrow keys step the focused thumb, PageUp and PageDown step it by `largeStep`, ten steps by
  default, and Home and End set its bounds. A press on the control moves the nearest thumb there and
  starts a drag.
- `formatOptions` and `locale` format the value text, each thumb's `aria-valuetext` and the dragging
  indicator. `getAriaValueText` replaces a thumb's `aria-valuetext`, for words such as "Left 20".
  Without either, a screen reader reads a thumb's number alone. For a percentage of 0 to 100, pass
  `{ style: "unit", unit: "percent" }`.
- The group and every thumb are named by `Slider.Label`, the label of a `Field` or the legend of a
  `Fieldset`. In a range, give each thumb its words as `label`: the thumb is then named after both,
  such as "Price Minimum".
- `origin` `center` fills the track from the middle to the thumb, and `end` from the thumb to the
  end.
- The thumbs are centred on their values, and the control is inset by half a thumb at each end, so a
  thumb at a bound ends at the root's edge. `thumbAlignment` and `thumbSize` are not offered,
  because nothing has to be measured.
- The thumb is a circle of the tag height, 21.6, 24 and 26.4px from `sm` to `lg`. Under a coarse
  pointer its target grows to a 40px square around the circle. The track is 4, 6 and 8px thick.
- Render `Slider.MarkerGroup` before the thumbs, so a thumb covers the dot it rests on. A marker's
  children are its words.
- A read-only slider keeps the thumbs in the tab order, refuses every key and dashes the thumbs'
  edges. A disabled one disables the `fieldset`. An invalid one takes the error palette.
- A vertical slider lays the parts out in a column as wide as its widest part, with a 12rem track.
- Each thumb renders a hidden input after it for a form. A range submits `name[]` once per thumb.

Inside a `Field`, the thumbs are named after the field's label and described by its texts. The root
takes the field's `disabled`, `invalid`, `readOnly` and `size`. Inside a `Fieldset` with no field
around it, it takes the group's `disabled` and `size`. A prop stated on the root overrides each.

## AngleSlider

`AngleSlider` renders a dial a person turns a thumb around to pick an angle from 0° to 359°.

```tsx
import { AngleSlider } from "@stealthscale/component-forms";

<AngleSlider.Root defaultValue={45} name="rotation">
  <AngleSlider.Label>Rotation</AngleSlider.Label>
  <AngleSlider.Control>
    <AngleSlider.Track>
      <AngleSlider.Range />
    </AngleSlider.Track>
    <AngleSlider.MarkerGroup>
      {[0, 90, 180, 270].map((value) => (
        <AngleSlider.Marker key={value} value={value} />
      ))}
    </AngleSlider.MarkerGroup>
    <AngleSlider.Thumb />
    <AngleSlider.ValueText />
  </AngleSlider.Control>
</AngleSlider.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `variant` | `subtle`, `outline`                                                | `outline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

| Part          | Element    | What it renders                                           |
| ------------- | ---------- | --------------------------------------------------------- |
| `Root`        | `fieldset` | The group, the hidden input a form submits, and the value |
| `Label`       | `label`    | The name of the group and of the thumb                    |
| `Control`     | `div`      | The dial, which centres the value text                    |
| `Track`       | `div`      | The ring                                                  |
| `Range`       | `div`      | The part of the ring from the top to the value            |
| `MarkerGroup` | `div`      | The layer over the ring that contains the markers         |
| `Marker`      | `span`     | A dot on the ring at `value`                              |
| `Thumb`       | `div`      | The thumb in the `slider` role, on the ring at the value  |
| `ValueText`   | `span`     | The value in the root's format, 45° by default            |

- `AngleSlider.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onValueChangeEnd`, `step`, `disabled`, `readOnly`, `invalid`, `name`, `dir`, `id`, `ids` and
  `getRootNode`. The callbacks receive the value as a number and as a CSS angle.
- ArrowRight and ArrowUp step the value up, ArrowLeft and ArrowDown step it down, PageUp, PageDown
  and an arrow with Shift step it ten times, and Home and End set 0° and 359°. A press on the dial
  moves the thumb to the pressed angle and starts a drag.
- The value runs from 0 to 359, and `aria-valuemax` is 359. A step past the last one stops at 359.
- `formatOptions` and `locale` format the value text and the thumb's `aria-valuetext`. The default
  is `{ style: "unit", unit: "degree", unitDisplay: "narrow" }`. For words in place of a number,
  such as a compass point, pass them as the value text's children and as the thumb's
  `aria-valuetext`.
- The group and the thumb are named by `AngleSlider.Label`, the label of a `Field` or the legend of
  a `Fieldset`. Without any of them, give the thumb its name as `label`.
- Render the range to fill the ring from the top to the value. Leave it out for a direction, such as
  a heading, where no part of the turn is filled.
- Render `AngleSlider.MarkerGroup` before the thumb, so the thumb covers the marker it rests on. A
  marker is a dot without words.
- The dial is 6, 8 and 10rem wide from `sm` to `lg`. The ring is 4, 6 and 8px thick and inset by the
  thumb's overhang, so a thumb on the ring ends at the dial's edge. Under a coarse pointer the
  thumb's target grows to a 40px square.
- `dir="rtl"` mirrors the dial: the angle grows anticlockwise, and ArrowLeft steps it up.
- A read-only dial keeps the thumb in the tab order, refuses every key and dashes the thumb's edge.
  A disabled one disables the `fieldset`, and the thumb sets `aria-disabled`. An invalid one takes
  the error palette.
- The thumb turns by the root's `--value`. The theme registers `--angle` without inheritance, so the
  machine's own `rotate` would leave the thumb at 0°.
- `aria-label` and `aria-labelledby` are not offered on the root. Name the dial with a label or the
  thumb's `label`.

Inside a `Field`, the thumb is named after the field's label and described by its texts. The root
takes the field's `disabled`, `invalid`, `readOnly` and `size`. Inside a `Fieldset` with no field
around it, it takes the group's `disabled` and `size`. A prop stated on the root overrides each.

## RatingGroup

`RatingGroup` renders a row of glyphs a person picks a score from.

```tsx
import { StarIcon } from "lucide-react";

import { RatingGroup } from "@stealthscale/component-forms";

<RatingGroup.Root name="stay" required>
  <RatingGroup.Label>Your stay</RatingGroup.Label>
  <RatingGroup.Control>
    <RatingGroup.Items>
      {(index) => (
        <RatingGroup.Item index={index}>
          <RatingGroup.ItemIndicator>
            <StarIcon />
          </RatingGroup.ItemIndicator>
        </RatingGroup.Item>
      )}
    </RatingGroup.Items>
  </RatingGroup.Control>
</RatingGroup.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

| Part            | Element | What it renders                                       |
| --------------- | ------- | ----------------------------------------------------- |
| `Root`          | `div`   | The `radiogroup`, and the hidden input a form submits |
| `Label`         | `span`  | The group's name                                      |
| `Control`       | `div`   | The row of items                                      |
| `Items`         | none    | One item per value, through a render function         |
| `Item`          | `span`  | One value in the `radio` role                         |
| `ItemIndicator` | `span`  | The glyph twice: empty, and filled up to the value    |

- `RatingGroup.Root` also takes the machine's options: `value`, `defaultValue`, `onValueChange`,
  `onHoverChange`, `count` (5 by default), `allowHalf`, `disabled`, `readOnly`, `required`, `name`,
  `form`, `autoFocus`, `dir`, `id`, `ids` and `getRootNode`, and `invalid`.
- The value is -1 while nothing is rated. ArrowRight and ArrowDown step it up, ArrowLeft and ArrowUp
  step it down to 0, Home sets 1, End sets `count`, and Space rates the focused item while nothing
  is rated. With `allowHalf` each step is a half. A key works while the pointer rests on the group.
- A pointer over an item previews its value, the first half of it with `allowHalf`. `onHoverChange`
  reports the previewed value, and -1 once the pointer leaves.
- `getItemLabel` returns the words each item is named by, given the value it stands for: "1 star",
  "3 stars", and "3.5 stars" on a rated half by default. `translations` is not offered.
- Only the rated item is checked. The first item takes the tab stop while nothing is rated.
- The glyph is the caller's. `ItemIndicator` renders its children twice: an empty glyph in the
  emphasized border ink, at the 3:1 WCAG 1.4.11 sets, and a filled glyph in the palette's solid on
  every item up to the value. An `svg` glyph is filled with its color. A half item fills its first
  half, the right half under `dir="rtl"`.
- The glyphs are 16, 20 and 24px from `sm` to `lg`, in items of at least 24px, and the items are
  40px squares under a coarse pointer.
- The hidden input submits the value under `name`, and nothing without one. It is empty while
  nothing is rated, so `required` blocks a form.
- A read-only group keeps a tab stop on the rated item and refuses every change. A disabled one
  leaves the tab order and sets `aria-disabled`. An invalid one takes the error palette and sets
  `aria-invalid`.

Inside a `Field`, the group is named after the field's label and described by its texts. The root
takes the field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with
no field around it, it takes the group's `disabled` and `size`. A prop stated on the root overrides
each.

## FileUpload

`FileUpload` takes the files a person picks, drops or pastes. It checks each file against what it
accepts, and lists the accepted files and the refused ones.

```tsx
import { FileTextIcon, UploadIcon, XIcon } from "lucide-react";

import { FileUpload } from "@stealthscale/component-forms";

<FileUpload.Root accept="application/pdf" maxFileSize={5_000_000} maxFiles={3} name="statements">
  <FileUpload.Label>Statements</FileUpload.Label>
  <FileUpload.Dropzone>
    <UploadIcon />
    Drop statements here, or press to choose
  </FileUpload.Dropzone>
  <FileUpload.ItemGroup>
    <FileUpload.Items>
      {(file) => (
        <FileUpload.Item file={file}>
          <FileUpload.ItemPreview>
            <FileTextIcon />
          </FileUpload.ItemPreview>
          <FileUpload.ItemContent>
            <FileUpload.ItemName />
            <FileUpload.ItemSizeText />
          </FileUpload.ItemContent>
          <FileUpload.ItemDeleteTrigger>
            <XIcon />
          </FileUpload.ItemDeleteTrigger>
        </FileUpload.Item>
      )}
    </FileUpload.Items>
  </FileUpload.ItemGroup>
</FileUpload.Root>;
```

| Axis      | Values              | Default   |
| --------- | ------------------- | --------- |
| `size`    | `sm`, `md`, `lg`    | `md`      |
| `variant` | `outline`, `subtle` | `outline` |

| Part                | Element    | What it renders                                             |
| ------------------- | ---------- | ----------------------------------------------------------- |
| `Root`              | `fieldset` | The group, and the hidden file input a form submits         |
| `Label`             | `label`    | The group's name. A press on it opens the file picker       |
| `Dropzone`          | `div`      | The area in the `button` role that takes dropped files      |
| `Trigger`           | `button`   | The actions package's `Button`, which opens the file picker |
| `ClearTrigger`      | `button`   | The actions package's `Button`, which removes every file    |
| `ItemGroup`         | `ul`       | The list of accepted files, or of refused ones with `type`  |
| `Items`             | none       | One item per file of the list, through a render function    |
| `Item`              | `li`       | One file's row                                              |
| `ItemPreview`       | `span`     | A square for the caller's glyph or `ItemPreviewImage`       |
| `ItemPreviewImage`  | `img`      | A picture of an image file                                  |
| `ItemContent`       | `span`     | The column of the name above the size                       |
| `ItemName`          | `span`     | The file's name on one line                                 |
| `ItemSizeText`      | `span`     | The file's size                                             |
| `ItemDeleteTrigger` | `button`   | A square button that removes the file                       |

- `FileUpload.Root` also takes the machine's options: `accept`, `maxFiles`, `maxFileSize`,
  `minFileSize`, `acceptedFiles`, `defaultAcceptedFiles`, `onFileChange`, `onFileAccept`,
  `onFileReject`, `validate`, `transformFiles`, `allowDrop`, `preventDocumentDrop`, `directory`,
  `capture`, `locale`, `disabled`, `readOnly`, `required`, `invalid`, `name`, `dir`, `id`, `ids` and
  `getRootNode`.
- The machine checks each file against `accept`, `minFileSize`, `maxFileSize`, `maxFiles` and
  `validate`. It refuses a file with codes such as `FILE_INVALID_TYPE`, `FILE_TOO_LARGE`,
  `TOO_MANY_FILES` and `FILE_EXISTS`, or with the codes `validate` returns.
- `Items` in an `ItemGroup` of `type="rejected"` passes each refused file with its codes. Map the
  codes to words for the row.
- `maxFiles` defaults to 1, and a second file then replaces the first. Above 1, the picker takes
  more than one file, and a file past the count is refused.
- The dropzone is named by its content, so a screen reader speaks the words a person reads. A press,
  Enter or Space opens the picker. Files dropped on it join the upload, and so do files pasted while
  it has focus. Do not place a control inside it, because a button cannot contain another.
- While files are dragged over the dropzone, its dashed edge turns solid in the palette's solid
  color. `preventDocumentDrop`, on by default, keeps a file dropped beside it from opening in the
  browser.
- `transformFiles` runs on the accepted files before they join the list, to rename or compress them.
  `directory` asks the picker for a folder, and `capture` opens a phone's camera.
- `Trigger` and `ClearTrigger` take every axis of the button and the upload's size. The machine
  hides the clear trigger while no file is accepted.
- Each delete trigger is named by `label`, which defaults to `Remove` and the file's name. After a
  press, focus moves to the next row's delete trigger, the previous row's, or the dropzone or the
  trigger when no row is left. The clear trigger moves focus to the dropzone or the trigger.
- `ItemPreviewImage` shows an image file through an object URL it revokes when it unmounts. Its
  `alt` is empty, because the file's name is beside it. It renders nothing for a file that is not an
  image.
- `ItemSizeText` renders the size in the upload's `locale`: `182 kB` and `5.24 MB`, and `520 bytes`
  below a kilobyte.
- The root announces each change of the accepted files and each refusal. `addedMessage` and
  `removedMessage` receive the files added or removed, and `rejectedMessage` the files refused. Each
  is a function that returns the words.
- The dropzone is at least 128, 160 and 192px tall from `sm` to `lg`. A row's preview is a square of
  the control height, and its delete trigger is the number input's square.
- A read-only upload disables the trigger, takes the dropzone out of the tab order and hides the
  delete and clear triggers. A disabled one disables the `fieldset`. An invalid dropzone and a
  refused file's row take the error edge.
- The machine writes the accepted files to the hidden input, which a form submits under `name`.
- `translations`, the dropzone's `disableClick` and a hook that reads the machine are not offered.
  Keep the files in state with `acceptedFiles` and `onFileAccept` to show a count or a total.

Inside a `Field`, the group is named after the field's label and described by its texts, and the
hidden input takes the field's control ID, so a press on the label opens the picker. The root takes
the field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no
field around it, it takes the group's `disabled` and `size`. A prop stated on the root overrides
each.

## SignaturePad

`SignaturePad` renders a box a person signs in with a mouse, a pen or a finger, with a guide line
and a button that clears the strokes.

```tsx
import { EraserIcon } from "lucide-react";

import { SignaturePad } from "@stealthscale/component-forms";

<SignaturePad.Root name="signature" required>
  <SignaturePad.Label>Signature</SignaturePad.Label>
  <SignaturePad.Control>
    <SignaturePad.Segment />
    <SignaturePad.Guide />
    <SignaturePad.ClearTrigger>
      <EraserIcon />
    </SignaturePad.ClearTrigger>
  </SignaturePad.Control>
</SignaturePad.Root>;
```

| Axis      | Values                                                                             | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                                                                   | `md`      |
| `variant` | `outline`, `subtle`                                                                | `outline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | `neutral` |

| Part           | Element    | What it renders                                                 |
| -------------- | ---------- | --------------------------------------------------------------- |
| `Root`         | `fieldset` | The group, and the hidden input a form submits                  |
| `Label`        | `label`    | The pad's name. A press on it focuses the control               |
| `Control`      | `div`      | The box a pointer draws in, in the `application` role           |
| `Segment`      | `svg`      | The strokes, one `path` each                                    |
| `Guide`        | `div`      | The dashed line a signature is written on                       |
| `ClearTrigger` | `button`   | A square button in the control's corner that clears the strokes |

- `SignaturePad.Root` also takes the machine's options: `paths`, `defaultPaths`, `onDraw`,
  `onDrawEnd`, `drawing`, `disabled`, `readOnly`, `required`, `name`, `dir`, `id`, `ids` and
  `getRootNode`, and `invalid`, which renders the control's error edge.
- A primary pointer draws a stroke. The machine turns each stroke into a filled outline through
  `perfect-freehand` and keeps the strokes as SVG path data in the control's pixels. `paths` and
  `onDraw` serve a caller that keeps the strokes, such as one that removes the last stroke.
- `drawing` takes the stroke options: `size`, `simulatePressure`, `thinning`, `smoothing`,
  `streamline` and `fill`. The strokes fill in the palette's solid color, `neutral` by default.
  `fill` replaces it with a color string. A custom property in `fill` does not reach an exported
  image.
- `onDrawEnd` passes `getDataUrl`, which renders the strokes as a PNG, a JPEG or an SVG. The image
  inks the strokes in `drawing.fill`, or in black, which reads on paper in either color mode.
- The root renders the hidden input a form submits under `name`: the strokes as an SVG data URL
  cropped to them, empty while nothing is drawn. The input is not read-only, so `required` blocks a
  form while the pad is blank.
- The control is in the tab order, named by the pad's label or a field's label, and described by a
  field's texts. No key draws. A signature depends on the pointer's path, which WCAG 2.1.1 exempts
  from keyboard operation. Offer a typed name as another way to sign.
- `ClearTrigger` is named by `label`, which defaults to `Clear signature`. The machine hides it
  while nothing is drawn and while a stroke is being drawn, and a read-only pad hides it. After a
  press, focus moves to the control.
- The control is at least 160, 208 and 256px tall from `sm` to `lg` and takes the whole width. The
  clear trigger is the number input's square at the same size.
- A read-only pad keeps its strokes, draws nothing and dashes its edge. A disabled pad disables the
  `fieldset` and leaves the tab order.
- Strokes are in the control's pixels, so a pad drawn at one width does not rescale them at another.
  `translations` and a hook that reads the machine are not offered.

Inside a `Field`, the group and the control are named after the field's label, the control is
described by its texts, and the hidden input takes the field's control ID. The root takes the
field's `disabled`, `invalid`, `readOnly`, `required` and `size`. Inside a `Fieldset` with no field
around it, it takes the group's `disabled` and `size`. A prop stated on the root overrides each.

## Forms from a schema

`@stealthscale/component-forms/form` binds this package's components to
`@stealthscale/provider-form` with one `createSchemaForm` call. A form renders from a JSON Schema,
or from fields written by hand in `form.AppField`.

```tsx
import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { useSchemaForm } from "@stealthscale/component-forms/form";

const glyphs = {
  checkbox: <CheckIcon />,
  error: <CircleAlertIcon />,
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

const form = useSchemaForm<Signup>({ onSubmit: ({ value }) => save(value), schema: signup });

<form.AppForm>
  <form.Form glyphs={glyphs} mark="optional" orientation="floating">
    <form.Fields />
    <form.Submit />
  </form.Form>
</form.AppForm>;
```

| Export                                                      | What it is                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `useSchemaForm`, `useAppForm`, `withForm`, `withFieldGroup` | The hooks `createSchemaForm` returns                                    |
| `Form`, `Submit`                                            | The `form` element and its submit button                                |
| `fieldComponents` and nineteen field components             | The controls a renderer or `form.AppField` renders, such as `TextField` |
| `Frame`, `useBoundField`                                    | The frame an application's own control composes, and the field it reads |
| `layouts`, `renderers`                                      | What `form.Fields` renders groups, items, steps, errors and fields with |
| `iban`, `phone`                                             | Formats an engine registers through `createEngine({ formats })`         |
| `RADIO_CHOICES`, `SELECT_CHOICES`                           | The most choices an `enum` renders as a radio group, and as a select    |
| `FormGlyphs` and its parts                                  | The glyphs a form gives its fields                                      |

### The control a property renders

| The property's schema                 | The control                                                   |
| ------------------------------------- | ------------------------------------------------------------- |
| `type: "string"`                      | A text box, of type `email` or `url` where `format` names one |
| `format: "password"`                  | A password input                                              |
| `format: "date"`                      | A date input                                                  |
| `format: "phone"`                     | A phone input, whose value is a valid number in E.164         |
| `format: "iban"`                      | An input mask, whose value is the IBAN without its spaces     |
| `type: "number"` or `type: "integer"` | A number input, bounded by `minimum` and `maximum`            |
| `type: "boolean"`                     | A checkbox                                                    |
| An `enum` of up to five choices       | A radio group                                                 |
| An `enum` of six to ten choices       | A select                                                      |
| An `enum` of more than ten choices    | A combobox that narrows its list as a person types            |
| An array whose items list choices     | A group of checkboxes                                         |
| An array of other strings             | A tags input                                                  |

- `x-control` picks a control at the strongest rank: `switch`, `textarea`, `select`, `radio`,
  `combobox`, `segments`, `cards`, `slider`, `date-picker`, `phone` or `mask`. `cards` renders radio
  cards for an `enum` and checkbox cards for an array of choices.
- `x-options` passes a control its settings: `mask` for an input mask, `countries` and `country` for
  a phone input, and `style`, `currency`, `unit` and `step` for a number input.
- `x-width` sets how wide a control is: `short` for a number, a date or a code, `medium` for an
  account or a phone number, and `full` for the column. A number input is `short` and a phone input
  `medium` where the property states nothing. The label and the texts keep the column's width.
- A renderer that an application gives `FormProvider` registers after the package's. The later of
  two renderers at one rank renders the field, so an application replaces a control by registering
  its own.
- A slider starts at the schema's `default`. Without one the engine starts a number at 0, which a
  slider with a `minimum` above 0 cannot show.

### The form element

`form.Form` renders the `form` element, and every field of the form takes its props.

| Prop           | Values                 | Default    | What it sets                                                      |
| -------------- | ---------------------- | ---------- | ----------------------------------------------------------------- |
| `size`         | `sm`, `md`, `lg`       | `md`       | The size of every field and the gaps between them                 |
| `orientation`  | `vertical`, `floating` | `vertical` | Labels above their controls, or inside each empty text box        |
| `mark`         | `required`, `optional` | `required` | An asterisk on each required field, or words on each optional one |
| `glyphs`       | `FormGlyphs`           | none       | The marks a field renders                                         |
| `headingLevel` | `2` to `6`             | `2`        | The level of a wizard step's heading                              |

- A field without its glyph renders no mark: a select no chevron, a checked box its fill alone, a
  number input no steppers, a password input no button, a date picker no calendar, a tags input no
  remove button, and a closed group no chevron. A field's own `glyphs` prop applies over the form's.
- `mark="optional"` reads the words from `<id>.marks.optional`, then `marks.optional`, then
  `(optional)`. A checkbox and a switch take no optional mark.
- A wizard moves focus to the heading of each step it opens. Tabs leave focus on the tab a person
  activated.
- A fieldset that follows another member opens with a hairline, with twice the fields' gap above the
  line and below it.

### Formats

The engine refuses a schema that names a format it does not register. Register `iban` and `phone`
before a schema names them.

```tsx
import { iban, phone } from "@stealthscale/component-forms/form";
import { createEngine, FormProvider } from "@stealthscale/provider-form";

const engine = createEngine({ formats: [iban, phone] });

<FormProvider engine={engine}>{children}</FormProvider>;
```

- `iban` accepts an empty string, and an IBAN whose mod-97 check digits match.
- `phone` accepts an empty string, and a number `libphonenumber-js` reads as valid with its `min`
  metadata.
- Both accept an empty string, so a field a person must fill states `minLength: 1` too.

### Words

Each choice reads its words from `<id>.fields.<path>.options.<value>`, and a card reads the words
under its title from `<id>.fields.<path>.descriptions.<value>`. The buttons and the messages read
`<id>.actions.<name>`:

| Name                              | English                                                     |
| --------------------------------- | ----------------------------------------------------------- |
| `submit`, `back`, `next`          | Submit, Back, Next                                          |
| `add`, `remove`, `removeItem`     | Add, Remove, and the button's name `Remove item {{number}}` |
| `choose`                          | Choose, the placeholder of an empty select                  |
| `showChoices`, `noMatch`          | Show the choices, No match                                  |
| `increment`, `decrement`          | Increase, Decrease                                          |
| `showPassword`, `hidePassword`    | Show password, Hide password                                |
| `passwordShown`, `passwordHidden` | Your password is visible, Your password is hidden           |
| `chooseDate`, `countryCode`       | Choose a date, Country code                                 |
| `removeTag`                       | Remove `{{value}}`                                          |

## Licence

MIT. See [LICENSE](LICENSE).
