/**
 * Renders the select's root and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` that stacks the label above the control. It renders the hidden `select`
 *   a form submits after its children. The root runs the panel's presence: the panel is not in the
 *   document until it first opens, and it leaves once its exit animation ends. Inside a field the
 *   select takes the field's disabled, invalid, read-only and required states, its size, and the
 *   field's label and texts. Inside a fieldset without a field it takes the group's disabled state
 *   and size. A prop the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined, type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { withProvider } from "#select/context.ts";
import { HiddenSelect } from "#select/hidden-select.tsx";
import {
  ApiProvider,
  PresenceProvider,
  type SelectOptions,
  splitSelectProps,
  useSelectMachine,
} from "#select/machine.ts";
import { LabellingProvider, namesOf, NamingProvider, SharedProvider } from "#select/state.ts";

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
    Omit<PresenceOptions, "present">,
    Omit<ComponentProps<typeof Framed>, "dir" | "id" | keyof SelectOptions>,
    SelectOptions {
  /**
   * Collection of the items a person picks from, which a collection hook creates.
   */
  readonly collection: NonNullable<SelectOptions["collection"]>;
}

/**
 * Renders the root and provides the machine's api, the panel's presence and the names to the
 * parts.
 *
 * @param props - The machine's options, the panel's presence, the recipe's variants and the props
 *   of a `div`.
 * @returns The `div` element that contains the parts and the hidden `select`.
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
  const [options, rest] = splitSelectProps(props);
  const { size, ...attributes } = rest;
  const { api, dismiss, labelId, triggerId } = useSelectMachine(
    { ...inherited(field, group), ...options },
    field?.ids.control,
  );
  const presence = usePresence({
    lazyMount,
    onExitComplete,
    present: api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });
  const names = namesOf(field, labelled ? labelId : undefined, named);

  return (
    <ApiProvider value={api}>
      <PresenceProvider value={presence}>
        <LabellingProvider value={setLabelled}>
          <NamingProvider value={setNamed}>
            <SharedProvider value={{ ...names, dismiss, trigger: triggerId }}>
              <Framed
                {...mergeProps(api.getRootProps(), attributes)}
                {...omitUndefined({ size: sized(size, field, group) })}
              >
                {children}
                <HiddenSelect />
              </Framed>
            </SharedProvider>
          </NamingProvider>
        </LabellingProvider>
      </PresenceProvider>
    </ApiProvider>
  );
}
