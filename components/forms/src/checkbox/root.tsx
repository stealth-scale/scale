/**
 * Renders the checkbox's row and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the root renders after its children, so a
 *   press anywhere on the row toggles the box. The input is the checkbox assistive technology
 *   reads and the value a form submits. The root renders it, so a caller cannot leave it out. The
 *   box is `aria-hidden`, so the state is announced once.
 *   Inside a field the checkbox takes the field's disabled, invalid, read-only and required states
 *   and size, and the input lists the field's texts in `aria-describedby`. Inside a fieldset
 *   without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each. The input's `indeterminate` property is written on every commit, because the
 *   machine writes it only on a change and a box rendered partly on would read as unchecked. It is
 *   the property and not `aria-checked`, which axe reports on a native checkbox as
 *   `aria-conditional-attr`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#checkbox/context.ts";
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
const Framed = withProvider("label", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `label`.
 *
 * @remarks
 *   The label's own props of the same names as the machine's options, and `htmlFor`, which the
 *   machine sets, are left out, so no prop has two types.
 */
export interface RootProps
  extends CheckboxOptions, Omit<ComponentProps<typeof Framed>, "htmlFor" | keyof CheckboxOptions> {}

/**
 * Renders the checkbox and provides the machine's api to its parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `label`.
 * @returns The `label` element, holding the parts and the `input` a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [options, rest] = splitCheckboxProps(props);
  const { children, size, ...attributes } = rest;
  const api = useCheckboxMachine({ ...inherited(field, group), ...options });

  return (
    <ApiProvider value={api}>
      <Framed
        {...attributes}
        {...omitUndefined({ size: sized(size, field, group) })}
        {...api.getRootProps()}
      >
        {children}
        <input
          aria-describedby={field ? describedBy(field.ids) : undefined}
          {...api.getHiddenInputProps()}
          ref={(node) => {
            if (node !== null) {
              node.indeterminate = api.indeterminate;
            }
          }}
        />
      </Framed>
    </ApiProvider>
  );
}
