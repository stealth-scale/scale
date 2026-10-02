/**
 * Builds the fieldsets the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type RootProps } from "#fieldset/root.tsx";

/**
 * Renders the children inside a root, with the props the case sets on the root.
 *
 * @param children - The part under test.
 * @param props - The props of the root.
 * @returns The root with the children inside it.
 */
export function grouped(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Fieldset.Root {...props}>{children}</Fieldset.Root>;
}

/**
 * Renders a group with every part and one field inside it.
 *
 * @param props - The props of the root.
 * @returns The group.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Delivery</Fieldset.Legend>
      <Fieldset.HelperText>We deliver on weekdays.</Fieldset.HelperText>
      <Field.Root>
        <Field.Label>Address</Field.Label>
        <Field.Control />
      </Field.Root>
      <Fieldset.ErrorText>Choose one before going on.</Fieldset.ErrorText>
    </Fieldset.Root>
  );
}
