/**
 * Binds the package's field components, form components, layouts and renderers to the form
 * foundation, the one call every form an application builds shares.
 */

import { createSchemaForm } from "@stealthscale/provider-form";

import { fieldComponents } from "#form/fields.ts";
import { Form } from "#form/form.tsx";
import { layouts } from "#form/layouts.ts";
import { renderers } from "#form/renderers.ts";
import { Submit } from "#form/submit.tsx";

/**
 * The two hooks a form is built with, and the two helpers that compose a form or a group of fields
 * outside the component that builds the form.
 *
 * @remarks
 *   `useAppForm` builds a form from the library's own options, and `useSchemaForm` builds one from
 *   a schema. Either form's `AppField` hands each field component the field it renders. Either
 *   form has `Form`, `Submit` and `Fields` as members. The contexts are the foundation's, so a
 *   field rendered by another package bound to the same contexts reads the same form.
 */
export const { useAppForm, useSchemaForm, withFieldGroup, withForm } = createSchemaForm({
  fieldComponents,
  formComponents: { Form, Submit },
  layouts,
  renderers,
});
