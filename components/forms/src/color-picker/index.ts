/**
 * Exports the color picker's parts, composed as `ColorPicker.Root` around its label, a control
 * with a text input and the trigger, and a panel of an area, sliders, inputs and swatches, the
 * types its callbacks receive, and the parser that turns a CSS color string into a `Color`.
 */

export { type Color, type ColorChannel, type ColorFormat, parseColor } from "@zag-js/color-utils";

export { AreaBackground, type AreaBackgroundProps } from "#color-picker/area-background.tsx";
export { AreaThumb, type AreaThumbProps } from "#color-picker/area-thumb.tsx";
export { Area, type AreaProps } from "#color-picker/area.tsx";
export { ChannelInput, type ChannelInputProps } from "#color-picker/channel-input.tsx";
export {
  ChannelSliderLabel,
  type ChannelSliderLabelProps,
} from "#color-picker/channel-slider-label.tsx";
export {
  ChannelSliderThumb,
  type ChannelSliderThumbProps,
} from "#color-picker/channel-slider-thumb.tsx";
export {
  ChannelSliderTrack,
  type ChannelSliderTrackProps,
} from "#color-picker/channel-slider-track.tsx";
export {
  ChannelSliderValueText,
  type ChannelSliderValueTextProps,
} from "#color-picker/channel-slider-value-text.tsx";
export { ChannelSlider, type ChannelSliderProps } from "#color-picker/channel-slider.tsx";
export { Content, type ContentProps } from "#color-picker/content.tsx";
export { Control, type ControlProps } from "#color-picker/control.tsx";
export {
  EyeDropperTrigger,
  type EyeDropperTriggerProps,
} from "#color-picker/eye-dropper-trigger.tsx";
export { FormatTrigger, type FormatTriggerProps } from "#color-picker/format-trigger.tsx";
export { Label, type LabelProps } from "#color-picker/label.tsx";
export {
  type FormatChangeDetails,
  type OpenChangeDetails,
  type ValueChangeDetails,
} from "#color-picker/machine.ts";
export { Positioner, type PositionerProps } from "#color-picker/positioner.tsx";
export { Root, type RootProps } from "#color-picker/root.tsx";
export { SwatchGroup, type SwatchGroupProps } from "#color-picker/swatch-group.tsx";
export { SwatchIndicator, type SwatchIndicatorProps } from "#color-picker/swatch-indicator.tsx";
export { SwatchTrigger, type SwatchTriggerProps } from "#color-picker/swatch-trigger.tsx";
export { Swatch, type SwatchProps } from "#color-picker/swatch.tsx";
export { Trigger, type TriggerProps } from "#color-picker/trigger.tsx";
export { ValueSwatch, type ValueSwatchProps } from "#color-picker/value-swatch.tsx";
export { ValueText, type ValueTextProps } from "#color-picker/value-text.tsx";
export { View, type ViewProps } from "#color-picker/view.tsx";
