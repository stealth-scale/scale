# @stealthscale/component-forms

Draws what a person fills in: the group, the field that explains a control, the checkbox, the
switch, the text field, the multi-line box, the box that holds fields, marks and addons, and the
search field with a control that empties it.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component draws with `as`. A component with parts is published as a
namespace, `Field.Root` and `InputGroup.Root`.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. List the preset under
`./theme` among the presets your compiler installs.

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
- A floating label reads whether the control is empty from `:placeholder-shown`, so give the control
  a placeholder. A single space works.

## Checkbox

Draws a box a person turns on and off, and the words that name it.

```tsx
import { Checkbox } from "@stealthscale/component-forms";

<Checkbox.Root name="terms" onCheckedChange={({ checked }) => setAccepted(checked)}>
  <Checkbox.Control>
    <Checkbox.Indicator>
      <TickIcon />
    </Checkbox.Indicator>
    <Checkbox.Indicator indeterminate>
      <DashIcon />
    </Checkbox.Indicator>
  </Checkbox.Control>
  <Checkbox.Label>Accept the terms</Checkbox.Label>
</Checkbox.Root>;
```

| Axis      | Values                                | Default  |
| --------- | ------------------------------------- | -------- |
| `size`    | `sm`, `md`, `lg`                      | `md`     |
| `variant` | `solid`, `subtle`, `outline`          | `solid`  |
| `status`  | `info`, `success`, `warning`, `error` | none     |
| `radius`  | `l1`, `l2`, `full`                    | `l1`     |
| `align`   | `center`, `start`                     | `center` |
| `spread`  | `true`                                | off      |
| `motion`  | `fade`, `rise`, `reveal`              | none     |

| Part        | Element | What it draws                    |
| ----------- | ------- | -------------------------------- |
| `Root`      | `label` | The row, and the checkbox itself |
| `Control`   | `div`   | The box the state is seen in     |
| `Indicator` | `span`  | A mark, for one of the states    |
| `Label`     | `span`  | The words naming the checkbox    |

`Checkbox.Root` also takes `checked`, `defaultChecked`, `disabled`, `form`, `invalid`, `name`,
`onCheckedChange`, `readOnly`, `required` and `value`.

`checked` takes `true`, `false` or `"indeterminate"`, so it serves a box that goes partly on. Set
`indeterminate` on the indicator that draws the partly-on mark. Write a second indicator without it
for the on mark. A box that never goes partly on needs one indicator.

The root draws the checkbox a form submits. Do not add an input of your own.

Name the checkbox. Write `Checkbox.Label`, or state `aria-label` on the root for a box that carries
no words.

A label that runs to more than one line takes `align="start"`, which puts the box on the first line
rather than halfway down the block.

Set `spread` for a settings row. The row takes the width it is given, the label keeps the start, and
the box goes to the far end.

Put the checkbox inside a `Field` and it takes the field's `disabled`, `invalid`, `readOnly` and
`required`, and is described by the field's texts:

```tsx
<Field.Root invalid={!accepted}>
  <Checkbox.Root>…</Checkbox.Root>
  <Field.ErrorText>Accept the terms to go on.</Field.ErrorText>
</Field.Root>
```

## Switch

Draws a track a person throws on and off, and the words that name it.

```tsx
import { Switch } from "@stealthscale/component-forms";

<Switch.Root name="theme" onCheckedChange={({ checked }) => setDark(checked)} spread>
  <Switch.Label>Dark mode</Switch.Label>
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
</Switch.Root>;
```

| Axis      | Values                                | Default  |
| --------- | ------------------------------------- | -------- |
| `size`    | `sm`, `md`, `lg`                      | `md`     |
| `variant` | `solid`, `subtle`, `outline`          | `solid`  |
| `status`  | `info`, `success`, `warning`, `error` | none     |
| `radius`  | `l1`, `l2`, `full`                    | `full`   |
| `align`   | `center`, `start`                     | `center` |
| `spread`  | `true`                                | off      |

| Part      | Element | What it draws                   |
| --------- | ------- | ------------------------------- |
| `Root`    | `label` | The row, and the control itself |
| `Control` | `span`  | The track the thumb crosses     |
| `Thumb`   | `span`  | The knob that crosses it        |
| `Label`   | `span`  | The words naming the switch     |

`Switch.Root` also takes `checked`, `defaultChecked`, `disabled`, `form`, `invalid`, `name`,
`onCheckedChange`, `readOnly`, `required` and `value`.

The root draws the control a form submits, and a reader hears it as a switch that is on or off. Do
not add an input of your own.

Name the switch. Write `Switch.Label`, or state `aria-label` on the root.

Write the label before the track for a settings row, and set `spread`. The row takes the width it is
given, the label keeps the start, and the track goes to the far end.

`Switch.Thumb` states no size. It fills the track, so one `size` moves both.

Put the switch inside a `Field` and it takes the field's `disabled`, `invalid`, `readOnly` and
`required`, and is described by the field's texts.

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

## Licence

MIT. See [LICENSE](LICENSE).
