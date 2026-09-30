/**
 * Renders the field box of one date's segments.
 *
 * @remarks
 *   The element is a `group` of the segments. It is named by `DateInput.Label` or a field's label,
 *   followed by its own `aria-label` where the caller passes one, such as "Check-in" in a range,
 *   else by its `aria-label` alone. The machine's reference to a label that may not render is left
 *   out.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-input/context.ts";
import { GroupProvider } from "#date-input/group.ts";
import { useDateInput } from "#date-input/machine.ts";
import { groupLabelledBy } from "#date-input/names.ts";
import { useShared } from "#date-input/state.ts";

/**
 * Renders the `div` with the date input's segment group class.
 */
const Grouped = withContext("div", "segmentGroup");

/**
 * Describes the props of the segment group: the index of its date and the props of a `div`.
 */
export interface SegmentGroupProps extends ComponentProps<typeof Grouped> {
  /**
   * Index of the date the group edits: 0 for a single date and the start of a range, 1 for the
   * end. Defaults to 0.
   */
  readonly index?: number | undefined;
}

/**
 * Renders the group with the machine's group props, named after the label and its own
 * `aria-label`, and provides its index and name to its segments.
 *
 * @param props - The index, the segments and the props of a `div`.
 * @returns The `div` element with `role="group"`.
 */
export function SegmentGroup({ index = 0, ...props }: SegmentGroupProps): ReactElement {
  const api = useDateInput();
  const { ids, label } = useShared();
  const own = props["aria-label"];
  const { "aria-labelledby": _labelledBy, ...machine }: SegmentGroupProps = {
    ...api.getSegmentGroupProps({ index }),
  };
  const named = omitUndefined({
    "aria-labelledby": groupLabelledBy(label, own, ids.segmentGroup(index)),
  });

  return (
    <GroupProvider value={{ index, label: own }}>
      <Grouped {...mergeProps(machine, named, props)} />
    </GroupProvider>
  );
}
