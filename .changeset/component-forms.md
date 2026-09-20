---
"@stealthscale/component-forms": minor
---

component-forms: publish Fieldset, Field, Checkbox, Switch, Textarea and InputGroup

- `Switch` draws a track a person throws on and off. Four parts under one namespace: `Root`,
  `Control`, `Thumb` and `Label`. It binds Zag's switch machine.
- The input carries `role="switch"` and `aria-checked`. The machine draws it as a checkbox and
  states neither, so a reader announced a switch as a checkbox. The role is the pattern the APG
  names for a native checkbox, and axe accepts `aria-checked` where it agrees with the element.
- `label` is taken off the root's props. The machine's splitter claims the name and the machine
  reads it nowhere, so a caller stating it lost the prop off the element and gained nothing.
- The geometry comes from three scales and one rule. The track is `control` wide and `tag` tall,
  which hold one ratio at every step because both read the control shares. The thumb fills the
  track's content box as a square, so the track's padding is the inset and the thumb states no size.
  The size axis writes the track's width less its height into `--switch-travel` and the thumb reads
  it, so one rule moves the thumb whatever the padding is.
- Six axes: `size`, `variant`, `status`, `radius`, `align` and `spread`. The track rests on the
  muted surface rather than the panel, because the thumb is drawn on the panel.
- A switch inside a `Field` takes that field's `disabled`, `invalid`, `readOnly` and `required`, and
  its input is described by the field's texts.

- `Checkbox` draws a box a person turns on and off. Four parts under one namespace: `Root`,
  `Control`, `Indicator` and `Label`. It binds Zag's checkbox machine.
- `Checkbox.Root` draws the input a form submits as well as the label around it, so the element
  carrying the value and the role is never left out. Ark publishes that input as a fifth part a
  caller has to remember.
- The partly-on state is written onto the input on every commit. Zag writes it from a `track` on the
  checked value, which runs on a change and not on a mount, so a checkbox drawn partly on was
  announced as unchecked. It is the `indeterminate` property rather than `aria-checked="mixed"`,
  because axe reports the attribute on a native checkbox as `aria-conditional-attr`.
- A checkbox inside a `Field` takes that field's `disabled`, `invalid`, `readOnly` and `required`,
  and its input is described by the field's helper text and error message. A checkbox that states
  one of them overrides the field.
- `Indicator` takes `indeterminate`, which states which of the two marked states the mark belongs
  to. A checkbox that never goes partly on draws one indicator and no flag.
- Seven axes: `size`, `variant`, `status`, `radius`, `align`, `spread` and `motion`. No value of
  `variant` writes a border color, so a status always reaches the edge.
- The box reads the theme's field fragment, so its edge and its states match every text field in the
  same form. The ring is drawn outside, the coarse-pointer height is dropped, and `touchTarget`
  widens the target to a `control.md` square instead of stretching the box.

- `Textarea` draws a box a person types several lines into. Set `grows` and it takes its height from
  the text, measuring nothing: the root is a grid of one cell holding both the control and a hidden
  copy of its text, and the copy gives the cell its height. The box is right on the frame the text
  changes, and no layout is read and no state is written from an effect.
- Five axes: `size`, `variant`, `status`, `grip` and `grows`. `grip` is the CSS `resize` property,
  named apart from it because a styled element takes every CSS property as a prop and a style prop
  of the same name shadows an axis.
- It takes `value` and `defaultValue`, and reports every change through `onValueChange`. Compose it
  into a field with `<Field.Control as={Textarea} />`.

- `Fieldset` groups fields that belong together and names the group. Four parts under one namespace:
  `Root`, `Legend`, `HelperText` and `ErrorText`.
- `Fieldset.Root` is a `fieldset` and `disabled` is the element's own attribute, so a browser takes
  every control in the group out of reach, out of the tab order and out of what the form submits,
  and leaves the first legend alone. The state also goes down a context, so the labels beside those
  controls draw as unreachable. A field states its own `disabled` to override it.
- The root is described by both of its texts and carries `aria-invalid`. It clears the minimum
  inline size a `fieldset` defaults to, so one inside a flex or grid parent shrinks.
- Three axes: `size`, `orientation` and `status`.

- `Field` wraps a control in everything that explains it. Seven parts under one namespace: `Root`,
  `Label`, `RequiredIndicator`, `Control`, `HelperText`, `Counter` and `ErrorText`.
