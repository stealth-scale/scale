/**
 * Builds the selects the part specs render.
 */

import { type ReactElement } from "react";

import { Field } from "#native-select/field.tsx";
import { Indicator } from "#native-select/indicator.ts";
import { Root, type RootProps } from "#native-select/root.tsx";

/**
 * Accessible name of the select every fixture renders.
 */
export const NAME = "Account";

/**
 * Renders a select of two accounts with a placeholder and an indicator.
 *
 * @param props - The root's props.
 * @returns The select.
 */
export function selected(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Field aria-label={NAME} placeholder="Pick an account">
        <option value="bridge">Bridge Ledger</option>
        <option value="halden">Halden & Co</option>
      </Field>
      <Indicator>v</Indicator>
    </Root>
  );
}
