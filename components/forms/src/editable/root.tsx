/**
 * Renders an editable's grid and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` that lays the label on a row of its own above the area and the control.
 *   Inside a field the input takes the field's control ID, and the preview is named after the
 *   field's label. The editable also takes the field's disabled, invalid, read-only and required
 *   states and size. Inside a fieldset without a field it takes the group's disabled state and
 *   size. A prop the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#editable/context.ts";
import {
  ApiProvider,
  type EditableOptions,
  splitEditableProps,
  useEditableMachine,
} from "#editable/machine.ts";
import { LabellingProvider, SharedProvider } from "#editable/state.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Grid = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends EditableOptions, Omit<ComponentProps<typeof Grid>, keyof EditableOptions> {}

/**
 * Renders the grid and provides the machine's api, the preview's name and the read-only state to
 * the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element that contains the parts.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitEditableProps(props);
  const { size, ...attributes } = rest;
  const stated = { ...inherited(field, group), ...options };
  const { api, labelId, previewId } = useEditableMachine(stated, field?.ids.control);
  const shared = {
    label: labelled ? labelId : field?.ids.label,
    preview: previewId,
    readOnly: stated.readOnly === true,
  };

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={shared}>
          <Grid
            {...mergeProps(api.getRootProps(), attributes)}
            {...omitUndefined({ size: sized(size, field, group) })}
          />
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
