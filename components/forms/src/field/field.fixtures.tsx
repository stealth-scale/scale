/**
 * Builds the fields the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Field from "#field/index.ts";
import { type RootProps } from "#field/root.tsx";

/**
 * Renders the children inside a root, with the props the case sets on the root.
 *
 * @param children - The part under test.
 * @param props - The props of the root.
 * @returns The root with the children inside it.
 */
export function fielded(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Field.Root {...props}>{children}</Field.Root>;
}

/**
 * Renders a field with every part: a label with both marks, an email control, both texts and a
 * counter. A required field shows the required mark, and any other the optional one.
 *
 * @param props - The props of the root.
 * @returns The field.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Field.Root {...props}>
      <Field.Label>
        Email
        <Field.RequiredIndicator />
        <Field.OptionalIndicator />
      </Field.Label>
      <Field.Control type="email" />
      <Field.HelperText>We only write about invoices.</Field.HelperText>
      <Field.Counter />
      <Field.ErrorText>That address is not one we recognise.</Field.ErrorText>
    </Field.Root>
  );
}
