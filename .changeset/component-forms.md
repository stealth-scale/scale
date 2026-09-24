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
- It takes `value` and `defaultValue`, and reports every change through `onChange` with the event
  and then `onValueChange` with the value. `className` goes to the box that draws the edge. Inside a
  field, render `Field.Textarea`.

- `Fieldset` groups fields that belong together under one name. Four parts under one namespace:
  `Root`, `Legend`, `HelperText` and `ErrorText`.
- `Fieldset.Root` is a `fieldset` and `disabled` is the element's own attribute, so the browser
  disables every control in the group, takes it out of the tab order and out of the form's
  submission, and leaves the first legend enabled. The state also reaches the fields through a
  context, so their labels take the disabled look. A field states its own `disabled` to override it.
- The group's `size` reaches every field inside that states none, and so reaches the controls.
- The legend floats, so it is not the rendered legend a browser lays out apart from the flex items,
  and the root's gap separates it from the next part: 6, 8 and 12px at `sm`, `md` and `lg`. It still
  names the group.
- The helper and error texts read the body role one size smaller, the same as a field's.
- `ErrorText` renders while the group is invalid or reports a status, and sets `role="alert"` only
  while the group is invalid. A leading `svg` is centred on the first line.
- The root lists both texts in `aria-describedby` and carries `aria-invalid`. It clears the minimum
  inline size a `fieldset` defaults to, so one inside a flex or grid parent shrinks.
- Three axes: `size`, `orientation` and `status`.

- `Field` wraps a control in a label, the text a person needs in advance, a count and what is wrong.
  Eight parts under one namespace: `Root`, `Label`, `RequiredIndicator`, `Control`, `Textarea`,
  `HelperText`, `Counter` and `ErrorText`.
- `Field.Root` takes `disabled`, `invalid`, `readOnly`, `required` and `maxLength`, and every part
  reads them. One `invalid` marks the control and renders the error text. The root's `size` also
  sizes the control: 36, 40 and 44px at `sm`, `md` and `lg`.
- The root derives five identifiers from one. The label points at the control with `htmlFor`. The
  control lists the helper text, the error text and the counter in `aria-describedby`, whether or
  not each is rendered, because assistive technology skips an identifier that names no element.
- `Field.Textarea` renders the package's `Textarea` as the control and takes its props, `grows` and
  `maxRows` included. `Field.Control` with `as` cannot pass them, because `as` does not retype
  props.
- `Counter` renders `12 / 80`: the length of the control's value in UTF-16 code units against the
  root's `maxLength`, or the length alone without one. The control writes the length to a store
  after layout and the counter reads it through `useSyncExternalStore`, so no state is written from
  an effect. Children replace the count. It sets no `aria-live`, because a live region would
  announce every keystroke.
- `ErrorText` renders nothing while the field is valid and reports no status, and sets
  `role="alert"` only while the field is invalid, so an error raised on submit is announced.
- `RequiredIndicator` renders nothing while the field is optional and sets `aria-hidden`, because
  the control's `required` attribute already reports the state.
- The error text and the required mark read the palette `status` sets, which defaults to the error
  palette. A field reporting a status that is not a fault renders its message in that palette
  without marking the control invalid.
- Three axes: `size`, `orientation` (`vertical`, `horizontal`, `floating`) and `status`.

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

component-forms: stop a growing textarea at maxRows

- `Textarea` takes `maxRows`. A growing field stops at that many lines and scrolls, where it grew
  without end. The limit is held at `rows` or more, and a field without `grows` ignores it.
- The component writes `data-capped` and the limit, in `--textarea-max-rows`, onto the root. The
  recipe caps the hidden copy of the text at that many lines and lets the control scroll.
