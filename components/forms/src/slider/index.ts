/**
 * Exports the slider's parts, composed as `Slider.Root` around its label, its value text and a
 * control that contains the track, the range, the thumbs and the markers, and the types its
 * callbacks receive.
 */

export { Control, type ControlProps } from "#slider/control.tsx";
export { DraggingIndicator, type DraggingIndicatorProps } from "#slider/dragging-indicator.tsx";
export { Label, type LabelProps } from "#slider/label.tsx";
export {
  type FocusChangeDetails,
  type ValueChangeDetails,
  type ValueTextDetails,
} from "#slider/machine.ts";
export { MarkerGroup, type MarkerGroupProps } from "#slider/marker-group.tsx";
export { Marker, type MarkerProps } from "#slider/marker.tsx";
export { Range, type RangeProps } from "#slider/range.tsx";
export { type Formatting, Root, type RootProps } from "#slider/root.tsx";
export { Thumb, type ThumbProps } from "#slider/thumb.tsx";
export { Track, type TrackProps } from "#slider/track.tsx";
export { ValueText, type ValueTextProps } from "#slider/value-text.tsx";
