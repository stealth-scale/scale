/**
 * Exports the date input's parts, composed as `DateInput.Root` around its label and a control with
 * one group of segments per date, the types its callbacks receive, and the functions that create a
 * date.
 */

export {
  type CalendarDate,
  type CalendarDateTime,
  type DateValue,
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  today,
  type ZonedDateTime,
} from "@internationalized/date";

export { ClearTrigger, type ClearTriggerProps } from "#date-input/clear-trigger.tsx";
export { Control, type ControlProps } from "#date-input/control.tsx";
export { Label, type LabelProps } from "#date-input/label.tsx";
export {
  type DateSegment,
  type FocusChangeDetails,
  type PlaceholderChangeDetails,
  type ValueChangeDetails,
} from "#date-input/machine.ts";
export { Root, type RootProps } from "#date-input/root.tsx";
export { SegmentGroup, type SegmentGroupProps } from "#date-input/segment-group.tsx";
export { Segment, type SegmentProps } from "#date-input/segment.tsx";
export { Segments, type SegmentsProps } from "#date-input/segments.tsx";
