/**
 * Renders the date picker's root and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` that stacks the label above the control. It renders one hidden input per
 *   date after its children, through which a form submits the dates in ISO 8601. The root runs the
 *   panel's presence: a floating panel is not in the document until it first opens, and it leaves
 *   once its exit animation ends. Inside a field the picker takes the field's disabled, invalid,
 *   read-only and required states, its size, and the field's label and texts. Inside a fieldset
 *   without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined, type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#date-picker/context.ts";
import { HiddenInputs } from "#date-picker/hidden-inputs.tsx";
import {
  ApiProvider,
  type DatePickerOptions,
  PresenceProvider,
  splitDatePickerProps,
  useDatePickerMachine,
} from "#date-picker/machine.ts";
import { LabellingProvider, namesOf, SharedProvider } from "#date-picker/state.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the panel's presence, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types. `lazyMount` and `unmountOnExit` are true by default.
 */
export interface RootProps
  extends
    DatePickerOptions,
    Omit<PresenceOptions, "present">,
    Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id" | keyof DatePickerOptions> {}

/**
 * Renders the root and provides the machine's api, the panel's presence, the names and the IDs to
 * the parts.
 *
 * @param props - The machine's options, the panel's presence, the recipe's variants and the props
 *   of a `div`.
 * @returns The `div` element that contains the parts and the hidden inputs.
 */
export function Root({
  children,
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitDatePickerProps(props);
  const { palette, size, ...attributes } = rest;
  const stated = { ...inherited(field, group), ...options };
  const { api, ids, reset } = useDatePickerMachine(stated, field?.ids.control);
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });
  return (
    <ApiProvider value={api}>
      <PresenceProvider value={presence}>
        <LabellingProvider value={setLabelled}>
          <SharedProvider
            value={{
              ...namesOf(field, labelled ? ids.label(0) : undefined),
              ids,
              readOnly: api.readOnly,
              required: stated.required === true,
              reset,
            }}
          >
            <Framed
              {...mergeProps(api.getRootProps(), attributes)}
              {...omitUndefined({ palette, size: sized(size, field, group) })}
            >
              {children}
              <HiddenInputs name={stated.name} required={stated.required === true} />
            </Framed>
          </SharedProvider>
        </LabellingProvider>
      </PresenceProvider>
    </ApiProvider>
  );
}
