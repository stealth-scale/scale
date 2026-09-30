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
 *   without a field it takes the group's disabled state and size. Inside a `Checkbox.Group` a box
 *   with a `value` or marked `parent` takes its state from the group's value, and the group's size
 *   applies before the field's. A prop the caller states overrides each. The caller's handlers on
 *   the row run before the machine's. The input takes its `checked` and `indeterminate` properties
 *   from the machine hook after every press and every change of the state, so a box rendered partly
 *   on reads as partly on and a refused press leaves the input as it was. `indeterminate` is the
 *   property and not `aria-checked`, which axe reports on a native checkbox as
 *   `aria-conditional-attr`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#checkbox/context.ts";
import { joined, useCheckboxGroup } from "#checkbox/grouping.ts";
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
  extends CheckboxOptions, Omit<ComponentProps<typeof Framed>, "htmlFor" | keyof CheckboxOptions> {
  /**
   * Whether the box checks and clears every value of the group's `allValues`. It is on while all
   * are checked and partly on while some are.
   */
  readonly parent?: boolean | undefined;
}

/**
 * Renders the checkbox and provides the machine's api to its parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `label`.
 * @returns The `label` element, holding the parts and the `input` a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const fieldset = useFieldset();
  const group = useCheckboxGroup();
  const [options, rest] = splitCheckboxProps(props);
  const { children, parent, size, ...attributes } = rest;
  const { api, input } = useCheckboxMachine({
    ...inherited(field, fieldset),
    ...joined(group, options, parent),
  });

  return (
    <ApiProvider value={api}>
      <Framed
        {...mergeProps(api.getRootProps(), attributes)}
        {...omitUndefined({ size: sized(size ?? group?.size, field, fieldset) })}
        data-parent={parent === true ? "" : undefined}
      >
        {children}
        <input
          aria-describedby={field ? describedBy(field.ids) : undefined}
          {...api.getHiddenInputProps()}
          ref={input}
        />
      </Framed>
    </ApiProvider>
  );
}