- `Field.Root` takes `disabled`, `invalid`, `readOnly` and `required`, and every part reads them.
  One `invalid` marks the control, draws the message and leaves the two in step, where a prop on
  each part would let them disagree.
- The root derives four identifiers from one. The label points at the control with `htmlFor`, and
  the control is described by the helper text and the message. Both identifiers are listed whether
  or not either is drawn, because an identifier naming no element is passed over. Watching the
  document to find out which exists would mean writing state from an effect, which React 19 reports,
  and a second render before the control is described at all.
- `ErrorText` renders nothing where the field is not wrong, and states `role="alert"` where it does,
  so a message raised after a submit reaches a reader who is not looking at the field.
- `RequiredIndicator` renders nothing where the field is optional and states `aria-hidden` where it
  does, since the control already carries `required`.
- `Counter` announces politely and stays out of `aria-describedby`. A description is read when the
  control takes focus, and a number that changes as a person types would be read stale.
- The message and the required mark read the palette, which `status` sets. A field defaults to the
  error palette, so the same part draws a green message for a field reporting something else.
- Three axes: `size`, `orientation` and `status`.

- `InputGroup` draws a field with a mark at one end or both: a currency symbol, a unit, a glyph, or
  a control. Four parts under one namespace: `Root`, `Field`, `Start` and `End`.
- The marks are drawn over the field and the field reserves room for them, so the typing never runs
  underneath. The group writes no padding: `size` states the room on the root and `marks` hands it
  to `--control-inset-start` or `--control-inset-end`, which every recipe built on `controlSizes`
  reads with its own step as the fallback. The control's recipe stays the one rule writing its
  padding, so restyling the control never races the group for the property.
- `SearchInput` is drawn on the group with `marks="end"`, so the two write one mechanism between
  them. Its own recipe is now the control that empties the field and nothing else.
- `marks` takes `start`, `end` or `both`, defaulting to `both`. `size` reads the control scale, so a
  mark and the field step together and a group lines up with a button beside it.
- `InputGroup.Field` binds the text field, so a group holding one needs no `as`. Another control
  goes in its place with `as`, and the factory draws it under both recipes. A native `select` is the
  one control this does not hold at both ends, because the browser draws and places its own arrow at
  the inline end.
- `align` takes `center` or `start`, defaulting to `center`. Set `start` for a control that runs to
  several lines, where a mark centred against a tall box floats in the middle of it.
- A mark takes no pointer and whatever it holds takes the pointer back, so a press over a decorative
  glyph reaches the field behind it and a control drawn in a mark still works.
- `Input` gains a `status` row in the README, which the axis it took in the previous release left
  undocumented.

component-forms: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-forms: reach a textarea's states from its own control

- The textarea's surface reads `wrappedField()` and the wrapped looks, so its disabled, read-only,
  invalid and focused treatments follow the control rather than the box. The box always matched
  `:read-only`, so it rested on the read-only fill in every state.
- The textarea reserves an input group's leading and trailing room through
  `--control-inset-start/end`, which it wrote its own padding over. Text ran under both adornments.
- The switch's thumb travels the other way where the page runs right to left, carries a border where
  the display replaces every fill, and names `translate` as the property it moves in rather than
  `transform`, which it never changed.

component-forms: stack a field's texts under the control beside its label

- A horizontal field is a grid of two columns: the label takes the first and every other part the
  second, so the helper text, the counter and the message stack under the control. A row of every
  part put the helper text and the counter in the room after the control, where the text wrapped
  word by word and the counter broke over two lines.
- A horizontal fieldset shares its row between the fields, each from twelve rem, and gives its two
  texts a row each. A field fills the width it is given, so a row of fields put each on a line of
  its own and the group across read the same as the group down.
- An input group's marks are set in the label of the group's step. A mark in the body size overran a
  small square: `EUR` ran past the end of an extra small field. The specimen states the size on the
  field as well as on the group, because the group's size is the room a mark takes and the field's
  is its own height.
- The checkbox's and the switch's alignment scenes stand in a room at the smallest measure, so the
  label runs to a second line and the two places differ.

component-forms: split a root's props over a copy

- `Checkbox.Root` and `Switch.Root` split their props through `splitEnumerable` from
  `@stealthscale/hooks`. Rendered with a `key`, each logged React's `key is not a prop` warning and
  spread `key` onto its element in development.
