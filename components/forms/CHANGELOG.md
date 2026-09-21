# @stealthscale/component-forms

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-forms: publish Fieldset, Field, Checkbox, Switch, Textarea and InputGroup
  
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

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: hold every package to the barrel rule its ADR already states
  
  - ADR-0018 puts a specification beside every source file, the barrels included, and records that the
    conformance suite holds a package to it "where the package asks with `barrels: true`, which every
    component package does". Ten of the sixteen asked for nothing, so the rule was written down and
    enforced nowhere in them.
  - `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
    `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
    them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
    barrels, and `collections`' collection barrel.
  - A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
    binding is among them, which is what catches a leaked binding and a dropped export.
  - Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
    decision covers them and its enforcement note does not, so they are left for a pass of their own.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: emit a rule for every status a component can be handed
  
  - Every recipe with a `status` axis now carries `statusEmitted()` under `staticCss`: `Button`,
    `Badge`, `Alert`, `Checkbox`, `Field`, `Fieldset`, `Input`, `Switch`, `Textarea`, `Card`,
    `Blockquote`, `Code`, `Kbd` and `Mark`.
  - The compiler emits a rule for a value it reads from a literal in an application's source. An
    application writes `status={row.status}` rather than `status="error"`, so the compiler read a name
    it could not follow. The runtime still wrote the class, and the component drew in its default
    palette while reporting an error.
  - Measured on the single-theme example, which writes `status="error"` and the other three nowhere:
    the stylesheet held a rule for `error` alone before, and for all four after, at 0.19 kB over the
    wire.
  - `recipe.emitted` in the theme's test kit reports a recipe that offers a status and lists none, so
    a new one cannot be written without it.
- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`82e8f5c`](https://github.com/stealth-scale/config/commit/82e8f5cdce0c8c62694c8777fae24ef4ab761e07) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-forms: publish the text field and the search field
  
  - `Input` draws a box a person types one line into. The surface, the edge, the ink, the placeholder,
    the focus ring and every state a field enters come from the theme's own field fragment, so a theme
    decides what a field looks like once for every field. It offers a size read off the control scale,
    so a field lines up with a button of the same size beside it, and three looks for its edge.
  - The field carries no label of its own and takes no prop for being wrong. A caller points a `label`
    at it or states `aria-label`, and a field that is wrong states `aria-invalid`, which is the
    attribute the recipe's invalid styling reads and the one a screen reader reads too. That is one
    attribute rather than two things able to disagree.
  - The focus ring is drawn inside the box, because a ring outside it is clipped where a field sits
    flush against the edge of a panel.
  - `SearchInput` draws a field a person searches from, with a control at its end that empties it. It
    takes `value` and `defaultValue`, so one component serves a caller that sets the value and a
    caller that leaves the component to hold it.
  - The control appears only where the field holds something and a caller has passed something to draw
    in it, because a control that does nothing half the time is one a reader learns to pass over.
    Clearing puts focus back in the field.
  - The field reserves room at its end exactly the width of the control, both read off the control
    scale, so one name moves both and the typing never runs underneath.
  - The search field composes the text field rather than restating it, so a theme that moves every
    field moves this one and neither recipe repeats the other.

### Patch Changes

- Updated dependencies [[`614fb9f`](https://github.com/stealth-scale/config/commit/614fb9ff17f757776a5d5132c5d21a3bb6c41efb), [`6ac64f2`](https://github.com/stealth-scale/config/commit/6ac64f2666f92a187fc06d34df1d2cd023266434), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/hooks@0.1.0
  - @stealthscale/theme@0.3.0
