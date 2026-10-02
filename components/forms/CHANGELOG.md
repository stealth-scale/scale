# @stealthscale/component-forms

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Field`: `Root`, `Label`, `RequiredIndicator`, `Control`, `Textarea`, `HelperText`, `Counter`,
    `ErrorText`.
  - Add `Fieldset`: `Root`, `Legend`, `HelperText`, `ErrorText`.
  - Add `Checkbox` and `Checkbox.Group` over `@zag-js/checkbox`.
  - Add `Switch` over `@zag-js/switch`.
  - Add `Textarea` with `grows`, `maxRows` and `grip`.
  - Add `InputGroup`: `Root`, `Row`, `Field`, `Mark`, `Addon`.
  - Rebuild `SearchInput` on `InputGroup`, with `searchIndicator`, Escape to clear and `onSubmit`.
  - Set the input's and textarea's inline inset one size smaller than a button's.
  - Add `NativeSelect`.
  - Add `RadioGroup`, `RadioCard`, `SegmentGroup` and `CheckboxCard`.
  - Add `NumberInput`, `PinInput`, `PasswordInput` and `Editable`.
  - Add `TagsInput`, and depend on `component-data`.
  - Add `Slider`, `AngleSlider` and `RatingGroup`.
  - Add `FileUpload`, and depend on `component-actions`.
  - Add `InputMask` over `maska` 3.2.1.
  - Add `SignaturePad`.
  - Add `Select` and `Combobox`, scrolled in `ScrollArea` with the viewport as the `listbox` element.
  - Add `ColorPicker`.
  - Add `DateInput` and `DatePicker` over `@internationalized/date`.
  - Add `PhoneInput` over `libphonenumber-js` 1.13.14, and peer on `provider-locale`.
  - Take words as `label` props in place of the machines' `translations`.
  - Place every control of a `Field` in the control's column.
  - Write a toggle's state into its input after every press.
  - Run the caller's handlers on a checkbox, checkbox card or switch before the machine's.
  - Dim a disabled checkbox or switch once.
  - Depend on `component-primitives`.
  - Add a specimen per component, with examples.
  - Add the `./form` entry: `useSchemaForm`, `useAppForm`, `withForm` and `withFieldGroup` over
    `provider-form`'s `createSchemaForm`.
  - Add `Form`, `Submit`, `Frame`, `useBoundField`, the layouts and the renderers to `./form`.
  - Add nineteen field components to `./form`, from `TextField` to `CheckboxCardsField`.
  - Add the `iban` and `phone` formats to `./form`.
  - Add `size`, `orientation`, `mark`, `glyphs` and `headingLevel` to `Form`.
  - Peer on `provider-form` as an optional peer.
  - Depend on `component-disclosure` and `component-feedback`.
  - Add `Field.OptionalIndicator`.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Emit every status value through `statusEmitted()` in `staticCss` of every recipe with a `status`
    axis.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`85466a2`](https://github.com/stealth-scale/scale/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`02dda13`](https://github.com/stealth-scale/scale/commit/02dda131a19849e9d7ea4018c1c973525ce47014), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-feedback@0.2.0
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/provider-form@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-locale@0.1.0

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
