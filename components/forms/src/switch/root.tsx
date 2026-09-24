/**
 * Renders the switch's row and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the root renders after its children, so a
 *   press anywhere on the row toggles the switch. The input is the control assistive technology
 *   reads and the value a form submits. The root renders it, so a caller cannot leave it out. The
 *   input sets `role="switch"` and `aria-checked`, because the machine renders a checkbox with no
 *   role and a screen reader announced it as a checkbox. ARIA in HTML allows the role on a
 *   checkbox input. Inside a field the switch takes the field's disabled, invalid, read-only and
 *   required states and size, and the input lists the field's texts in `aria-describedby`. Inside a
 *   fieldset without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { withProvider } from "#switch/context.ts";
import {
  ApiProvider,
  splitSwitchProps,
  type SwitchOptions,
  useSwitchMachine,
} from "#switch/machine.ts";

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
  extends Omit<ComponentProps<typeof Framed>, "htmlFor" | keyof SwitchOptions>, SwitchOptions {}

/**
 * Renders the switch and provides the machine's api to its parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `label`.
 * @returns The `label` element, which contains the parts and the `input` a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [options, rest] = splitSwitchProps(props);
  const { children, size, ...attributes } = rest;
  const api = useSwitchMachine({ ...inherited(field, group), ...options });

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
          aria-checked={api.checked}
          role="switch"
        />
      </Framed>
    </ApiProvider>
  );
}
