/**
 * Renders a checkbox card and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the card renders after its children, so a
 *   press anywhere on the card toggles it. The input is the checkbox assistive technology reads and
 *   the value a form submits. Its name is the card's title, and it lists the card's description
 *   and addon in `aria-describedby`. Inside a field the card takes the field's disabled, invalid,
 *   read-only and required states and size, and the input lists the field's texts first. Inside a
 *   fieldset without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each. The caller's handlers on the card run before the machine's. The input takes its
 *   `checked` and `indeterminate` properties from the machine hook after every press and every
 *   change of the state, as the checkbox's does.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#checkbox-card/context.ts";
import { DescribeProvider } from "#checkbox-card/state.ts";
import {
  ApiProvider,
  type CheckboxOptions,
  splitCheckboxProps,
  useCheckboxMachine,
} from "#checkbox/machine.ts";
import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `label` with the recipe's variants.
 */
const Card = withProvider("label", "root");

/**
 * Describes the props of the card: the machine's options, the recipe's variants and the props of
 * a `label`.
 *
 * @remarks
 *   The label's own props of the same names as the machine's options, and `htmlFor`, which the
 *   machine sets, are left out, so no prop has two types.
 */
export interface RootProps
  extends CheckboxOptions, Omit<ComponentProps<typeof Card>, "htmlFor" | keyof CheckboxOptions> {}

/**
 * Renders the card and provides the machine's api and the description registry to its parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `label`.
 * @returns The `label` element, holding the parts and the `input` a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [options, rest] = splitCheckboxProps(props);
  const { children, size, ...attributes } = rest;
  const { api, input } = useCheckboxMachine({ ...inherited(field, group), ...options });
  const [described, setDescribed] = useState<readonly string[]>([]);
  const ids = field ? [describedBy(field.ids), ...described] : described;

  return (
    <ApiProvider value={api}>
      <DescribeProvider value={setDescribed}>
        <Card
          {...mergeProps(api.getRootProps(), attributes)}
          {...omitUndefined({ size: sized(size, field, group) })}
        >
          {children}
          <input
            aria-describedby={ids.length === 0 ? undefined : ids.join(" ")}
            {...api.getHiddenInputProps()}
            ref={input}
          />
        </Card>
      </DescribeProvider>
    </ApiProvider>
  );
}
