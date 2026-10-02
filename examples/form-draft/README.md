# @stealthscale/example-form-draft

`@stealthscale/example-form-draft` renders a profile form in two steps. The form starts from the
record saved in the database, keeps a draft in the browser as a person types, opens on the step and
the values of that draft after a refresh, and never writes the password to it.

## Run it

```bash
pnpm --filter @stealthscale/example-form-draft dev
pnpm --filter @stealthscale/example-form-draft test
```

The development server listens on port 4920. Type into the form, refresh the page, and the form
opens where you left it. `vp test` renders the page over a memory store, plants a draft, reads the
step and the values back, advances the debounce, and reads what the store holds.

## The form

`src/profile-form.tsx` is one call and one element:

```tsx
const form = useSchemaForm<ProfileValues>({
  draft: { app: "docs", id: `profile.${id}`, store },
  onSubmit: ({ value }) => save(value),
  schema: profile,
  values: saved,
});

return (
  <form.AppForm>
    <form.Form>
      <form.Fields />
    </form.Form>
  </form.AppForm>
);
```

## The record and the draft

`src/records.ts` replaces the database in this example. The form receives the saved profile as
`values`. The draft is keyed by the record's identifier, `profile.p-1`, so a draft of one profile
never opens over another. The form's own identifier stays `profile`. Its words are read under that.

Where there is a draft, its values take precedence over the record, because they are the person's
unsaved edits. Both are written over the schema's defaults. The defaults fill in the password the
draft left out, so every control starts controlled. This example does not detect a record that
changes on the server while a draft is open. An application that needs that puts the record's
version into the draft's identifier. A draft of the old version is then never found.

The hook writes the draft through the library's own change listener, debounced by 300 ms, and clears
it once the submit handler returns. Leaving a step writes the step at once, and the form opens on
the step the draft was left on.

## The steps

The schema's `x-form` lists the two steps of a wizard. `form.Fields` renders the step a person is on
through the `Step` layout of `@stealthscale/component-forms/form`. The layout renders the steps as a
progress list, the back control and the next control. The last step renders the submit in place of
the next control.

Leaving the first step marks its fields touched, calls `validateField` once with the cause `submit`,
which runs every form-level validator, and reads the errors of that step's fields alone. A refused
field keeps the person on the step and takes focus. The second step's fields are not touched until
it is reached, so the page does not show an error of theirs before then.
