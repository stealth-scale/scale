/**
 * Renders the checkout form, generated from the presentation its schema states.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/component-forms/form";

import { checkout } from "#schema.ts";

/**
 * Describes what the checkout form is given.
 */
export interface CheckoutFormProps {
  /**
   * Receives the values once the schema accepts them.
   */
  readonly onDone: (value: unknown) => void;
}

/**
 * Renders the checkout form.
 *
 * @remarks
 *   The schema is resolved against the values on every change, and the fields render a member only
 *   where the resolved schema has it. A generated form has no type of its own, so the values are
 *   a record of unknown values.
 */
export function CheckoutForm({ onDone }: CheckoutFormProps): ReactElement {
  const form = useSchemaForm({
    onSubmit: ({ value }) => {
      onDone(value);
    },
    schema: checkout,
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
