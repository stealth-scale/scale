/**
 * Renders the signup form, whose rules come from four places: the schema, the engine, a field
 * validator and a form validator.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/component-forms/form";

import { isTaken } from "#accounts.ts";
import { apart } from "#apart.ts";
import { type Signup, signup } from "#schema.ts";

/**
 * Describes what the signup form is given.
 */
export interface SignupFormProps {
  /**
   * Receives the values once every rule passes.
   */
  readonly onDone: (value: Signup) => void;
}

/**
 * Renders the signup form from its schema.
 *
 * @remarks
 *   The schema goes in the dynamic slot with the page's engine, so the VAT format and the
 *   matching keyword apply. The username asks the accounts service on blur, debounced, through
 *   the library's own field validator, given by path, and the library skips that request while
 *   the schema refuses the field. The rule across the password and the username is a form
 *   validator in the submit slot. The VAT field renders where the schema resolved against the
 *   values declares it.
 */
export function SignupForm({ onDone }: SignupFormProps): ReactElement {
  const form = useSchemaForm<Signup>({
    fieldOptions: {
      username: {
        validators: {
          onBlurAsync: async ({ signal, value }) =>
            (await isTaken(value, signal)) ? { keyword: "taken" } : undefined,
          onBlurAsyncDebounceMs: 50,
        },
      },
    },
    onSubmit: ({ value }) => {
      onDone(value);
    },
    schema: signup,
    validators: { onSubmit: apart },
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
