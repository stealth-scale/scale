/**
 * Renders the pin input's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset`, the group that contains the label and the boxes, and the root
 *   renders the hidden `input` a form submits after its children, so a caller cannot leave it out.
 *   The group is named by `PinInput.Label` while one is rendered, and otherwise by the label of a
 *   field or the legend of a fieldset around it. An `aria-label` or `aria-labelledby` the caller
 *   passes takes precedence. Inside a field the group lists the field's texts in
 *   `aria-describedby` and takes the field's disabled, invalid, read-only and required states and
 *   size. Inside a fieldset without a field it takes the group's disabled state and size. A prop
 *   the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import { withProvider } from "#pin-input/context.ts";
import {
  ApiProvider,
  type PinInputOptions,
  splitPinInputProps,
  usePinInputMachine,
} from "#pin-input/machine.ts";
import { LabellingProvider } from "#pin-input/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `fieldset`.
 *
 * @remarks
 *   The fieldset's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Grouped>, keyof PinInputOptions>, PinInputOptions {}

/**
 * Renders the group and provides the machine's api to the label, the control and the boxes.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `fieldset`.
 * @returns The `fieldset` element, which contains the parts and the `input` a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitPinInputProps(props);
  const { children, size, ...attributes } = rest;
  const { api, labelId } = usePinInputMachine(
    { ...inherited(field, group), ...options },
    field?.ids.control,
  );

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <Grouped
          {...mergeProps(
            api.getRootProps(),
            omitUndefined({
              "aria-describedby": field ? describedBy(field.ids) : undefined,
              "aria-labelledby": labelled ? labelId : (field?.ids.label ?? legend),
            }),
            attributes,
          )}
          {...omitUndefined({ size: sized(size, field, group) })}
        >
          {children}
          <input {...api.getHiddenInputProps()} />
        </Grouped>
      </LabellingProvider>
    </ApiProvider>
  );
}
