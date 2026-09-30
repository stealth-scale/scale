/**
 * Renders one segment of a date: an editable part, such as the month, or a separator.
 *
 * @remarks
 *   An editable segment is a `spinbutton` a person types digits into or steps with the arrow keys.
 *   Page Up and Page Down step it further, Home and End set its ends, and Backspace clears it. Its
 *   value text is its value or its placeholder. It is named by its type in the root's locale and by
 *   the group's name. The first segment of the first group is described by a field's texts, and
 *   every segment is described by them while the input is invalid. A separator is hidden from
 *   assistive technology.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-input/context.ts";
import { useGroup } from "#date-input/group.ts";
import { type DateSegment, useDateInput } from "#date-input/machine.ts";
import { segmentLabelling, segmentName } from "#date-input/names.ts";
import { useShared } from "#date-input/state.ts";

/**
 * Renders the `span` with the date input's segment class.
 */
const Edited = withContext("span", "segment");

/**
 * Describes the props of a segment: the segment the machine returns and the props of a `span`.
 */
export interface SegmentProps extends ComponentProps<typeof Edited> {
  /**
   * The segment, one of those `DateInput.Segments` renders.
   */
  readonly segment: DateSegment;
}

/**
 * Renders the segment with the machine's segment props, its name and its description.
 *
 * @param props - The segment and the props of a `span`.
 * @returns The `span` element with `role="spinbutton"`, or an `aria-hidden` one for a separator.
 */
export function Segment({ segment, ...props }: SegmentProps): ReactElement {
  const api = useDateInput();
  const { describedBy, invalid, label, locale } = useShared();
  const group = useGroup();
  const id = useId();
  const { "aria-label": _label, ...machine }: ComponentProps<typeof Edited> = {
    ...api.getSegmentProps({ index: group.index, segment }),
  };
  const first =
    group.index === 0 &&
    api.getSegments({ index: 0 }).find((each) => each.isEditable)?.type === segment.type;
  const own =
    segment.type === "literal"
      ? {}
      : omitUndefined({
          ...segmentLabelling(segmentName(segment.type, locale), id, label, group.label),
          "aria-describedby": first || invalid ? describedBy : undefined,
          id,
        });

  return <Edited {...mergeProps(machine, own, props)}>{segment.text}</Edited>;
}
