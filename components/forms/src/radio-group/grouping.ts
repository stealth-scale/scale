/**
 * Runs the machine a radio group or a set of radio cards shares, and names and describes the
 * element that renders it.
 *
 * @remarks
 *   The group is named by its own label while one is rendered, and otherwise by the label of the
 *   field or the legend of the fieldset around it. Inside a field the group takes the field's
 *   disabled, invalid, read-only and required states and lists the field's texts in
 *   `aria-describedby`. Inside a fieldset without a field it takes the group's disabled and invalid
 *   states. An option the caller states overrides each.
 */

import { useState } from "react";

import { describedBy } from "#field/ids.ts";
import { type Inherited, inherited } from "#field/inherited.ts";
import { type FieldState, useOptionalField } from "#field/state.ts";
import { type FieldsetState, useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import {
  type RadioGroupApi,
  type RadioGroupOptions,
  useRadioGroupMachine,
} from "#radio-group/machine.ts";

/**
 * Describes the attributes the element of a group renders with: the machine's, with the name and
 * the description the group settles on.
 */
export type GroupAttributes = {
  /**
   * IDs of the field's helper and error texts, inside a field.
   */
  readonly "aria-describedby"?: string | undefined;

  /**
   * ID of the element that names the group, where one is rendered.
   */
  readonly "aria-labelledby"?: string | undefined;
} & Omit<ReturnType<RadioGroupApi["getRootProps"]>, "aria-labelledby">;

/**
 * Describes what the element of a group needs from the machine and from the parts around it.
 */
export interface Grouping {
  /**
   * Connected api of the machine.
   */
  readonly api: RadioGroupApi;

  /**
   * Attributes of the element that renders the group.
   */
  readonly attributes: GroupAttributes;

  /**
   * Records that the group's label mounted or unmounted.
   */
  readonly setLabelled: (labelled: boolean) => void;

  /**
   * Size of the field or the fieldset around the group, where either states one.
   */
  readonly size: FieldsetState["size"];
}

/**
 * Returns the machine options a group takes from the field or the fieldset around it.
 *
 * @remarks
 *   A toggle takes a fieldset's disabled state only. A group also takes its invalid state, because
 *   a fieldset around a group usually exists for that one choice.
 */
function inheritedByGroup(field: FieldState | undefined, group: FieldsetState): Inherited {
  return { ...inherited(field, group), invalid: field?.invalid ?? (group.invalid || undefined) };
}

/**
 * Returns the ID of the element that names the group: its own label while one is rendered, then
 * the field's label, then the fieldset's legend.
 */
function nameOf(
  labelled: boolean,
  labelId: string,
  field: FieldState | undefined,
  legend: string | undefined,
): string | undefined {
  return labelled ? labelId : (field?.ids.label ?? legend);
}

/**
 * Starts the machine and settles the group's name, description and inherited state.
 *
 * @param options - The machine options split from the root's props.
 * @returns The api, the root's attributes, the label's report function and the inherited size.
 */
export function useGrouping(options: RadioGroupOptions): Grouping {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const { api, labelId } = useRadioGroupMachine({ ...inheritedByGroup(field, group), ...options });
  const { "aria-labelledby": _machine, ...root } = api.getRootProps();

  return {
    api,
    attributes: {
      ...root,
      "aria-describedby": field ? describedBy(field.ids) : undefined,
      "aria-labelledby": nameOf(labelled, labelId, field, legend),
    },
    setLabelled,
    size: field?.size ?? group.size,
  };
}
