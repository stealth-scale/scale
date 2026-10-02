# @stealthscale/provider-form

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`02dda13`](https://github.com/stealth-scale/scale/commit/02dda131a19849e9d7ea4018c1c973525ce47014) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `values` to `Words.action`, which its words interpolate.
  - Add `Words.mark` and `Identifiers.mark`.
  - Add `Words.optionDescription` and `Identifiers.optionDescription`.
  - Add `Field.width` and the `x-width` keyword, with `FieldWidth` and `WIDTHS`.
  - Keep focus on the activated tab when a tabbed form changes steps.
  - Start an array whose items list choices as an empty array.

### Patch Changes

- Updated dependencies []:
  - @stealthscale/settings@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`5983d53`](https://github.com/stealth-scale/config/commit/5983d5390186d254094c5827f5ef1763c954d20b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Add the form foundation. It publishes the contexts a bound field and a bound form share, the engine
  that evaluates a JSON Schema, and `standardOf`, which wraps a schema as the Standard Schema the form
  library validates with. It derives the defaults and the message identifiers from a schema, types how
  a form is drawn as data, puts the engine, the renderers and the translator in scope through
  `FormProvider`, and keeps a form across a refresh with `useDraft`.
  
  - Add `createSchemaForm`, which binds a package's field components, form components, layouts and
    renderers in one call and returns `useSchemaForm` beside the library's own hooks.
  - Add `Fields`, a form component every form carries, which draws a form from its presentation:
    groups, repeat groups with add and remove, steps opened on the draft's step, one step or the
    members given.
  - Attach the schema, the presentation, the engine, the translator and the draft to the form, read
    back through `useProperty`, `useWords`, `useResolved` and `descriptionOf`.
  - Take the library's own form options beside the schema, and a field's options by presentation path
    in `fieldOptions`, typed over the value at that path.
  - Add `schemaFormOptions`, `leaveStep`, `propertyOf`, `requiredIn`, `choicesOf`, `textOf`, `bound`,
    `countAt`, `valueAt`, `interpolate` and the `<id>.actions.<name>` identifier.
  - Interpolate `{{name}}` in `translateFrom` and `untranslated`.
  - Keep nothing in `useDraft` when it is given no options.
  - Type `Path<Values>` as a string, so a typed presentation stands where a string is asked for.
  - Follow a form's description through `useDescribed` and `useDescribedForm`, so a translator, a
    presentation, a field option, an engine or a schema the hook is given after the first render is
    drawn by `Fields` and by every bound field, even where nothing above them re-renders.
  - Listen to a draft's store once per form rather than once per render, and leave the draft's own
    writes unread, so writing the form's values to the store does not draw the form again.
  - Open a stepped form on the draft's step when the draft arrives after the first render, which is
    when a page rendered on a server reads it.
  - Withhold the add control once a repeat group has its `maxItems` items and the remove controls
    while it has no more than its `minItems`. `ItemProps.onRemove` is optional.
  - Move focus to a refused field inside the element carrying the form's `formId` where the form
    component writes it as its `id`, and anywhere on the page otherwise.
  - Keep a schema's hash and a library object's converted document by the object, so a form reads one
    document and hashes a schema once.
  - Add `useFieldAria`, which resolves the label, the help text and the first error of the field in
    scope with the props that tie the three to the control. `aria-describedby` names the help text and
    the error only while each is on the page.
  - Add the `Errors` layout and `RootErrors`, the region the errors of a form as a whole are read
    from. The foundation moves focus to it when a submit is refused and no field holds the error.
  - Give `GroupProps`, `ItemProps` and `StepProps` an `id`. A layout writes it on its root element,
    and the foundation moves focus into a group, an item or a step by it.

### Patch Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`ec4b811`](https://github.com/stealth-scale/config/commit/ec4b81154daadbe496f8172ead2897ca68f0e63d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specifications: stop reading the page's real local storage
  
  The locale provider's pending case and the draft specification both read the page's real local
  storage. Node 26 defines `globalThis.localStorage` and returns `undefined` for it without
  `--localstorage-file`, so each run reported `ExperimentalWarning: localStorage is not available`.
  
  The pending case now takes a memory store like every case beside it. The draft specification stubs a
  working storage, which is what it takes to check that the draft is written and cleared. Reading a
  storage that returns nothing proved only that the hook does not throw.
- Updated dependencies [[`044f611`](https://github.com/stealth-scale/config/commit/044f6110d6f70ace50ab25e7d545c3399d0ea72b)]:
  - @stealthscale/settings@0.1.0
