/**
 * Exports the angle slider's parts, composed as `AngleSlider.Root` around its label and a dial that
 * contains the ring, the range, the markers, the thumb and the value text, and the type its
 * callbacks receive.
 */

export { Control, type ControlProps } from "#angle-slider/control.tsx";
export { Label, type LabelProps } from "#angle-slider/label.tsx";
export { type ValueChangeDetails } from "#angle-slider/machine.ts";
export { MarkerGroup, type MarkerGroupProps } from "#angle-slider/marker-group.tsx";
export { Marker, type MarkerProps } from "#angle-slider/marker.tsx";
export { Range, type RangeProps } from "#angle-slider/range.ts";
export { type Formatting, Root, type RootProps } from "#angle-slider/root.tsx";
export { Thumb, type ThumbProps } from "#angle-slider/thumb.tsx";
export { Track, type TrackProps } from "#angle-slider/track.ts";
export { ValueText, type ValueTextProps } from "#angle-slider/value-text.tsx";
