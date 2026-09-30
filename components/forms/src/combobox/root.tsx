/**
 * Renders the combobox's root and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` that stacks the label above the control. Unless custom values are
 *   allowed it renders the hidden `select` a form submits after its children, so a form submits
 *   the selected values and not the text. The root runs the panel's presence: the panel is not in
 *   the document until it first opens, and it leaves once its exit animation ends. Inside a field
 *   the combobox takes the field's disabled, invalid, read-only and required states, its size, and
 *   the field's label and texts. Inside a fieldset without a field it takes the group's disabled
 *   state and size. A prop the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined, type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#combobox/context.ts";
import { HiddenSelect } from "#combobox/hidden-select.tsx";
import {
  ApiProvider,
  type ComboboxOptions,
  PresenceProvider,
  splitComboboxProps,
  useComboboxMachine,
} from "#combobox/machine.ts";
import { LabellingProvider, namesOf, NamingProvider, SharedProvider } from "#combobox/state.ts";
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
    ComboboxOptions,
    Omit<PresenceOptions, "present">,
    Omit<ComponentProps<typeof Framed>, "dir" | "id" | keyof ComboboxOptions> {
  /**
   * Collection of the items a person picks from, which a collection hook creates and narrows.
   */
  readonly collection: NonNullable<ComboboxOptions["collection"]>;
}

/**
 * Renders the root and provides the machine's api, the panel's presence, the names and the
 * functions that keep the text and the value in step to the parts.
 *
 * @param props - The machine's options, the panel's presence, the recipe's variants and the props
 *   of a `div`.
 * @returns The `div` element that contains the parts, and the hidden `select` unless custom values
 *   are allowed.
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
  const [named, setNamed] = useState<string>();
  const [options, rest] = splitComboboxProps(props);
  const { size, ...attributes } = rest;
  const stated = { ...inherited(field, group), ...options };
  const { api, emptied, labelId, reset, settle } = useComboboxMachine(stated, field?.ids.control);
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });
  const custom = stated.allowCustomValue === true;
  const names = namesOf(field, labelled ? labelId : undefined, named);

  return (
    <ApiProvider value={api}>
      <PresenceProvider value={presence}>
        <LabellingProvider value={setLabelled}>
          <NamingProvider value={setNamed}>
            <SharedProvider value={{ ...names, custom, emptied, reset, settle }}>
              <Framed
                {...mergeProps(api.getRootProps(), attributes)}
                {...omitUndefined({ size: sized(size, field, group) })}
              >
                {children}
                {custom ? null : (
                  <HiddenSelect
                    disabled={stated.disabled}
                    form={stated.form}
                    name={stated.name}
                    required={stated.required}
                  />
                )}
              </Framed>
            </SharedProvider>
          </NamingProvider>
        </LabellingProvider>
      </PresenceProvider>
    </ApiProvider>
  );
}
