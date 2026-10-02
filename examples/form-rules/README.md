# @stealthscale/example-form-rules

`@stealthscale/example-form-rules` renders a signup form whose rules come from four places, and
shows where each kind of rule belongs.

| The rule                                   | Where it is written                                                                          | Who runs it                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| A VAT number has a shape                   | A `Format` registered in `createEngine`, named as `format: "vat-number"` in the schema       | The engine, for every form on the page |
| The confirmation equals the password       | A `Keyword` registered in `createEngine`, written as `"x-matches": "password"` in the schema | The engine                             |
| A business states a VAT number             | `if`, `then` in the schema                                                                   | The engine                             |
| The username is not taken                  | `onBlurAsync` on the field, debounced, with the library's signal                             | The form library                       |
| The password does not contain the username | A form validator in the `onSubmit` slot, marking `password`                                  | The form library                       |

## Run it

```bash
pnpm --filter @stealthscale/example-form-rules dev
pnpm --filter @stealthscale/example-form-rules test
```

The development server listens on port 4910. `vp test` renders the page into a happy-dom document
and drives each rule: a bad VAT number, a confirmation that differs, a taken name after a blur, a
password holding the name, and a form that passes.

## The form

`src/signup-form.tsx` builds the form with `useSchemaForm` and draws it with `form.Fields`. The
username's rule is the library's own field validator, given by path in `fieldOptions` and typed over
the username's value, and the foundation writes it onto the field it draws. The form validator goes
in `validators`, in the submit slot.

`@stealthscale/component-forms/form` renders the kind, an `enum` of two choices, as a radio group.
`password` and `confirm` state `format: "password"`, so each renders as a password input. The page
states neither.

## The engine

`src/engine.ts` builds one engine with `vatNumber` and `matches` and gives it to `FormProvider`.
Every form under the provider evaluates its schema with that engine, so a schema that references the
format validates the same way in every form.

A refusal from a registered keyword reads its words under the keyword's name, so
`signup.errors.confirm.x-matches` is the entry for the confirmation.

## The field drawn on a condition

The schema declares `vat` only where `kind` is `business`. `form.Fields` draws the member where the
schema resolved against the values has it, and marks it required as the resolved schema does.
Validation needs none of that: the whole schema is in the dynamic slot, and the engine evaluates the
conditional against the whole value.

## The rule that needs a request

`src/accounts.ts` replaces the accounts service in this example. The field's `onBlurAsync` awaits it
with the `signal` the library passes in, which the library aborts when the value changes again, and
`onBlurAsyncDebounceMs` waits for typing to stop. The library does not run the request while the
schema refuses the field: after a submit, a username shorter than three characters is refused by the
schema and the service is never called.
