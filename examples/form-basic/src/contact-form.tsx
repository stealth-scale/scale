/**
 * Renders the contact form, generated from its schema.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/component-forms/form";

import { type Contact, contact } from "#schema.ts";

/**
 * Describes what the contact form is given.
 */
export interface ContactFormProps {
  /**
   * Receives the values once they pass the schema.
   */
  readonly onSent: (value: Contact) => void;
}

/**
 * Renders the contact form from its schema: the fieldsets and fields its `x-form` keyword states,
 * validated by the schema on submit and then on every change, with every word read under
 * `contact`.
 */
export function ContactForm({ onSent }: ContactFormProps): ReactElement {
  const form = useSchemaForm<Contact>({
    onSubmit: ({ value }) => {
      onSent(value);
    },
    schema: contact,
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
