# @stealthscale/example-form-basic

`@stealthscale/example-form-basic` renders a contact form from one JSON Schema document. The schema
states the data, its `x-form` keyword states the two fieldsets the form is drawn in, and every word
on the page comes from a catalogue in the language a person picks. The form itself is the schema and
a submit handler.

## Run it

```bash
pnpm --filter @stealthscale/example-form-basic dev
pnpm --filter @stealthscale/example-form-basic test
```

The development server listens on port 4900. `vp test` renders the page into a happy-dom document,
submits the empty form, reads the refusals back in English, switches to Dutch, and submits a filled
form.

## The form

`src/contact-form.tsx` is the whole form:

```tsx
const form = useSchemaForm<Contact>({ onSubmit: ({ value }) => onSent(value), schema: contact });

return (
  <form.AppForm>
    <form.Form>
      <form.Fields />
      <form.Submit />
    </form.Form>
  </form.AppForm>
);
```

`useSchemaForm` comes from `@stealthscale/component-forms/form`, the binding the forms package
publishes. It starts from the schema's defaults, puts the schema in the form's dynamic slot so it
validates on submit and then on every change, and moves focus to the first refused field on a
submit. `form.Fields` renders the members the schema's `x-form` states through the binding's
renderers. The topic is an `enum` of two choices, so it renders as a radio group. `form.Submit`
reads its words from the catalogue.

## The schema

`src/schema.ts` states five properties. A string a person has to fill in states `minLength: 1`,
because `required` in JSON Schema asks only that the property exist and every control starts from an
empty string. The consent is `const: true`, so an unticked box refuses under the keyword `const`.
The root's `x-form` names the form `contact` and lists two fieldsets, `who` and `what`.

## The words

`src/words.ts` keeps one catalogue per language, keyed the way `@stealthscale/provider-form` derives
identifiers. The form's identifier is `contact`. A field at `email` reads:

| What                                | Key                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| Its label                           | `contact.fields.email.label`                              |
| Its help text                       | `contact.fields.email.description`                        |
| A refusal under `minLength`         | `contact.errors.email.minLength`, then `errors.minLength` |
| The legend of the fieldset it is in | `contact.groups.who.legend`                               |
| The submit button                   | `contact.actions.submit`                                  |

A form in another package reads its words under its own identifier. One catalogue therefore holds
every form of an application without a clash. The English `errors.format` entry has no `contact`
counterpart. The email format refusal reads the shared words instead, which is what a product-wide
message is.

`translateFrom(catalogue)` builds a translator with i18next's signature: a key or a list of keys, a
`defaultValue`, and the values a message interpolates with `{{name}}`. An application over i18next
gives `FormProvider` its `t` instead. Nothing on the page changes.
