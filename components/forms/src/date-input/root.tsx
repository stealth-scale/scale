/**
 * Renders the date input's root and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` that stacks the label above the control. It renders one hidden input
 *   per group of segments after its children, two for a range, through which a form submits the
 *   dates. Inside a field the input takes the field's disabled, invalid, read-only and required
 *   states, its size, and the field's label and texts. Inside a fieldset without a field it takes
 *   the group's disabled state and size. A prop the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#date-input/context.ts";
import { HiddenInput } from "#date-input/hidden-input.tsx";
import {
  ApiProvider,
  type DateInputOptions,
  splitDateInputProps,
  useDateInputMachine,
} from "#date-input/machine.ts";
import { LabellingProvider, namesOf, SharedProvider } from "#date-input/state.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends
    DateInputOptions,
    Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id" | keyof DateInputOptions> {}

/**
 * Renders the root and provides the machine's api, the names, the IDs and the locale to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element that contains the parts and the hidden inputs.
 */
export function Root({ children, ...props }: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitDateInputProps(props);
  const { size, ...attributes } = rest;
  const stated = { ...inherited(field, group), ...options };
  const { api, ids, reset } = useDateInputMachine(stated, field?.ids.control);
  const names = namesOf(field, labelled ? ids.label(0) : undefined);
  const groups = stated.selectionMode === "range" ? [0, 1] : [0];

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider
          value={{
            ...names,
            ids,
            invalid: api.invalid,
            locale: stated.locale ?? "en-US",
            readOnly: stated.readOnly === true,
            reset,
          }}
        >
          <Framed
            {...mergeProps(api.getRootProps(), attributes)}
            {...omitUndefined({ size: sized(size, field, group) })}
          >
            {children}
            {groups.map((index) => (
              <HiddenInput index={index} key={index} name={stated.name} range={groups.length > 1} />
            ))}
          </Framed>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
