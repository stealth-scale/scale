/**
 * Renders a group of segments with one segment per part of its date.
 *
 * @remarks
 *   The segments follow the locale's order and separators, and `granularity` decides whether the
 *   hour, the minute and the second follow the date.
 */

import { type ReactElement } from "react";

import { useDateInput } from "#date-input/machine.ts";
import { SegmentGroup, type SegmentGroupProps } from "#date-input/segment-group.tsx";
import { Segment } from "#date-input/segment.tsx";

/**
 * Describes the props of the segments: the props of a segment group.
 */
export type SegmentsProps = SegmentGroupProps;

/**
 * Renders the group and its segments.
 *
 * @param props - The index of the date and the props of a `div`.
 * @returns The `div` element with `role="group"`.
 */
export function Segments(props: SegmentsProps): ReactElement {
  const api = useDateInput();

  return (
    <SegmentGroup {...props}>
      {api.getSegments({ index: props.index ?? 0 }).map((segment, position) => (
        // eslint-disable-next-line react/no-array-index-key -- a separator repeats, and the segments keep their order for a locale
        <Segment key={position} segment={segment} />
      ))}
    </SegmentGroup>
  );
}
