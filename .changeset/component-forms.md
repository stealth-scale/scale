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

- `InputGroup` draws one field box that holds fields, marks and addons in a row, or in stacked rows.
  Five parts under one namespace: `Root`, `Row`, `Field`, `Mark` and `Addon`.
- The root is the box. It draws the edge, the surface and every state from the theme's
  `wrappedField()`, read from the controls inside it. It draws the ring when one has keyboard focus,
  the error edge when one is invalid, the dashed edge when every text control is read-only, and the
  disabled look when none is enabled.
- Every item takes its own width, so a mark of any width never covers the text. A field is a bare
  control that grows into the free width, or keeps the width of its `size` attribute. `as` renders a
  `select`, a `textarea` or any component that renders an input and forwards its ref.
- A mark holds an icon, a unit, a separator, a counter or a button. A button at either end of a row
  sits 4px from the edge.
- An addon reaches the box's edge at either end and takes its corners. `look` sets its fill:
  `filled` is one surface step darker than the box, and `plain` has no fill.
- A divider in the field's edge color separates two adjacent fields, an addon from the fields, and
  one row from the next. The inset lies on both sides of every divider. Under forced colors the
  divider between two fields paints `CanvasText`, because Firefox paints an input's own edge in its
  gray there.
- A root that contains `Row` parts stacks them. Each row lays out its items the way a root without
  rows does, so a card form puts the number on one row and the expiry and security code on the next.
- A primary press on a mark, an addon's text or the padding focuses an enabled field. The field is
  the one nearest the pointer in the smallest part around the press that holds a field: the addon,
  the row or the box. A press that focuses a `select` also opens its list where the browser supports
  `showPicker`. A press on a control, a link or a label keeps its own behaviour.
- Four axes: `size`, `variant`, `status` and `align`. The inset is one size smaller than the size,
  the same as the input's, and the flushed look keeps the smallest inset. The recipe has no
  `palette` axis, because a field's color reports a state.
- `Input` gains a `status` row in the README, which the axis it took in the previous release left
  undocumented.

component-forms: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-forms: reach a textarea's states from its own control

- The textarea's surface reads `wrappedField()` and the wrapped looks, so its disabled, read-only,
  invalid and focused treatments follow the control rather than the box. The box always matched
  `:read-only`, so it rested on the read-only fill in every state.
- The textarea reads its inline inset through `--control-inset-start/end`, which it wrote its own
  padding over.
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
- The checkbox's and the switch's alignment scenes stand in a room at the smallest measure, so the
  label runs to a second line and the two places differ.

component-forms: split a root's props over a copy

- `Checkbox.Root` and `Switch.Root` split their props through `splitEnumerable` from
  `@stealthscale/hooks`. Rendered with a `key`, each logged React's `key is not a prop` warning and
  spread `key` onto its element in development.

component-forms: order the look axes by their vocabulary

- `Checkbox` and `Switch` list their looks as `solid`, `subtle`, `outline` rather than
  alphabetically. The styles each look draws are unchanged.

component-forms: import omitUndefined from the hooks package

- The checkbox and switch machines and `Textarea` take `omitUndefined` from `@stealthscale/hooks`.
  The package's private copy, `stated`, is removed.

component-forms: narrow the inline inset of the input

- `Input` reads its inline inset one size smaller than its own size: 8, 8, 12, 16, 20, 24, 32 and
  40px from `xs` to `4xl`, in place of a button's 8 to 48px. The height and the text size still
  match a button of the same size. The inset is written through the control inset properties, so a
  component that places something inside the field opens the side it needs.
- `Input` sets typed text at the normal weight, 400, the same as `Textarea`. The label role set it
  at 500.
- A flushed `Input` writes its 8px inset through the control inset properties. Its fixed
  `paddingInline` overrode both properties.

component-forms: keep a textarea without grows at the height of its rows

- `Textarea` writes the copy of its text onto the root only when `grows` is set. Every textarea
  wrote it, so every textarea grew with its text: a field of three rows holding five lines measured
  154px in place of 98px.
- The inset on every side reads one size smaller than the size: 8, 12 and 16px at `sm`, `md` and
  `lg`, in place of 12, 16 and 20px. A flushed textarea keeps an 8px inline inset, the same as the
  flushed input, in place of none.

component-forms: rebuild SearchInput on the input group

- `SearchInput` renders an `InputGroup`: an optional search mark, the field, and the clear control
  in a mark while the field has a value. It takes the group's `size`, `variant` and `status`.
- `searchIndicator` renders a decorative mark before the field, such as a magnifying glass.
- Escape empties a field that has a value and stops the event there. In an empty field Escape passes
  on, so a dialog around the field still closes. React Aria's `useSearchField` does the same.
- Enter calls `onSubmit` with the value.
- The clear control leaves the tab order, because Escape does the same from the keyboard.
- The clear control is a square of the tag height, at least 24px, and the group places it 4px from
  the box's end. The recipe drops the negative inline margin it wrote, which pushed the square past
  its mark at every size.
